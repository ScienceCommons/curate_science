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
        paddingTop: 10,
        alignContent: 'space-around'
    }
}

class Home extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

	render() {
        let {classes} = this.props
		let {articles, searched} = this.state
		return (
			<div>
                <Typography variant="h1">Recently Added</Typography>
			</div>
		)
	}
}

export default withRouter(withStyles(style)(Home));