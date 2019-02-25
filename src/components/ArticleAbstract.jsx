import React from 'react';
import PropTypes from 'prop-types';

import {Typography} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import {truncate} from '../util/util.jsx'

const MAX_LEN = 400

class ArticleAbstract extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }
        this.toggle_expand = this.toggle_expand.bind(this)
    }

    toggle_expand() {
        this.setState({expanded: !this.state.expanded})
    }

	render() {
		let {classes, text} = this.props
        let {expanded} = this.state
        let long = text.length > MAX_LEN
        if (!expanded) text = truncate(text, 250)
		return (
			<Typography>
				{ text }&nbsp;
                <span hidden={!long}><a href="javascript:void(0)" onClick={this.toggle_expand}>{ expanded ? "Less" : "More" }</a></span>
            </Typography>
        )
	}
}

ArticleAbstract.propTypes = {
    text: PropTypes.string,
}

ArticleAbstract.defaultProps = {
	text: ""
}

export default ArticleAbstract
