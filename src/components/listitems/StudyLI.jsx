import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Card, CardActions, CardContent, Button, Icon, IconButton} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import C from '../../constants/constants';
import TransparencyBadge from '../TransparencyBadge.jsx';
import JournalDOIBadge from '../JournalDOIBadge.jsx';
import FigureList from '../shared/FigureList.jsx';
import AuthorList from '../AuthorList.jsx';

const styles = {
  card: {
    minWidth: 275,
    marginBottom: '5px'
  },
  replicationHeader: {
    fontSize: 14,
    color: '#aaa',
    fontWeight: 'normal'
  },
  authors: {
  	color: "#0CC343",
    marginBottom: 12,
  },
  studyNum: {
  	fontSize: 12
  },
  thumbnails: {
  	marginTop: 10
  }
};

class StudyLI extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        }
        this.handleEdit = this.handleEdit.bind(this)
        this.handleDelete = this.handleDelete.bind(this)

        this.STUDY_FORM_INPUTS = [
        	'id',
        	'study_number',
        	'reporting_standards_type',
        	'replication_of',
        	'effects',
        	'method_similarity_type',
        	'method_differences',
        	'auxiliary_hypo_evidence',
        	'ind_vars',
        	'dep_vars',
        	'ind_var_methods',
        	'dep_var_methods'
        ]
    }

    handleEdit() {
    	let {idx} = this.props
    	this.props.onEdit(idx)
    }

    handleDelete() {
    	this.props.onDelete(this.props.idx)
    }

    render_hidden_inputs() {
    	let {study} = this.props
    	return this.STUDY_FORM_INPUTS.map((name) => {
    		<input type='hidden' name={name} value={study[name] || ''} />
    	})
    }

	render() {
 	    let { classes, study, ofMultiple, showActions, showReplicationDetails, article_type} = this.props;
 	    let actions = (
 	    	<CardActions>
 	    		<IconButton onClick={this.handleEdit}>
 	    			<Icon>edit</Icon>
    			</IconButton>
 	    		<IconButton onClick={this.handleDelete}>
 	    			<Icon>delete</Icon>
 	    		</IconButton>
    		</CardActions>
		)
		let auxiliary_hypo_evidence = (study.auxiliary_hypo_evidence == null) ? [] : study.auxiliary_hypo_evidence
		return (
			<Card className={classes.card}>
				<CardContent>
					{ ofMultiple ? <Typography className={classes.studyNum} color="textSecondary" gutterBottom>{ "STUDY " + (study.study_number || '?') }</Typography> : null }
					<TransparencyBadge studies={[study]} study_level={true} article_type={article_type} />

					<FigureList figures={study.figures} />

					<div hidden={!showReplicationDetails}>
						<Typography variant="h5">Replication Details</Typography>

						<Grid container>
							<Grid item xs={2}>
								<Typography variant="h6" className={classes.replicationHeader}>Original Study</Typography>

							</Grid>
							<Grid item xs={2}>
								<Typography variant="h6" className={classes.replicationHeader}>Target Effect</Typography>
							</Grid>
							<Grid item xs={2}>
								<Typography variant="h6" className={classes.replicationHeader}>Rep. Method Similarity</Typography>
								<Typography variant="body1">{ study.method_similarity_type }</Typography>
							</Grid>
							<Grid item xs={2}>
								<Typography variant="h6" className={classes.replicationHeader}>Differences</Typography>
							</Grid>
							<Grid item xs={2}>
								<Typography variant="h6" className={classes.replicationHeader}>Aux. Hypotheses</Typography>
								<ul>{ auxiliary_hypo_evidence.map((text, i) => <li key={i}><Typography variant="body1">{text}</Typography></li>) }</ul>
							</Grid>
						</Grid>
					</div>
	  			</CardContent>
				{ showActions ? actions : null }
				{ this.render_hidden_inputs() }
			</Card>
		)
	}
}

StudyLI.defaultProps = {
	study: {},
	idx: null,
	ofMultiple: true,
	showActions: false,
	showReplicationDetails: true,
	article_type: "ORIGINAL"
};

StudyLI.propTypes = {
  classes: PropTypes.object.isRequired,
  showActions: PropTypes.bool,
  showReplicationDetails: PropTypes.bool
};

export default withStyles(styles)(StudyLI);
