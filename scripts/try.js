let PhraseEngine = require('phrase-engine');
let engine  = PhraseEngine.compile('<sentence><maybe>POTATO</maybe></sentence>');
alert(engine.random());