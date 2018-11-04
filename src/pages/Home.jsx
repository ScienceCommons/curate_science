import React from 'react';

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

export default Home;