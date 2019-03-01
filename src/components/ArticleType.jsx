import React from 'react';

import Button from '@material-ui/core/Button';
import {find} from 'lodash'
import C from '../constants/constants';

const STYLE = {
	opacity: 0.4
}

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
			opacity: 0.4,
			backgroundColor: color,
			color: '#FFFFFF'
		}
		return <Button variant="outlined" style={st} disabled>{ label }</Button>
	}
}

ArticleType.defaultProps = {
	type: 'original'
};

export default ArticleType;