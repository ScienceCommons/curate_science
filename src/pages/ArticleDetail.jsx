import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import C from '../constants/constants';
import ArticleContentLinks from '../components/ArticleContentLinks.jsx';
import TransparencyBadge from '../components/TransparencyBadge.jsx';


const styles = {
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
    marginBottom: 12,
  },
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
    }

    fetch_article() {
    	let {match} = this.props
    	fetch(`/api/articles/${match.params.id}`).then(res => res.json()).then((res) => {
    		console.log(res)
    		this.setState({article: res})
    	})
    }

    componentDidMount() {
    	this.fetch_article()
    }

	render() {
		const { classes } = this.props;
		let {match} = this.props
		let {article} = this.state
		if (article == null) return <p>Loading...</p>
		return (
			<div>
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
		      			<Typography className={classes.authors} gutterBottom>
		      			{ article.authors.map(author => `${author.last_name}, ${author.first_name}`) }
		      			</Typography>
		      			<Typography className={classes.journal} color="textSecondary" gutterBottom>
			      			<span>{ article.journal }</span> <span>{ article.doi }</span>
		      			</Typography>

						<TransparencyBadge transparencies={article.transparencies} />
						<Keywords />

						<Typography className={classes.editor} color="textSecondary" gutterBottom>
							{ article.editor + " " + article.edit_date }
						</Typography>
						<Typography className={classes.label} color="textSecondary" gutterBottom>
				          Abstract
				        </Typography>
				        <Typography className={classes.abstract} color="default" gutterBottom>
			      			{ article.abstract }
		      			</Typography>
  				    </CardContent>
				</Card>
			</div>
		)
	}
}

ArticleDetail.defaultProps = {

}

export default withStyles(styles)(ArticleDetail);
