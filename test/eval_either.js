const is = require('chai').assert;
const en = require('../dist/').default;

describe('EVAL: either', function () {
    describe('.iterate()', function () {

        it('should render each data', function () {
            let engine = en.compile(`
                    <sentence>
                        <either>
                            <this>Tomato</this>
                            <or>Potato</or>
                        </either>
                    </sentence>
                `);

            engine.vars();
            engine.count({});

            let li = [...engine.iterate()];

            is.equal(li.length, 2);
        });

        it('should render each data', function () {
            let engine = en.compile(`
                    <sentence>
                        <either>
                            <this>Tomato</this>
                            <or>Potato</or>
                        </either>
                    </sentence>
                `);

            engine.vars();
            engine.count({});

            let li = [...engine.iterate()];

            is.isTrue(li.every(x => x === 'Tomato' || x === 'Potato'));
        });

    });
});