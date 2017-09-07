import React from 'react';

export default class Ace extends React.Component {
    getInitialState() {
        return {
            code: this.props.code || '',
            lang: this.props.language || 'json',
            error_line: null
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

        if (this.props.onUpdate) {
            editor.getSession().on('change', (e) => {
                this.setState({
                    code: editor.getValue()
                });

                this.props.onUpdate(this.state.code, e);
            });
        }

        if (this.props.onCursor) {
            const selection = editor.getSelection();

            selection.on('changeCursor', (e) => {
                this.props.onCursor(selection.getCursor());
            });
        }

        editor.setOptions({
            enableBasicAutocompletion: true
        });

        if (this.props.completer) {
            langTools.addCompleter(this.props.completer);
            editor.completers = [this.props.completer];

            editor.commands.on("afterExec", function (e) {
                if (e.command.name == "insertstring" && /^[\w\\< ]$/.test(e.args)) {
                    editor.execCommand("startAutocomplete")
                }
            });
        }

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

        if (next.focus) {
            this.editor.focus();
        }

        this.setState({
            error_line: next.errorAt
        });

        if (next.errorAt) {
            this.editor.getSession().setAnnotations([{
                row: next.errorAt - 1,
                column: 0,
                type: "error",
                text: next.errorMessage
            }]);
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