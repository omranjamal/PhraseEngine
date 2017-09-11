export class PhraseError {
    protected __line_num: number;
    public message: string;
    public error: Error;
    
    constructor(message: string) {
        this.message = message;
        this.error = new Error(message);
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