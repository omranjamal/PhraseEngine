const is = require('chai').assert;
const en = require('../dist/').default;

describe('EVAL: spaceless', function () {
    describe('.iterate()', function () {

        it('should make spaces vanish', function () {
            let engine = en.compile(`
                    <sentence>
                        <text>A</text>
                        <text>B</text>
                    </sentence>
                `);
            engine.vars();
            engine.count();

            let li = [...engine.iterate()];

            is.equal(li[0], 'A B');


            engine = en.compile(`
                    <sentence>
                        <spaceless>
                            <text>A</text>
                            <text>B</text>
                        </spaceless>
                    </sentence>
                `);
            engine.vars();
            engine.count();

            li = [...engine.iterate()];

            is.equal(li[0], 'AB');
        });

    });
});