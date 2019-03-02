import React from 'react';

import {Typography, Button} from '@material-ui/core';
import {find} from 'lodash'
import C from '../constants/constants';

class ArticleType extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		let {type} = this.props
		let at = find(C.ARTICLE_TYPES, {id: type.toUpperCase()})
		let label = at != null ? at.label : "Unknown"
		let color = at != null ? at.color : "#000000"
		const st = {
			color: color,
			border: `1px solid ${color}`
		}
		return <span className="ArticleType" style={st}><Typography color="inherit">{ label }</Typography></span>
	}
}

ArticleType.defaultProps = {
	type: 'original'
};

export default ArticleType;