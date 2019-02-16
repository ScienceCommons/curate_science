import React from 'react';
import { withRouter } from 'react-router-dom';

import qs from 'query-string';

import { Link } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import {List, Grid, Button, Icon} from '@material-ui/core';

import AuthorEditor from '../components/AuthorEditor.jsx';
import ArticleLI from '../components/ArticleLI.jsx';
import AuthorLinks from '../components/AuthorLinks.jsx';
import LabeledBox from '../components/shared/LabeledBox.jsx';

import { withStyles } from '@material-ui/core/styles';


const DUMMY_AUTHOR = {
    name: "Jeremy Gordon",
    title: "PhD Student",
    affiliation: "UC Berkeley School of Information",
    links: {
        gscholar: 'https://www.google.com',
        orcid: 'https://www.google.com',
        twitter: 'https://www.google.com',
        internet: 'https://www.google.com',
        email: 'mailto:onejgordon@gmail.com'
    }
}

const DUMMY_ARTICLES = [
    {
        "id": 5,
        "year": 2009,
        "key_figures": [],
        "authors": [
            "Jeremy Gordon"
        ],
        "journal": "Journal of Articles in Support of the Null Hypothesis",
        "doi": "10.1.1.214.2427",
        "title": "Is cleanliness next to godliness? Dispelling old wives’ tales: Failure to replicate Zhong and Liljenquist",
        "abstract": "",
        "keywords": null,
        "article_type": "REPLICATION",
        "reporting_standards_type": null,
        "pdf_url": "",
        "html_url": "",
        "preprint_url": "",
        "research_area": "SOCIAL_SCIENCE",
        "created": "2018-10-29T19:24:10.490641Z",
        "updated": "2019-01-07T02:52:53.644571Z"
    },
    {
        "id": 6,
        "year": 2009,
        "key_figures": [],
        "authors": [
            "Jeremy Gordon"
        ],
        "journal": "Journal of Articles in Support of the Null Hypothesis",
        "doi": "10.1.1.214.2427",
        "title": "Out, Damned Spot: Can the “Macbeth Effect” Be Replicated?",
        "abstract": "",
        "keywords": null,
        "article_type": "REPLICATION",
        "reporting_standards_type": null,
        "pdf_url": "",
        "html_url": "",
        "preprint_url": "",
        "research_area": "SOCIAL_SCIENCE",
        "created": "2018-10-29T19:24:10.490641Z",
        "updated": "2019-01-07T02:52:53.644571Z"
    }
]

const styles = theme => ({
    root: {
        paddingTop: 10,
        flexGrow: 1
    },
    box: {
        padding: theme.spacing.unit * 2,
    }
})

class AuthorPage extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	articles: [],
            author: DUMMY_AUTHOR,
            searched: false,
            edit_author_modal_open: false
        }

        this.open_author_editor = this.toggle_author_editor.bind(this, true)
        this.close_author_editor = this.toggle_author_editor.bind(this, false)
    }

    componentDidMount() {
        this.fetch_articles()
    }

    componentWillUnmount() {
    }

    fetch_articles() {
        const DUMMY_DATA = true
        let {match} = this.props
        if (DUMMY_DATA) {
            this.setState({articles: DUMMY_ARTICLES, searched: false})
        } else {
            fetch(`/api/articles/`).then(res => res.json()).then((res) => {
                console.log(res)
                this.setState({articles: res, searched: false})
            })
        }
    }

    toggle_author_editor(open) {
        this.setState({edit_author_modal_open: open})
    }

	render() {
        let {classes} = this.props
		let {articles, searched, author, edit_author_modal_open} = this.state
		return (
            <div>
    			<Grid container justify="center" spacing={24} className={classes.root}>
                    <Grid item>
                        <LabeledBox label="Author Information">
                            <Button variant="contained" color="secondary" onClick={this.open_author_editor}>
                                Edit
                                <Icon>edit</Icon>
                            </Button>
                            <Typography variant="h2">{ author.name }</Typography>
                            <AuthorLinks links={author.links} />
                        </LabeledBox>
                    </Grid>
                    <Grid item>
                        <div id="actions" className={classes.box}>
                            <Button variant="contained" color="secondary">
                                Add Article
                                <Icon>add</Icon>
                            </Button>
                            <Button variant="contained" color="secondary">
                                Add Preexisting Article
                                <Icon>add</Icon>
                            </Button>
                        </div>
                    </Grid>
                    <Grid item>
                        { articles.map(a => <ArticleLI key={a.id} {...a} />) }
                    </Grid>
    			</Grid>

                <AuthorEditor open={edit_author_modal_open} onClose={this.close_author_editor} />
            </div>
		)
	}
}

export default withRouter(withStyles(styles)(AuthorPage));
