import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import {pick} from 'lodash'

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

import C from '../constants/constants';
import TransparencyBadge from './TransparencyBadge.jsx';
import ArticleType from './ArticleType.jsx';
import JournalDOIBadge from './JournalDOIBadge.jsx';
import ArticleContentLinks from './ArticleContentLinks.jsx';
import AuthorList from './AuthorList.jsx';
import FigureList from './shared/FigureList.jsx';
import ArticleAbstract from './ArticleAbstract.jsx';
import ArticleKeywords from './ArticleKeywords.jsx';

const styles = {
  card: {
    minWidth: 275,
    marginBottom: '5px'
  },
  title: {
    fontSize: 24,
  },
  title_a: {
  },
  authors: {
  	color: "#0CC343",
    marginBottom: 12,
  },
  boldProp: {
  	fontStyle: 'bold'
  },
  reviewers: {
  	color: "#0CC343"
  }
};

class ArticleLI extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	show_more: false
        };

        this.toggle_show_more = this.toggle_show_more.bind(this)
    }

    toggle_show_more() {
    	let {show_more} = this.state
    	this.setState({show_more: !show_more})
    }

	render() {
		let {show_more} = this.state
 	    let { article, classes } = this.props;
 	    let content_links = pick(article, ['pdf_url', 'pdf_downloads', 'pdf_citations', 'pdf_views',
			       						   'html_url', 'html_views',
			 	    					   'preprint_url', 'preprint_views', 'preprint_downloads'
			 	    					   ])
		return (
			<Card className={classes.card}>
				<CardContent>
					<ArticleType type={article.article_type} />
      				<Grid container justify="flex-end">
						<ArticleContentLinks {...content_links} />
					</Grid>

					<Typography className={classes.title} variant="h2" color="textPrimary">{article.title}</Typography>
					<Typography className={classes.authors} color="textSecondary" gutterBottom>
						<AuthorList author_list={article.author_list} year={article.year} />
					</Typography>
					<TransparencyBadge article_type={article.article_type} />
		  			<Typography className={classes.journal} color="textSecondary" gutterBottom>
		  				<JournalDOIBadge journal={article.journal} doi={article.doi} />
		  			</Typography>

		  			<IconButton onClick={this.toggle_show_more}>
		  				<Icon>{show_more ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</Icon>
	  				</IconButton>

	  				<div id="details" hidden={!show_more}>
	  					<ArticleAbstract text={article.abstract} />
	  					<ArticleKeywords keywords={article.keywords} />
	  					<FigureList figures={article.figures} />
	  					<div>
		  					<Typography className={classes.boldProp}>Competing interests:</Typography>
		  					<Typography>{ article.competing_interests || '--' }</Typography>
	  					</div>
	  					<div>
		  					<Typography className={classes.boldProp}>Funding sources:</Typography>
		  					<Typography>{ article.funding_sources || '--' }</Typography>
		  				</div>
		  				<div>
		  					<Typography className={classes.boldProp}>Editor:</Typography>
	  						<Typography className={classes.reviewers}>{ article.peer_review_editor || '--' }</Typography>
	  					</div>
		  				<div>
		  					<Typography className={classes.boldProp}>Reviewers:</Typography>
	  						<Typography className={classes.reviewers}>{ article.peer_reviewers || '--' }</Typography>
	  					</div>
	  					<Typography hidden={article.peer_review_url == null}><a href={article.peer_review_url} target="_blank">Open peer review <Icon>open_in_new</Icon></a></Typography>
	  				</div>
	  			</CardContent>
			</Card>
		)
	}
}

ArticleLI.defaultProps = {
	article: {}
};

ArticleLI.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ArticleLI);
