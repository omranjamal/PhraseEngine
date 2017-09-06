const is = require('chai').assert;
const en = require('../dist/').default;

describe('EVAL: spaceless', function () {
    describe('.iterate()', function () {

        it('should make spaces vanish', function () {
            let li = [...en.compile(`
                    <sentence>
                        <text>A</text>
                        <text>B</text>
                    </sentence>
                `).iterate()];

            is.equal(li[0], 'A B');

            li = [...en.compile(`
                    <sentence>
                        <spaceless>
                            <text>A</text>
                            <text>B</text>
                        </spaceless>
                    </sentence>
                `).iterate()];

            is.equal(li[0], 'AB');
        });

    });
});