import "babel-core/register";
import "babel-polyfill";

import React from 'react';
import { render } from 'react-dom';
import PhraseEngine from 'phrase-engine/src/browser.ts';
import Ace from './components/Ace';

const str = `
    <sentence>
        I <maybe>really</maybe>
        <either>
            <this>like</this>
            <or>love</or>
        </either>
        <either>
            <this>trains</this>
            <or>planes</or>
            <or>ships</or>
        </either>
    </sentence>
`;

// const engine = PhraseEngine.compile();

// for (let sen of engine.iterate({})) {
//     console.log(sen);
// }

const try_window = document.getElementsByClassName('try-window')[0];

class App extends React.Component {
    getInitialState() {
        return {
            editor: 'lang',
            lang_code: "<sentence>\n\tWrite your language file here\n<sentence>",
            data_code: "{\n}"
        };
    }

    nav(editor) {
        this.setState({ editor });
    }

    render() {
        return <div className="app">
            <nav>

            </nav>
            <aside className="controls">
                <a
                className={`compile-link control-link action-link ${this.state.editor === 'data' ? 'active-link' : ''}`}
                onClick={() => { this.nav('data') }}
                title="Data">
                    <i className="fa fa-play fa-lg"></i>
                </a>
                <a
                className={`lang-link control-link editor-link ${this.state.editor === 'lang' ?'active-link':''}`}
                onClick={() => { this.nav('lang') }}
                title="Language Definition">
                    <i className="fa fa-code fa-lg"></i>
                </a>
                <a
                className={`data-link control-link editor-link ${this.state.editor === 'data' ?'active-link':''}`}
                onClick={() => { this.nav('data') }}
                title="Data">
                    <i className="fa fa-database fa-lg"></i>
                </a>
            </aside>
            <section className="editors">
                <div className={this.state.editor === 'lang' ? 'editor-container' : 'editor-container hidden'}>
                    <Ace
                        language='xml'
                        code={this.state.lang_code}
                        onUpdate={(c) => { this.setState({ lang_code: c }) }}
                    />
                </div>
                <div className={this.state.editor === 'data' ? 'editor-container' : 'editor-container hidden'}>
                    <Ace
                        language='json'
                        code={this.state.data_code}
                        onUpdate={(c) => { this.setState({ data_code: c }) }}
                    />
                </div>
            </section>
        </div>
    }
}

render(<App />, try_window);
