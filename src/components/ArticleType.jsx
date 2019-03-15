import React from 'react';

import {Typography, Button} from '@material-ui/core';
import MouseOverPopover from '../components/shared/MouseOverPopover.jsx';
import {find} from 'lodash'
import C from '../constants/constants';

class ArticleType extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		let {type, replication_data} = this.props
		let at = find(C.ARTICLE_TYPES, {id: type.toUpperCase()})
		let count
		let label = at != null ? at.label : "Unknown"
		let color = at != null ? at.color : "#000000"
		const st = {
			color: color,
			border: `1px solid ${color}`
		}
		if (type == 'REPLICATION') {
			count = <span className="Count">{replication_data.number_of_reps}</span>
		}
		let type_label = <span className="ArticleType" style={st}><Typography color="inherit">{ label }{ count }</Typography></span>
		if (type == 'REPLICATION') {
			return (
				<MouseOverPopover target={type_label} key='rep_popover'>
					<div style={{padding: 10}}>
						<Typography variant="body1">Article reports { replication_data.number_of_reps } replications of <a href={replication_data.original_article_url} target="_blank">{ replication_data.original_study }</a> (target effects: { replication_data.target_effects }).</Typography>
						<Typography variant="body2" color="gray">
							A replication is a study that uses a methodology that is<br/>
							'close' or 'very close' to a previous study (see <a href="/sitestatic/legacy/logos/replication-taxonomy-v4_small.png" target="_blank">replication taxonomy</a> for details).
						</Typography>
					</div>
				</MouseOverPopover>
			)
		} else return type_label
	}
}

ArticleType.defaultProps = {
	type: 'original',
	replication_data: {}
};

export default ArticleType;