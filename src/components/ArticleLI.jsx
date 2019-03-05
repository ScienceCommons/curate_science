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
import TruncatedText from './shared/TruncatedText.jsx';
import ArticleKeywords from './ArticleKeywords.jsx';

import {json_api_req} from '../util/util.jsx'

const styles = {
  card: {
    minWidth: 275,
    marginBottom: '9px'
  },
  title: {
    fontSize: 19,
    fontWeight: 400,
    clear: 'both',
    paddingTop: 10,
    marginTop: 3,
    marginBottom: 3
  },
  title_a: {
  },
  authors: {
  	color: "#009933",
  	marginTop: 3,
  	marginBottom: 3,
  },
  abstract: {
  	lineHeight: 1.1
  },
  journal: {
  	fontStyle: 'italic'
  },
  grayedTitle: {
  	color: '#BBB',
  	fontWeight: 'bold',
  	marginRight: 5
  },
  grayedDetails: {
  	color: '#BBB'
  },
  reviewers: {
  	color: "#009933"
  },
  moreIcon: {
  	justifyContent: 'center',
  	textAlign: 'center'
  }
};

class ArticleLI extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	show_more: false,
        	// Below from article detail endpoint
        	// Arrays after fetch
        	figures: null,
        	commentaries: null
        };

        this.toggle_show_more = this.toggle_show_more.bind(this)
    }

    toggle_show_more() {
    	let {show_more, figures} = this.state
    	let details_fetched = figures != null
    	this.setState({show_more: !show_more}, () => {
    		if (!details_fetched) {
    			this.fetch_article_details()
    		}
    	})
    }

    fetch_article_details() {
    	let {article} = this.props
    	let {figures, commentaries} = this.state
    	console.log("Fetching article details...")
    	json_api_req('GET', `/api/articles/${article.id}/`, {}, null, (res) => {
    		if (res.key_figures != null) figures = res.key_figures
    		if (res.commentaries != null) commentaries = res.commentaries
    		console.log(res)
    		this.setState({figures: figures, commentaries: commentaries})
    	}, (err) => {

    	})
    }

    empty(text) {
    	return text == null || text.length == 0
    }

	render() {
		let {show_more, figures, commentaries} = this.state
 	    let { article, classes } = this.props;
 	    let content_links = pick(article, ['pdf_url', 'pdf_downloads', 'pdf_citations', 'pdf_views',
			       						   'html_url', 'html_views',
			 	    					   'preprint_url', 'preprint_views', 'preprint_downloads'
			 	    					   ])
 	    let transparency_data = pick(article, ['article_type',
    										   'prereg_protocol_url',
											   'prereg_protocol_type',
											   'public_study_materials_url',
											   'public_data_url',
											   'public_code_url',
											   'reporting_standards_type'
											   ])
		return (
			<div className="ArticleCard">
				<Card className={classes.card} raised>
					<CardContent>
						<ArticleType type={article.article_type} />
						<ArticleContentLinks {...content_links} />

						<Typography className={classes.title} variant="h2" color="textPrimary">{article.title}</Typography>
						<Typography className={classes.authors} color="textSecondary" gutterBottom>
							<AuthorList author_list={article.author_list} year={article.year} />
						</Typography>
						<TransparencyBadge {...transparency_data} />
			  			<Typography className={classes.journal} color="textSecondary" gutterBottom>
			  				<JournalDOIBadge journal={article.journal} doi={article.doi} />
			  			</Typography>

			  			<div className={classes.moreIcon}>
				  			<IconButton onClick={this.toggle_show_more} >
				  				<Icon>{show_more ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</Icon>
			  				</IconButton>
		  				</div>

		  				<div id="details" hidden={!show_more}>
		  					<Typography style={{lineHeight: 1.2, marginBottom: 10}}><TruncatedText text={article.abstract} /></Typography>
		  					<ArticleKeywords keywords={article.keywords} />
		  					<FigureList figures={figures} />
		  					<div hidden={this.empty(article.author_contributions)}>
			  					<Typography component="span">
			  						<span className={classes.grayedTitle}>Author contributions:</span>
				  					<span className={classes.grayedDetails}><TruncatedText text={ article.author_contributions } /></span>
				  				</Typography>
		  					</div>
		  					<div hidden={this.empty(article.competing_interests)}>
			  					<Typography component="span">
			  						<span className={classes.grayedTitle}>Competing interests:</span>
				  					<span className={classes.grayedDetails}><TruncatedText text={ article.competing_interests } /></span>
				  				</Typography>
		  					</div>
		  					<div hidden={this.empty(article.funding_sources)}>
			  					<Typography component="span">
			  						<span className={classes.grayedTitle}>Funding sources:</span>
			  						<span className={classes.grayedDetails}><TruncatedText text={ article.funding_sources } /></span>
			  					</Typography>
			  				</div>
			  				<div hidden={this.empty(article.peer_review_editor)}>
			  					<Typography>
			  						<span className={classes.grayedTitle}>Editor:</span>
		  							<span className={classes.reviewers}>{ article.peer_review_editor || '--' }</span>
	  							</Typography>
		  					</div>
			  				<div hidden={this.empty(article.peer_reviewers)}>
			  					<Typography component="span">
				  					<span className={classes.grayedTitle}>Reviewers:</span>
			  						<span className={classes.reviewers}>{ article.peer_reviewers || '--' }</span>
			  					</Typography>
		  					</div>
		  					<span hidden={article.peer_review_url == null || article.peer_review_url.length == 0}><Typography><a href={article.peer_review_url} target="_blank">Open peer review <Icon fontSize="inherit">open_in_new</Icon></a></Typography></span>
		  				</div>
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
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ArticleLI);
