import React from 'react';
import PropTypes from 'prop-types';

import {Typography} from '@material-ui/core';

const SPLIT_CHAR = ','

class ArticleKeywords extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
        let {keywords} = this.props
        let keywords_arr = keywords != null ? keywords.replace(SPLIT_CHAR + ' ',SPLIT_CHAR).split(SPLIT_CHAR) : []
        const st = {

        }
		return (
			<Typography>
			{ keywords_arr.map((kw, i) => {
				return <span className="ArticleKeyword" key={i} style={st}>{ kw }</span>
			}) }
			</Typography>
		)
	}
}

ArticleKeywords.propTypes = {
    keywords: PropTypes.string,
}

ArticleKeywords.defaultProps = {
	keywords: ''
}

export default ArticleKeywords
