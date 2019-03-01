import React from 'react';
import { withRouter } from 'react-router-dom';

import qs from 'query-string';

import { Link } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import {List, Grid, Button, Icon,
        Popover} from '@material-ui/core';

import AuthorEditor from '../components/AuthorEditor.jsx';
import ArticleEditor from '../components/ArticleEditor.jsx';
import ArticleLI from '../components/ArticleLI.jsx';
import Loader from '../components/shared/Loader.jsx';
import AuthorLinks from '../components/AuthorLinks.jsx';
import LabeledBox from '../components/shared/LabeledBox.jsx';

import ArticleSelector from '../components/curateform/ArticleSelector.jsx';

import { withStyles } from '@material-ui/core/styles';

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
            author: null,
            articles: [],
            edit_author_modal_open: false,
            edit_article_modal_open: false,
            editing_article_id: null,
            popperAnchorEl: null
        }

        this.open_author_editor = this.toggle_author_editor.bind(this, true)
        this.close_author_editor = this.toggle_author_editor.bind(this, false)
        this.open_article_editor = this.toggle_article_editor.bind(this, true)
        this.close_article_editor = this.toggle_article_editor.bind(this, false)
        this.handle_edit = this.handle_edit.bind(this)
        this.handle_unlink = this.handle_unlink.bind(this)
        this.add_article = this.add_article.bind(this)
        this.add_existing_article = this.add_existing_article.bind(this)
        this.open_preexisting_popper = this.open_preexisting_popper.bind(this)
        this.close_preexisting_popper = this.close_preexisting_popper.bind(this)
    }

    componentDidMount() {
        this.fetch_author_then_articles()
    }

    componentWillUnmount() {
    }

    slug() {
        let {match} = this.props
        return match.params.slug || null
    }

    add_article() {
        let new_article = {
            id: 'NEW'
        }
        this.handle_edit(new_article)
    }

    add_existing_article(a) {
        console.log(a)
    }

    handle_edit(a) {
        this.setState({editing_article_id: a.id, edit_article_modal_open: true})
    }

    handle_unlink(a) {
        console.log('unlink')
        console.log(a)
    }

    fetch_author_then_articles() {
        let slug = this.slug()
        if (slug != null) {
            fetch(`/api/authors/${slug}`).then(res => res.json()).then((res) => {
                console.log(res)
                this.setState({author: res}, this.fetch_articles)
            })
        }
    }

    fetch_articles() {
        const ALL = true
        let {match} = this.props
        let {author} = this.state
        if (ALL) {
            // Testing only
            fetch(`/api/articles/`).then(res => res.json()).then((res) => {
                console.log(res)
                this.setState({articles: res})
            })
        } else {
            let slug = this.slug()
            if (slug != null) {
                fetch(`/api/author/${slug}/articles/`).then(res => res.json()).then((res) => {
                    console.log(res)
                    this.setState({articles: res})
                })
            }
        }
    }

    toggle_author_editor(open) {
        this.setState({edit_author_modal_open: open})
    }

    toggle_article_editor(open) {
        this.setState({edit_article_modal_open: open})
    }

    open_preexisting_popper = event => {
        this.setState({
          popperAnchorEl: event.currentTarget,
        });
    };

    close_preexisting_popper = () => {
        this.setState({
          popperAnchorEl: null,
        });
    };

	render() {
        let {classes} = this.props
		let {articles, author, edit_author_modal_open, edit_article_modal_open,
            editing_article_id, popperAnchorEl} = this.state
        if (author == null) return <Loader />
        const add_preexisting_open = Boolean(popperAnchorEl)
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
                                <span className={classes.title}>{ author.position_title },</span>
                                <span className={classes.affiliation}>{ author.affiliations }</span>
                            </Typography>
                            <AuthorLinks links={author.links} />
                        </LabeledBox>
                    </Grid>
                    <Grid item xs={10}>
                        <div id="actions" className={classes.box}>
                            <Button variant="contained" color="secondary" onClick={this.add_article}>
                                Add Article
                                <Icon>add</Icon>
                            </Button>
                            <Button variant="contained"
                                    color="secondary"
                                    aria-owns={add_preexisting_open ? 'add_preexisting_popper' : undefined}
                                    onClick={this.open_preexisting_popper}
                                    style={{marginLeft: 10}}>
                                Add Preexisting Article
                                <Icon>add</Icon>
                            </Button>
                            <Popover
                              id="add_preexisting_popper"
                              open={add_preexisting_open}
                              anchorEl={popperAnchorEl}
                              onClose={this.close_preexisting_popper}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                              }}
                              transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                              }}
                            >
                                <div style={{width: "400px", height: "250px", padding: 14 }}>
                                  <ArticleSelector onChange={this.add_existing_article} />
                                </div>
                            </Popover>
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
        const ST = {
            marginRight: 10
        }
        return (
            <div key={article.id} className="ArticleWithActions">
                <ArticleLI article={article} admin={false} />
                <div className="ArticleActions">
                    <Button variant="outlined" color="secondary" onClick={this.edit} style={ST}>
                        Edit
                        <Icon>edit</Icon>
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={this.unlink} style={ST}>
                        Unlink
                        <Icon>link_off</Icon>
                    </Button>
                </div>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(AuthorPage));
