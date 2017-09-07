import React from 'react';

export default class Ace extends React.Component {
    getInitialState() {
        return {
            code: this.props.code || '',
            lang: this.props.language || 'json'
        };
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        const langTools = ace.require("ace/ext/language_tools");
        const editor = ace.edit(this.editor_window);
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode(`ace/mode/${this.state.lang}`);
        editor.setValue(this.state.code);

        editor.getSession().on('change', () => {
            this.setState({
                code: editor.getValue()
            });

            this.props.onUpdate(this.state.code);
        });

        editor.setOptions({
            enableBasicAutocompletion: true
        });

        const completer = {
            getCompletions: function (editor, session, pos, prefix, callback) {
                let line = session.getLine(pos.row).substr(0, pos.column);
                let tokens = line
                    .replace(/\s+/ig, ' ')
                    .split(' ');
                
                let tag_writing = tokens[tokens.length - 1][0] === '<';
                let tags = tokens.filter(token => (/^\<[a-z]{2,10}$/g).test(token));
                let tag = (tags[tags.length - 1] || '').substr(1);
                let attr_writing = !tag_writing && !!tag;

                let basics = ['id', 'class'];

                if (tag_writing) {
                    callback(null, ([
                        'sentence',
                        'if',
                        'or',
                        'then',
                        'this',
                        'for',
                        'else',
                        'unless',
                        'either',
                        'select',
                        'maybe',
                        'br',
                        'data',
                        'ref',
                        'spaceless',
                        'text'
                    ]).map(function (ea) {
                        return { value: ea, score: 100, meta: "tag" }
                    }));
                } else if (attr_writing) {
                    callback(null, (({
                        if: basics.concat(['condition']),
                        or: basics,
                        then: basics,
                        this: basics,
                        for: basics.concat(['value']),
                        else: basics,
                        unless: basics.concat(['condition']),
                        either: basics,
                        select: basics.concat(['key']),
                        maybe: basics,
                        data: basics.concat(['key']),
                        ref: ['id'],
                        spaceless: basics,
                        text: basics
                    }[tag]) || []).map(function (ea) {
                        return { value: ea + '="', score: 100, meta: "attr" }
                    }));
                }
            }
        }

        langTools.addCompleter(completer);
        editor.completers = [completer];

        editor.commands.on("afterExec", function (e) {
            if (e.command.name == "insertstring" && /^[\w\\< ]$/.test(e.args)) {
                editor.execCommand("startAutocomplete")
            }
        })

        if (this.props.focus) {
            editor.focus();
        }

        editor.clearSelection();

        this.editor = editor;
    }

    componentWillReceiveProps(next) {
        if (this.state.code !== next.code) {
            this.setState({
                code: next.code
            });

            this.editor.setValue(this.state.code);
            this.editor.clearSelection();
        }
    }

    render() {
        return <div
            ref={(editor) => { this.editor_window || (this.editor_window = editor) }}
            className={`editor ${this.props.className}`}
        >
        </div>
    }
}