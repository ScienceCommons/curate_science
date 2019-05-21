import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

import qs from 'query-string';
import C from '../constants/constants';

import { Link } from "react-router-dom";

import {Paper, List, ListItem, ListItemText, Grid, Button, Icon, Fab,
        Popover, Typography, IconButton, ListItemSecondaryAction} from '@material-ui/core';

import ArticleEditor from '../components/ArticleEditor.jsx';
import Loader from '../components/shared/Loader.jsx';

import {json_api_req, simple_api_req, randomId} from '../util/util.jsx'

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    fab: {
        margin: 10,
    }
})

class AdminManage extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            articles: [],
            edit_article_modal_open: false,
        }

        this.open_article_editor = this.toggle_article_editor.bind(this, true)
        this.close_article_editor = this.toggle_article_editor.bind(this, false)
        this.create_new_article = this.create_new_article.bind(this)
        this.article_updated = this.article_updated.bind(this)
    }

    componentDidMount() {
        this.fetch_articles()
    }

    componentWillUnmount() {
    }

    article_updated(article) {
        let {articles} = this.state
        for (let i=0; i<articles.length; i++) {
            if (articles[i].id == article.id) {
                // Replace with updated object
                articles[i] = article
            }
        }
        this.setState({articles, edit_article_modal_open: false, editing_article_id: null})
    }

    create_new_article() {
        let {cookies} = this.props
        let {articles} = this.state
        let now = new Date()
        let data = {
            title: `${C.PLACEHOLDER_TITLE_PREFIX}${randomId(15)}`,
            authors: [],
            article_type: 'ORIGINAL',
            year: now.getFullYear(),
            key_figures: [],
            commentaries: [],
            is_live: false
        }
        json_api_req('POST', `/api/articles/create/`, data, cookies.get('csrftoken'), (res) => {
            articles.unshift(res) // Add object to array
            this.setState({articles: articles, editing_article_id: res.id, edit_article_modal_open: true})
        }, (err) => {
            console.error(err)
        })
    }

    slug() {
        let {match} = this.props
        return match.params.slug || null
    }

    handle_edit(a) {
        this.setState({editing_article_id: a.id, edit_article_modal_open: true})
    }

    handle_delete(a) {
        let pk = a.id
        let {cookies} = this.props
        let {articles} = this.state
        simple_api_req('DELETE', `/api/articles/${pk}/delete/`, {}, cookies.get('csrftoken'), () => {
            articles = articles.filter(article => article.id != a.id)
            this.setState({articles: articles})
        }, (err) => {
            console.error(err)
        })
    }

    fetch_articles() {
        let {match, cookies} = this.props
        json_api_req('GET', `/api/articles/`, {}, cookies.get('csrf_token'), (res) => {
            console.log(res)
            this.setState({articles: res})
        })
    }

    toggle_article_editor(open) {
        this.setState({edit_article_modal_open: open})
    }

	render() {
        let {classes} = this.props
		let {articles, edit_article_modal_open,
            editing_article_id} = this.state
		return (
            <div className="CenteredContent">
                <Typography variant="h2">Manage articles (admin only)</Typography>

                <Typography variant="subtitle1">
                    Admins can manage all articles below, or create new ones.
                </Typography>

                <br/>

                <Paper style={{marginTop: 15}}>
        			<List>
                        { articles.map((a) => {
                            let title = a.title
                            if (!a.is_live) title = `[NOT LIVE] ${title}`
                            return (
                                <ListItem button key={a.id} onClick={this.handle_edit.bind(this, a)}>
                                    <ListItemText primary={title} secondary={a.author_list} />
                                    <ListItemSecondaryAction>
                                        <IconButton aria-label="Delete" onClick={this.handle_delete.bind(this, a)}>
                                            <Icon>delete</Icon>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        })}
                    </List>
                </Paper>

                <div align="right">
                    <Fab color="primary" variant="round" className={classes.fab} onClick={this.create_new_article}><Icon>add</Icon></Fab>
                </div>

                <ArticleEditor
                    article_id={editing_article_id}
                    open={edit_article_modal_open}
                    onUpdate={this.article_updated}
                    onClose={this.close_article_editor} />
            </div>
		)
	}
}

export default withRouter(withCookies(withStyles(styles)(AdminManage)));
