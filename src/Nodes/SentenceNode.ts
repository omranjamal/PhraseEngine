import { PhraseNode, InitPacketInterface, EvalPacketInterface } from '../Node';
import { SpaceNode } from './SpaceNode';
import mapFilter from '../mapFilter';
import factories from '../factories';
import text from '../text';
import textSupport from '../textSupport';

export class SentenceNode extends PhraseNode {
    protected validateNodeName(name: string): boolean {
        return name === 'sentence';
    }

    public init(root: Node, packet: InitPacketInterface): void {
        const id_node_map: {[key: string]: Node} = {};

        const indexIds = (root: Node) => {
            if (root.nodeName === '#text' || root.nodeName === 'ref') {
                return;
            }

            if (root.hasAttributes() && (<Element>root).hasAttribute('id')) {
                const id = (<Element>root).getAttribute('id');

                if (id in id_node_map) {
                    throw new Error(`Duplicate ID detedted "${id}"`);
                }

                id_node_map[id] = root;
                return;
            }

            const length = root.childNodes.length;

            for (let i = 0; i < length; i++) {
                indexIds(root.childNodes.item(i));
            }
        };

        indexIds(root);

        packet.id_map = id_node_map;

        this.setNextNode(text.call(this, root, packet, textSupport));
    }

    public eval(packet: EvalPacketInterface, branch?: number): void {
        this.next().eval(packet);
    }

    public *gen(packet: EvalPacketInterface): any {
        yield* this.next().gen(packet);
    }
}