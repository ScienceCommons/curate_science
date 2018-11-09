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
        	articles: []
        };
    }

    fetch_recent_articles() {
    	let {match} = this.props
    	fetch(`/api/articles/`).then(res => res.json()).then((res) => {
            console.log(res)
    		this.setState({articles: res})
    	})
    }

    componentDidMount() {
    	this.fetch_recent_articles()
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
            this.setState({articles: res})
        })
    }

	render() {
		let {articles} = this.state
		return (
			<Grid container>
                <Grid item xs={4}>
                    <ArticleSearchFilter query={this.query()} />
                </Grid>
                <Grid item xs={8}>
    				<Typography variant="h2">Recently Curated</Typography>
    				{ articles.map(a => <ArticleLI key={a.id} {...a} />) }
                </Grid>
			</Grid>
		)
	}
}

export default withRouter(Home);