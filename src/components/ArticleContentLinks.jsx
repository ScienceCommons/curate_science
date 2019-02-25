import React from 'react';

import Button from '@material-ui/core/Button';

const LINK_TYPES = ['pdf', 'html', 'preprint']

class ArticleContentLinks extends React.Component {
	constructor(props) {
        super(props);

        this.render_link = this.render_link.bind(this)
    }

	render_link(lt) {
		const st = {
			marginLeft: 5
		}
		let url = this.props[`${lt}_url`]
		let views = this.props[`${lt}_views`]
		let cites = this.props[`${lt}_citations`]
		let dls = this.props[`${lt}_downloads`]
		if (url == null || url.length == 0) return null
		return (
			<span key={lt}>
				{ views > 0 ? <span key="views">{views}</span> : null }
				{ dls > 0 ? <span key="dls">{dls}</span> : null }
				{ cites > 0 ? <span key="cites">{cites}</span> : null }
				<Button href={url} key={url} style={st} target="_blank" variant="outlined">{lt}</Button>
			</span>
		)
	}

	render() {
		let links = []
		LINK_TYPES.forEach((lt) => {
			let link = this.render_link(lt)
			if (link != null) links.push(link)
		})
		return links
	}
}

ArticleContentLinks.defaultProps = {
};

export default ArticleContentLinks;