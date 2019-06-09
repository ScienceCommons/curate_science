import React from 'react';

import PropTypes from 'prop-types';

import C from '../constants/constants';
import {truncate, get_link_source_icon} from '../util/util.jsx'
import {find} from 'lodash'

import MouseOverPopover from '../components/shared/MouseOverPopover.jsx';

import { withStyles } from '@material-ui/core/styles';

import {Icon, Typography, Menu} from '@material-ui/core';

const styles = theme => ({

})

class TransparencyBadge extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };

        this.render_feature = this.render_feature.bind(this)
    }

	render_feature(f, i) {
		let {icon_size, reporting_standards_type, prereg_protocol_type, classes, article_type} = this.props
		let repstd = f.id == 'REPSTD'
		let url, subtitle
		let enabled = false
		if (f.url_prop != null) url = this.props[f.url_prop]
		let reporting_standards = []
		// Collect this feature's transparencies across all studies
		let n = 0
		if (repstd) {
			enabled = reporting_standards_type != null
		} else {
			enabled = url != null && url.length > 0
		}
		let label = ''
		let icon = f.icon
		if (!enabled) {
			label = `${f.label_long} is not (yet) available`
			icon += "_dis"
		}
		let badge_icon = (
			<img
   			   key={`badgeicon-${i}`}
			   src={`/sitestatic/icons/${icon}.svg`}
			   title={label}
			   width={icon_size}
			   height={icon_size}
			   type="image/svg+xml" />
		)
		if (!enabled) {
			// If article type calls for transparencies to be bonuses, dont render disabled badges
			let tbonus = find(C.ARTICLE_TYPES, {id: article_type}).transparencies_bonus
			return tbonus ? null : badge_icon
		} else {
			let popover_content
			if (repstd) {
				let rep_std_type = find(C.REPORTING_STANDARDS_TYPES, {value: reporting_standards_type})
				let rep_std_label = rep_std_type == null ? '?' : rep_std_type.label
				popover_content = <Typography>{ rep_std_label }</Typography>
			} else {
				let no_url = url == null || url.length == 0
				let source_icon
				let source_icon_url = get_link_source_icon(url)
				if (source_icon_url != null) source_icon = <img src={source_icon_url} width="13" style={{marginRight: 4}} />
				if (!no_url) popover_content = <Typography>{ source_icon }<a href={url} target="_blank">{ truncate(url, 15) } <Icon fontSize="inherit">open_in_new</Icon></a></Typography>
				if (f.id === 'PREREG') {
					let ppt = find(C.PREREG_PROTOCOL_TYPES, {value: prereg_protocol_type})
					let display_label = ppt == null ? '' : ppt.label_detail || ppt.label || ''
					if (ppt != null) subtitle = <Typography variant="body2" style={{color: 'gray', fontStyle: 'italic'}}>{ display_label }</Typography>
				}
			}
			return (
				<MouseOverPopover target={badge_icon} key={`mouseover-${i}`}>
					<div style={{padding: 10}}>
						<Typography variant="h5">{ f.label }</Typography>
						{ subtitle }
						{ popover_content }
					</div>
				</MouseOverPopover>
			)
		}
	}

	relevant_badges() {
		let {article_type} = this.props
		return C.TRANSPARENCY_BADGES.filter((tb) => {
			return tb.article_types.includes(article_type)
		})
	}

	render_commentaries() {
		return (
			<ul>
			{ this.props.commentaries.map((comm, i) => {
				return <li key={i}><Typography><a href={comm.commentary_url} target="_blank">{ comm.authors_year }</a></Typography></li>
			}) }
			</ul>
		)
	}

	render() {
		let {commentaries} = this.props
		let commentary_el, commentary_popover
		if (commentaries.length > 0) {
			commentary_el = <span className="ArticleBadgeWithCount ArticleCommentaryBadge">Commentaries <span className="Count">{ commentaries.length }</span></span>
			commentary_popover = (
				<MouseOverPopover target={commentary_el} key='commentary'>
					<div style={{padding: 10}}>
						<Typography variant="h5">Commentaries about this article:</Typography>
						{ this.render_commentaries() }
					</div>
				</MouseOverPopover>
			)
		}
		let badges = []
		this.relevant_badges().forEach((b, i) => {
			let badge_rendered = this.render_feature(b, i)
			if (badge_rendered != null) badges.push(badge_rendered)
		})
		if (badges.length == 0) return null
		else return (
			<div>
				<span style={{marginRight: 10}}>{ badges }</span>
				{ commentary_popover }
			</div>
		)
	}
}

TransparencyBadge.propTypes = {
	transparencies: PropTypes.array,
	article_type: PropTypes.string,
	reporting_standards_type: PropTypes.string,
    original_article_url: PropTypes.string,
    prereg_protocol_url: PropTypes.string,
    prereg_protocol_type: PropTypes.string,
    public_study_materials_url: PropTypes.string,
    public_data_url: PropTypes.string,
    public_code_url: PropTypes.string,
    commentaries: PropTypes.array
}



TransparencyBadge.defaultProps = {
	reporting_standards_type: null,
	article_type: "ORIGINAL",
	icon_size: 30,
    original_article_url: null,
    prereg_protocol_url: null,
    prereg_protocol_type: null,
    public_study_materials_url: null,
    public_data_url: null,
    public_code_url: null,
    commentaries: []
};

export default withStyles(styles)(TransparencyBadge);