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
  },
  thumbnails: {
  	marginTop: 10
  },
  thumbnail: {
  	width: 80,
  	height: 80,
  	marginRight: 10,
  	marginBottom: 10,
  	border: '1px solid gray'
  }
};

class StudyLI extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };
    }

    render_figures() {
    	let {figures, classes} = this.props
    	return (
    		<div className={classes.thumbnails}>
    			{ figures.map((fig) => {
    				return <img className={classes.thumbnail} src={fig.image_url} title={`Figure ${fig.figure_number}`} />
	    		})}
	    	</div>
    	)
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
		let auxiliary_hypo_evidence = (study.auxiliary_hypo_evidence == null) ? [] : study.auxiliary_hypo_evidence
		return (
			<Card className={classes.card}>
				<CardContent>
					{ ofMultiple ? <Typography className={classes.studyNum} color="textSecondary" gutterBottom>{ "STUDY " + study.study_number }</Typography> : null }
					<TransparencyBadge studies={[study]} study_level={true} />

					{ this.render_figures() }

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
								<Typography variant="body">{ study.method_similarity_type }</Typography>
							</Grid>
							<Grid item xs={2}>
								<Typography variant="h6" className={classes.replicationHeader}>Differences</Typography>
							</Grid>
							<Grid item xs={2}>
								<Typography variant="h6" className={classes.replicationHeader}>Aux. Hypotheses</Typography>
								<Typography variant="body"><ul>{ auxiliary_hypo_evidence.map(text => <li>{text}</li>) }</ul></Typography>
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
	showActions: false,
	figures: [],
	showReplicationDetails: true
};

StudyLI.propTypes = {
  classes: PropTypes.object.isRequired,
  showActions: PropTypes.bool,
  showReplicationDetails: PropTypes.bool,
  figures: PropTypes.array
};

export default withStyles(styles)(StudyLI);
