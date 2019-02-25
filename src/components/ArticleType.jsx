import React from 'react';

import Button from '@material-ui/core/Button';
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
		return <Button variant="outlined" disabled>{ label }</Button>
	}
}

ArticleType.defaultProps = {
	type: 'original'
};

export default ArticleType;