import React from 'react';
import { withRouter } from 'react-router-dom';

import qs from 'query-string';

import { Link } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import {List, Grid, Button, Icon} from '@material-ui/core';

import AuthorEditor from '../components/AuthorEditor.jsx';
import ArticleEditor from '../components/ArticleEditor.jsx';
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
    },
    subtitle: {
        textAlign: 'center'
    },
    affiliation: {
        fontStyle: 'italic',
        paddingLeft: 4
    },
    name: {
        textAlign: 'center'
    }
})

class AuthorPage extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	articles: [],
            author: DUMMY_AUTHOR,
            searched: false,
            edit_author_modal_open: false,
            edit_article_modal_open: false,
            editing_article_id: null
        }

        this.open_author_editor = this.toggle_author_editor.bind(this, true)
        this.close_author_editor = this.toggle_author_editor.bind(this, false)
        this.open_article_editor = this.toggle_article_editor.bind(this, true)
        this.close_article_editor = this.toggle_article_editor.bind(this, false)
        this.handle_edit = this.handle_edit.bind(this)
        this.handle_unlink = this.handle_unlink.bind(this)
    }

    componentDidMount() {
        this.fetch_articles()
    }

    componentWillUnmount() {
    }

    handle_edit(a) {
        this.setState({editing_article_id: a.id, edit_article_modal_open: true})
    }

    handle_unlink(a) {
        console.log('unlink')
        console.log(a)
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

    toggle_article_editor(open) {
        this.setState({edit_article_modal_open: open})
    }

	render() {
        let {classes} = this.props
		let {articles, searched, author, edit_author_modal_open, edit_article_modal_open,
            editing_article_id} = this.state
		return (
            <div className={classes.root}>
    			<Grid container justify="center" spacing={24}>
                    <Grid item xs={10}>
                        <LabeledBox label="Author Information">
                            <Button variant="contained" color="secondary" onClick={this.open_author_editor}>
                                Edit
                                <Icon>edit</Icon>
                            </Button>
                            <Typography variant="h2" className={classes.name}>{ author.name }</Typography>
                            <Typography variant="h4" className={classes.subtitle}>
                                <span className={classes.title}>{ author.title },</span>
                                <span className={classes.affiliation}>{ author.affiliation }</span>
                            </Typography>
                            <AuthorLinks links={author.links} />
                        </LabeledBox>
                    </Grid>
                    <Grid item xs={10}>
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
                    <Grid item xs={10}>
                        { articles.map(a => <ArticleWithActions key={a.id} article={a} onEdit={this.handle_edit} onUnlink={this.handle_unlink} />) }
                    </Grid>
    			</Grid>

                <AuthorEditor author={author} open={edit_author_modal_open} onClose={this.close_author_editor} />
                <ArticleEditor article_id={editing_article_id} open={edit_article_modal_open} onClose={this.close_article_editor} />
            </div>
		)
	}
}

class ArticleWithActions extends React.Component {
    constructor(props) {
        super(props);

        this.edit = this.edit.bind(this)
        this.unlink = this.unlink.bind(this)
    }

    edit() {
        let {article} = this.props
        this.props.onEdit(article)
    }

    unlink() {
        let {article} = this.props
        this.props.onUnlink(article)
    }

    render() {
        let {article} = this.props
        return (
            <div key={article.id} className="ArticleWithActions">
                <ArticleLI {...article} admin={false} />
                <div className="ArticleActions">
                    <Button variant="outlined" color="secondary" onClick={this.edit}>
                        Edit
                        <Icon>edit</Icon>
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={this.unlink}>
                        Unlink
                        <Icon>link_off</Icon>
                    </Button>
                </div>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(AuthorPage));
