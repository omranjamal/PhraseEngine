import { PhraseNode, InitPacketInterface, EvalPacketInterface } from '../Node';
import peek from '../peek';

export class RawTextNode extends PhraseNode {
    protected __value: string;

    protected validateNodeName(name: string): boolean {
        return name === '#text' || name === 'text';
    }

    public init(root: Node, packet: InitPacketInterface): void {
        this.__value = peek(packet.ignore_spaces)
            ? root.nodeValue.replace(/[\s\n\r]+/ig, ' ').trim()
            : root.nodeValue.replace(/[\s\n\r]+/ig, ' ')

        this.setNextNode(peek(packet.next_stack));
    }

    public eval(packet: EvalPacketInterface, branch?: number): EvalPacketInterface {
        packet.sentence_components.push(this.__value);
        return this.next().eval(packet);
    }

    public *gen(packet: EvalPacketInterface): any {
        packet.sentence_components.push(this.__value);
        yield* this.next().gen(packet);
        packet.sentence_components.pop();
    }

    public count(e_packet: EvalPacketInterface): number {
        const ret = this.next().count(e_packet);
        return ret;
    }
}