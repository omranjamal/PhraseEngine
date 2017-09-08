import { PhraseNode, InitPacketInterface, EvalPacketInterface } from './Node';
import { SpaceNode } from './Nodes/SpaceNode';
import peek from './peek';
import { PhraseError } from './PhraseError';

export default function (root: Node, packet: InitPacketInterface, support: { [key: string]: (root: Node, packet: InitPacketInterface) => PhraseNode}) {
    const length = root.childNodes.length;

    if (length === 0) {
        return peek(packet.next_stack);
    }

    let last_node: PhraseNode;
    let name = root.childNodes.item(length - 1).nodeName;

    if (!(name in support)) {
        let err = new PhraseError(`Unrecognized child <${name}>...</${name}>`);
        err.node(root.childNodes.item(length - 1));

        return err;
    }

    last_node = support[name](
        root.childNodes.item(length - 1),
        packet
    );

    if (last_node instanceof SpaceNode && peek(packet.ignore_spaces)) {
        last_node = peek(packet.next_stack);
    }

    for (let i = length - 2; i > -1; i--) {
        packet.next_stack.push(last_node);
        let name = root.childNodes.item(i).nodeName;
        let node: PhraseNode;

        if (!(name in support)) {
            let err = new PhraseError(`Unrecognized child <${name}>...</${name}>`);
            err.node(root.childNodes.item(i));

            throw err;
        }

        node = support[name](root.childNodes.item(i), packet);

        if (node instanceof SpaceNode && peek(packet.ignore_spaces)) {
            packet.next_stack.pop();
            continue;
        }

        last_node = node;
        packet.next_stack.pop();
    }

    return last_node;
};