import { PhraseNode, EvalPacketInterface, InitPacketInterface, VarsPacket} from './Node';

export class TerminusNode extends PhraseNode {
    protected validateNodeName(name: string): boolean { return true };
    public init(root: Node, packet: InitPacketInterface): void { };
    public eval(packet: EvalPacketInterface, branch?: number): EvalPacketInterface {
        return packet;
    };

    public vars(packet: VarsPacket): VarsPacket {
        return packet;
    }

    public count() {
        return 1;
    }
};

export default () => {
    return new TerminusNode('', {
        ignore_spaces: [],
        next_stack: [],
        id_map: {},
        node_count: 0
    });
}