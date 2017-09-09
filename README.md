# Phrase Engine
UIs that say the same thing over and over again every time are just not fun and writing a few thousand sentences must suck. That leaves us with an AI that enslaves us all or **PhraseEngine**.

Welcome to PhraseEngine's docs.

You can try it online: [Try Online](http://hedronium.github.io/PhraseEngine/try.htm?GHREADME)
Or, read the docs in a nicer way: [Nice Docs]((http://hedronium.github.io/PhraseEngine/?GHREADME)

## Installation
```bash
yarn add phrase-engine
```
Or if you're not using yarn (which you should be, it's awesome):
```bash
npm install phrase-engine --save
```
That's it. You're ready to go. 

## Getting Started
Let's compile a Phase file and generate exactly one sentence.

```Javascript
import PhraseEngine from 'phrase-engine';

const engine = PhraseEngine.compile(`
	<sentence>
    	I like Trains.
    </sentence>
`);

console.log(engine.random()); // I like Trains.
```

## &lt;maybe/&gt;
Okay, now let's do two sentences.

```XML
<sentence>
    I <maybe>really</maybe> like Trains.
</sentence>
```

```Javascript
console.log(engine.random());
```
the output will be either one of the folloing sentences.
```
I like trains.
I really like trains.
```

## Nesting
All tags support nesting so you can mix and macth as you please. To give an example
let's put `<maybe/>` inside another `<maybe/>` for kicks.

```XML
<sentence>
    I
    <maybe>
    	really <maybe>do</maybe>
    </maybe>
    like Trains.
</sentence>
```
This is totally valid. Use this often.

## Generating
then let's get a lsit of all the sentences. with `engine.iterate()`

```JS
const engine = PhraseEngine.compile(xml_string);

// .iterate() returns a generator.
// console.log() on the generator won't be useful.

for (let sentence of engine.iterate()) { 
	console.log(sentence);
}
```
Outpuit:
```
I like Trains.
I really like Trains.
I really do like Trains.
```

`.iterate()` returns a generator in order to be efficient. In order to convert
it into an array you could use ES6 syntax like...

```JS
let array_of_sens = [...engine.iterate()];
```

## &lt;either/&gt;

So we know how to branch off into two paths, one with a few characters
and another without. But what if we wanna select from a few different
choices at random?

```XML
<sentence>
    I
    <maybe>really <maybe>do</maybe></maybe>
    <either>
    	<this>like</this>
        <or>love</or>
    </either>
    Trains.
</sentence>
```

Output:

```
I really do love Trains.
I really do like Trains.
I really love Trains.
I really like Trains.
I love Trains.
I like Trains.
```

> `<this/>` and `<or/>` are actually aliases so
> you can use either one interchangably. They exist
> to provide semantic value.

Nesting is possible here too!

```XML
<sentence>
    I
    <either>
    	<this>like</this>
        <or>
        	<either>
            	<or>love</or>
                <or>
                    have a
                    <either>
                    	<or>love-hate</or>
                        <or>lovely</or>
                        <or>good</or>
                    </either>
                    relationship with
                </or>
            </either>
        </or>
    </either>
    Trains.
</sentence>
```

output:
```
I have a good relationship with Trains.
I have a lovely relationship with Trains.
I have a love-hate relationship with Trains.
I love Trains.
I like Trains.
```

## &lt;text/&gt;
If you think naked text in XML is ugly. We can't blame you.
That is why a completely inert tag called `<text/>`
has been included.

```XML
<sentence>
    <text>I</text>
    <maybe>really <maybe>do</maybe></maybe>
    <either>
    	<this>like</this>
        <or>love</or>
    </either>
    <text>Trains.</text>
</sentence>
```

It has other uses when used with `<ref/>` or `<if/>`
but we'll get to that later in this document.

##  &lt;spaceless/&gt;
Don't you hate it when adding a line break adds a space? `<spaceless/>` solves that.

```XML
<sentence>
    Me. Trians.
    <either>
        <this>
            <text>To</text>
            <text>gether</text>
        </this>
        <or>
            <spaceless>
                <text>To</text>
                <text>gether</text>
            </spaceless>
        </or>
    </either>
    forever.
</sentence>
```

```
Me. Trians. Together forever.
Me. Trians. To gether forever.
```
Tadda!

##  &lt;ref/&gt;
But isn't writing the same tags over and over again a pain? especially
if the blocks are large? Habe no fear, `<ref/>` tags are here.

```XML
<sentence>
    I
    <either id="affection">
        <this>love</this>
        <or>like</or>
    </either>
    Trains. My cousin
    <ref id="affection" />s
    then too.
</sentence>
```
Output:
```
I like Trains. My cousin likes then too.
I like Trains. My cousin loves then too.
I love Trains. My cousin likes then too.
I love Trains. My cousin loves then too.
```
This tag is PhraseEngine's solutin to the DRY approach. It enables code reuse.


All you have to do is put an `id` attribute on a tag you want to reuse. Then create a `<ref/>` tag with the same attribute where you wanna reuse it. 

> It supports every tag except `<or>`, `<this>`, `<then>`, `<else>`

Another example:
```XML
<sentence>
    Omran
    <text id="likes">
        <maybe>really </maybe> likes trains
    </text>.
    Narmo <ref id="likes"/> too.
</sentence>
```

```
Omran really likes trains. Narmo really likes trains too.
Omran really likes trains. Narmo likes trains too.
Omran likes trains. Narmo really likes trains too.
Omran likes trains. Narmo likes trains too.
```

## &lt;data/&gt; interpolation
Let's mix info from the outside world into the sentences!

```XML
<sentence>
    <data key="first_name"/>
    <maybe>really</maybe>
    likes trains.
</sentence>
```

```JS
const engine = PhraseEngine.compile(xml_string);
const sentences = engine.iterate({
	first_name: "Omran"
});

for (let sentence of sentences) { 
	console.log(sentence);
}
```
Yeah just send the data in as a Javascript object into the `.iterate()` method
or `.random()` method.

Output:
```
Omran really likes trains.
Omran likes trains.
```




## &lt;data/&gt; with fallbacks
Imagine thsi scenarios: You want to write a language file that says `"Mr [x] likes trains."` you want to refer to them by their last name and only default to the first name if for some reason the last name isn't known.

```XML
<sentence>
    Mr.
    <data key="last_name|first_name"/>
    <maybe>really</maybe>
    likes trains.
</sentence>
```

if data is:
```JS
{
	first_name: "Omran",
    last_name: "Jamal"
}
```

output will be:
```
Mr. Jamal really likes trains.
Mr. Jamal likes trains.
```

if only first name is available:
```JS
{
	first_name: "Omran"
}
```

```
Mr. Omran really likes trains.
Mr. Omran likes trains.
```

## &lt;if/&gt;
It's time to make the tough descisions in life. How to make sure your language files address Sir Lancelot as 'Sir' and not 'Mr'.

Let's set the flag in our data.
```JS
{
	sir: true,
    name: "Lancelot"
}
```
```XML
<sentence>
    <if condition="sir">
        <then>Sir</then>
        <else>Mr.</else>
    </if>
    <data key="name"/>
    <maybe>really</maybe> likes Trains.
</sentence>
```

output:
```
Sir Lancelot likes Trains.
Sir Lancelot really likes Trains.
```

let's try that with `sir` as `false`
```JS
{
	sir: false,
    name: "Omran"
}
```
```
Mr. Omran likes Trains.
Mr. Omran really likes Trains.
```

### Strings?
Okay, booleans are easily resolved, what about strings?
All strings, even empty ones are truthy.
```JS
{
    name: "Omran"
}
```
```XML
<sentence>
    <if condition="name">
        <then>
            <data key="name"/>
        </then>
        <else>He</else>
    </if>
    likes Trains.
</sentence>
```
```
Omran likes Trains.
```


### What is `false`?

`<if/>` actually fails silently by considering keys that don't exist as
`false`. For example if we don't include `sir` at all...

```JS
{
    name: "Omran"
}
```
```
Mr. Omran likes Trains.
Mr. Omran really likes Trains.
```

## Implicit &lt;if/&gt;
Writing a `<then>` or an `<else>` or both, is a tedius task, that is why
implicit `<if/>`s are a thing.

```JS
{
	sir: true,
	name: "Lacelot"
}
```
```XML
<sentence>
    <if condition="sir">Sir</if>
    <data key="name"/>
    likes Trains.
</sentence>
```
```
Sir Lancelot likes Trains.
```

## Negating &lt;if/&gt;
Okay there are three ways to negate an `<if/>`

### NOT Operator
```JS
{
	sir: false,
	name: "Omran"
}
```
```XML
<sentence>
    <if condition="!sir">Mr.</if>
    <data key="name"/>
    likes Trains.
</sentence>
```
```
Mr. Omran likes Trains.
```
How the not operator works and how much you can do with it, will be dicussed later in this document.

### &lt;else/&gt; only
```JS
{
	sir: false,
	name: "Omran"
}
```
```XML
<sentence>
    <if condition="sir">
    	<else>Mr.</else>
    </if>
    <data key="name"/>
    likes Trains.
</sentence>
```
```
Mr. Omran likes Trains.
```

### &lt;unless/&gt; tag
```JS
{
	sir: false,
	name: "Omran"
}
```
```XML
<sentence>
    <unless condition="sir">Mr.</unless>
    <data key="name"/>
    likes Trains.
</sentence>
```
```
Mr. Omran likes Trains.
```
The `<unless/>` tag is actually an alias (with negative logic) for `<if/>` that means unless supports `<then/>`s and `<else/>`s',

## Compound Conditions
So in the previous section you got familiar with the `NOT` operator `!`.
Let's see a list of what other operators `<if/>` has.


| Name     | Operator  | Example Use                 |
|----------|----|------------------------------------|
| NOT      | `!`  | condition="!sir"`                |
| AND      | `&`  | condition="female & !married"    |
| OR       | &#124;  | condition="engineer &#124; scientist"
| BRACKETs | `(` `)` | condition="(a & !b) &#124; (!a & b)"

Let's see them in action.

```XML
<sentence>
    <text>
        <if condition="female & married">Mrs.</if>
        <if condition="female & !married">Ms.</if>
        <if condition="!female">Mr.</if>
    </text>
    <data key="last_name"/>
    likes Trains.
</sentence>
```
```JS
{
    "female": true,
    "married": true,
	"last_name": "Jamal"
}
```
```
Mrs. Jamal likes Trains.
```

## Internal State Conditions
Wouldn't it be great if we could act upon the state of another part of a sentence?

Consider these two sentences:
`They love trains.`, `She loves trains.` You see the "s" after `They` but not `She`? That can be acheived completely in PhraseEngine aswell.

### IDs
It can act on IDs if a certain Id has been rendered. It evaluated to true. For example if the ID is `tomato` then `#tomato` in `<if/>` condition translates to `true`

```XML
<sentence>
    <either>
        <this id="they">They</this>
        <this id="she">She</this>
        <this id="he">He</this>
        <this id="self">I</this>
    </either>
    <spaceless>
        <text>love</text>
        <unless condition="#they | #self">s</unless>
    </spaceless>
    Trains.
</sentence>
```
```
I love Trains.
He loves Trains.
She loves Trains.
They love Trains.
```
MAGIC.

### Classes
Classes work the same way but the condition variable has to be prefixed with `.` like `.fruit`. For example if the class is `tomato` then `.tomato` in `<if/>` condition translates to `true`

```XML
<sentence>
    <either>
        <this class="singular">They</this>
        <this>She</this>
        <this>He</this>
        <this class="singular">I</this>
    </either>
    <spaceless>
        <text>love</text>
        <unless condition=".singular">s</unless>
    </spaceless>
    Trains.
</sentence>
```
```
I love Trains.
He loves Trains.
She loves Trains.
They love Trains.
```
MAGIC AGAIN.

## &lt;select/&gt;
Okay writing a large block of if conditions suck. How about something like a `switch/case` statement?

```XML
<sentence>
    My
    <select key="pet_type">
        <for value="canine">dog</for>
        <for value="feline">cat</for>
        <default>pet</default>
    </select>
    <maybe>really</maybe>
    likes Trains.
</sentence>
```
```JS
{
	pet_type: "feline"
}
```
```
My cat really likes Trains.
My cat likes Trains.
```

default example:

```JS
{
	pet_type: "bovine"
}
```
```
My pet really likes Trains.
My pet likes Trains.
```

## &lt;br/&gt;
Every needs line breaks.

```XML
<sentence>
    My Trains <br> Hurt.
</sentence>
```
output:
```
My Trains
Hurt
```