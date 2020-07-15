import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

import Typography from '@material-ui/core/Typography';
import {
    Grid,
    Button,
    Icon,
    IconButton,
    InputAdornment,
    Popover,
    Snackbar,
    TextField,
    Tooltip,
    Menu,
    MenuItem
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AuthorEditor from '../components/AuthorEditor.jsx';
import ArticleEditor from '../components/ArticleEditor.jsx';
import ArticleList from '../components/ArticleList.jsx';
import Loader from '../components/shared/Loader.jsx';
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
        visibility: 'hidden',
        position: 'absolute',
        top: 0,
        right: 0
    },
    box: {
        paddingBottom: theme.spacing(2),
        paddingTop: theme.spacing(2),
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
    },
    searchFilter: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        color: '#DCDCDC',
    },
    authorInformation: {
        position: 'relative',
        '&:hover $authorEditButton': {
            visibility: 'visible'
        }
    },
    menuIcon: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        float: 'right'
    },
    menuItem: {
        margin: 0,
        padding: 0,
        border: 'solid',
        borderColor: '#999',
        borderWidth: '1.5px',
    },          
    actions: {
        paddingTop: theme.spacing(5),
    }
})

const ActionButton = ({ iconLeft, iconRight, label, color }) => {
    color = color || 'primary'
    return (
        <Button
        variant="outlined"
        size="medium"
        color={color}
        style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            padding: '0.5rem 0.5rem',
            border: 'none',
            color: '#999',
        }}
        >
            <Icon>{iconLeft}</Icon>
            <span style={{ marginLeft: '0.5rem' }}>
                {label}
            </span>
                { iconRight === null ? null :
                    <Tooltip title="Link an article to your author page that is already in our database (for example, an article that has already been added by one of your co-authors)."> 
                        <Icon style={{marginLeft:'0.6rem'}}>{iconRight}</Icon>
                    </Tooltip>
                }
        </Button>
    )
}

