import "babel-core/register";
import "babel-polyfill";

import React from 'react';
import { render } from 'react-dom';
import PhraseEngine from '../node_modules/phrase-engine/src/browser.ts';
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

const try_window = document.getElementsByClassName('try-window')[0];

class App extends React.Component {
    getInitialState() {
        return {
            editor: 'lang',
            lang_code: localStorage.getItem('lang_code') || `<sentence>\n\tWrite your phrase script here.\n</sentence>`,
            data_code: "{ }",
            error_shown: false,
            error_message: '',
            data: {}
        };
    }

    nav(editor) {
        this.setState({ editor });
    }

    compile() {
        try {
            const engine = PhraseEngine.compile(this.state.lang_code);
            const variables = engine.vars();
        } catch(e) {
            this.setState({
                error_shown: true,
                error_message: e.message
            });

            setTimeout(() => {
                this.setState({
                    error_shown: false
                });
            }, 8000);
        }
    }

    parsed = setTimeout(() => {}, 2);

    newData(c) {
        this.setState({ data_code: c });

        clearTimeout(this.parsed);
        this.parsed = setTimeout(() => {
            try {
                let data = JSON.parse(c);

                this.setState({
                    data
                });
            } catch (e) {

            }
        }, 1000);
    }

    newLang(c) {
        this.setState({ lang_code: c })
        localStorage.setItem('lang_code', this.state.lang_code);
    }

    render() {
        return <div className="app">
            <aside className="controls">
                <a
                className={`compile-link control-link action-link ${this.state.editor === 'data' ? 'active-link' : ''}`}
                onClick={() => { this.compile() }}
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
                        onUpdate={(c) => { this.newLang(c) }}
                        focus={true}
                    />
                </div>
                <div className={this.state.editor === 'data' ? 'editor-container' : 'editor-container hidden'}>
                    <Ace
                        language='json'
                        code={this.state.data_code}
                        onUpdate={(c) => { this.newData(c) }}
                    />
                </div>
            </section>
            <aside className={`error ${this.state.error_shown ? 'shown' : ''}`}>
                <div class="error-title">Error</div>
                { this.state.error_message }
            </aside>
            <section className="display">
            </section>
        </div>
    }
}

render(<App />, try_window);
