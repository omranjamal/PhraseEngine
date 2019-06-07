import { InitPacketInterface } from '../Node';
import text from '../text';
import textSupport from '../textSupport';
import {SpacelessNode} from './SpacelessNode';

export class SpacefulNode extends SpacelessNode {
    protected validateNodeName(name: string): boolean {
        return name === 'spaceful';
    }

    public init(root: Node, packet: InitPacketInterface): void {
        packet.ignore_spaces.push(false);

        this.setNextNode(text.call(this, root, packet, textSupport));

        packet.ignore_spaces.pop();
        this.registararGenerate(root);
    }
}