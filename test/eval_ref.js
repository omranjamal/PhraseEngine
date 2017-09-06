const is = require('chai').assert;
const en = require('../dist/').default;

describe('EVAL: ref', function () {
    describe('.iterate()', function () {

        it('should throw on unknown tag', function () {
            is.throws(() => {
                let li = [...en.compile(`
                    <sentence>
                        <maybe>Y</maybe>
                        <ref id="x"/>
                    </sentence>
                `).iterate()];
            });
        });

        it('should render mimic refferenced tag', function () {
            let li = [...en.compile(`
                    <sentence>
                        <maybe id="x">Y</maybe>
                        <ref id="x"/>
                    </sentence>
                `).iterate()];

            is.equal(li.length, 4);
            is.isTrue(li.every(x =>
                x === '' || x === 'Y Y' || x === 'Y'
            ));
        });

    });
});