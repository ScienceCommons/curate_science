import React from 'react';

import PropTypes from 'prop-types';

import C from '../constants/constants';
import {truncate} from '../util/util.jsx'

import MouseOverPopover from '../components/shared/MouseOverPopover.jsx';

import {Icon, Typography} from '@material-ui/core';



class TransparencyBadge extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };

        this.render_feature = this.render_feature.bind(this)
    }

	render_feature(f, i) {
		let {icon_size, study_level, studies} = this.props
		let sole_study = studies.length == 1
		let transparencies_by_study = {}
		// Collect this feature's transparencies across all studies
		let n = 0
		studies.forEach((study) => {
			let study_transparencies = study.transparencies.filter(t => t.transparency_type.toUpperCase() == f.id.toUpperCase())
			n = n + study_transparencies.length
			transparencies_by_study[study.id] = study_transparencies
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
			return (
				<MouseOverPopover target={badge_icon} key={i}>
					<div style={{padding: 10}}>
						<Typography variant="h5">{ f.label }</Typography>
						{ Object.keys(transparencies_by_study).map((study_id) => {
							let study_transparencies = transparencies_by_study[study_id]
							if (study_transparencies.length == 0) return null
							return (
								<p>
									{ !sole_study ? <Typography variant="overline" gutterBottom>Study {study_id}</Typography> : null }
									{ study_transparencies.map((t, idx) => {
										return <a href={t.url} target="_blank"><Icon>link</Icon> { truncate(t.url) }</a>
									}) }
								</p>
							)
						}) }
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

	render() {
		return this.relevant_badges().map(this.render_feature)
	}
}

TransparencyBadge.propTypes = {
	transparencies: PropTypes.array,
	article_type: PropTypes.string.required,
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

export default TransparencyBadge;