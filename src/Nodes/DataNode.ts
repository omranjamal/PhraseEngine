import { PhraseError } from '../PhraseError';
import { InitPacketInterface, EvalPacketInterface, VarsPacket } from '../Node';
import { RefableNode } from '../RefableNode';
import peek from '../peek';

export class DataNode extends RefableNode {
    protected __evaulator: (eval_pack: EvalPacketInterface) => string;
    protected __check_arr: string[];

    protected validateNodeName(name: string): boolean {
        return name === 'data';
    }

    public init(root: Node, packet: InitPacketInterface): void {
        if (!(<Element>root).hasAttribute('key')) {
            let err = new PhraseError(`<data /> tags must include a key attribute.`);
            err.node(root);
            throw err;
        }

        const check_arr = (<Element>root)
            .getAttribute('key')
            .split('|')
            .map(key => key.trim());
            
        this.__check_arr = check_arr;

        this.__evaulator = (eval_pack: EvalPacketInterface) => {
            let key = check_arr.find(key => key in eval_pack.data)
            
            if (key === undefined) {
                throw new Error(`No data for keys "${check_arr.join(', ')}"`);
            }

            return eval_pack.data[key];
        };

        this.setNextNode(peek(packet.next_stack));
        this.registararGenerate(root);
    }

    public eval(packet: EvalPacketInterface, branch?: number): EvalPacketInterface {
        this.registerRender(packet);
        
        packet.sentence_components.push(this.__evaulator(packet));
        return this.next().eval(packet);
    }

    public *gen(packet: EvalPacketInterface): any {
        this.registerRender(packet);

        packet.sentence_components.push(this.__evaulator(packet));
        yield* this.next().gen(packet);
        packet.sentence_components.pop();

        this.deregisterRender(packet);
    }

    public vars(packet: VarsPacket): VarsPacket {
        let check_array_copy = this.__check_arr.slice(0);
        
        if (!this.__vared) {
            this.__vared = true;

            let popped: string = check_array_copy.pop();

            packet.vars[popped] = packet.vars[popped] || [];

            packet.vars[popped].push({
                type: 'string',
                last: true
            });

            popped = check_array_copy.pop();

            while (popped) {
                packet.vars[popped] = packet.vars[popped] || [];

                packet.vars[popped].push({
                    type: 'string',
                    last: false
                });

                popped = check_array_copy.pop()
            }

            this.next().vars(packet);
        }

        return packet;
    }

    public count(e_packet: EvalPacketInterface): number {
        this.registerRender(e_packet);
        const ret =  this.next().count(e_packet);
        this.registerRender(e_packet);

        return ret;
    }
}