import PhraseEngine from './index';

let engine: PhraseEngine;

try {
    engine = PhraseEngine.compile(`
        <sentence>
            My
            <select key="pet_type">
                <for value="canine">dog</for>
                <for value="feline">cat</for>
                <default>pet</default>
            </select>
            <maybe>really</maybe>
            likes Trains.
        </sentence>
    `);
} catch (e) {
    console.log(e.message, e.line());
}

const dat = {
    pet_type: "feline"
};

// console.log(JSON.stringify(engine.vars(), null, 4));
// console.log(engine.count(dat));
console.log([...engine.iterate(dat)]);
// console.log([...engine.iterate(dat)].length);