export interface IteratorState {
    data: {
        i: number;
    }[];
}


export function* range(stop: number, depth: number, state: IteratorState): Iterable<number> {
    if (depth >= state.data.length) {
        state.data.push({
            i: 0
        });
    }
    
    const stop_actual = stop - 1;
    let i = state.data[depth].i;

    while (i < stop_actual) {
        yield i;

        i++;
        state.data[depth].i = i;
    }

    yield stop_actual;
    state.data[depth].i = 0;
}