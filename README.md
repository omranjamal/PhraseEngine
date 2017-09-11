# Phrase Engine

UIs that say the same thing over and over again every time are just not fun and writing a few thousand sentences must suck. That leaves us with an AI that enslaves us all or **PhraseEngine**.

Welcome to PhraseEngine's docs.

## Features

- Familiar XML Syntax
- Intuitive Tag Names
- Smart Data Interpolation
- Built in Randomization
- Code Reuseability
- Conditional Statements
    - Basic Operators
    - Selection
    - Compound conditions
    - Ability to act upon Internal State
- Generators (for efficient sentence generation)
- Helper Tags to workaround the limitations of XML
- Chain Optimizer to Purge unused Nodes

## Installation
```BASH
yarn add phrase-engine
```

Or if you're not using yarn (which you should be, it's awesome):
```BASH
npm install phrase-engine --save
```
That's it. You're ready to go. 

## Getting Started
Let's compile a PhraseScript and generate exactly one sentence.

```Javascript
import PhraseEngine from 'phrase-engine';

const engine = PhraseEngine.compile(`
    <sentence>
        I like Trains.
    </sentence>
`);

console.log(engine.random()); // I like Trains.
```

Okay, now let's do two sentences.

```XML
<sentence>
    I <maybe>really</maybe> like Trains.
</sentence>
```

```Javascript
console.log(engine.random());
```
the output will be either one of the following sentences.
```
I like trains.
I really like trains.
```

## Nesting
All tags support nesting so you can mix and match as you please. To give an example
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
then let's get a list of all the sentences with `engine.iterate()`

```JS
const engine = PhraseEngine.compile(xml_string);

// .iterate() returns a generator.
// console.log() on the generator won't be useful.

for (let sentence of engine.iterate()) { 
	console.log(sentence);
}

```
Output:
```
I like Trains.
I really like Trains.
I really do like Trains.
```

`.iterate()` returns a generator in order to be efficient. In order to convert
it into an array you could use ES6 syntax like...

```JS
let array_of_sens = [...engine.iterate()];

// or 
let array_of_sens = Array(engine.iterate());
```


## Tags

### &lt;maybe/&gt;
You've met this tag before.

```XML
<sentence>
    I <maybe>really</maybe> like Trains.
</sentence>
```

output...

```Markdown
I like Trains.
I really like Trains.
```

### &lt;either/&gt;

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
> you can use either one interchangeably. They exist
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

### &lt;text/&gt;
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

###  &lt;spaceless/&gt;
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

###  &lt;ref/&gt;
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
```Markdown
I like Trains. My cousin likes then too.
I like Trains. My cousin loves then too.
I love Trains. My cousin likes then too.
I love Trains. My cousin loves then too.
```
This tag is PhraseEngine's solution to the DRY approach. It enables code reuse.


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

```Markdown
Omran really likes trains. Narmo really likes trains too.
Omran really likes trains. Narmo likes trains too.
Omran likes trains. Narmo really likes trains too.
Omran likes trains. Narmo likes trains too.
```

### &lt;data/&gt;

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


#### with fallbacks
Imagine this scenario: You want to write a language file that says `"Mr [x] likes trains."` you want to refer to them by their last name and only default to the first name if for some reason the last name isn't known.

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
```Markdown
Mr. Jamal really likes trains.
Mr. Jamal likes trains.
```

if only first name is available:
```JS
{
	first_name: "Omran"
}
```

```Markdown
Mr. Omran really likes trains.
Mr. Omran likes trains.
```

