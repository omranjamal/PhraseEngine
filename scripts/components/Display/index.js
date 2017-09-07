import React from 'react';

const __count = 2;

export default class Display extends React.Component {
    getInitialState() {
        return {
            length: this.props.length,
            iter: this.props.iter,
            cur: 0,
            page: 1,
            li: []
        };
    }

    componentWillReceiveProps(next) {
        if (next.iter !== this.state.iter) {
            this.setState({
                length: next.length,
                iter: next.iter,
                cur: 0,
                page: 1,
                li: []
            });
        }
    }

    getList() {
        if (this.state.iter === null) {
            return [];
        }

        let diff = this.state.page - this.state.cur;
        let new_list = [];

        while (diff--) {
            for (let i = 0; i < __count; i++) {
                let val = this.state.iter.next().value;

                if (val === undefined) {
                    break;
                }

                new_list.push(val);
            }
        }

        this.state.cur += diff;
        this.state.li = this.state.li.concat(new_list);
        return this.state.li;
    }

    more() {
        this.setState({
            page: this.state.page+1
        });
    }

    render() {
        return <section className="display">
            {this.getList().map(sen => {
                return <div className="sentence">{sen}</div>
            })}
            {
                (this.state.page * __count) < this.state.length
                    ? <a className="show-more-button" onClick={() => { this.more() }}>Show More</a>
                    : null
            }
        </section>
    }
}