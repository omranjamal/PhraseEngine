require("babel-core/register");
require("babel-polyfill");

const PhraseEngine = require('phrase-engine').default;
const engine = PhraseEngine.compile(`
    <sentence>
        <maybe>POTATO</maybe>
    </sentence>
`);

console.log('x', engine.random({}));