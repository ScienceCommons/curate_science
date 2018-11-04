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
 	    let { classes, id, title, authors, journal, doi, transparencies } = this.props;
 	    let author_text = authors.map(author => `${author.last_name}, ${author.first_name}`)
 	    let url = `/new/article/${id}`
		return (
			<ListItem button component="a" href={url} className="ArticleLI">
				<ListItemText primary={title} secondary={author_text} />
	  			<Typography className={classes.journal} color="textSecondary" gutterBottom>
	  				<span>{ journal }</span> <span>{ doi }</span>
	  			</Typography>
				<TransparencyBadge transparencies={transparencies} />
			</ListItem>
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
