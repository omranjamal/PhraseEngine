const is = require('chai').assert;
const en = require('../dist/').default;

describe('Compiler', function () {
    describe('.compile()', function () {
        it('should not accept empty string', function () {
            is.throws(() => {
                en.compile(``);
            });
        });

        it('should accept empty sentence', function () {
            is.doesNotThrow(() => {
                en.compile(`<sentence></sentence>`);
            });
        });

        it('should not accept wrong document element', function () {
            is.throws(() => {
                en.compile(`<potato>Hello</potato>`);
            });
        });

        it('should accept sentence with one text', function () {
            is.doesNotThrow(() => {
                en.compile(`<sentence>hello</sentence>`);
            });
        });

        it('should accept data', function () {
            is.doesNotThrow(() => {
                en.compile(`<sentence><data key="potato"/></sentence>`);
            });
        });

        it('should accept data with multiple fallback keys', function () {
            is.doesNotThrow(() => {
                en.compile(`<sentence><data key="potato|tomato"/></sentence>`);
            });
        });

        it('should not accept data without key', function () {
            is.throws(() => {
                en.compile(`<sentence><data/></sentence>`);
            });
        });

        it('should accept either', function () {
            is.doesNotThrow(() => {
                en.compile(`
                    <sentence>
                        <either>
                            <this>X</this>
                            <or>Y</or>
                        </either>
                    </sentence>
                `);
            });
        });

        it('should not accept either with no routes', function () {
            is.throws(() => {
                en.compile(`
                    <sentence>
                        <either>
                        </either>
                    </sentence>
                `);
            });
        });

        it('should accept either with one route', function () {
            is.doesNotThrow(() => {
                en.compile(`
                    <sentence>
                        <either>
                            <this>woah</this>
                        </either>
                    </sentence>
                `);
            });
        });

        it('should accept either with multiple routes', function () {
            is.doesNotThrow(() => {
                en.compile(`
                    <sentence>
                        <either>
                            <this>woah</this>
                            <this>huehue</this>
                            <or>haha</or>
                        </either>
                    </sentence>
                `);
            });
        });

        it('should accept implicit if', function () {
            is.doesNotThrow(() => {
                en.compile(`
                    <sentence>
                        <if condition="toronto">
                            POTATO
                        </if>
                    </sentence>
                `);
            });
        });

        it('should not accept if with empty condition', function () {
            is.throws(() => {
                en.compile(`
                    <sentence>
                        <if condition="">
                            POTATO
                        </if>
                    </sentence>
                `);
            });
        });

        it('should not accept if with without condition', function () {
            is.throws(() => {
                en.compile(`
                    <sentence>
                        <if>
                            POTATO
                        </if>
                    </sentence>
                `);
            });
        });

        it('should accept explicit if', function () {
            is.doesNotThrow(() => {
                en.compile(`
                    <sentence>
                        <if condition="toronto">
                            <then>POTATO</then>
                        </if>
                    </sentence>
                `);

                en.compile(`
                    <sentence>
                        <if condition="toronto">
                            <then>POTATO</then>
                            <else>TOMATO</else>
                        </if>
                    </sentence>
                `);

                en.compile(`
                    <sentence>
                        <if condition="toronto">
                            <else>TOMATO</else>
                        </if>
                    </sentence>
                `);
            });
        });


        it('should not accept if with multiple thens or elses', function () {
            is.throws(() => {
                en.compile(`
                    <sentence>
                        <if condition="toronto">
                            <then>x</then>
                            <then>y</then>
                        </if>
                    </sentence>
                `);
            });
        });

        it('should not accept if with multiple thens or elses', function () {
            is.throws(() => {
                en.compile(`
                        <sentence>
                            <if condition="toronto">
                                <else>x</else>
                                <else>y</else>
                            </if>
                        </sentence>
                    `);
            });
        });

        it('should not accept if with multiple thens or elses', function () {
            is.throws(() => {
                en.compile(`
                        <sentence>
                            <if condition="toronto">
                                <else>x</else>
                                <then>z</then>
                                <else>y</else>
                            </if>
                        </sentence>
                    `);
            });
        });

        it('should not accept if with multiple thens or elses', function () {
            is.throws(() => {
                en.compile(`
                        <sentence>
                            <if condition="toronto">
                                <then>x</then>
                                <else>z</else>
                                <then>y</then>
                            </if>
                        </sentence>
                    `);
            });
        });

        it('should ignore unkown tags in if', function () {
            is.doesNotThrow(() => {
                en.compile(`
                        <sentence>
                            <if condition="toronto">
                                <then>x</then>
                                <potato>woah</potato>
                            </if>
                        </sentence>
                    `);
            });
        });

        it('should accept empty maybe', function () {
            is.doesNotThrow(() => {
                en.compile(`<sentence><maybe></maybe></sentence>`);
            });
        });

        it('should accept maybe', function () {
            is.doesNotThrow(() => {
                en.compile(`<sentence><maybe>LOL</maybe></sentence>`);
            });
        });

        it('should accept nested maybe', function () {
            is.doesNotThrow(() => {
                en.compile(`<sentence><maybe>LOL <maybe>LMFAO</maybe></maybe></sentence>`);
            });
        });

        it('should accept ref', function () {
            is.doesNotThrow(() => {
                en.compile(`<sentence>
                    <maybe id="potato">POTATO</maybe>
                    <ref id="potato"/>
                </sentence>`);
            });
        });

        it('should not accept ref without id', function () {
            is.throws(() => {
                en.compile(`<sentence>
                    <maybe id="potato">POTATO</maybe>
                    <ref/>
                </sentence>`);
            });
        });

        it('should not accept ref with empty id', function () {
            is.throws(() => {
                en.compile(`<sentence>
                    <maybe id="potato">POTATO</maybe>
                    <ref id=""/>
                </sentence>`);
            });
        });

        it('should not accept ref refferencing unknown tag', function () {
            is.throws(() => {
                en.compile(`<sentence>
                    <maybe id="tomato">POTATO</maybe>
                    <ref id="potato"/>
                </sentence>`);
            });
        });

        it('should accept select', function () {
            is.doesNotThrow(() => {
                en.compile(`<sentence>
                    <select key="tomato">
                        <for value="x">X</for>
                        <for value="y">Y</for>
                    </select>
                </sentence>`);
            });
        });

        it('should not accept select empty key', function () {
            is.throws(() => {
                en.compile(`<sentence>
                    <select key="">
                        <for value="x">X</for>
                        <for value="y">Y</for>
                    </select>
                </sentence>`);
            });
        });

        it('should not accept select without key', function () {
            is.throws(() => {
                en.compile(`<sentence>
                    <select>
                        <for value="x">X</for>
                        <for value="y">Y</for>
                    </select>
                </sentence>`);
            });
        });

        it('should not accept select duplicate fors', function () {
            is.throws(() => {
                en.compile(`<sentence>
                    <select key="tomato">
                        <for value="x">X</for>
                        <for value="x">Y</for>
                    </select>
                </sentence>`);
            });
        });

        it('should not accept select without fors', function () {
            is.throws(() => {
                en.compile(`<sentence>
                    <select key="tomato">
                    </select>
                </sentence>`);
            });
        });

        it('should not accept unknown tags inside select', function () {
            is.doesNotThrow(() => {
                en.compile(`<sentence>
                    <select key="tomato">
                        <for value="s">S</for>
                    </select>
                </sentence>`);
            });
        });

        it('should not accept only default in select', function () {
            is.throws(() => {
                en.compile(`<sentence>
                    <select key="tomato">
                        <default>Potato</default>
                    </select>
                </sentence>`);
            });
        });

        it('should accept default in select', function () {
            is.doesNotThrow(() => {
                en.compile(`<sentence>
                    <select key="tomato">
                        <for value="h">HueHue</for>
                        <default>Potato</default>
                    </select>
                </sentence>`);
            });
        });

        it('should accept for with empty value in select', function () {
            is.doesNotThrow(() => {
                en.compile(`<sentence>
                    <select key="tomato">
                        <for value="">HueHue</for>
                        <default>Potato</default>
                    </select>
                </sentence>`);
            });
        });

        it('should not accept for without value in select', function () {
            is.throws(() => {
                en.compile(`<sentence>
                    <select key="tomato">
                        <for>HueHue</for>
                        <default>Potato</default>
                    </select>
                </sentence>`);
            });
        });

        it('should accept empty text', function () {
            is.doesNotThrow(() => {
                en.compile(`<sentence><text></text></sentence>`);
            });
        });

        it('should accept text', function () {
            is.doesNotThrow(() => {
                en.compile(`<sentence><text>Hello</text></sentence>`);
            });
        });
    });
});