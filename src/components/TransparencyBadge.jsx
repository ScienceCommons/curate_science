import React from 'react';

import PropTypes from 'prop-types';

import C from '../constants/constants';
import {truncate, get_link_source_icon} from '../util/util.jsx'
import {find} from 'lodash'

import MouseOverPopover from '../components/shared/MouseOverPopover.jsx';

import { withStyles } from '@material-ui/core/styles';

import {Icon, Typography, Popover, Menu} from '@material-ui/core';

const styles = theme => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing.unit,
  },
})

class TransparencyBadge extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };

        this.render_feature = this.render_feature.bind(this)
    }

	render_feature(f, i) {
		let {icon_size, reporting_standards_type, classes, article_type} = this.props
		let repstd = f.id == 'REPSTD'
		let url
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
			label = `${f.label} not available`
			icon += "_dis"
		}
		let badge_icon = (
			<img
   			   key={i}
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
				let rep_std_label = find(C.REPORTING_STANDARDS_TYPES, {value: reporting_standards_type}).label
				popover_content = <Typography>{ rep_std_label }</Typography>
			} else {
				let no_url = url == null || url.length == 0
				let source_icon
				let source_icon_url = get_link_source_icon(url)
				if (source_icon_url != null) source_icon = <img src={source_icon_url} width="10" style={{marginRight: 4}} />
				if (!no_url) popover_content = <Typography>{ source_icon }<a href={url} target="_blank">{ truncate(url, 15) } <Icon fontSize="inherit">open_in_new</Icon></a></Typography>
			}
			return (
				<MouseOverPopover target={badge_icon} key={i}>
					<div style={{padding: 10}}>
						<Typography variant="h5">{ f.label }</Typography>
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
			{ this.props.commentaries.map((comm) => {
				return <li><Typography><a href={comm.commentary_url} target="_blank">{ comm.authors_year }</a></Typography></li>
			}) }
			</ul>
		)
	}

	render() {
		let {commentaries} = this.props
		let commentary_el, commentary_popover
		if (commentaries.length > 0) {
			commentary_el = <span className="ArticleCommentaryBadge">Commentaries <span className="Count">{ commentaries.length }</span></span>
			commentary_popover = (
				<MouseOverPopover target={commentary_el} key='commentary'>
					<div style={{padding: 10}}>
						<Typography variant="h5">Commentaries about this article:</Typography>
						{ this.render_commentaries() }
					</div>
				</MouseOverPopover>
			)
		}
		return (
			<div>
				<span style={{marginRight: 10}}>{ this.relevant_badges().map(this.render_feature) }</span>
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