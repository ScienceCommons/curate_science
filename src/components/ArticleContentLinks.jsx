import React from 'react';

import Button from '@material-ui/core/Button';

const LINK_TYPES = ['pdf', 'html', 'preprint']


class ArticleContentLinks extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };

        this.render_link = this.render_link.bind(this)
    }

	render_link(url, link_type) {
		return <Button href={url} key={url} target="_blank" variant="outlined">{link_type}</Button>
	}

	render() {
		let links = []
		LINK_TYPES.forEach((lt) => {
			let url = this.props[lt]
			if (url != null && url.length > 0) links.push(this.render_link(url, lt))
		})
		return links
	}
}

ArticleContentLinks.defaultProps = {
	pdf: null,
	html: null,
	preprint: null
};

export default ArticleContentLinks;