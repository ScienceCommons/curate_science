import React from 'react';
import { withRouter } from 'react-router-dom';

import qs from 'query-string';

import { Link } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';

import ArticleSearchFilter from '../components/ArticleSearchFilter.jsx';
import ArticleLI from '../components/ArticleLI.jsx';

class Home extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	articles: [],
            searched: false
        };
    }

    componentDidMount() {
        this.handleLocationChange(this.props.history.location);
        this.unlisten = this.props.history.listen(this.handleLocationChange);
        console.log("Home listening")
    }

    componentWillUnmount() {
        this.unlisten();
    }

    handleLocationChange(location) {
        this.search()
    }

    query() {
        let q = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).q
        return q
    }

    search() {
        let q = this.query()
        let url = `/api/articles/search/?q=${q}&page_size=25`
        console.log(url)
        fetch(url).then(res => res.json()).then((res) => {
            console.log(res)
            this.setState({articles: res, searched: true})
        })
    }

    fetch_recent_articles() {
        let {match} = this.props
        fetch(`/api/articles/`).then(res => res.json()).then((res) => {
            console.log(res)
            this.setState({articles: res, searched: false})
        })
    }

	render() {
		let {articles, searched} = this.state
		return (
			<Grid container>
                <Grid item xs={3}>
                    <ArticleSearchFilter />
                </Grid>
                <Grid item xs={9}>
    				<Typography variant="h2">{ searched ? "Search Results" : "Recently Curated" }</Typography>
                    <Typography variant="subtitle1">Showing <b>{ articles.length }</b> articles</Typography>
    				{ articles.map(a => <ArticleLI key={a.id} {...a} />) }
                </Grid>
			</Grid>
		)
	}
}

export default withRouter(Home);