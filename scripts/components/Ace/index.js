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

        this.editor = editor;
    }

    componentWillReceiveProps(next) {
        if (this.state.code !== next.code) {
            this.setState({
                code: next.code
            });

            this.editor.setValue(this.state.code);
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