import React from 'react';

import { Link } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';

import {Button, Icon} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import C from '../constants/constants';
import ArticleContentLinks from '../components/ArticleContentLinks.jsx';
import TransparencyBadge from '../components/TransparencyBadge.jsx';
import JournalDOIBadge from '../components/JournalDOIBadge.jsx';
import AuthorList from '../components/AuthorList.jsx';
import StudyLI from '../components/listitems/StudyLI.jsx';

import {printDate} from '../util/util.jsx'

const styles = {
	root: {
		padding: 10
	},
	card: {
		minWidth: 275,
	},
	title: {
		fontSize: 28,
	},
	type: {
		fontSize: 14,
	},
	label: {
		fontSize: 14,
	},
	authors: {
		color: "#0CC343",
	},
	sectionHeading: {
		marginTop: 15,
		marginBottom: 15
	}
};

function Keywords(props) {
	if (props.keywords != null) return props.keywords.map((kw) => <Chip label={kw} variant="outlined" />)
	else return null
}

class ArticleDetail extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	article: null
        };

        this.render_study = this.render_study.bind(this)
    }

    componentDidMount() {
    	this.fetch_article()
    }

    fetch_article() {
    	let {match} = this.props
    	fetch(`/api/articles/${match.params.id}`).then(res => res.json()).then((res) => {
    		console.log(res)
    		this.setState({article: res})
    	})
    }

    render_study(s) {
    	let {article} = this.state
    	let key_figures = article.key_figures.filter(kf => kf.study == s.id)
    	if (key_figures == null) key_figures = []
    	let multiple = article.studies != null && article.studies.length > 1
    	return <StudyLI key={s.id} study={s} ofMultiple={multiple} figures={key_figures} article_type={article.article_type} />
    }

	render() {
		const { classes } = this.props;
		let {match, auth} = this.props
		let {article} = this.state
		if (article == null) return <Typography variant="h3" style={{textAlign: 'center'}}>Loading...</Typography>
		let update_date = new Date(article.updated)
		let plural = article.studies.length > 1
		return (
			<div className={classes.root}>
				<div hidden={!auth} align="right" style={{marginBottom: 10}}>
					<Link to={`/article/${article.id}/edit`}>
						<Button variant="contained" color="primary">
							<Icon>edit</Icon>
							Edit
						</Button>
					</Link>
				</div>
				<Card className={classes.card}>
	      			<CardContent>
	      				<Grid container justify="flex-end">
							<ArticleContentLinks pdf={article.pdf_url} html={article.html_url} preprint={article.preprint_url} />
						</Grid>

		      			<Typography className={classes.type} color="textSecondary" gutterBottom>
				          { article.article_type }
				        </Typography>
		      			<Typography className={classes.title} variant="h2" component="h2" gutterBottom>
		      			{ article.title }
		      			</Typography>
		      			<Typography className={classes.authors}>
		      				<AuthorList authors={article.authors} />
		      			</Typography>
		      			<Typography className={classes.journal} gutterBottom>
			      			<JournalDOIBadge journal={article.journal} doi={article.doi} />
		      			</Typography>
						<TransparencyBadge icon_size={50} studies={article.studies} article_type={article.article_type} />

						<Keywords keywords={article.keywords} />
						<Typography className={classes.label} color="textSecondary" gutterBottom>
				          Abstract
				        </Typography>
				        <Typography className={classes.abstract} color="default" gutterBottom>
			      			{ article.abstract }
		      			</Typography>
						<Typography className={classes.editor} color="textSecondary" gutterBottom>
							{ "Updated " + printDate(update_date) }
						</Typography>

  				    </CardContent>
				</Card>

				<Typography variant="h5" color="textSecondary" className={classes.sectionHeading}>{ plural ? "Studies" : "Study" }</Typography>

				{ article.studies.map(this.render_study) }

				<Typography variant="h5" color="textSecondary" className={classes.sectionHeading}>Related Articles/Collections</Typography>

				<p>...</p>

			</div>
		)
	}
}

ArticleDetail.defaultProps = {
	auth: true
}

export default withStyles(styles)(ArticleDetail);
