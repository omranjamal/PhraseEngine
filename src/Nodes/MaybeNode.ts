import { PhraseNode, InitPacketInterface, EvalPacketInterface, VarsPacket } from '../Node';
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

    public eval(packet: EvalPacketInterface, branch: number = Math.round(Math.random() * 453745)): EvalPacketInterface {
        !!(branch&1) && this.registerRender(packet);
        
        return [
            this.__skip,
            this.__next_node
        ][branch&1].eval(packet);
    }

    public *gen(packet: EvalPacketInterface): any {
        this.registerRender(packet);
        yield* this.next().gen(packet);
        this.deregisterRender(packet);

        yield* this.__skip.gen(packet);
    }

    public count(packet: EvalPacketInterface): number {
        let ret: number;

        this.registerRender(packet);
        ret = this.next().count(packet);
        this.deregisterRender(packet);

        ret += this.__skip.count(packet);

        return ret;
    }

    public vars(packet: VarsPacket): VarsPacket {
        if (!this.__vared) {
            this.__next_node.vars(packet);
            this.__skip.vars(packet);

            this.__vared = true;
        }

        return packet;
    }
}