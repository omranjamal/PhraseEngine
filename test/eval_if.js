const is = require('chai').assert;
const en = require('../dist/').default;

describe('EVAL: if', function () {
    describe('.iterate()', function () {

        it('should treat unknown variable as false', function () {
            let engine = en.compile(`
                    <sentence>
                        <if condition="yes">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
            });
                
            let li = [...engine.iterate({
                })];

            is.equal(li[0], '');
        });

        it('should treat unknown element as false', function () {
            let engine = en.compile(`
                    <sentence>
                        <text id="x">HUE</text>
                        <if condition="#y">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
            });

            let li = [...engine.iterate({
                })];

            is.equal(li[0], 'HUE');

            engine = en.compile(`
                    <sentence>
                        <text id="x">HUE</text>
                        <if condition="!#y">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
            });

            li = [...engine.iterate({
                })];

            is.equal(li[0], 'HUE Y');
        });

        it('should render conditionally (implicit)', function () {
            let engine = en.compile(`
                    <sentence>
                        <if condition="yes">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                yes: true
            });

            let li = [...engine.iterate({
                    yes: true
                })];

            is.equal(li[0], 'Y');

            engine = en.compile(`
                    <sentence>
                        <if condition="yes">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                yes: false
            });

            li = [...engine.iterate({
                    yes: false
                })];

            is.equal(li[0], '');
        });

        it('should render conditionally (explicit-1)', function () {
            let engine = en.compile(`
                    <sentence>
                        <if condition="yes">
                            <then>Y</then>
                        </if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                yes: true
            });

            let li = [...engine.iterate({
                    yes: true
                })];

            is.equal(li[0], 'Y');

            engine = en.compile(`
                    <sentence>
                        <if condition="yes">
                            <then>Y</then>
                        </if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                yes: false
            });

            li = [...engine.iterate({
                    yes: false
                })];

            is.equal(li[0], '');
        });

        it('should render conditionally (explicit-2)', function () {
            let engine = en.compile(`
                    <sentence>
                        <if condition="yes">
                            <else>Y</else>
                        </if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                yes: true
            });

            let li = [...engine.iterate({
                    yes: true
                })];

            is.equal(li[0], '');

            engine = en.compile(`
                    <sentence>
                        <if condition="yes">
                            <else>Y</else>
                        </if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                yes: false
            });

            li = [...engine.iterate({
                    yes: false
                })];

            is.equal(li[0], 'Y');
        });

        it('should render conditionally (explicit-3)', function () {
            let engine = en.compile(`
                    <sentence>
                        <if condition="yes">
                            <then>Y</then>
                            <else>N</else>
                        </if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                yes: true
            });

            let li = [...engine.iterate({
                    yes: true
                })];

            is.equal(li[0], 'Y');

            engine = en.compile(`
                    <sentence>
                        <if condition="yes">
                            <then>Y</then>
                            <else>N</else>
                        </if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                yes: false
            });

            li = [...engine.iterate({
                    yes: false
                })];

            is.equal(li[0], 'N');
        });

        it('should render conditionally with complex condition (or)', function () {
            let engine = en.compile(`
                    <sentence>
                        <if condition="a | b">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                b: true,
                a: false
            });
            
            let li = [...engine.iterate({
                    b: true,
                    a: false
                })];

            is.equal(li[0], 'Y');

            engine = en.compile(`
                    <sentence>
                        <if condition="a | b">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                b: false,
                a: false
            });

            li = [...engine.iterate({
                    b: false,
                    a: false
                })];

            is.equal(li[0], '');

            engine = en.compile(`
                    <sentence>
                        <if condition="a|b">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                b: false,
                a: false
            });

            li = [...engine.iterate({
                    b: false,
                    a: false
                })];

            is.equal(li[0], '');
        });

        it('should render conditionally with complex condition (and)', function () {
            let engine = en.compile(`
                    <sentence>
                        <if condition="a & b">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                b: true,
                a: true
            });
            
            let li = [...engine.iterate({
                    b: true,
                    a: true
                })];

            is.equal(li[0], 'Y');

            engine = en.compile(`
                    <sentence>
                        <if condition="a & b">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                b: false,
                a: false
            });

            li = [...engine.iterate({
                    b: false,
                    a: false
                })];

            is.equal(li[0], '');

            engine = en.compile(`
                    <sentence>
                        <if condition="a&b">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                b: true,
                a: false
            });

            li = [...engine.iterate({
                    b: true,
                    a: false
                })];

            is.equal(li[0], '');
        });

        it('should render conditionally with complex condition (not)', function () {
            let engine = en.compile(`
                    <sentence>
                        <if condition="!a">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                a: true
            });
            
            let li = [...engine.iterate({
                    a: true
                })];

            is.equal(li[0], '');

            engine = en.compile(`
                    <sentence>
                        <if condition="!a">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                a: false
            });

            li = [...engine.iterate({
                    a: false
                })];

            is.equal(li[0], 'Y');
        });

        it('should render conditionally with complex condition (brackets)', function () {
            let engine = en.compile(`
                    <sentence>
                        <if condition="(a &!b) |(!a & b)">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                a: true,
                b: false,
            });
            
            let li = [...engine.iterate({
                    a: true,
                    b: false
                })];

            is.equal(li[0], 'Y');

            engine = en.compile(`
                    <sentence>
                        <if condition="(a&!b)|(!a & b)">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                a: false,
                b: true,
            });

            li = [...engine.iterate({
                    a: false,
                    b: true
                })];

            is.equal(li[0], 'Y');

            engine = en.compile(`
                    <sentence>
                        <if condition="(a & !b) | (!a & b)">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                a: false,
                b: false,
            });

            li = [...engine.iterate({
                    a: false,
                    b: false,
                })];

            is.equal(li[0], '');

            engine = en.compile(`
                    <sentence>
                        <if condition="(a & !b) | (!a & b)">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                a: true,
                b: true,
            });

            li = [...engine.iterate({
                    a: true,
                    b: true,
                })];

            is.equal(li[0], '');
        });

        it('should render based on local element (id)', function () {

            let engine = en.compile(`
                    <sentence>
                        <text id="a">A</text>
                        <if condition="#a">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count();

            let li = [...engine.iterate()];

            is.equal(li[0], 'A Y');

            engine = en.compile(`
                    <sentence>
                        <text id="a">A</text>
                        <if condition="!#a">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count();

            li = [...engine.iterate()];

            is.equal(li[0], 'A');
        });

        it('should render based on local element (class)', function () {
            let engine = en.compile(`
                    <sentence>
                        <text class="a">A</text>
                        <if condition=".a">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count();

            let li = [...engine.iterate()];

            is.equal(li[0], 'A Y');

            engine = en.compile(`
                    <sentence>
                        <text class="a">A</text>
                        <if condition="!.a">Y</if>
                    </sentence>
                `);
            engine.vars();
            engine.count();

            li = [...engine.iterate()];

            is.equal(li[0], 'A');
        });

        it('should render based on elemental interaction with itself (implicit)', function () {
            let engine = en.compile(`
                    <sentence>
                        <if condition="yes" id="a">A</if>
                        <if condition="#a">B</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                yes: true
            });

            let li = [...engine.iterate({
                    yes: true
                })];

            is.equal(li[0], 'A B');

            engine = en.compile(`
                    <sentence>
                        <if condition="yes" id="a">A</if>
                        <if condition="!#a">B</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                yes: false
            });

            li = [...engine.iterate({
                    yes: false
                })];

            is.equal(li[0], 'B');
        });

        it('should render based on elemental interaction with itself (explicit)', function () {
            let engine = en.compile(`
                    <sentence>
                        <if condition="yes" id="a">
                            <then>A</then>
                            <else>C</else>
                        </if>
                        <if condition="#a">B</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                yes: true
            });
            
            let li = [...engine.iterate({
                    yes: true
                })];

            is.equal(li[0], 'A B');

            engine = en.compile(`
                    <sentence>
                        <if condition="yes" id="a">
                            <then>A</then>
                            <else>C</else>
                        </if>
                        <if condition="#a">B</if>
                    </sentence>
                `);
            engine.vars();
            engine.count({
                yes: false
            });

            li = [...engine.iterate({
                    yes: false
                })];

            is.equal(li[0], 'C B');
        });
    });
});