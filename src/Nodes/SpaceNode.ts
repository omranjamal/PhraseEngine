import { PhraseNode, InitPacketInterface, EvalPacketInterface} from '../Node';
import peek from '../peek';

export class SpaceNode extends PhraseNode {
    protected validateNodeName(name: string): boolean {
        return name === '#text';
    }

    public init(root: Element, packet: InitPacketInterface): void {
        this.setNextNode(peek(packet.next_stack));
    }

    public eval(packet: EvalPacketInterface, branch?: number): void {
        
        packet.sentence_components.push(" ");
        this.next().eval(packet);
    }

    public *gen(packet: EvalPacketInterface): any {
        packet.sentence_components.push(" ");
        yield* this.next().gen(packet);
        packet.sentence_components.pop();
    }
}