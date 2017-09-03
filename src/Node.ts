export interface InitPacketInterface {
    ignore_spaces: boolean[];
    next_stack: PhraseNode[];
    id_map: {
        [key: string]: Node;
    };
}

export interface EvalPacketInterface {
    data: {
        [key: string]: any;
    }
    sentence_components: string[];
    id_render_map: {
        [key: string]: boolean;
    };
    class_render_map: {
        [key: string]: boolean;
    };
}

export abstract class PhraseNode {
    protected __node_name = this.constructor.name;
    protected __next_node: PhraseNode;

    protected abstract validateNodeName(name: string): boolean;
    public abstract init(root: Node, packet: InitPacketInterface): void;
    public abstract eval(packet: EvalPacketInterface, branch?: number): void;

    public *gen(packet: EvalPacketInterface): any {
        yield packet;
    }

    public constructor(root: Node | any, packet: InitPacketInterface) {
        if (!this.validateNodeName(root.nodeName)) {
            throw new Error(`Tag name "${root.nodeName}" not supported.`);
        }

        this.init(root, packet);
    }

    protected setNextNode(node: PhraseNode) {
        this.__next_node = node;
    }

    protected next(): PhraseNode {
        !this.__next_node && (this.__next_node = new (class extends PhraseNode {
            protected validateNodeName(name: string): boolean { return true };
            public init(root: Node, packet: InitPacketInterface): void {};
            public eval(packet: EvalPacketInterface, branch?: number): void {};
        })('', {
            ignore_spaces: [],
            next_stack: [],
            id_map: {}
        }));

        return this.__next_node;
    }
}