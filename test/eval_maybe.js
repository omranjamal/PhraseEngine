const is = require('chai').assert;
const en = require('../dist/').default;

describe('EVAL: maybe', function () {
    describe('.iterate()', function () {

        it('should render two sentences', function () {
            let engine = en.compile(`
                    <sentence>
                        <maybe>Y</maybe>
                    </sentence>
                `);
            engine.vars();
            engine.count();

            let li = [...engine.iterate()];

            is.equal(li.length, 2);
            is.isTrue(li.every(x => x === '' || x === 'Y'));
        });

        it('should interact with if (false on non-render, vice-versa)', function () {
            let engine = en.compile(`
                    <sentence>
                        <maybe id="a">A</maybe>
                        <if condition="!#a">X</if>
                    </sentence>
                `);
            engine.vars();
            engine.count();

            let li = [...engine.iterate()];

            is.equal(li.length, 2);
            is.isTrue(li.every(x => x === 'X' || x === 'A'));
        });

    });
});