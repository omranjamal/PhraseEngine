import { DOMParser } from 'xmldom';
import * as fs from 'fs';
import { SentenceNode } from './Nodes/SentenceNode';

const doc = (new DOMParser).parseFromString(
    fs.readFileSync('./src/example.xml').toString('utf8')
);

const root = doc.documentElement;
const sentence = new SentenceNode(root, {
    ignore_spaces: [false],
    next_stack: [],
    id_map: {}
});

let x = {
    data: {
        person: true,
        subject_plural: false,
        start: true,
        subject: 'Julia',
        pet: 'canine',
        gender: 'F'
    },
    sentence_components: <Array<string>>[],
    id_render_map: {},
    class_render_map: {}
};


for (let s of sentence.gen(x)) {
    console.log(s.sentence_components.join('').replace(/\s+/ig, ' ').trim());
}

// console.log(JSON.stringify(sentence, null, 4));