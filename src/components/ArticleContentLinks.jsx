import React from 'react';

import {Button, Icon, Typography} from '@material-ui/core';

const LINK_TYPES = ['pdf', 'html', 'preprint']
const COLORS = {
	'preprint': '#9b59b6',
	'html': '#000000',
	'pdf': '#920007'
}

const SOURCE_ICON_ST = {
	paddingTop: 2,
	marginRight: 4
}

const COUNT_ST = {
	fontSize: 12,
	color: '#BCBCBC',
	display: 'inline',
	marginRight: 7
}
const COUNT_ICON_ST = {
	fontSize: '13px'
}

const ICONS = [
	{
		strings: ["osf", "psyarxiv", "openscienceframework"],
		icon: 'preprint_osf.png'
	},
	{
		strings: ["figshare"],
		icon: "preprint_figshare.svg"
	},
	{
		strings: ["ssrn"],
		icon: "preprint_ssrn.png"
	}
]

class ArticleContentLinks extends React.Component {
	constructor(props) {
        super(props);

        this.render_link = this.render_link.bind(this)
    }

    get_icon(url, color) {
    	let icon
    	ICONS.forEach((icon_spec) => {
    		let match = false
    		icon_spec.strings.forEach((str) => {
    			if (url.indexOf(str) > -1) {
    				icon = icon_spec.icon
    			}
    		})
    	})
    	if (icon == null) return null
    	else return <img src={`/sitestatic/icons/${icon}`} width="12" style={SOURCE_ICON_ST} />
    }

	render_link(lt) {
		let color = COLORS[lt] || '#444444'
		let label = lt.toUpperCase()
		const st = {
			marginLeft: 5,
			color: color,
			border: `1px solid ${color}`,
			display: 'inline'
		}
		let url = this.props[`${lt}_url`]
		let views = this.props[`${lt}_views`]
		let cites = this.props[`${lt}_citations`]
		let dls = this.props[`${lt}_downloads`]
		if (url == null || url.length == 0) return null
		let icon
		if (lt == 'preprint') icon = this.get_icon(url, color)
		return (
			<div key={lt}>
				<Typography className="ContentLink" style={{marginBottom: 4}}>
					<span className="ContentLinkCounts">
						{ views > 0 ? <span key="views" style={COUNT_ST}><Icon fontSize="inherit" style={COUNT_ICON_ST}>remove_red_eye</Icon> {views}</span> : null }
						{ dls > 0 ? <span key="dls" style={COUNT_ST}><Icon fontSize="inherit" style={COUNT_ICON_ST}>cloud_download</Icon> {dls}</span> : null }
						{ cites > 0 ? <span key="cites" style={COUNT_ST}><Icon fontSize="inherit" style={COUNT_ICON_ST}>format_quote</Icon> {cites}</span> : null }
					</span>
					<a href={url} className="ArticleContentLink" key={url} style={st} target="_blank">{icon}{label}</a>
				</Typography>
			</div>
		)
	}

	render() {
		let links = []
		LINK_TYPES.forEach((lt) => {
			let link = this.render_link(lt)
			if (link != null) links.push(link)
		})
		return <div className="ArticleContentLinks">{ links }</div>
	}
}

ArticleContentLinks.defaultProps = {
};

export default ArticleContentLinks;