import React from 'react';
import PropTypes from 'prop-types';

import {Chip} from '@material-ui/core';

class ArticleKeywords extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
        let {keywords} = this.props
        let keywords_arr = keywords != null ? keywords.replace(', ',',').split(',') : []
        const st = {

        }
		return keywords_arr.map((kw, i) => {
			return <Chip key={i} style={st} label={ keywords } />
		})
	}
}

ArticleKeywords.propTypes = {
    keywords: PropTypes.string,
}

ArticleKeywords.defaultProps = {
	keywords: ''
}

export default ArticleKeywords
