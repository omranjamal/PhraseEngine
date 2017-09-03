import peek from './peek';

export const isOperator = (o: string) => (
    o in {
        '&': true,
        '|': true,
        '!': true,
    }
)

export const precedence = (o: string) => (
    (<{[key: string]: number}>{
        '&': 2,
        '|': 1,
        '!': 3
    })[o]
)

export default (expression: string) => {
    const operator_stack: string[] = [];
    const working: string[] = [];
    let identifier: string[] = [];

    const pushIdentifier = (): boolean =>
        !!identifier.length
        && working.push(identifier.join(''))
        && (identifier = <string[]>[])
        && true

    expression
        .replace(/\s/ig, '')
        .split('')
        .forEach(char => {
            if (char === '(') {
                pushIdentifier();
                operator_stack.push('(');
            } else if (char === ')') {
                pushIdentifier();

                let popped = operator_stack.pop();

                while (!!popped && popped !== '(') {
                    working.push(popped);
                    popped = operator_stack.pop();
                }
            } else if (isOperator(char)) {
                pushIdentifier()

                while (!!peek(operator_stack) && precedence(peek(operator_stack)) > precedence(char)) {
                    working.push(operator_stack.pop());
                }

                operator_stack.push(char);
            } else {
                identifier.push(char);
            }
        });

    pushIdentifier();

    return working.concat(operator_stack.reverse());
}