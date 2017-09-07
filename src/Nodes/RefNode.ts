import { PhraseNode, InitPacketInterface, EvalPacketInterface } from '../Node';
import peek from '../peek';
import mapFilter from '../mapFilter';
import factories from '../factories';
import { PhraseError } from '../PhraseError';

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
            throw (new PhraseError(`<ref>...</ref> must have an ID attribute.`)).node(root);
        }

        if (!(<Element>root).getAttribute('id').trim()) {
            throw (new PhraseError(`<ref>...</ref> must have an non empty ID attribute.`)).node(root);
        }

        const id = (<Element>root).getAttribute('id');

        if (!(id in packet.id_map)) {
            throw (new PhraseError(`Element with ID "${id}" not found.`)).node(root);
        }

        const node = packet.id_map[id];

        if (!(node.nodeName in support)) {
            throw (new PhraseError(`<${node.nodeName}>...</${node.nodeName}> cannot be reffered to.`)).node(root);
        }

        this.setNextNode(support[node.nodeName](node, packet));
    }

    public eval(packet: EvalPacketInterface, branch?: number): EvalPacketInterface {
        return this.next().eval(packet);
    }
    
    public *gen(packet: EvalPacketInterface): any {
        yield* this.next().gen(packet);
    }

    public count(e_packet: EvalPacketInterface): number {
        const ret = this.next().count(e_packet);
        return ret;
    }
}