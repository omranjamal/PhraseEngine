import PhraseEngine from './index';

let engine: PhraseEngine;

try {
    engine = PhraseEngine.compile(`
        <sentence>
            <!-- TOMATO -->
            TOMATO
        </sentence>
    `);
} catch (e) {
    console.log(e.message);
}

const dat = {
    pet_type: "feline"
};

// console.log(JSON.stringify(engine.vars(), null, 4));
// console.log(engine.count(dat));
// console.log([...engine.iterate(dat)]);
// console.log([...engine.iterate(dat)].length);