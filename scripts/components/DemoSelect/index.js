import React from 'react';

import DemoData from '../../../demos.json';

export default class DemoSelect extends React.Component {
    getInitialState() {
        return {};
    }

    didChange(e) {
        if (this.props.onChange) {
            this.props.onChange(e.target.value);
        }
    }

    render() {
        return <select onChange={(e) => { this.didChange(e) }} value={this.props.val}>
            <option value="custom">Custom</option>
            {Object.keys(DemoData).map(key => {
                return <option value={key}>{key}</option>
            })}
        </select>;
    }
}