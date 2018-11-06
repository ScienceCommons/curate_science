import React from 'react';
import { withRouter } from 'react-router-dom';

import { Link } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';

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
        return this.props.location.search.substring(3)
    }

    search() {
        let q = this.query()
        fetch(`/api/articles/search/?q=${q}&page_size=25`).then(res => res.json()).then((res) => {
            console.log(res)
            this.setState({articles: res})
        })
    }

	render() {
		let {articles} = this.state
		return (
			<div>
				<Typography variant="h2">Recently Curated</Typography>

				<List style={{backgroundColor: 'white'}}>
					{ articles.map(a => <ArticleLI key={a.id} {...a} />) }
				</List>

			</div>
		)
	}
}

export default withRouter(Home);