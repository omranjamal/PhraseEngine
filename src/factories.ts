import { TextNode } from './Nodes/TextNode';
import { IfNode } from './Nodes/IfNode';
import { MaybeNode } from './Nodes/MaybeNode';
import { EitherNode } from './Nodes/EitherNode';
import { SelectNode } from './Nodes/SelectNode';
import { ForNode } from './Nodes/ForNode';
import { UnlessNode } from './Nodes/UnlessNode';
import { ThenNode } from './Nodes/ThenNode';
import { ElseNode } from './Nodes/ElseNode';
import { OrNode } from './Nodes/OrNode';
import { DataNode } from './Nodes/DataNode';
import { SpacelessNode } from './Nodes/SpacelessNode';
import { RawTextNode } from './Nodes/RawTextNode';
import { SpaceNode } from './Nodes/SpaceNode';
import { RefNode } from './Nodes/RefNode';
import { BrNode } from './Nodes/BrNode';

import peek from './peek';
import { PhraseNode, InitPacketInterface } from './Node';

const orFactory = (root: Node, packet: InitPacketInterface) => {
    return new OrNode(root, packet);
};

export default {
    "this": orFactory,
    "or": orFactory,
    "if": (root: Node, packet: InitPacketInterface) => {
        return new IfNode(root, packet);
    },
    "text": (root: Node, packet: InitPacketInterface) => {
        return new TextNode(root, packet);
    },
    "maybe": (root: Node, packet: InitPacketInterface) => {
        return new MaybeNode(root, packet);
    },
    "either": (root: Node, packet: InitPacketInterface) => {
        return new EitherNode(root, packet);
    },
    "select": (root: Node, packet: InitPacketInterface) => {
        return new SelectNode(root, packet);
    },
    "for": (root: Node, packet: InitPacketInterface) => {
        return new ForNode(root, packet);
    },
    "spaceless": (root: Node, packet: InitPacketInterface) => {
        return new SpacelessNode(root, packet);
    },
    "unless": (root: Node, packet: InitPacketInterface) => {
        return new UnlessNode(root, packet);
    },
    "then": (root: Node, packet: InitPacketInterface) => {
        return new ThenNode(root, packet);
    },
    "else": (root: Node, packet: InitPacketInterface) => {
        return new ElseNode(root, packet);
    },
    "data": (root: Node, packet: InitPacketInterface) => {
        return new DataNode(root, packet);
    },
    "ref": (root: Node, packet: InitPacketInterface) => {
        return new RefNode(root, packet);
    },
    "br": (root: Node, packet: InitPacketInterface) => {
        return new BrNode(root, packet);
    },
    "#text": (root: Node, packet: InitPacketInterface) => {
        const trimmed_data = root.nodeValue.trim();
        return !!trimmed_data
            ? new RawTextNode(root, packet)
            : peek(packet.next_stack) instanceof SpaceNode
                ? peek(packet.next_stack)
                : new SpaceNode(root, packet)
    }
}