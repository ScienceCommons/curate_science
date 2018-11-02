import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import C from '../constants/constants';
import TransparencyBadge from './TransparencyBadge.jsx';

const styles = {
  card: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  authors: {
  	color: "#0CC343",
    marginBottom: 12,
  },
};

class ArticleLI extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };
    }

	render() {
 	    const { classes } = this.props;
		let a = this.props.article
		return (
			<div className="ArticleLI">
				<Card className={classes.card}>
	      			<CardContent>
		      			<Typography className={classes.title} variant="h2" component="h2" gutterBottom>
		      			{ a.title }
		      			</Typography>
		      			<Typography className={classes.authors} gutterBottom>
		      			{ a.authors }
		      			</Typography>
		      			<Typography className={classes.journal} color="textSecondary" gutterBottom>
		      			{ a.journal }
		      			</Typography>
						<TransparencyBadge active={['rs']} />
						<Typography className={classes.editor} color="textSecondary" gutterBottom>
							{ a.editor + " " + a.edit_date }
						</Typography>
  				    </CardContent>
				</Card>
			</div>
		)
	}
}

ArticleLI.defaultProps = {
	article: {}
};

ArticleLI.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ArticleLI);
