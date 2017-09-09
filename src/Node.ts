import { PhraseError } from './PhraseError';

export interface InitPacketInterface {
    ignore_spaces: boolean[];
    next_stack: PhraseNode[];
    id_map: {
        [key: string]: Node;
    };
    node_count: number;
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

export interface VarsPacket {
    vars: {
        [key: string]: ({
            type: 'string';
            last: boolean;
        }|{
            type: 'enum',
            values: string[];
        }|{
            type: 'boolean'
        })[];
    }
}

export abstract class PhraseNode {
    protected __node_name = this.constructor.name;
    protected __next_node: PhraseNode;
    protected __node_sequenced_name: string;
    protected __vared: boolean;

    protected abstract validateNodeName(name: string): boolean;
    public abstract init(root: Node, packet: InitPacketInterface): void;
    public abstract eval(packet: EvalPacketInterface, branch?: number): EvalPacketInterface;
    
    protected __seq(seq: Number): void {
        this.__node_sequenced_name = `n-${seq}`;
    }

    public vars(packet: VarsPacket): VarsPacket {
        if (!this.__vared) {
            this.next().vars(packet);
            this.__vared = true;
        }

        return packet;
    }

    public count(packet: EvalPacketInterface): number {
        return this.next().count(packet);
    }

    public *gen(packet: EvalPacketInterface): any {
        yield packet;
    }

    public constructor(root: Node | any, packet: InitPacketInterface) {
        if (!this.validateNodeName(root.nodeName)) {
            let err = new PhraseError(`Tag name "${root.nodeName}" not supported.`);
            err.node(root);

            throw err;
        }

        this.init(root, packet);
        this.__seq(++packet.node_count);
    }

    protected setNextNode(node: PhraseNode) {
        this.__next_node = node;
    }

    protected next(): PhraseNode {
        return this.__next_node;
    }
}