import { PhraseNode, InitPacketInterface, EvalPacketInterface, VarsPacket } from '../Node';
import { RefableNode } from '../RefableNode';
import peek from '../peek';
import mapFilter from '../mapFilter';
import factories from '../factories';
import { PhraseError } from '../PhraseError';

export class EitherNode extends RefableNode {
    protected __routes: PhraseNode[];

    protected validateNodeName(name: string): boolean {
        return name === 'either';
    }

    public init(root: Node, packet: InitPacketInterface): void {
        const routes: PhraseNode[] = [];
        const type_support = mapFilter(factories, [
            'this',
            'or'
        ]);

        const length = root.childNodes.length;

        for (let i = length - 1; i > -1; i--) {
            let node = root.childNodes.item(i);

            if (node.nodeName === '#text') {
                continue;
            }

            if (!(node.nodeName in type_support)) {
                let err = new PhraseError(`Unrecognized tag <${node.nodeName}>...</${node.nodeName}> under <either>...</either>`);
                err.node(root);
                throw err;
            }

            routes.push(type_support[node.nodeName](node, packet));
            this.__routes = routes;
        }

        if (routes.length === 0) {
            let err = new PhraseError(`Either should always have atleast one path.`);
            err.node(root);
            throw err;
        }

        this.registararGenerate(root);
    }

    public eval(packet: EvalPacketInterface, branch: number = Math.round(Math.random() * (2 ** 16))): EvalPacketInterface {
        this.registerRender(packet);
        return this.__routes[branch%this.__routes.length].eval(packet);
    }

    public *gen(packet: EvalPacketInterface): any {
        this.registerRender(packet);
        
        for (let route of this.__routes) {
            yield* route.gen(packet);
        }

        this.deregisterRender(packet);
    }

    public vars(packet: VarsPacket): VarsPacket {
        if (!this.__vared) {
            this.__routes.forEach(route => {
                route.vars(packet);
            });

            this.__vared = true;
        }

        return packet;
    }

    public count(e_packet: EvalPacketInterface): number {
        this.registerRender(e_packet);

        const ret = this.__routes.map(route => {
            return route.count(e_packet);
        }).reduce((a, b) => a+b);

        this.deregisterRender(e_packet);

        return ret;
    }
}