### &lt;if/&gt;
It's time to make the tough decisions in life. How to make sure your language files address Sir Lancelot as 'Sir' and not 'Mr'.

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
```Markdown
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
```Markdown
Mr. Omran likes Trains.
Mr. Omran really likes Trains.
```

If statements only support booleans, and no support for comparison operators for now, this may change in the future but we don't see much of a use for
comparison operators at the moment. We don't intend to replace Javascript just supplement it.

If you think we're stupid, we probably are! Send us a pull request! Show us how it's done!

#### Strings?
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
```Markdown
Omran likes Trains.
```


#### What is `false`?

`<if/>` actually fails silently by considering keys that don't exist as
`false`. For example if we don't include `sir` at all...

```JS
{
    name: "Omran"
}
```
```Markdown
Mr. Omran likes Trains.
Mr. Omran really likes Trains.
```

#### Implicit &lt;if/&gt;
Writing a `<then>` or an `<else>` or both, is a tedious task, that is why
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
```Markdown
Sir Lancelot likes Trains.
```

#### Negating &lt;if/&gt;
Okay there are three ways to negate an `<if/>`

##### NOT Operator
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
```Markdown
Mr. Omran likes Trains.
```
How the not operator works and how much you can do with it, will be discussed later in this document.

##### &lt;else/&gt; only
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

##### &lt;unless/&gt; tag
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

#### Compound Conditions
So in the previous section you got familiar with the `NOT` operator `!`.
Let's see a list of what other operators `<if/>` has.

| Name     | Operator  | Example Use                              |
|----------|-----------|------------------------------------------|
| NOT      | !         | condition="!sir"                        |
| AND      | &         | condition="female & !married"            |
| OR       | &#124;    | condition="engineer &#124; scientist"    |
| BRACKETs | ( )       | condition="(a & !b) &#124; (!a & b)"     |

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
```Markdown
Mrs. Jamal likes Trains.
```

#### Internal State Conditions
Wouldn't it be great if we could act upon the state of another part of a sentence?

Consider these two sentences:

`They love trains.`  
`She loves trains.`

You see the `s` in `loves` after `They` but not `She`? That can be achieved completely in PhraseEngine.

##### IDs
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
```Markdown
I love Trains.
He loves Trains.
She loves Trains.
They love Trains.
```
MAGIC.

##### Classes
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
```Markdown
I love Trains.
He loves Trains.
She loves Trains.
They love Trains.
```
MAGIC AGAIN.

> A tag can hace multiple classes. Just like HTML
> it works by space separating the classes like
> `"food fruit tomato"`

### &lt;select/&gt;
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

The select statement does **NOT** fail silently. It will throw an error 
when the key it switches is not foundind data.

### &lt;br/&gt;
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

## Misc
### List Variables
It is sometimes useful to be able to get a list
of all the variables that the language files use.

For that the `.vars()` method is included on a compiled
engine.

```JS
const engine = PhraseEngine.compile(`
    <sentence>
        <data key="name"/>'s
        <select key="pet_type">
            <for value="feline">cat</for>
            <for value="canine">dog</for>
        </select>
        likes Trains.
    </sentence>
`);

console.log(
    engine.vars()
);
```

the output should be something like...

```JS
{
    vars: {
        name: [
            {
                type: "string",
                last: true
            }
        ],
        pet_type: [
            {
                type: "enum",
                values: [
                    "feline",
                    "canine"
                ]
            }
        ]
    }
}
```

Yes, when it encounters a key on a `<select/>` tag,
it grabs all the values in the `<for/>` tags under it
and labels the variable to be a `enum`.

In the case of `<data/>` tags the keys are labeled as `string` types
and the last fallback has the extra `last: true` property to signify
"if this is not defined there's a chance an Exception will be thrown"

To formally define the return type we should show you 
the Typescript interfaces we used.

```Typescript
interface StringVar {
    type: 'string';
    last: boolean;
}

interface EnumVar {
    type: 'enum';
    values: string[];
}

interface BooleanVar {
    type: 'boolean';
}

type VarType = StringVar | EnumVar | BooleanVar;

interface VarsPacket {
    vars: {
        [key: string]: Array<VarType>;
    };
}
```

It happens to be an array because it is entirely possible for a key
to be used for `<data/>`, `<select/>`, and even `<if/>` all in the same
PhraseScript file.


### Count Paths
It is also useful to know the number of paths sometimes.
`.count(data)` helps with that.

```JS
const engine = PhraseEngine.compile(`
    <sentence>
        I <maybe>really</maybe> likes Trains.
    </sentence>
`);

engine.count() // 3
```

<p class="warn"></p>
> Using count is actually a very bad idea because
> it calculates that count by traveling every path in
> the PhraseScript, which happens to be a very expensive
> operation. We highly advice against using it.   
>    
> **Reason**: We're actually trying to solve this issue
> and making this operation more efficient
> but our attempts with caching and a few other methods
> fail thanks to PhraseEngine's ability to act upon
> Internal State. 

You are much better off, counting and maybe caching the output
from the generator.


## Why?
We actually develop and maintain a chat bot called
[Blood Bot](https://bloodbot.org). So, a few months ago
we decided we should vary our dumb bot's responses, but we were
faced with a dillema.

**A:** We were too stupid to build full fledged AIs.  
**B:** We didn't want to write a thousand sentences, 'cause we're also lazy.

So we did what every noob programmer does. Apply tons of Javascript.
It was all fun and sunshines until our language files started to grow.
Every branch of a sentence doubled our Javascript code. Every time we needed
to conditionally render based on internal state, out code almost tripled.
Even with the really nice helper functions and classes we built
for ourselves, it was a nightmare to maintain. Our language files had BUGs.
Go figure.

As our Bot mostly operates in Bangladesh we needed to translate our language files to Bengali. Where do we even begin to talk about translators.
Even the techsavy-est of translators failed to translate our
English language files.

So we thought, "eyy, what would happen if we hooked up an XML parser to
some magical JS code and made a programming-ish language that was easy
and familiar to programmers and translators alike."

Three Months Later: PhraseEngine is Born.

## License
**MIT**. Go crazy.