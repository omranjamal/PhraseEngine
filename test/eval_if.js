const is = require('chai').assert;
const en = require('../dist/').default;

describe('EVAL: if', function () {
    describe('.iterate()', function () {

        it('should treat unknown variable as false', function () {
            let li = [...en.compile(`
                    <sentence>
                        <if condition="yes">Y</if>
                    </sentence>
                `).iterate({
                })];

            is.equal(li[0], '');
        });

        it('should treat unknown element as false', function () {
            let li = [...en.compile(`
                    <sentence>
                        <text id="x">HUE</text>
                        <if condition="#y">Y</if>
                    </sentence>
                `).iterate({
                })];

            is.equal(li[0], 'HUE');

            li = [...en.compile(`
                    <sentence>
                        <text id="x">HUE</text>
                        <if condition="!#y">Y</if>
                    </sentence>
                `).iterate({
                })];

            is.equal(li[0], 'HUE Y');
        });

        it('should render conditionally (implicit)', function () {
            let li = [...en.compile(`
                    <sentence>
                        <if condition="yes">Y</if>
                    </sentence>
                `).iterate({
                    yes: true
                })];

            is.equal(li[0], 'Y');

            li = [...en.compile(`
                    <sentence>
                        <if condition="yes">Y</if>
                    </sentence>
                `).iterate({
                    yes: false
                })];

            is.equal(li[0], '');
        });

        it('should render conditionally (explicit-1)', function () {
            let li = [...en.compile(`
                    <sentence>
                        <if condition="yes">
                            <then>Y</then>
                        </if>
                    </sentence>
                `).iterate({
                    yes: true
                })];

            is.equal(li[0], 'Y');

            li = [...en.compile(`
                    <sentence>
                        <if condition="yes">
                            <then>Y</then>
                        </if>
                    </sentence>
                `).iterate({
                    yes: false
                })];

            is.equal(li[0], '');
        });

        it('should render conditionally (explicit-2)', function () {
            let li = [...en.compile(`
                    <sentence>
                        <if condition="yes">
                            <else>Y</else>
                        </if>
                    </sentence>
                `).iterate({
                    yes: true
                })];

            is.equal(li[0], '');

            li = [...en.compile(`
                    <sentence>
                        <if condition="yes">
                            <else>Y</else>
                        </if>
                    </sentence>
                `).iterate({
                    yes: false
                })];

            is.equal(li[0], 'Y');
        });

        it('should render conditionally (explicit-3)', function () {
            let li = [...en.compile(`
                    <sentence>
                        <if condition="yes">
                            <then>Y</then>
                            <else>N</else>
                        </if>
                    </sentence>
                `).iterate({
                    yes: true
                })];

            is.equal(li[0], 'Y');

            li = [...en.compile(`
                    <sentence>
                        <if condition="yes">
                            <then>Y</then>
                            <else>N</else>
                        </if>
                    </sentence>
                `).iterate({
                    yes: false
                })];

            is.equal(li[0], 'N');
        });

        it('should render conditionally with complex condition (or)', function () {
            let li = [...en.compile(`
                    <sentence>
                        <if condition="a | b">Y</if>
                    </sentence>
                `).iterate({
                    b: true,
                    a: false
                })];

            is.equal(li[0], 'Y');

            li = [...en.compile(`
                    <sentence>
                        <if condition="a | b">Y</if>
                    </sentence>
                `).iterate({
                    b: false,
                    a: false
                })];

            is.equal(li[0], '');

            li = [...en.compile(`
                    <sentence>
                        <if condition="a|b">Y</if>
                    </sentence>
                `).iterate({
                    b: false,
                    a: false
                })];

            is.equal(li[0], '');
        });

        it('should render conditionally with complex condition (and)', function () {
            let li = [...en.compile(`
                    <sentence>
                        <if condition="a & b">Y</if>
                    </sentence>
                `).iterate({
                    b: true,
                    a: true
                })];

            is.equal(li[0], 'Y');

            li = [...en.compile(`
                    <sentence>
                        <if condition="a & b">Y</if>
                    </sentence>
                `).iterate({
                    b: false,
                    a: false
                })];

            is.equal(li[0], '');

            li = [...en.compile(`
                    <sentence>
                        <if condition="a&b">Y</if>
                    </sentence>
                `).iterate({
                    b: true,
                    a: false
                })];

            is.equal(li[0], '');
        });

        it('should render conditionally with complex condition (not)', function () {
            let li = [...en.compile(`
                    <sentence>
                        <if condition="!a">Y</if>
                    </sentence>
                `).iterate({
                    a: true
                })];

            is.equal(li[0], '');

            li = [...en.compile(`
                    <sentence>
                        <if condition="!a">Y</if>
                    </sentence>
                `).iterate({
                    a: false
                })];

            is.equal(li[0], 'Y');
        });

        it('should render conditionally with complex condition (brackets)', function () {
            let li = [...en.compile(`
                    <sentence>
                        <if condition="(a &!b) |(!a & b)">Y</if>
                    </sentence>
                `).iterate({
                    a: true,
                    b: false
                })];

            is.equal(li[0], 'Y');

            li = [...en.compile(`
                    <sentence>
                        <if condition="(a&!b)|(!a & b)">Y</if>
                    </sentence>
                `).iterate({
                    a: false,
                    b: true
                })];

            is.equal(li[0], 'Y');

            li = [...en.compile(`
                    <sentence>
                        <if condition="(a & !b) | (!a & b)">Y</if>
                    </sentence>
                `).iterate({
                    a: false,
                    b: false,
                })];

            is.equal(li[0], '');

            li = [...en.compile(`
                    <sentence>
                        <if condition="(a & !b) | (!a & b)">Y</if>
                    </sentence>
                `).iterate({
                    a: true,
                    b: true,
                })];

            is.equal(li[0], '');
        });

        it('should render based on local element (id)', function () {
            let li = [...en.compile(`
                    <sentence>
                        <text id="a">A</text>
                        <if condition="#a">Y</if>
                    </sentence>
                `).iterate()];

            is.equal(li[0], 'A Y');

            li = [...en.compile(`
                    <sentence>
                        <text id="a">A</text>
                        <if condition="!#a">Y</if>
                    </sentence>
                `).iterate()];

            is.equal(li[0], 'A');
        });

        it('should render based on local element (class)', function () {
            let li = [...en.compile(`
                    <sentence>
                        <text class="a">A</text>
                        <if condition=".a">Y</if>
                    </sentence>
                `).iterate()];

            is.equal(li[0], 'A Y');

            li = [...en.compile(`
                    <sentence>
                        <text class="a">A</text>
                        <if condition="!.a">Y</if>
                    </sentence>
                `).iterate()];

            is.equal(li[0], 'A');
        });

        it('should render based on elemental interaction with itself (implicit)', function () {
            let li = [...en.compile(`
                    <sentence>
                        <if condition="yes" id="a">A</if>
                        <if condition="#a">B</if>
                    </sentence>
                `).iterate({
                    yes: true
                })];

            is.equal(li[0], 'A B');

            li = [...en.compile(`
                    <sentence>
                        <if condition="yes" id="a">A</if>
                        <if condition="!#a">B</if>
                    </sentence>
                `).iterate({
                    yes: false
                })];

            is.equal(li[0], 'B');
        });

        it('should render based on elemental interaction with itself (explicit)', function () {
            let li = [...en.compile(`
                    <sentence>
                        <if condition="yes" id="a">
                            <then>A</then>
                            <else>C</else>
                        </if>
                        <if condition="#a">B</if>
                    </sentence>
                `).iterate({
                    yes: true
                })];

            is.equal(li[0], 'A B');

            li = [...en.compile(`
                    <sentence>
                        <if condition="yes" id="a">
                            <then>A</then>
                            <else>C</else>
                        </if>
                        <if condition="#a">B</if>
                    </sentence>
                `).iterate({
                    yes: false
                })];

            is.equal(li[0], 'C B');
        });
    });
});