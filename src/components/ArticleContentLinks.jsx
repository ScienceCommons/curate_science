import React from 'react';

import {Button, Icon, Typography} from '@material-ui/core';

const LINK_TYPES = ['pdf', 'html', 'preprint']
const COLORS = {
	'preprint': '#9b59b6',
	'html': '#000000'
}

class ArticleContentLinks extends React.Component {
	constructor(props) {
        super(props);

        this.render_link = this.render_link.bind(this)
    }

	render_link(lt) {
		const st = {
			marginLeft: 5,
			backgroundColor: COLORS[lt] || '#444444',
			color: '#FFFFFF'
		}
		const countsSt = {
			fontSize: 10,
			color: 'gray'
		}
		let url = this.props[`${lt}_url`]
		let views = this.props[`${lt}_views`]
		let cites = this.props[`${lt}_citations`]
		let dls = this.props[`${lt}_downloads`]
		if (url == null || url.length == 0) return null
		return (
			<div key={lt}>
				{ views > 0 ? <Typography key="views" style={countsSt}><Icon fontSize="inherit">remove_red_eye</Icon> {views}</Typography> : null }
				{ dls > 0 ? <Typography key="dls" style={countsSt}><Icon fontSize="inherit">cloud_download</Icon> {dls}</Typography> : null }
				{ cites > 0 ? <Typography key="cites" style={countsSt}><Icon fontSize="inherit">format_quote</Icon> {cites}</Typography> : null }
				<Button href={url} key={url} style={st} target="_blank" variant="outlined">{lt}</Button>
			</div>
		)
	}

	render() {
		let links = []
		LINK_TYPES.forEach((lt) => {
			let link = this.render_link(lt)
			if (link != null) links.push(link)
		})
		return <div style={{float: 'right'}}>{ links }</div>
	}
}

ArticleContentLinks.defaultProps = {
};

export default ArticleContentLinks;