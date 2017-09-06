import { PhraseNode, InitPacketInterface, EvalPacketInterface, VarsPacket } from '../Node';
import { RefableNode } from '../RefableNode';
import peek from '../peek';
import mapFilter from '../mapFilter';
import factories from '../factories';

export class SelectNode extends RefableNode {
    protected __map: {
        [key: string]: PhraseNode;
    };

    protected __default: PhraseNode;
    protected __key: string;

    protected validateNodeName(name: string): boolean {
        return name === 'select';
    }

    public init(root: Node, packet: InitPacketInterface): void {
        if (!(<Element>root).hasAttribute('key')) {
            throw new Error(`<select/> must have a "key" attribute.`);
        }

        this.__key = (<Element>root).getAttribute('key');

        if (this.__key.trim().length === 0) {
            throw new Error(`Select must have non empty key`);
        }

        let map: {[key: string]: PhraseNode} = {};
        const support = mapFilter(factories, ['for']);
        const length = root.childNodes.length;

        for (let i = 0; i < length; i++) {
            let node = root.childNodes.item(i);
            let name = node.nodeName;

            if (name !== 'for') {
                if (name === 'default') {
                    if (this.__default) {
                        throw new Error(`Multiple <default/> in <select/>`);
                    }

                    this.__default = support['for'](node, packet);
                    continue;
                } else if (name === '#text') {
                    continue;
                }

                throw new Error(`Unrecognized tag <${name}>...</${name}> under <select>...</select>`);
            }

            if (!(<Element>node).hasAttribute('value')) {
                throw new Error(`<for>...</for> must have "value" attribute`);
            }

            let value = (<Element>node).getAttribute('value');

            if (value in map) {
                throw new Error(`Duplicate value "${value}" in <select/>.`);
            }

            map[value] = support['for'](node, packet);
        }

        if (!this.__default) {
            this.__default = peek(packet.next_stack);
        }
        
        if (Object.keys(map).length === 0) {
            throw new Error(`Select must have atleast one for.`);
        }

        this.__map = map;

        this.registararGenerate(root);
    }

    public eval(packet: EvalPacketInterface, branch?: number): EvalPacketInterface {
        this.registerRender(packet);
        
        if (!(this.__key in packet.data)) {
            throw new Error(`key "${this.__key}" not found in data.`);
        }

        const val = packet.data[this.__key];

        if (val in this.__map) {
            return this.__map[val].eval(packet);
        } else {
            return this.__default.eval(packet);
        }
    }

    public *gen(packet: EvalPacketInterface): any {
        this.registerRender(packet);

        if (!(this.__key in packet.data)) {
            throw new Error(`key "${this.__key}" not found in data.`);
        }

        const val = packet.data[this.__key];

        if (val in this.__map) {
            yield* this.__map[val].gen(packet);
        } else {
            yield* this.__default.gen(packet);
        }

        this.deregisterRender(packet);
    }

    public vars(packet: VarsPacket): VarsPacket {
        if (!this.__vared) {
            packet.vars[this.__key] = packet.vars[this.__key] || [];
            packet.vars[this.__key].push({
                type: 'enum',
                values: Object.keys(this.__map)
            });

            this.__vared = true;
        }

        return packet;
    }

    public count(packet: EvalPacketInterface): number {
        let ret: number;

        this.registerRender(packet);
        
        if (!(this.__key in packet.data)) {
            throw new Error(`key "${this.__key}" not found in data.`);
        }

        const val = packet.data[this.__key];

        if (val in this.__map) {
            ret = this.__map[val].count(packet);
        } else {
            ret = this.__default.count(packet);
        }

        this.registerRender(packet);

        return ret;
    }

}