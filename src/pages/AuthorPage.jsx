import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

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

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import {merge} from 'lodash'

import {json_api_req, simple_api_req, randomId} from '../util/util.jsx'

import C from '../constants/constants';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        paddingTop: 10,
        flexGrow: 1
    },
    cardColumn: {
        width: '650px'
    },
    articleList: {
        marginTop: '10px'
    },
    authorEditButton: {
        position: 'absolute',
        top: 0,
        right: 0
    },
    box: {
        padding: theme.spacing.unit * 2,
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 14,
        textTransform: 'none'
    },
    affiliation: {
        fontStyle: 'italic',
        paddingLeft: 4
    },
    name: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4
    }
})

class AuthorPage extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            author: null,
            articles: [],
            articles_loading: false,
            edit_author_modal_open: false,
            edit_article_modal_open: false,
            editing_article_id: null,
            popperAnchorEl: null,
            author_creator_showing: false,
            view_figure_thumb: null,
            view_figure_full: null,
            // Lightbox / gallery state
            gallery_images: [],
            gallery_showing: false,
            gallery_index: 0
        }

        this.open_author_editor = this.toggle_author_editor.bind(this, true)
        this.close_author_editor = this.toggle_author_editor.bind(this, false)
        this.open_article_editor = this.toggle_article_editor.bind(this, true)
        this.close_article_editor = this.toggle_article_editor.bind(this, false)
        this.author_updated = this.author_updated.bind(this)
        this.handle_edit = this.handle_edit.bind(this)
        this.handle_delete = this.handle_delete.bind(this)
        this.unlink = this.unlink.bind(this)
        this.create_new_article = this.create_new_article.bind(this)
        this.link_existing_article = this.link_existing_article.bind(this)
        this.open_preexisting_popper = this.open_preexisting_popper.bind(this)
        this.close_preexisting_popper = this.close_preexisting_popper.bind(this)
        this.article_updated = this.article_updated.bind(this)
        this.show_figure = this.show_figure.bind(this)
    }

    componentDidMount() {
        this.fetch_author_then_articles()
    }

    componentWillUnmount() {
    }

    editable() {
        // Show edit functions if admin or user-owned author page
        let {user_session} = this.props
        let {author} = this.state
        let admin = user_session.admin
        let me = author != null && user_session.author != null && user_session.author.id == author.id
        return admin || me
    }

    slug() {
        let {match} = this.props
        return match.params.slug || null
    }

    create_new_article() {
        // Create new placeholder article, then open editor
        let {cookies} = this.props
        let {articles, author} = this.state
        let now = new Date()
        let date_str = now.toLocaleDateString() + ' ' + now.toLocaleTimeString()
        let data = {
            title: `${C.PLACEHOLDER_TITLE_PREFIX}${randomId(15)}`,
            authors: [author.id],
            article_type: 'ORIGINAL',
            year: now.getFullYear(),
            key_figures: [],
            commentaries: [],
            is_live: false
        }
        json_api_req('POST', `/api/articles/create/`, data, cookies.get('csrftoken'), (res) => {
            articles.unshift(res) // Add object to array, though will initially not render since is_live=false
            this.setState({articles: articles}, () => {
                this.handle_edit(res)
            })
        }, (err) => {
            console.error(err)
        })
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

    handle_edit(a) {
        this.setState({editing_article_id: a.id, edit_article_modal_open: true})
    }

    update_linkage(a, linked) {
        let {cookies} = this.props
        let {author, articles} = this.state
        if (author != null) {
            // Update author to remove article_id from articles member
            let data = [
                {
                    article: a.id,
                    linked: linked
                }
            ]
            json_api_req('POST', `/api/authors/${this.slug()}/articles/linkage/`, data, cookies.get('csrftoken'), (res) => {
                if (linked) {
                    // Get full article object to add to list
                    json_api_req('GET', `/api/articles/${a.id}/`, {}, null, (res) => {
                        articles.unshift(res) // Add object to array
                        this.setState({articles: articles, popperAnchorEl: null})
                    }, (err) => {
                        console.error(err)
                    })
                } else {
                    // Remove unlinked from list
                    articles = articles.filter(article => article.id != a.id)
                    this.setState({articles: articles})
                }
            })
        }
    }

    unlink(a) {
        this.update_linkage(a, false)
    }

    link_existing_article(a) {
        this.update_linkage(a, true)
    }

    fetch_author_then_articles() {
        let {cookies} = this.props
        let slug = this.slug()
        if (slug != null) {
            json_api_req('GET', `/api/authors/${slug}`, {}, cookies.get('csrftoken'), (res) => {
                console.log(res)
                this.setState({author: res}, this.fetch_articles)
            }, (e) => {
                window.location.replace('/app/author/create')
            })
        }
    }

    fetch_articles() {
        let {match, cookies} = this.props
        let {author} = this.state
        let slug = this.slug()
        if (slug != null) {
            this.setState({articles_loading: true}, () => {
                json_api_req('GET', `/api/authors/${slug}/articles/`, {}, cookies.get('csrftoken'), (res) => {
                    this.setState({articles: res, articles_loading: false})
                })
            })
        }
    }

    author_updated(author_updates) {
        let {author} = this.state
        merge(author, author_updates)
        this.setState({author}, () => {
            this.close_author_editor()
        })
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

    toggle_author_editor(open) {
        this.setState({edit_author_modal_open: open})
    }

    toggle_article_editor(open) {
        let st = {edit_article_modal_open: open}
        if (!open) st.editing_article_id = null
        this.setState(st)
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

    show_figure(fig) {
        // Currently shows only one at a time
        this.setState({gallery_images: [fig.image], gallery_index: 0, gallery_showing: true})
    }

    sorted_visible_articles() {
        let {articles} = this.state
        let sorted_visible = articles.filter(a => a.is_live)
        sorted_visible.sort((a, b) => {
            let aval = a.in_press ? 3000 : a.year
            let bval = b.in_press ? 3000 : b.year
            if (bval > aval) return 1
            else if (bval < aval) return -1
            else return 0
        })
        return sorted_visible
    }

    render_position() {
        let {author} = this.state
        let position = author.position_title
        if (author.affiliations != null) position += ', '
        return position
    }

	render() {
        let {classes, user_session} = this.props
		let {articles, author, edit_author_modal_open, edit_article_modal_open,
            editing_article_id, popperAnchorEl, author_creator_showing,
            view_figure_thumb, view_figure_full, articles_loading, gallery_showing,
            gallery_images, gallery_index} = this.state
        if (author == null) return <Loader />
        let article_ids = articles.map((a) => a.id)
        const add_preexisting_open = Boolean(popperAnchorEl)
        let editable = this.editable()
        let gallery
        if (gallery_showing && gallery_images.length > 0) gallery = (
            <Lightbox
                mainSrc={gallery_images[gallery_index]}
                nextSrc={gallery_images[(gallery_index + 1) % gallery_images.length]}
                prevSrc={gallery_images[(gallery_index + gallery_images.length - 1) % gallery_images.length]}
                onCloseRequest={() => this.setState({ gallery_showing: false })}
                onMovePrevRequest={() =>
                  this.setState({
                    gallery_index: (gallery_index + gallery_images.length - 1) % gallery_images.length,
                  })
                }
                onMoveNextRequest={() =>
                  this.setState({
                    gallery_index: (gallery_index + 1) % gallery_images.length,
                  })
                }
              />
        )
		return (
            <div className={classes.root}>
    			<Grid container justify="center" spacing={24} className="AuthorPage">
                    <Grid item lg={12} className={classes.cardColumn}>
                        <div style={{position: 'relative'}}>
                            <span hidden={!editable}>
                                <Button variant="contained" color="secondary"
                                        className={classes.authorEditButton}
                                        onClick={this.open_author_editor}>
                                    <Icon>edit</Icon>
                                    Edit
                                </Button>
                            </span>
                            <Typography variant="h2" className={classes.name}>{ author.name }</Typography>
                            <Typography variant="h4" className={classes.subtitle}>
                                <span className={classes.title}>{ this.render_position() }</span>
                                <span className={classes.affiliation}>{ author.affiliations }</span>
                            </Typography>
                            <AuthorLinks links={author.profile_urls} />
                        </div>

                        <div id="actions" className={classes.box} hidden={!editable}>
                            <Button variant="contained" color="secondary" onClick={this.create_new_article}>
                                <Icon>add</Icon>
                                Add Article
                            </Button>
                            <Button variant="contained"
                                    color="secondary"
                                    aria-owns={add_preexisting_open ? 'add_preexisting_popper' : undefined}
                                    onClick={this.open_preexisting_popper}
                                    style={{marginLeft: 10}}>
                                <Icon>add</Icon>
                                Add Preexisting Article
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
                                  <ArticleSelector onChange={this.link_existing_article} author_articles={article_ids} />
                                </div>
                            </Popover>
                        </div>

                        <div className={classes.articleList}>
                            { this.sorted_visible_articles().map(a => <ArticleWithActions key={a.id}
                                                    article={a}
                                                    editable={editable}
                                                    onEdit={this.handle_edit}
                                                    onDelete={this.handle_delete}
                                                    onUnlink={this.unlink}
                                                    onFigureClick={this.show_figure}
                                                    admin={user_session.admin} />) }
                            { articles_loading ? <Loader /> : null }
                        </div>

                    </Grid>
    			</Grid>

                { gallery }

                <AuthorEditor author={author}
                              open={edit_author_modal_open}
                              onClose={this.close_author_editor}
                              onAuthorUpdate={this.author_updated} />
                <ArticleEditor article_id={editing_article_id}
                        open={edit_article_modal_open}
                        onUpdate={this.article_updated}
                        onClose={this.close_article_editor} />
            </div>
		)
	}
}

class ArticleWithActions extends React.Component {
    constructor(props) {
        super(props);

        this.edit = this.edit.bind(this)
        this.unlink = this.unlink.bind(this)
        this.delete = this.delete.bind(this)
        this.show_figure = this.show_figure.bind(this)
    }

    edit() {
        let {article} = this.props
        this.props.onEdit(article)
    }

    delete() {
        let {article} = this.props
        this.props.onDelete(article)
    }

    unlink() {
        let {article} = this.props
        this.props.onUnlink(article)
    }

    show_figure(fig) {
        this.props.onFigureClick(fig)
    }

    render() {
        let {article, admin, editable} = this.props
        const ST = {
            marginRight: 10
        }
        const DELETE_ST = {
            borderColor: 'red',
            color: 'red'
        }
        return (
            <div key={article.id} className="ArticleWithActions">
                <ArticleLI article={article} admin={false} onFigureClick={this.show_figure} />
                <div className="ArticleActions">
                    <span hidden={!editable}>
                        <Button variant="outlined" size="small" color="secondary" onClick={this.edit} style={ST}>
                            <Icon>edit</Icon>
                            Edit
                        </Button>
                    </span>
                    <span hidden={!editable}>
                        <Button variant="outlined" size="small" color="secondary" onClick={this.unlink} style={ST}>
                            <Icon>link_off</Icon>
                            Unlink
                        </Button>
                    </span>
                    <span hidden={!admin}>
                        <Button variant="outlined" size="small" onClick={this.delete} style={DELETE_ST}>
                            <Icon color="inherit">delete</Icon>
                            Delete
                        </Button>
                    </span>
                </div>
            </div>
        )
    }
}

ArticleWithActions.defaultProps = {
    editable: false
}

export default withRouter(withCookies(withStyles(styles)(AuthorPage)));
