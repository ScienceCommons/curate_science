import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

import qs from 'query-string';

import { Link } from "react-router-dom";

import {Paper, List, ListItem, ListItemText, Grid, Button, Icon, Fab,
        Popover, Typography} from '@material-ui/core';

import ArticleEditor from '../components/ArticleEditor.jsx';
import Loader from '../components/shared/Loader.jsx';

import {json_api_req} from '../util/util.jsx'

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
        let {cookies, author} = this.props
        let {articles} = this.state
        let now = new Date()
        let date_str = now.toLocaleDateString() + ' ' + now.toLocaleTimeString()
        let data = {
            title: `New untitled article created at ${date_str}`,
            authors: [],
            article_type: 'ORIGINAL',
            year: now.getFullYear(),
            key_figures: [],
            commentaries: []
        }
        json_api_req('POST', `/api/articles/create/`, data, cookies.get('csrftoken'), (res) => {
            articles.unshift(res) // Add object to array
            this.setState({articles: articles})
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
            <div className={classes.root}>
                <Grid container justify="center">

                    <Grid item xs={8}>
                        <Typography variant="h2">Manage articles (admin only)</Typography>

                        <Typography variant="subtitle1">
                            Admins can manage all articles below, or create new ones.
                        </Typography>

                        <br/>

                        <Paper style={{marginTop: 15}}>
                			<List>
                                { articles.map((a) => {
                                    return (
                                        <ListItem button key={a.id} onClick={this.handle_edit.bind(this, a)}>
                                            <ListItemText primary={a.title} secondary={a.author_list} />
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </Paper>


                    </Grid>
                    <Grid item xs={8} justifyContent="center">
                        <Fab color="primary" variant="round" className={classes.fab} onClick={this.create_new_article}><Icon>add</Icon></Fab>
                    </Grid>
                </Grid>

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
