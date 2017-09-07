import { PhraseNode, InitPacketInterface, EvalPacketInterface, VarsPacket } from '../Node';
import { RefableNode } from '../RefableNode';
import peek from '../peek';
import mapFilter from '../mapFilter';
import factories from '../factories';
import expressionStack, { isOperator } from '../expressionStack';
import { PhraseError } from '../PhraseError';

export class IfNode extends RefableNode {
    protected __then: PhraseNode;
    protected __else: PhraseNode;
    protected __logic_stack: string[];
    protected __implicit: boolean;

    protected validateNodeName(name: string): boolean {
        return name === 'if';
    }

    protected evalLogic(packet: EvalPacketInterface): boolean {
        const e_stack: boolean[] = [];
        const l_stack = this.__logic_stack.slice(0);

        let cur = l_stack.pop();

        while (!!cur) {
            if (isOperator(cur)) {
                if (cur === '!') {
                    let a = e_stack.pop();
                    e_stack.push((!a));

                } else if (cur === '&') {
                    let a = e_stack.pop();
                    let b = e_stack.pop();

                    e_stack.push((a && b));
                } else if (cur === '|') {
                    let a = e_stack.pop();
                    let b = e_stack.pop();

                    e_stack.push((a || b));
                }
            } else {
                e_stack.push((() => {
                    if (cur in packet.data) {
                        return !!packet.data[cur];
                    } else {
                        if (cur[0] === '#') {
                            return !!packet.id_render_map[cur.substr(1)];
                        } else if (cur[0] === '.') {
                            return !!packet.class_render_map[cur.substr(1)];
                        } else {
                            return false;
                        }
                    }
                })());
            }

            cur = l_stack.pop();
        }

        return e_stack[0];
    }

    public init(root: Node, packet: InitPacketInterface): void {
        this.__implicit = false;

        if(!(<Element>root).hasAttribute('condition')) {
            let err = new PhraseError(`A condition must be specified in <if/>`);
            err.node(root);

            throw err;
        }

        const condition = (<Element>root).getAttribute('condition');

        if (!condition.trim()) {
            let err = new PhraseError(`Condition is empty in <if/>`);
            err.node(root);

            throw err;
        }

        this.__logic_stack = expressionStack(condition).reverse();

        const type_support = mapFilter(factories, [
            'then',
            'else'
        ]);

        const useful_node = Array(root.childNodes.length)
            .fill('')
            .map((_, i) => root.childNodes.item(i))
            .filter(node => {
                if (node.nodeName === 'then' || node.nodeName === 'else') {
                    return true;
                } else {
                    return false;
                }
            })
            .sort((a, b) => Number(a.nodeName < b.nodeName))

        if (useful_node.length === 2) {
            this.__then = type_support['then'](useful_node[0], packet);
            this.__else = type_support['else'](useful_node[1], packet);

        } else if (useful_node.length === 1) {

            if (useful_node[0].nodeName === 'then') {
                this.__then = type_support['then'](useful_node[0], packet);
                this.__else = peek(packet.next_stack);
            } else {
                this.__then = peek(packet.next_stack);
                this.__else = type_support['else'](useful_node[0], packet);
            }

        } else if (useful_node.length === 0) {
            this.__implicit = true;

            this.__then = type_support['then'](root, packet);
            this.__else = peek(packet.next_stack);
        } else {
            let err = new PhraseError(`Multiple thens or elses in if`);
            err.node(root);
            throw err;
        }

        this.registararGenerate(root);
    }

    public eval(packet: EvalPacketInterface, branch?: number): EvalPacketInterface {
        if (this.__implicit) {
            if (this.evalLogic(packet)) {
                this.registerRender(packet);
                return this.__then.eval(packet)
            } else {
                return this.__else.eval(packet)
            }
        } else {
            this.registerRender(packet);

            return this.evalLogic(packet)
                ? this.__then.eval(packet)
                : this.__else.eval(packet)
        }
    }

    public *gen(packet: EvalPacketInterface): any {
        if (this.__implicit) {
            if (this.evalLogic(packet)) {
                this.registerRender(packet);
                yield* this.__then.gen(packet)
                this.deregisterRender(packet);
            } else {
                yield* this.__else.gen(packet)
            }
        } else {
            this.registerRender(packet);

            yield* this.evalLogic(packet)
                ? this.__then.gen(packet)
                : this.__else.gen(packet);

            this.deregisterRender(packet);
        }
    }

    public vars(packet: VarsPacket): VarsPacket {
        if (!this.__vared) {
            this.__logic_stack
                .filter(entry => !isOperator(entry))
                .filter(entry => entry[0] !== '.' && entry[0] !== '#')
                .forEach(entry => {
                    packet.vars[entry] = packet.vars[entry] || [];
                    packet.vars[entry].push({
                        type: 'boolean'
                    });
                });

            this.__then.vars(packet);
            this.__else.vars(packet);

            this.__vared = true;
        }

        return packet;
    }

    public count(packet: EvalPacketInterface): number {
        let ret: number;

        if (this.__implicit) {
            if (this.evalLogic(packet)) {
                this.registerRender(packet);
                ret = this.__then.count(packet)
                this.deregisterRender(packet);
            } else {
                ret = this.__else.count(packet)
            }
        } else {
            this.registerRender(packet);

            ret = this.evalLogic(packet)
                ? this.__then.count(packet)
                : this.__else.count(packet);

            this.deregisterRender(packet);
        }

        return ret;
    }
}