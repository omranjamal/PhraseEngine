import PhraseEngine from './index';

let engine: PhraseEngine;

try {
    engine = PhraseEngine.compile(`
        <sentence>
            <text>I love</text>
            <text> </text>
            <text> </text>
            <potato></potato>
            <br/>
            Shaira
        </sentence>
    `);
} catch (e) {
    console.log(e.message, e.line());
}

const dat =  {
};

// console.log(JSON.stringify(engine.vars(), null, 4));
// console.log(engine.count(dat));
// console.log([...engine.iterate(dat)]);
// console.log([...engine.iterate(dat)].length);