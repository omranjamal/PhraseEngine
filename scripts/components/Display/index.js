import React from 'react';

const __count = 40;

export default class Display extends React.Component {
    getInitialState() {
        return {
            length: this.props.length,
            iter: this.props.iter,
            showMore: false,
            li: []
        };
    }

    __should = false;
    shouldComponentUpdate() {
        if (this.__should) {
            this.__should = false;
            return true;
        }

        return false;
    }

    componentWillReceiveProps(next) {
        if (next.iter !== this.state.iter) {
            this.__should = true;

            this.setState({
                length: next.length,
                iter: next.iter,
                showMore: true,
                li: this.getMore(next.iter)
            });
        }
    }

    getMore(iter = this.state.iter) {
        let new_list = [];
        for (let i = 0; i < __count; i++) {
            let val;

            try {
                val = iter.next().value;
            } catch (e) {
                return [];
            }

            if (val === undefined) {
                break;
            }

            new_list.push(val);
        }

        return new_list;
    }

    more() {
        this.__should = true;

        this.setState({
            li: this.state.li.concat(this.getMore())
        });
    }

    render() {
        return <section className="display">
            {this.state.li.map((sen, i) => {
                return <div className="sentence">
                    <span class="num">{i+1}</span>
                    <span class="sen">{sen}</span>
                </div>
            })}
            {
                this.state.li.length < this.state.length
                    ? <a className="show-more-button" onClick={() => { this.more() }}>Show More</a>
                    : null
            }
        </section>
    }
}