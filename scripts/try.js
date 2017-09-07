import "babel-core/register";
import "babel-polyfill";

import React from 'react';
import { render } from 'react-dom';
import { App } from './App';

const try_window = document.getElementsByClassName('try-window')[0];

render(<App />, try_window);