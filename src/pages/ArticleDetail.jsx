import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import C from '../constants/constants';
import TransparencyBadge from '../components/TransparencyBadge.jsx';


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
		console.log(match)
		if (article == null) return <p>Loading...</p>
		return (
			<div>
				<Card className={classes.card}>
	      			<CardContent>
		      			<Typography className={classes.title} variant="h2" component="h2" gutterBottom>
		      			{ article.title }
		      			</Typography>
		      			<Typography className={classes.authors} gutterBottom>
		      			{ article.authors }
		      			</Typography>
		      			<Typography className={classes.journal} color="textSecondary" gutterBottom>
		      			{ article.journal }
		      			</Typography>
						<TransparencyBadge active={['rs']} />
						<Typography className={classes.editor} color="textSecondary" gutterBottom>
							{ article.editor + " " + article.edit_date }
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
