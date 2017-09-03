import { PhraseNode, InitPacketInterface, EvalPacketInterface } from '../Node';
import { RefableNode } from '../RefableNode';
import peek from '../peek';
import text from '../text';
import textSupport from '../textSupport';

export class MaybeNode extends RefableNode {
    protected __skip: PhraseNode;

    protected validateNodeName(name: string): boolean {
        return name === 'maybe';
    }

    public init(root: Node, packet: InitPacketInterface): void {
        this.setNextNode(text.call(this, root, packet, textSupport));
        this.__skip = peek(packet.next_stack);

        this.registararGenerate(root);
    }

    public eval(packet: EvalPacketInterface, branch: number = Math.round(Math.random()*453745)): void {
        !!(branch&1) && this.registerRender(packet);
        
        [
            this.__skip,
            this.__next_node
        ][branch&1].eval(packet);
    }

    public *gen(packet: EvalPacketInterface): any {
        this.registerRender(packet);
        yield* this.__skip.gen(packet);
        this.deregisterRender(packet);

        yield* this.next().gen(packet);
    }
}