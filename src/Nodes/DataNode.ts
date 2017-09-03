import { InitPacketInterface, EvalPacketInterface } from '../Node';
import { RefableNode } from '../RefableNode';
import peek from '../peek';

export class DataNode extends RefableNode {
    protected __evaulator: (eval_pack: EvalPacketInterface) => string;

    protected validateNodeName(name: string): boolean {
        return name === 'data';
    }

    public init(root: Node, packet: InitPacketInterface): void {
        if (!(<Element>root).hasAttribute('key')) {
            throw new Error(`<data /> tags must include a key attribute.`);
        }

        const check_arr = (<Element>root).getAttribute('key').split('|');

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

    public eval(packet: EvalPacketInterface, branch?: number): void {
        this.registerRender(packet);
        
        packet.sentence_components.push(this.__evaulator(packet));
        this.next().eval(packet);
    }

    public *gen(packet: EvalPacketInterface): any {
        this.registerRender(packet);

        packet.sentence_components.push(this.__evaulator(packet));
        yield* this.next().gen(packet);
        packet.sentence_components.pop();

        this.deregisterRender(packet);
    }
}