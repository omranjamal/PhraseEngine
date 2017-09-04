import { PhraseNode, InitPacketInterface, EvalPacketInterface } from '../Node';
import peek from '../peek';
import mapFilter from '../mapFilter';
import factories from '../factories';

export class RefNode extends PhraseNode {
    protected validateNodeName(name: string): boolean {
        return name === 'ref';
    }

    public init(root: Element, packet: InitPacketInterface): void {
        const support = mapFilter(factories, [
            'if',
            'text',
            'maybe',
            'either',
            'select',
            'spaceless',
            'unless',
            'data'
        ]);

        if (!(<Element>root).hasAttribute('id')) {
            throw new Error(`<ref>...</ref> must have an ID attribute.`);
        }

        if (!(<Element>root).getAttribute('id').trim()) {
            throw new Error(`<ref>...</ref> must have an non empty ID attribute.`);
        }

        const id = (<Element>root).getAttribute('id');

        if (!(id in packet.id_map)) {
            throw new Error(`Element with ID "${id}" not found.`);
        }

        const node = packet.id_map[id];

        if (!(node.nodeName in support)) {
            throw new Error(`<${node.nodeName}>...</${node.nodeName}> cannot be reffered to.`);
        }

        this.setNextNode(support[node.nodeName](node, packet));
    }

    public eval(packet: EvalPacketInterface, branch?: number): EvalPacketInterface {
        return this.next().eval(packet);
    }
    
    public *gen(packet: EvalPacketInterface): any {
        yield* this.next().gen(packet);
    }
}