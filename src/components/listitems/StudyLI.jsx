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

import {find} from 'lodash'

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
        	{name: 'id'},
        	{name: 'study_number'},
        	{name: 'reporting_standards_type'},
        	{name: 'replication_of'},
        	{name: 'effects', multi: true, prop: 'id'},
        	{name: 'method_similarity_type'},
        	{name: 'method_differences'},
        	{name: 'auxiliary_hypo_evidence'},
        	{name: 'ind_vars', multi: true, prop: 'id'},
        	{name: 'dep_vars', multi: true, prop: 'id'},
        	{name: 'ind_var_methods', multi: true, prop: 'id'},
        	{name: 'dep_var_methods', multi: true, prop: 'id'}
        ]
        this.STUDY_TRANSPARENCY_FORM_INPUTS = [
          'id',
          'transparency_type',
          'url'
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
    	let {study, idx} = this.props
      let inputs = []
    	this.STUDY_FORM_INPUTS.forEach((params) => {
        let name = params.name
        let prefixed_name = `study-${idx}-${name}`
        let values = []
        if (params.multi) {
          let els = study[name] || []
          values = els.map((el) => el[params.prop])
        }
        else values = [study[name]]
        values.forEach((value) => {
          inputs.push(<input type='hidden' key={prefixed_name} name={prefixed_name} value={value || ''} />)
        })
    	})
      this.STUDY_TRANSPARENCY_FORM_INPUTS.forEach((name) => {
        let t_idx = '?'  // TODO
        let prefixed_name = `study-${idx}-transparency-${t_idx}-${name}`
        inputs.push(<input type='hidden' key={prefixed_name} name={prefixed_name} value={study[name] || ''} />)
      })
      return inputs
    }

  render_list(arr, prop) {
    arr = arr == null ? [] : arr
    return (
      <ul>
        { arr.map((el, i) => {
          return <li key={i}><Typography variant="body1">{prop == null ? el : el[prop]}</Typography></li>
        }) }
      </ul>
      )
  }

	render() {
 	    let { classes, study, ofMultiple, showActions, showReplicationDetails, article_type} = this.props;
      let similarity_label = study.method_similarity_type == null ? "--" : find(C.METHOD_SIMILARITY, {value: study.method_similarity_type}).label
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
                <Typography variant="body1">{ study.replication_of || '' }</Typography>
							</Grid>
							<Grid item xs={2}>
								<Typography variant="h6" className={classes.replicationHeader}>Target Effect</Typography>
                { this.render_list(study.effects, 'name') }
							</Grid>
							<Grid item xs={2}>
								<Typography variant="h6" className={classes.replicationHeader}>Rep. Method Similarity</Typography>
								<Typography variant="body1">{ similarity_label }</Typography>
							</Grid>
							<Grid item xs={2}>
								<Typography variant="h6" className={classes.replicationHeader}>Differences</Typography>
                <Typography variant="body1">{ study.method_differences || '' }</Typography>
							</Grid>
							<Grid item xs={2}>
								<Typography variant="h6" className={classes.replicationHeader}>Aux. Hypotheses</Typography>
                { this.render_list(auxiliary_hypo_evidence) }
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
