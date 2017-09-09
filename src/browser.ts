import { VarsPacket } from './Node';
import { SentenceNode } from "./Nodes/SentenceNode";
import { EvalPacketInterface } from "./Node";
import makeTerminus from './makeTerminus';

export interface DataInterface {
    [key: string]: any
}

export default class PhraseEngine {
    protected __sentence: SentenceNode;

    public constructor(sentence: SentenceNode) {
        this.__sentence = sentence;
    }

    public static getDOMParser(): { new(): DOMParser } {
        return DOMParser;
    }

    public static compile(xml: string): PhraseEngine {
        return new PhraseEngine(
            new SentenceNode(
                (new (this.getDOMParser())).parseFromString(xml, 'text/xml').documentElement,
                {
                    ignore_spaces: [false],
                    next_stack: [makeTerminus()],
                    id_map: {},
                    node_count: 0
                }
            )
        );
    }

    protected makeEvalPacket(data: DataInterface): EvalPacketInterface {
        return {
            data,
            sentence_components: <Array<string>>[],
            id_render_map: {},
            class_render_map: {}
        }
    }

    protected makePresentable(components: string[]) {
        return components
            .join('')
            .replace(/ +/ig, ' ')
            .replace(/\r/ig, '')
            .replace(/ +\n/ig, "\n")
            .replace(/\n +/ig, "\n")
            .trim()
    }

    public random(data: DataInterface = {}) {
        return this.makePresentable(
            this.__sentence.eval(
                this.makeEvalPacket(data)
            ).sentence_components
        );
    }

    public * iterate(data: DataInterface = {}): IterableIterator<string> {
        const iterator: IterableIterator<EvalPacketInterface> = this.__sentence.gen(
            this.makeEvalPacket(data)
        );

        for (let pack of iterator) {
            yield this.makePresentable(pack.sentence_components);
        }
    }

    public vars(): VarsPacket {
        return this.__sentence.vars({
            vars: {}
        });
    }

    public count(data: DataInterface = {}): number {
        return this.__sentence.count(this.makeEvalPacket(data));
    }
}