const is = require('chai').assert;
const en = require('../dist/').default;

describe('EVAL: spaceful', function () {
    describe('.iterate()', function () {

        it('should bring back spaces nested inside a spaceless tag', function () {
            let engine = en.compile(`
                    <sentence>
                        <spaceless>
                            <text>A</text>
                            <text>B</text>
                            <spaceful>
                                <text>C</text>
                                <text>D</text>
                            </spaceful>
                        </spaceless>
                    </sentence>
                `);
            engine.vars();
            engine.count();

            let li = [...engine.iterate()];

            is.equal(li[0], 'AB C D');
        });

    });
});