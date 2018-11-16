import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Card, CardActions, CardContent, Icon} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import C from '../../constants/constants';
import TransparencyBadge from '../TransparencyBadge.jsx';
import JournalDOIBadge from '../JournalDOIBadge.jsx';
import AuthorList from '../AuthorList.jsx';

const styles = {
  card: {
    minWidth: 275,
    marginBottom: '5px'
  },
  replicationHeader: {
    fontSize: 16,
  },
  authors: {
  	color: "#0CC343",
    marginBottom: 12,
  },
  studyNum: {
  	fontSize: 12
  }
};

class StudyLI extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };
    }

	render() {
 	    let { classes, study, ofMultiple, showActions, showReplicationDetails} = this.props;
 	    let actions = (
 	    	<CardActions>
 	    		<Button>Edit</Button>
 	    		<Button>
 	    			<Icon>delete</Icon>
 	    			Delete
 	    		</Button>
    		</CardActions>
		)
		return (
			<Card className={classes.card}>
				<CardContent>
					{ ofMultiple ? <Typography className={classes.studyNum} color="textSecondary" gutterBottom>{ "STUDY " + study.study_number }</Typography> : null }
					<TransparencyBadge transparencies={study.transparencies} />

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
								<Typography variant="h6" className={classes.replicationHeader}>Similarity Method</Typography>
							</Grid>
							<Grid item xs={2}>
								<Typography variant="h6" className={classes.replicationHeader}>Differences</Typography>
							</Grid>
							<Grid item xs={2}>
								<Typography variant="h6" className={classes.replicationHeader}>Aux. Hypotheses</Typography>
							</Grid>
						</Grid>
					</div>
	  			</CardContent>
				{ showActions ? actions : null }
			</Card>
		)
	}
}

StudyLI.defaultProps = {
	study: {},
	ofMultiple: true,
	showActions: false
};

StudyLI.propTypes = {
  classes: PropTypes.object.isRequired,
  showActions: PropTypes.bool,
  showReplicationDetails: PropTypes.bool
};

export default withStyles(styles)(StudyLI);
