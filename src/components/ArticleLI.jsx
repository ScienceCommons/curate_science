import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import C from '../constants/constants';
import TransparencyBadge from './TransparencyBadge.jsx';
import JournalDOIBadge from './JournalDOIBadge.jsx';
import AuthorList from './AuthorList.jsx';

const styles = {
  card: {
    minWidth: 275,
    marginBottom: '5px'
  },
  title: {
    fontSize: 24,
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
 	    let { classes, id, title, authors, journal, doi, transparencies } = this.props;
 	    let url = `/new/article/${id}`
		return (
			<Card>
				<CardContent>
					<a href={url}><Typography className={classes.title} variant="h2" color="textPrimary">{title}</Typography></a>
					<Typography className={classes.authors} color="textSecondary" gutterBottom>
						<AuthorList authors={authors} />
					</Typography>
					<TransparencyBadge transparencies={transparencies} />
		  			<Typography className={classes.journal} color="textSecondary" gutterBottom>
		  				<JournalDOIBadge journal={journal} doi={doi} />
		  			</Typography>
	  			</CardContent>
			</Card>
		)
	}
}

ArticleLI.defaultProps = {
	id: "",
	title: "",
	authors: [],
	journal: "",
	doi: "",
	transparencies: []
};

ArticleLI.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ArticleLI);
