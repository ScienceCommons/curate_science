import React from 'react';

import {Typography, Button} from '@material-ui/core';
import MouseOverPopover from '../components/shared/MouseOverPopover.jsx';
import { find, isEmpty } from 'lodash'
import C from '../constants/constants';

class ArticleType extends React.Component {
	constructor(props) {
        super(props);
    }

  render_article_type_label() {
    let { article, label_styles, type, replication_data } = this.props
    let at = find(C.ARTICLE_TYPES, {id: type.toUpperCase()})
    let count
    let label = at != null ? at.label : "Unknown"
    let color = at != null ? at.color || '#000000' : "#000000"
    const st = {
      color: color,
      opacity: 1,
    }
    if (type == 'REPLICATION' && !isEmpty(replication_data)) {
      count = <span className="Count">{replication_data.number_of_reps}</span>
    }

    function render_type_label(title) {
      return (
        <span className="ArticleBadgeWithCount ArticleType" style={{...st, ...label_styles}} title={title}>
            { label }{ count }
        </span>
      )
    }

    const has_reproducibility_data = article.reproducibility_original_study && article.reproducibility_original_study_url
    const has_commentary_data = article.commentary_target && article.commentary_target_url

    if (type == 'REPLICATION' && !isEmpty(replication_data)) {
      return (
        <MouseOverPopover target={render_type_label()} key='rep_popover'>
          <div style={{padding: 10}}>
            <Typography variant="body1">
								Article reports { replication_data.number_of_reps } {replication_data.number_of_reps > 1 ? 'replications' : 'replication'} of <a href={replication_data.original_article_url} target="_blank">{ replication_data.original_study }</a> <em>{ replication_data.target_effects || "" }</em>						</Typography>
						<Typography variant="body2" style={{marginTop: 15, color: "#808080"}}>
                A study is considered a replication if it uses a sufficiently similar methodology relative to a previous study (i.e., a 'Close', 'Very close', or 'Exact' replication according to our <a href="/sitestatic/infographics/replication-taxonomy-v0.4.0.png" target="_blank">replication taxonomy</a>.
              </Typography>
            </div>
          </MouseOverPopover>
      )
    } else if (type === 'REPRODUCIBILITY' && has_reproducibility_data) {
      return (
        <MouseOverPopover target={render_type_label()} key='rep_popover'>
          <div style={{padding: 10}}>
            <Typography variant="body1">
                Article reports a reproducibility/robustness reanalysis of <a href={article.reproducibility_original_study_url} target="_blank">{article.reproducibility_original_study}</a>.
              </Typography>
            </div>
          </MouseOverPopover>
      )
    } else if (type === 'COMMENTARY' && has_commentary_data) {
      return (
        <MouseOverPopover target={render_type_label()} key='rep_popover'>
          <div style={{padding: 10}}>
            <Typography variant="body1">
                Article is a commentary on <a href={article.commentary_target_url} target="_blank">{article.commentary_target}</a>.
              </Typography>
            </div>
          </MouseOverPopover>
      )
    } else return render_type_label(at.description)
  }

	render() {
		let {registered_report} = this.props
		let type_label = this.render_article_type_label()
		let rr
		const rr_color = C.REGISTERED_REPORT_COLOR
		const st = {
			color: rr_color,
			opacity: 1,
		}
		if (registered_report) rr = (
			<span className="ArticleBadgeWithCount ArticleType" style={st}>
				<Typography variant="body2" color="inherit">Registered Report</Typography>
			</span>
		)
		return (
			<div style={{ display: 'flex', alignItems: 'center', padding: '5px 0' }}>
				{ type_label }
				{ rr }
			</div>
		)
	}
}

ArticleType.defaultProps = {
  article: {},
	type: 'original',
	replication_data: {},
	registered_report: false
};

export default ArticleType;
