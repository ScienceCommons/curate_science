import React from 'react';
import { withRouter } from 'react-router-dom';

import qs from 'query-string';

import { Link } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';

import ArticleSearchFilter from '../components/ArticleSearchFilter.jsx';
import ArticleLI from '../components/ArticleLI.jsx';

import { withStyles } from '@material-ui/core/styles';

const style = {
    root: {
        paddingTop: 10
    }
}

class Home extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	articles: [],
            searched: false
        };
    }

    componentDidMount() {
        this.fetch_recent_articles()
    }

    componentWillUnmount() {
    }

    fetch_recent_articles() {
        let {match} = this.props
        fetch(`/api/articles/`).then(res => res.json()).then((res) => {
            console.log(res)
            this.setState({articles: res, searched: false})
        })
    }

	render() {
        let {classes} = this.props
		let {articles, searched} = this.state
		return (
			<Grid container spacing={24} className={classes.root}>
                <Grid item xs={3}>
                    <ArticleSearchFilter />
                </Grid>
                <Grid item xs={9}>
    				<Typography variant="h2">Recently Curated</Typography>
                    <Typography variant="subtitle1">Showing <b>{ articles.length }</b> articles</Typography>
    				{ articles.map(a => <ArticleLI key={a.id} {...a} />) }
                </Grid>
			</Grid>
		)
	}
}

export default withRouter(withStyles(style)(Home));