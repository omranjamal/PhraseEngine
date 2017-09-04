import { PhraseNode, InitPacketInterface, EvalPacketInterface } from '../Node';
import { RefableNode } from '../RefableNode';
import peek from '../peek';
import mapFilter from '../mapFilter';
import factories from '../factories';
import expressionStack, { isOperator } from '../expressionStack';

export class IfNode extends RefableNode {
    protected __then: PhraseNode;
    protected __else: PhraseNode;
    protected __logic_stack: string[];

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
                        }
                        
                        throw new Error(`"${cur}" not found in data.`);
                    }
                })());
            }

            cur = l_stack.pop();
        }

        return e_stack[0];
    }

    public init(root: Node, packet: InitPacketInterface): void {
        if(!(<Element>root).hasAttribute('condition')) {
            throw new Error(`A condition must be specified in <if/>`);
        }

        const condition = (<Element>root).getAttribute('condition');

        if (!condition.trim()) {
            throw new Error(`Condition is empty in <if/>`);
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
            this.__then = type_support['then'](root, packet);
            this.__else = peek(packet.next_stack);

        }

        this.registararGenerate(root);
    }

    public eval(packet: EvalPacketInterface, branch?: number): EvalPacketInterface {
        this.registerRender(packet);
        
        return this.evalLogic(packet)
            ? this.__then.eval(packet)
            : this.__else.eval(packet)
    }

    public *gen(packet: EvalPacketInterface): any {
        this.registerRender(packet);

        yield* this.evalLogic(packet)
            ? this.__then.gen(packet)
            : this.__else.gen(packet);

        this.deregisterRender(packet);
    }
}