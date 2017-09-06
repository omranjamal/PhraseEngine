const is = require('chai').assert;
const en = require('../dist/').default;

describe('EVAL: data', function () {
    describe('.iterate()', function () {

        it('should render the data', function () {
            let li = [...en.compile(`
                    <sentence>
                        <data key="x" />
                    </sentence>
                `).iterate({
                    x: 'XXX'
                })];

            is.equal(li[0], 'XXX');
        });

        it('should render the first available data', function () {
            let li = [...en.compile(`
                    <sentence>
                        <data key="z|x|y" />
                    </sentence>
                `).iterate({
                    x: 'XXX',
                    y: 'YYY'
                })];

            is.equal(li[0], 'XXX');
        });

        it('should render ignore unavailable data', function () {
            let li = [...en.compile(`
                    <sentence>
                        <data key="x|y" />
                    </sentence>
                `).iterate({
                    y: 'YYY'
                })];

            is.equal(li[0], 'YYY');
        });


        it('should throw if data isn\'t found', function () {
            is.throws(() => {
                let li = [...en.compile(`
                    <sentence>
                        <data key="x|y" />
                    </sentence>
                `).iterate({})];
            });
        });

    });
});