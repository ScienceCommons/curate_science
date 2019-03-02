import React from 'react';
import PropTypes from 'prop-types';

import {Typography} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import {truncate} from '../../util/util.jsx'

const MAX_LEN = 400

class TruncatedText extends React.Component {
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
		let {classes, text, fontSize} = this.props
        let {expanded} = this.state
        if (text == null || text.length == 0) text = "--"
        let long = text.length > MAX_LEN
        if (!expanded && long) text = truncate(text, MAX_LEN)
        let st = {fontSize: fontSize}
		return (
			<Typography style={st}>
				{ text }&nbsp;
                <span hidden={!long}><a href="javascript:void(0)" onClick={this.toggle_expand}>{ expanded ? "Less" : "More" }</a></span>
            </Typography>
        )
	}
}

TruncatedText.propTypes = {
    text: PropTypes.string,
    fontSize: PropTypes.number
}

TruncatedText.defaultProps = {
	text: "",
    fontSize: 11
}

export default TruncatedText
