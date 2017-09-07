import React from 'react';
import langCompleter from './langCompleter';
import PhraseEngine from 'phrase-engine/src/';
import Ace from './components/Ace';

export class App extends React.Component {
    getInitialState() {
        return {
            editor: 'lang',
            lang_code: localStorage.getItem('lang_code') || `<sentence>\n\tWrite your phrase script here.\n</sentence>`,
            data_code: "{ }",
            error_shown: false,
            error_message: '',
            error_line: null,
            data: {}
        };
    }

    nav(editor) {
        this.setState({ editor });
    }

    __state_timeout = setTimeout(() => { }, 2);

    compile() {
        this.setState({
            error_line: null
        });

        try {
            const engine = PhraseEngine.compile(this.state.lang_code);
            const variables = engine.vars().vars;

            console.log(variables);

            let mutated = false;
            let n_map = {};

            Object.keys(variables).map(x => {
                let var_stack = variables[x];
                let ret = [x];

                if (x in this.state.data) {
                    ret.push(this.state.data[x]);
                } else {
                    mutated = true;

                    if (var_stack.some(c => c.type === 'enum')) {
                        let en = var_stack.find(c => c.type === 'enum');
                        ret.push(en.values[0]);
                    } else if (var_stack.some(c => c.type === 'string' && c.last)) {
                        ret.push('[Fill this in]');
                    } else {
                        ret.push(true);
                    }
                }

                return ret;
            }).forEach(c => {
                n_map[c[0]] = c[1];
            });

            if (mutated) {
                this.setState({
                    data: n_map,
                    data_code: JSON.stringify(n_map, null, "\t")
                });

                this.nav('data');
            }

        } catch (e) {
            let mutation = {
                error_shown: true,
                error_message: e.message
            };

            if ('line' in e && typeof e.line === 'function') {
                mutation.error_line = e.line();
            }

            this.setState(mutation);

            clearTimeout(this.__state_timeout);

            this.__state_timeout = setTimeout(() => {
                this.setState({
                    error_shown: false
                });
            }, 8000);
        }
    }

    parsed = setTimeout(() => { }, 2);

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

    newLang(c, e) {
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
                    className={`lang-link control-link editor-link ${this.state.editor === 'lang' ? 'active-link' : ''}`}
                    onClick={() => { this.nav('lang') }}
                    title="Language Definition">
                    <i className="fa fa-code fa-lg"></i>
                </a>
                <a
                    className={`data-link control-link editor-link ${this.state.editor === 'data' ? 'active-link' : ''}`}
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
                        onUpdate={(c, e) => { this.newLang(c, e) }}
                        focus={this.state.editor === 'lang'}
                        completer={langCompleter}
                        cursor={this.state.lang_cursor}
                        errorAt={this.state.error_line}
                        errorMessage={this.state.error_message}
                    />
                </div>
                <div className={this.state.editor === 'data' ? 'editor-container' : 'editor-container hidden'}>
                    <Ace
                        language='json'
                        code={this.state.data_code}
                        onUpdate={(c) => { this.newData(c) }}
                        focus={this.state.editor === 'data'}
                        cursor={this.state.data_cursor}
                    />
                </div>
            </section>
            <aside className={`error ${this.state.error_shown ? 'shown' : ''}`}>
                <div class="error-title">Error</div>
                {
                    this.state.error_line
                        ? <div class="error-line">Line {this.state.error_line}</div>
                        : null
                }
                {this.state.error_message}
            </aside>
            <section className="display">
            </section>
        </div>
    }
}