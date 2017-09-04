// import "babel-core/register";
// import "babel-polyfill";

// import React from 'react';
// import { render } from 'react-dom';
import PhraseEngine from 'phrase-engine';

const engine = PhraseEngine.compile('<sentence><maybe>Potato</maybe></sentence>');


const try_window = document.getElementsByClassName('try-window')[0];