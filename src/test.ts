import PhraseEngine from './index';
const engine = PhraseEngine.compile(`
    <sentence>
        Hello. <maybe id="name">I'm Omran.</maybe>
        <either>
            <this>potato</this>
            <or>tomato</or>
            <or>tematun</or>
            <or>chocolate</or>
        </either>
        <if condition="#name & tomato">
            <either>
                <this>x</this>
                <or>y</or>
                <or><data key="tomato | potato"/></or>
            </either>
            <maybe>HUE</maybe>
            <select key="woah">
                <for value="x">Hue</for>
                <for value="y">Mon</for>
                <for value="z">Gus</for>
            </select>
        </if>
    </sentence>
`);

const dat =  {
    tomato: false
};

console.log(JSON.stringify(engine.vars(), null, 4));
// console.log(engine.count(dat));
// console.log([...engine.iterate(dat)]);
// console.log([...engine.iterate(dat)].length);