import React from 'react';

import PropTypes from 'prop-types';

import C from '../constants/constants';
import {truncate} from '../util/util.jsx'

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
		let {icon_size, study_level, studies, transparencies, classes} = this.props
		let sole_study = studies.length == 1
		let transparencies_by_study = {}
		// Collect this feature's transparencies across all studies
		let n = 0
		studies.forEach((study) => {
			let study_transparencies = study.transparencies.filter(t => t.transparency_type.toUpperCase() == f.id.toUpperCase())
			n = n + study_transparencies.length
			transparencies_by_study[study.study_number] = study_transparencies
		})
		let enabled = n > 0
		let label = ''
		let url = ''
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
			return badge_icon
		} else {
			// Collect transparencies across all studies
			let popover_content = (
				<div style={{padding: 10}}>
					<Typography variant="h5">{ f.label }</Typography>
					{ Object.keys(transparencies_by_study).map((study_num, j) => {
						let study_transparencies = transparencies_by_study[study_num]
						if (study_transparencies.length == 0) return null
						return (
							<div key={j}>
								{ !sole_study ? <Typography variant="overline" gutterBottom>Study {study_num}</Typography> : null }
								{ study_transparencies.map((t, idx) => {
									return <Typography key={idx}><a href={t.url} key={idx} target="_blank"><Icon fontSize="inherit">open_in_new</Icon> { truncate(t.url) }</a></Typography>
								}) }
							</div>
						)
					}) }
				</div>
			)
			return (
				<MouseOverPopover target={badge_icon}>
					{ popover_content }
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

	render() {
		return this.relevant_badges().map(this.render_feature)
	}
}

TransparencyBadge.propTypes = {
	transparencies: PropTypes.array,
	article_type: PropTypes.string,
	study_level: PropTypes.bool,
	// If article-level
	studies: PropTypes.array
}

TransparencyBadge.defaultProps = {
	transparencies: [], // List of objects (see Transparency serializer)
	article_type: "ORIGINAL",
	icon_size: 30,
	study_level: false,
	studies: []
};

export default withStyles(styles)(TransparencyBadge);