class AuthorPage extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            author: null,
            articles: [],
            articles_loading: false,
            loading: false,
            edit_author_modal_open: false,
            edit_article_modal_open: false,
            editing_article_id: null,
            popperAnchorEl: null,
            menuAnchorEl: null,
            author_creator_showing: false,
            snack_message: null,
            search_filter: '',
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
        this.open_menu = this.open_menu.bind(this)
        this.close_menu = this.close_menu.bind(this)
        this.article_updated = this.article_updated.bind(this)
        this.show_snack = this.show_snack.bind(this)
        this.close_snack = this.close_snack.bind(this)
        this.update_articles = this.update_articles.bind(this)
        this.update_search_filter = this.update_search_filter.bind(this)
        this.focus_on_filter_box = this.focus_on_filter_box.bind(this)
    }

    componentDidMount() {
        if (this.props.embedded) {
            document.body.style.overflow = 'hidden'
        }

        document.addEventListener('keydown', this.focus_on_filter_box);
        this.fetch_author_then_articles()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.match.params.slug !== prevState.current_slug){
            const current_slug = nextProps.match.params.slug
            return { current_slug }
        }
        return null;
    }

    focus_on_filter_box(event) {
        // Focus of filter box when `Shift + /` is pressed
        if (event.shiftKey && event.keyCode === 191) {
            // Ignore the combo if the user is inputting text
            const target_tag_name = (event.target.nodeType == 1) ? event.target.nodeName.toUpperCase() : ''
            const in_text_field = /INPUT|SELECT|TEXTAREA/.test(target_tag_name)
            if (in_text_field) return

            event.preventDefault()
            this.filter_box.focus()
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.slug !== this.state.current_slug) {
            this.fetch_author_then_articles()
        }
    }

    componentWillUnmount() {
      document.removeEventListener('keydown', this.focus_on_filter_box);
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
        let {articles, author} = this.state
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
                articles.unshift(res) // Add object to array, though will initially not render since is_live=false
                this.setState({articles: articles}, () => {
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
        let {match, cookies, location} = this.props
        let {author} = this.state
        let slug = this.slug()
        if (slug != null) {
            this.setState({articles_loading: true}, () => {
                json_api_req('GET', `/api/authors/${slug}/articles/`, {}, cookies.get('csrftoken'), (res) => {
                    this.setState({articles: res, articles_loading: false}, () => {
                        // If anchor in URI, scroll here now that we have articles loaded
                        if (location.hash != null) {
                            window.location.hash = ''  // Need to change to ensure scroll
                            window.location.hash = location.hash
                        }
                        send_height_to_parent()
                    })
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

    open_menu = event => {
        this.setState({
          menuAnchorEl: event.currentTarget,
        });
    };

    close_menu = () => {
        this.setState({
          menuAnchorEl: null,
        });
    };

    update_search_filter(event) {
        this.setState({ search_filter: event.target.value })
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

    update_articles(articles) {
        let { author } = this.state
        // Remove any articles that have been unlinked from the author
        articles = articles.filter(article => includes(article.authors, author.id))
        this.setState({ articles: articles })
    }

    render() {
        let {classes, embedded, user_session} = this.props
        let {articles, author, edit_author_modal_open, edit_article_modal_open,
            editing_article_id, popperAnchorEl, author_creator_showing,
            articles_loading, menuAnchorEl,
            snack_message, loading} = this.state
        if (author == null) return <Loader />
        else if (!author.is_activated) return <Typography variant="h3" align="center" style={{marginTop: 30}}>This user has not created an author profile yet</Typography>
        let article_ids = articles.map((a) => a.id)
        const add_preexisting_open = Boolean(popperAnchorEl)
        const add_menu_open = Boolean(menuAnchorEl)
        let editable = this.editable()

        const search_filter = (
            <TextField
                placeholder="Filter articles"
                value={this.state.search_filter}
                onChange={this.update_search_filter}
                margin="normal"
                variant="outlined"
                style={{margin: 0}}
                inputRef={ref => { this.filter_box = ref }}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><Icon color="disabled">search</Icon></InputAdornment>,
                    inputProps: {
                        className: classes.searchFilter,
                    }
                }}
            />
        )

        const long_menu = (
            <span hidden={!editable}>
                <IconButton
                    className={classes.menuIcon}
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={this.open_menu}
                    style={{minWidth: 0, color: '#CCC' }}
                >
                <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={menuAnchorEl}
                    anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                    }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                    }}
                    getContentAnchorEl = {null}
                    keepMounted
                    open={add_menu_open}
                    onClose={this.close_menu}
                    MenuListProps={{ style: {padding: 0}}}
                >
                    <MenuItem 
                        key='Add article' 
                        onClick={() => {
                            this.close_menu(); 
                            this.create_new_article()}
                        } 
                        className={classes.menuItem}>
                        <ActionButton 
                            iconLeft='add' 
                            iconRight={null} 
                            label='Add article' 
                            color='default'
                        />
                    </MenuItem>
                    <MenuItem 
                        key='Link existing article' 
                        onClick={(event) => {
                            this.open_preexisting_popper(event), 
                            this.close_menu()}
                        } 
                        className={classes.menuItem}>
                        <ActionButton 
                            iconLeft='link' 
                            iconRight='info' 
                            label='Link existing article' 
                            color='default'
                        />
                    </MenuItem>
                </Menu>
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
            </span>
        )
		return (
            <div className={classes.root}>
                <Grid
                    container
                    justify="center"
                    className="AuthorPage"
                    style={embedded ? { padding: '0.5rem 1rem' } : null }
                >
                    <Grid item>
                        {
                            !embedded ?
                            <div className={classes.cardColumn}>
                                <div className={classes.authorInformation}>
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
                                    <div className={classes.actions}>
                                        {search_filter}
                                        {long_menu}
                                    </div>
                                </div>
                                :
                                <Grid container alignItems="center" justify="space-between">
                                    {search_filter}
                                    <a href="https://curatescience.org/" target="_blank">
                                        <img
                                            style={{ width: 65 }}
                                            src="/sitestatic/icons/powered_by_curate.png"
                                            alt="Powered by Curate Science"
                                            title="Powered by Curate Science"
                                        />
                                    </a>
                                </Grid>
                        }

                        {
                          articles_loading ?
                          <Loader/> :
                          <ArticleList
                            articles={this.sorted_visible_articles()}
                            onArticlesUpdated={this.update_articles}
                            user_session={this.props.user_session}
                            search_filter={this.state.search_filter}
                          />
                        }
                    </Grid>
    			</Grid>

                {
                    !embedded ?
                    <div>
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
                    : null
                }
            </div>
		)
	}
}

AuthorPage.defaultProps = {
    embedded: false,
    user_session: {},
}

export default withRouter(withCookies(withStyles(styles)(AuthorPage)));
