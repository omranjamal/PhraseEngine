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
            'spaceful',
            'unless',
            'data'
        ]);

        if (!(<Element>root).hasAttribute('id')) {
            let err = new PhraseError(`<ref>...</ref> must have an ID attribute.`);
            err.node(root);

            throw err;
        }

        if (!(<Element>root).getAttribute('id').trim()) {
            let err = new PhraseError(`<ref>...</ref> must have an non empty ID attribute.`);
            err.node(root);

            throw err;
        }

        const id = (<Element>root).getAttribute('id');

        if (!(id in packet.id_map)) {
            let err = new PhraseError(`Element with ID "${id}" not found.`);
            err.node(root);

            throw err;
        }

        const node = packet.id_map[id];

        if (!(node.nodeName in support)) {
            let err = new PhraseError(`<${node.nodeName}>...</${node.nodeName}> cannot be reffered to.`);
            err.node(root);

            throw err;
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