const is = require('chai').assert;
const en = require('../dist/').default;

describe('EVAL: ref', function () {
    describe('.iterate()', function () {

        it('should throw on unknown tag', function () {
            is.throws(() => {
                let engine = en.compile(`
                    <sentence>
                        <maybe>Y</maybe>
                        <ref id="x"/>
                    </sentence>
                `);
                engine.vars();
                engine.count();

                let li = [...engine.iterate()];
            });
        });

        it('should render mimic refferenced tag', function () {
            let engine = en.compile(`
                    <sentence>
                        <maybe id="x">Y</maybe>
                        <ref id="x"/>
                    </sentence>
                `);
            engine.vars();
            engine.count();

            let li = [...engine.iterate()];

            is.equal(li.length, 4);
            is.isTrue(li.every(x =>
                x === '' || x === 'Y Y' || x === 'Y'
            ));
        });

    });
});