import { PhraseNode } from './Node';
import { InitPacketInterface, EvalPacketInterface } from './Node';

export abstract class RefableNode extends PhraseNode {
    protected __classnames: string[];
    protected __id: string;

    protected registararGenerate(root: Node): void {
        const ele: Element = <Element>root;

        if (ele.hasAttribute('id')) {
            this.__id = ele.getAttribute('id').trim();
        }
        
        if (ele.hasAttribute('class')) {
            this.__classnames = ele.getAttribute('class')
                .replace(/\s+/ig, ' ')
                .trim()
                .split(' ');
        }
    }

    protected registerRender(packet: EvalPacketInterface): void {
        !!this.__id && (packet.id_render_map[this.__id] = true);

        if (this.__classnames) {
            this.__classnames.forEach(classname => {
                packet.class_render_map[classname] = true;
            });
        }
    }

    protected deregisterRender(packet: EvalPacketInterface): void {
        !!this.__id && (packet.id_render_map[this.__id] = false);

        if (this.__classnames) {
            this.__classnames.forEach(classname => {
                packet.class_render_map[classname] = false;
            });
        }
    }
}