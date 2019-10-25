import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

import Typography from '@material-ui/core/Typography';
import {Grid, Button, Icon, IconButton,
        Popover, Snackbar, Tooltip} from '@material-ui/core';

import AuthorEditor from '../components/AuthorEditor.jsx';
import ArticleEditor from '../components/ArticleEditor.jsx';
import ArticleLI from '../components/ArticleLI.jsx';
import ArticleList from '../components/ArticleList.jsx';
import Loader from '../components/shared/Loader.jsx';
import AuthorArticleList from '../components/AuthorArticleList.jsx';
import AuthorLinks from '../components/AuthorLinks.jsx';
import LabeledBox from '../components/shared/LabeledBox.jsx';
import ArticleSelector from '../components/curateform/ArticleSelector.jsx';

import { includes, merge } from 'lodash'

import { json_api_req, randomId, send_height_to_parent } from '../util/util.jsx'

import C from '../constants/constants';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        paddingTop: 10,
        flexGrow: 1
    },
    cardColumn: {
        maxWidth: C.CARD_COL_WIDTH + 'px'
    },
    authorEditButton: {
        position: 'absolute',
        top: 0,
        right: 0
    },
    box: {
        padding: theme.spacing(2),
    },
    leftIcon: {
        marginRight: theme.spacing(1)
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
            new_articles: [],
            author: null,
            loading: false,
            edit_author_modal_open: false,
            edit_article_modal_open: false,
            editing_article_id: null,
            popperAnchorEl: null,
            author_creator_showing: false,
            snack_message: null
        }

        this.open_author_editor = this.toggle_author_editor.bind(this, true)
        this.close_author_editor = this.toggle_author_editor.bind(this, false)
        this.open_article_editor = this.toggle_article_editor.bind(this, true)
        this.close_article_editor = this.toggle_article_editor.bind(this, false)
        this.author_updated = this.author_updated.bind(this)
        this.handle_edit = this.handle_edit.bind(this)
        this.create_new_article = this.create_new_article.bind(this)
        this.link_existing_article = this.link_existing_article.bind(this)
        this.open_preexisting_popper = this.open_preexisting_popper.bind(this)
        this.close_preexisting_popper = this.close_preexisting_popper.bind(this)
        this.article_updated = this.article_updated.bind(this)
        this.show_snack = this.show_snack.bind(this)
        this.close_snack = this.close_snack.bind(this)
    }

    componentDidMount() {
        this.fetch_author()
    }

    componentWillUnmount() {
    }

    show_snack(message) {
        this.setState({snack_message: message})
    }

    close_snack() {
        this.setState({snack_message: null})
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
        let {new_articles, author} = this.state
        let now = new Date()
        let data = {
            title: `${C.PLACEHOLDER_TITLE_PREFIX}${randomId(15)}`,
            authors: [author.id],
            article_type: 'ORIGINAL',
            year: now.getFullYear(),
            key_figures: [],
            commentaries: [],
            is_live: false
        }
        this.setState({loading: true}, () => {
            json_api_req('POST', `/api/articles/create/`, data, cookies.get('csrftoken'), (res) => {
                new_articles.unshift(res) // Add object to array, though will initially not render since is_live=false
                this.setState({new_articles}, () => {
                    this.handle_edit(res)
                })
            }, (err) => {
                console.error(err)
                this.setState({loading: false})
            })
        })
    }

    handle_edit(a) {
        this.setState({editing_article_id: a.id, edit_article_modal_open: true, loading: false})
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

    link_existing_article(a) {
        this.update_linkage(a, true)
    }

    fetch_author() {
        let {cookies} = this.props
        let slug = this.slug()
        if (slug != null) {
            json_api_req('GET', `/api/authors/${slug}`, {}, cookies.get('csrftoken'), (res) => {
                console.log(res)
                this.setState({author: res})
            }, (e) => {
                window.location.replace('/app/author/create')
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

    render_position() {
        let {author} = this.state
        let position = author.position_title
        if (author.affiliations != null) position += ', '
        return position
    }

	render() {
        const {classes, user_session} = this.props
        const {
            new_articles,
            author,
            edit_author_modal_open,
            edit_article_modal_open,
            editing_article_id,
            popperAnchorEl,
            author_creator_showing,
            articles_loading,
            snack_message,
            loading,
        } = this.state

        if (author == null) {
            return <Loader />
        } else if (!author.is_activated) {
            return <Typography variant="h3" align="center" style={{marginTop: 30}}>This user has not created an author profile yet</Typography>
        }

        const article_ids = articles.map((a) => a.id)
        const add_preexisting_open = Boolean(popperAnchorEl)
        const editable = this.editable()
        const slug = this.slug()

		return (
            <div className={classes.root}>
    			<Grid container justify="center" className="AuthorPage">
                    <Grid item>
                        <div className={classes.cardColumn}>
                            <div style={{position: 'relative'}}>
                                <span hidden={!editable}>
                                    <Button variant="outlined" color="secondary"
                                            className={classes.authorEditButton}
                                            onClick={this.open_author_editor}>
                                        <Icon className={classes.leftIcon}>edit</Icon>
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
                                <Button variant="contained" color="secondary" onClick={this.create_new_article} disabled={loading}>
                                    <Icon className={classes.leftIcon}>add</Icon>
                                    Add Article
                                </Button>
                                <Button variant="outlined"
                                        color="secondary"
                                        aria-owns={add_preexisting_open ? 'add_preexisting_popper' : undefined}
                                        onClick={this.open_preexisting_popper}
                                        style={{marginLeft: 10}}>
                                    <Icon className={classes.leftIcon}>link</Icon>
                                    Link Existing Article
                                </Button>
                                <Tooltip title="Link an article to your author page that is already in our database (for example, an article that has already been added by one of your co-authors).">
                                    <IconButton aria-label="Info" style={{cursor: 'default'}} disableRipple>
                                        <Icon>info</Icon>
                                    </IconButton>
                                </Tooltip>
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
                        </div>

                        <AuthorArticleList author={author} slug={slug} new_articles={new_articles}/>

                    </Grid>
    			</Grid>


                <AuthorEditor author={author}
                              open={edit_author_modal_open}
                              onClose={this.close_author_editor}
                              onAuthorUpdate={this.author_updated}
                              onShowSnack={this.show_snack} />

                <ArticleEditor article_id={editing_article_id}
                        open={edit_article_modal_open}
                        onUpdate={this.article_updated}
                        onClose={this.close_article_editor} />

                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={snack_message != null}
                  autoHideDuration={3000}
                  onClose={this.close_snack}
                  message={snack_message}
                />
            </div>
		)
	}
}

AuthorPage.defaultProps = {
    user_session: {},
}

export default withRouter(withCookies(withStyles(styles)(AuthorPage)));
