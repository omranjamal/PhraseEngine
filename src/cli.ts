#!/usr/bin/env node

import PhraseEngine from './index';
import * as fs from 'fs';

const [cmd, path, data_path] = process.argv.slice(-3);

if (!(cmd === 'random' || cmd === 'all')) {
    console.log('Unrecognized command.');
    process.exit(0);
}

const lang_data = fs.readFileSync(path).toString('utf8');
const engine = PhraseEngine.compile(lang_data);

const data = JSON.parse(fs.readFileSync(data_path).toString('utf8'));

if (cmd === 'random') {
    console.log(engine.random(data));
} else if (cmd === 'all') {
    for (let sen of engine.iterate(data)) {
        console.log(sen);
    }
}