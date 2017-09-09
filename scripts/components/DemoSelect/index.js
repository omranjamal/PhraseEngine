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
            {Object.keys(DemoData).sort((a, b) => {
                return parseInt(a.split('-')[0]) - parseInt(b.split('-')[0]);
            }).map(key => {
                return <option value={key}>{key}</option>
            })}
        </select>;
    }
}