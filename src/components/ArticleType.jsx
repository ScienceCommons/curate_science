import React from 'react';

import {Typography, Button} from '@material-ui/core';
import MouseOverPopover from '../components/shared/MouseOverPopover.jsx';
import {find} from 'lodash'
import C from '../constants/constants';

class ArticleType extends React.Component {
	constructor(props) {
        super(props);
    }

	render_article_type_label() {
		let {type, replication_data} = this.props
		let at = find(C.ARTICLE_TYPES, {id: type.toUpperCase()})
		let count
		let label = at != null ? at.label : "Unknown"
		let color = at != null ? at.color || '#000000' : "#000000"
		const st = {
			color: color,
			border: `1px solid ${color}`
		}
		if (type == 'REPLICATION') {
			count = <span className="Count">{replication_data.number_of_reps}</span>
		}
		let type_label = (
			<span className="ArticleBadgeWithCount ArticleType" style={st} title={at.description}>
				{ label }{ count }
			</span>
		)
		if (type == 'REPLICATION') {
			return (
				<MouseOverPopover target={type_label} key='rep_popover'>
					<div style={{padding: 10}}>
						<Typography variant="body1">Article reports { replication_data.number_of_reps } replications of <a href={replication_data.original_article_url} target="_blank">{ replication_data.original_study }</a> (target effects: { replication_data.target_effects }).</Typography>
						<Typography variant="body2" style={{marginTop: 15, color: "#808080"}}>
							A replication is a study that uses a methodology that is
							'close' or 'very close' to a previous study (see <a href="/sitestatic/legacy/logos/replication-taxonomy-v4_small.png" target="_blank">replication taxonomy</a> for details).
						</Typography>
					</div>
				</MouseOverPopover>
			)
		} else return type_label
	}

	render() {
		let {registered_report} = this.props
		let type_label = this.render_article_type_label()
		let rr
		const rr_color = '#E65950'
		const st = {
			color: rr_color,
			border: `1px solid ${rr_color}`,
		}
		if (registered_report) rr = (
			<span className="ArticleBadgeWithCount ArticleType" style={st}>
				<Typography color="inherit">Registered Report</Typography>
			</span>
		)
		return (
			<div>
				{ type_label }
				{ rr }
			</div>
		)
	}
}

ArticleType.defaultProps = {
	type: 'original',
	replication_data: {},
	registered_report: false
};

export default ArticleType;