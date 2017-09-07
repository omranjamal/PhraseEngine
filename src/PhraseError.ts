export class PhraseError extends Error {
    protected __line_num: number;
    
    constructor(message: string) {
        super(message);
    }

    node(node: Node): PhraseError {
        if(node && 'lineNumber' in node) {
            this.__line_num = (<any>node).lineNumber;
        }

        return this;
    }

    line(): null | number {
        return this.__line_num || null;
    }
}