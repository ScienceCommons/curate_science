import React from 'react';
import PropTypes from 'prop-types';

import {Typography} from '@material-ui/core';

class ArticleKeywords extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
        let {keywords} = this.props
		return <Typography>{ keywords }</Typography>
	}
}

ArticleKeywords.propTypes = {
    keywords: PropTypes.string,
}

ArticleKeywords.defaultProps = {
	keywords: ''
}

export default ArticleKeywords
