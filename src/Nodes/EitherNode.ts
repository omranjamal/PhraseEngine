import { PhraseNode, InitPacketInterface, EvalPacketInterface } from '../Node';
import { RefableNode } from '../RefableNode';
import peek from '../peek';
import mapFilter from '../mapFilter';
import factories from '../factories';

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
                throw new Error(`Unrecognized tag <${node.nodeName}>...</${node.nodeName}> under <either>...</either>`);
            }

            routes.push(type_support[node.nodeName](node, packet));
            this.__routes = routes;
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
}