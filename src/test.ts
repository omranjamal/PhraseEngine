import PhraseEngine from './index';
const engine = PhraseEngine.compile(`
    <sentence>
        <text>I love</text>
        <text> </text>
        <text> </text>
        <br/>
        Shaira
    </sentence>
`);

const dat =  {
};

// console.log(JSON.stringify(engine.vars(), null, 4));
// console.log(engine.count(dat));
console.log([...engine.iterate(dat)]);
// console.log([...engine.iterate(dat)].length);