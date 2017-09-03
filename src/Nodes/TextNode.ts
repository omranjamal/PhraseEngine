import { PhraseNode, InitPacketInterface, EvalPacketInterface } from '../Node';
import { RefableNode } from '../RefableNode';
import mapFilter from '../mapFilter';
import factories from '../factories';
import text from '../text';

import textSupport from '../textSupport';

export class TextNode extends RefableNode {
    protected validateNodeName(name: string): boolean {
        return name === 'text';
    }

    public init(root: Node, packet: InitPacketInterface): void {
        this.setNextNode(text.call(this, root, packet, textSupport));
        this.registararGenerate(root);
    }

    public eval(packet: EvalPacketInterface, branch?: number): void {
        this.registerRender(packet);
        
        this.next().eval(packet);
    }

    public *gen(packet: EvalPacketInterface): any {
        this.registerRender(packet);
        yield* this.next().gen(packet);
        this.deregisterRender(packet);
    }
}