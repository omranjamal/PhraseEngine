import { SentenceNode } from "./Nodes/SentenceNode";
import { EvalPacketInterface } from "./Node";

export interface DataInterface {
    [key: string]: any
}

export default class PhraseEngine {
    protected __sentence: SentenceNode;

    public constructor(sentence: SentenceNode) {
        this.__sentence = sentence;
    }

    public static compile(xml: string): PhraseEngine {
        return new PhraseEngine(
            new SentenceNode(
                (new DOMParser).parseFromString(xml, 'text/xml').documentElement,
                {
                    ignore_spaces: [false],
                    next_stack: [],
                    id_map: {}
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
                    .replace(/\s+/ig, ' ')
                    .replace(/\r/ig, '')
                    .replace(/\s+\n/ig, "\n")
                    .replace(/\n\s+/ig, "\n")
                    .trim()
    }

    public random(data: DataInterface) {
        return this.makePresentable(
            this.__sentence.eval(
                this.makeEvalPacket(data)
            ).sentence_components
        );
    }

    public * iterate(data: DataInterface): IterableIterator<string> {
        const iterator: IterableIterator<EvalPacketInterface> = this.__sentence.gen(
            this.makeEvalPacket(data)
        );

        for (let pack of iterator) {
            yield this.makePresentable(pack.sentence_components);
        }
    }
}