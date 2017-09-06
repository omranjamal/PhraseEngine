const is = require('chai').assert;
const en = require('../dist/').default;

describe('EVAL: select', function () {
    describe('.iterate()', function () {

        it('should render one sentence', function () {
            let li = [...en.compile(`
                    <sentence>
                        <select key="x">
                            <for value="A">XA</for>
                        </select>
                    </sentence>
                `).iterate({x: 'A'})];

            is.equal(li.length, 1);
            is.equal(li[0], 'XA');

            li = [...en.compile(`
                    <sentence>
                        <select key="x">
                            <for value="A">XA</for>
                        </select>
                    </sentence>
                `).iterate({ x: 'B' })];

            is.equal(li.length, 1);
            is.equal(li[0], '');

            li = [...en.compile(`
                    <sentence>
                        <select key="x">
                            <for value="A">XA</for>
                            <default>XD</default>
                        </select>
                    </sentence>
                `).iterate({ x: 'B' })];

            is.equal(li.length, 1);
            is.equal(li[0], 'XD');
        });

        it('should render one sentence', function () {
            let li = [...en.compile(`
                    <sentence>
                        <select key="x">
                            <for value="A">XA</for>
                        </select>
                    </sentence>
                `).iterate({ x: 'A' })];

            is.equal(li.length, 1);
            is.equal(li[0], 'XA');

            li = [...en.compile(`
                    <sentence>
                        <select key="x">
                            <for value="A">XA</for>
                        </select>
                    </sentence>
                `).iterate({ x: 'B' })];

            is.equal(li.length, 1);
            is.equal(li[0], '');

            li = [...en.compile(`
                    <sentence>
                        <select key="x">
                            <for value="A">XA</for>
                            <default>XD</default>
                        </select>
                    </sentence>
                `).iterate({ x: 'B' })];

            is.equal(li.length, 1);
            is.equal(li[0], 'XD');
        });


        it('should interact constant true with if', function () {
            let li = [...en.compile(`
                    <sentence>
                        <select key="x" id="y">
                            <for value="A">XA</for>
                        </select>
                        <if condition="#y">BB</if>
                    </sentence>
                `).iterate({ x: 'A' })];

            is.equal(li.length, 1);
            is.equal(li[0], 'XA BB');

            li = [...en.compile(`
                    <sentence>
                        <select key="x" id="y">
                            <for value="A">XA</for>
                        </select>
                        <if condition="#y">BB</if>
                    </sentence>
                `).iterate({ x: 'B' })];

            is.equal(li.length, 1);
            is.equal(li[0], 'BB');
        });

        it('FOR should interact with if', function () {
            let li = [...en.compile(`
                    <sentence>
                        <select key="x" id="y">
                            <for value="A" id="route-a">XA</for>
                        </select>
                        <if condition="#route-a">BB</if>
                    </sentence>
                `).iterate({ x: 'A' })];

            is.equal(li.length, 1);
            is.equal(li[0], 'XA BB');

            li = [...en.compile(`
                    <sentence>
                        <select key="x" id="y">
                            <for value="A" id="route-a">XA</for>
                        </select>
                        <if condition="!#route-a">BB</if>
                    </sentence>
                `).iterate({ x: 'B' })];

            is.equal(li.length, 1);
            is.equal(li[0], 'BB');
        });

    });

    it('DEFAULT should interact with if', function () {
        let li = [...en.compile(`
                    <sentence>
                        <select key="x" id="y">
                            <for value="A" id="route-a">XA</for>
                            <default id="route-x">AA</default>
                        </select>
                        <if condition="!#route-x">BB</if>
                    </sentence>
                `).iterate({ x: 'A' })];

        is.equal(li.length, 1);
        is.equal(li[0], 'XA BB');

        li = [...en.compile(`
                    <sentence>
                        <select key="x" id="y">
                            <for value="A" id="route-a">XA</for>
                            <default id="route-x">AA</default>
                        </select>
                        <if condition="#route-x">BB</if>
                    </sentence>
                `).iterate({ x: 'B' })];

        is.equal(li.length, 1);
        is.equal(li[0], 'AA BB');
    });
});