import React from 'react';

import {Button, Icon, Typography} from '@material-ui/core';

import ViewEmbeddedContentButton from './ViewEmbeddedContentButton.jsx';

import {get_link_source_icon} from '../util/util.jsx'


var numbro = require("numbro");

const LINK_TITLES = {
	'pdf': "View PDF of this article (postprint).",
	'html': "View interactive HTML version of this article (postprint).",
	'preprint': "View preprint of this article."
}

const LINK_LABELS = {
	'pdf': "PDF",
	'preprint': "Preprint",
	'html': "HTML"
}

const COLORS = {
	'preprint': '#9b59b6',
	'html': '#000000',
	'pdf': '#920007'
}

const SOURCE_ICON_ST = {
	marginRight: '0px',
	verticalAlign: 'middle'
}

const COUNT_ST = {
	fontSize: 12,
	color: '#BCBCBC',
	display: 'inline',
	marginRight: 7
}

const icon_size = 20
const COUNT_ICON_ST = {
	fontSize: '13px',
	verticalAlign: -2
}

const CITE_COUNT_ICON_ST = {
	fontSize: '18px',
	verticalAlign: -5,
	marginRight: '-3px'
}

class ArticleFullTextLinks extends React.Component {
	constructor(props) {
        super(props);

        this.render_link = this.render_link.bind(this)
    }

    get_icon(url, color) {
    	let icon = get_link_source_icon(url)
    	if (icon == null) return null
    	else return <img src={icon} width="15" style={SOURCE_ICON_ST} />
    }

	short_number(num) {
		return numbro(num).format({
		    average: true,
		    mantissa: 1,
		    optionalMantissa: true
		}).toUpperCase()
	}

	number(num) {
		return numbro(num).format({
			thousandSeparated: true
		})
	}

	render_link(lt) {
		let { updated } = this.props
		let color = COLORS[lt] || '#444444'
		let label = lt.toLowerCase()
		const st = {
			color: color,
			marginLeft: 5,
			display: 'flex',
			alignItems: 'center',
            fontSize: 16,
            paddingRight: 0,
		}

		const LINK_ICON = {
			color: color,
			fontSize: icon_size,
		}


		let url = this.props[`${lt}_url`]
		let views = this.props[`${lt}_views`]
		let cites = this.props[`${lt}_citations`]
		let dls = this.props[`${lt}_downloads`]
		let update_dt = new Date(updated)
		let update_date = update_dt.toLocaleDateString()
		if (url == null || url.length == 0) return null
		let icon
		if (lt == 'preprint') icon = this.get_icon(url, color)
		let title = LINK_TITLES[lt] || null
		let link_label = LINK_LABELS[lt] || "Article"
		let view_title = `${link_label} has been viewed ${this.number(views)} times (as of ${update_date})`
		let dl_title = `${link_label} has been downloaded ${this.number(dls)} times (as of ${update_date})`
		let cite_title = `${link_label} has been cited ${this.number(cites)} times (as of ${update_date}; Google Scholar)`
		return (
			<div key={lt}>
                <Typography
                    variant="body2"
                    className="ContentLink"
                    style={{
                        marginBottom: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                >
					<span className="ContentLinkCounts">
						{ cites > 0 ? <span key="cites" style={COUNT_ST} title={cite_title}><Icon fontSize="inherit" style={CITE_COUNT_ICON_ST}>format_quote</Icon> {this.short_number(cites)}</span> : null }
						{ dls > 0 ? <span key="dls" style={COUNT_ST} title={dl_title}><Icon fontSize="inherit" style={COUNT_ICON_ST}>cloud_download</Icon> {this.short_number(dls)}</span> : null }
						{ views > 0 ? <span key="views" style={COUNT_ST} title={view_title}><Icon fontSize="inherit" style={COUNT_ICON_ST}>remove_red_eye</Icon> {this.short_number(views)}</span> : null }
					</span>
					<a href={url} className="ArticleContentLink" key={url} style={st} target="_blank" title={title}>{icon}<span className="LinkLabel">{label}</span><Icon style={LINK_ICON}>open_in_new</Icon></a>
                    <ViewEmbeddedContentButton style={st} mediaType={lt} iconStyle={LINK_ICON} url={url}/>
				</Typography>
			</div>
		)
	}

    render() {
        let links = []

        const LINK_TYPES = ['pdf', 'html', 'preprint']
        LINK_TYPES.forEach((lt) => {
            let link = this.render_link(lt)
            if (link != null) links.push(link)
        })

        // Remove the last link if the article has figures to allow room for the figure viewer
        if (this.props.hide_last_link && links.length === 3) {
            links.pop()
        }

        return <div className="ArticleFullTextLinks">{ links }</div>
    }
}

ArticleFullTextLinks.defaultProps = {
	hide_last_link: false,
	updated: '',
};

export default ArticleFullTextLinks;
