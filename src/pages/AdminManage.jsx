import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

import qs from 'query-string';

import { Link } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import {Paper, List, ListItem, ListItemText, Grid, Button, Icon,
        Popover} from '@material-ui/core';

import ArticleEditor from '../components/ArticleEditor.jsx';
import Loader from '../components/shared/Loader.jsx';

import {json_api_req} from '../util/util.jsx'

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

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
        this.add_article = this.add_article.bind(this)
    }

    componentDidMount() {
        this.fetch_articles()
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
                <Typography variant="h1">Manage articles (admin only)</Typography>

                <Button color="primary" variant="contained">Create</Button>

                <Paper>
        			<List>
                        { articles.map((a) => {
                            return <ListItem button key={a.id}><ListItemText primary={a.title} /></ListItem>
                        })}
                    </List>
                </Paper>

                <ArticleEditor article_id={editing_article_id} open={edit_article_modal_open} onClose={this.close_article_editor} />
            </div>
		)
	}
}

export default withRouter(withCookies(withStyles(styles)(AdminManage)));
