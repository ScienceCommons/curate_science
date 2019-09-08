import React from 'react';
import PropTypes from 'prop-types';

import {Typography} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import {clone} from 'lodash'
import {truncate} from '../../util/util.jsx'

class TruncatedText extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }
        this.toggle_expand = this.toggle_expand.bind(this)
    }

    toggle_expand(event) {
        event.preventDefault()
        this.setState({expanded: !this.state.expanded})
    }

	render() {
		let {classes, text, fontSize, maxLength} = this.props
        let {expanded} = this.state
        if (text == null || text.length == 0) text = "--"
        let long = text.length > maxLength
        if (!expanded && long) text = truncate(text, maxLength)
        let st = {fontSize: fontSize}
		return (
			<span style={st}>
				{ text }&nbsp;
                <span hidden={!long}><a href="#" onClick={this.toggle_expand}>{ expanded ? "Less" : "More" }</a></span>
            </span>
        )
	}
}

TruncatedText.propTypes = {
    text: PropTypes.string,
    fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    style: PropTypes.object
}

TruncatedText.defaultProps = {
	text: "",
    fontSize: 11,
    style: {},
    maxLength: 500
}

export default TruncatedText
