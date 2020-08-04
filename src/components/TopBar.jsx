import React from 'react';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import qs from 'query-string';

// Routing & routes
import { Link } from './Link.jsx';
import { withRouter } from 'react-router-dom';

// UI components
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import {
    AppBar,
    Button,
    Divider,
    Drawer,
    Grid,
    Hidden,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import C from '../constants/constants';

import SearchBox from './shared/SearchBox.jsx';

import {json_api_req, summarize_api_errors, unspecified} from '../util/util.jsx'

export const TOPBAR_HEIGHT = 56

const styles = theme => ({
    root: {
        position: 'fixed',
        top: 0,
        zIndex: 20,
        width: '100%',
        maxWidth: '100vw',
    },
    sitename: {
        color: 'white',
        fontSize: 10
    },
    appBar: {
        background: 'linear-gradient(0deg, #333 70%, #555 100%)',
        flexDirection: 'row',
    },
    toolbar: {
        width: '100%',
        boxShadow: 'none',
        height: TOPBAR_HEIGHT,
        minHeight: TOPBAR_HEIGHT,
        display: 'flex',
        justifyContent: 'space-between',
    },
    sitelogo: {
        height: 14,
        marginRight: -2,
        marginLeft: 5
    },
    drawer: {
        width: 300
    },
    topButton: {
        color: 'white',
        borderColor: 'white',
        marginRight: theme.spacing(),
    },
    topLink: {
        color: 'white',
    },
    grow: {
        flexGrow: 1,
    },
    rightSide: {
        position: 'relative'
    },
    inputRoot: {
        color: 'inherit',
        maxWidth: 400,
    },
    inputInput: {
        paddingTop: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(10),
        transition: theme.transitions.create('width'),
        maxWidth: 400,
    },
})

function AuthorPageIcon({ slug }) {
    const icon = (
        <IconButton
            style={{color: 'white', padding: 4}}
            title="Author page"
        >
            <AccountCircle />
        </IconButton>
    )

    if (slug) {
        return (
            <Link to={`/author/${slug}`}>
                { icon }
            </Link>
        )
    }

    return icon
}

class TopBar extends React.Component {
    constructor(props) {
        super(props);

        let q = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).q || ''

        this.state = {
            anchors: {},
            menuOpen: {},
            search_term: q || '',
            drawerOpen: false
        };

        this.handle_create_author_page = this.handle_create_author_page.bind(this)
    }

    logout() {
        window.location.replace('/accounts/logout/')
    }

    componentDidMount() {
        // Hacky way to scroll to right place with hash in URL
        const hash = window.location.hash
        if (hash) {
            const el = document.querySelector(hash)
            if (el) {
                window.setTimeout(() => {
                    window.scrollTo(0, el.offsetTop - TOPBAR_HEIGHT)
                }, 0)
            }
        }
    }

    handleMenu = menu_id => event => {
        let {anchors} = this.state
        anchors[menu_id] = event.currentTarget
        this.setState({anchors})
    };

    handleClose = menu_id => () => {
        let {anchors} = this.state
        anchors[menu_id] = null
        this.setState({ anchors })
    }

    handle_create_author_page() {
        let {cookies, user_session} = this.props
        let has_page = this.user_has_author_page()
        if (has_page) {
            // Admin going to creator
            window.location.replace('/app/create_author')
        } else {
            // User or admin creating their own page on the fly
            let csrf_token = cookies.get('csrftoken')
            let author = user_session.author
            let slug = author.slug
            let data = {is_activated: true}
            json_api_req('PATCH', `/api/authors/${slug}/update/`, data, csrf_token, (res) => {
                console.log(res)
                window.location.replace(`/app/author/${slug}`)
            }, (err) => {
                let message = summarize_api_errors(err)
                if (message != null) alert(message)
            })
        }
    }

    menuOpen = menu_id => {
        let {anchors} = this.state
        return Boolean(anchors[menu_id])
    }

    toggleDrawer = (open) => () => {
        this.setState({drawerOpen: !this.state.drawerOpen})
    }

    user_has_author_page() {
        let {user_session} = this.props
        return user_session.author != null && user_session.author.is_activated
    }

    render() {
        const { classes } = this.props;
        let {user_session} = this.props
        let { anchors, menuOpen, search_term, drawerOpen } = this.state;
        let admin = user_session.admin
        let has_author_page = this.user_has_author_page()

        const drawer_links = [
            { title: 'How it works', to: '/home#how-it-works' },
            { title: 'Browse', to: '/recent' },
            { title: 'About', to: '/home#about' },
            { title: 'People', to: '/home#people' },
            { title: 'FAQ', to: '/home#faq' },
            { title: 'Newsletter', to: '/home#newsletter' },
            { title: 'Replications (legacy)', to: '/replications' },
            { title: 'Help', to: '/help' },
        ]

        let drawer_menu = (
            <div className={classes.drawer} key="drawer">
                <List>
                    {
                        drawer_links.map((link) => {
                            return (
                                <Link to={link.to} key={link.to}>
                                    <ListItem>
                                        <ListItemText primary={link.title} />
                                    </ListItem>
                                </Link>
                            )
                        })
                    }
                </List>
                <Divider />
            </div>
        )
        let author_slug = ''
        if (has_author_page) author_slug = user_session.author.slug
        const user_dropdown_menu = [
            <div key="ddmenu">
                <ListSubheader>Signed in as <b>{ user_session.username }</b></ListSubheader>
                <Link to={`/author/${author_slug}`} key="author_page" hidden={!has_author_page}><MenuItem>My author page (<b>{author_slug}</b>)</MenuItem></Link>
                <span key="create_author_page" hidden={has_author_page && !admin}><MenuItem onClick={this.handle_create_author_page}>Create author page</MenuItem></span>
                <Link to="/admin/manage" key="new_article" hidden={!admin}><MenuItem>Manage and add new articles</MenuItem></Link>
                <Link to="/admin/invite" key="invite" hidden={!admin}><MenuItem>Invite new users</MenuItem></Link>
                <Divider />
                <MenuItem onClick={this.logout}>Logout</MenuItem>
            </div>
        ]

        return (
            <div className={classes.root}>
                <AppBar position="static" className={classes.appBar + " mui-fixed"}>
                    <div className="TopBar">
                        <Toolbar className={classes.toolbar} disableGutters>
                          <div style={{display: 'flex', alignItems: 'center'}}>
                            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
                                <MenuIcon />
                            </IconButton>
                            <Link to="/" id="sitename" className={classes.sitename}>
                                <Typography variant="h6" color="inherit">
                                  <img src="/sitestatic/icons/snail_white.svg" className={classes.sitelogo} /> {C.SITENAME} <sup><span style={{fontSize: '9px', marginLeft: '-2px'}}>BETA</span></sup>
                                </Typography>
                            </Link>
                          </div>

                          <Hidden smDown>
                              <Grid container style={{ width: '40%' }}>
                                  <Grid item style={{ maxWidth: 400, flex: 1 }}>
                                      <SearchBox/>
                                  </Grid>
                                  <Grid item>
                                      <Link to="/recent">
                                          <Button variant="text" className={classes.topLink}>
                                              Browse
                                          </Button>
                                      </Link>
                                  </Grid>
                              </Grid>
                          </Hidden>

                            <div className={classes.rightSide} key="right">

                          <Hidden smDown>
                                {
                                    user_session.authenticated ?
                                    (
                                        <Link to="/help">
                                            <Button variant="text" className={classes.topLink}>
                                                Help
                                            </Button>
                                        </Link>
                                    ) :
                                    (
                                        <Link to="/home/#how-it-works">
                                            <Button variant="text" className={classes.topLink}>
                                                How It Works
                                            </Button>
                                        </Link>
                                    )
                                }
                            </Hidden>

                                {user_session.authenticated ? (
                                <span>
                                    <AuthorPageIcon
                                        slug={author_slug}
                                    />

                                    <IconButton
                                        aria-owns={this.menuOpen('account') ? 'menu-account' : undefined}
                                        aria-haspopup="true"
                                        onClick={this.handleMenu('account')}
                                        color="inherit"
                                        style={{padding: 0}}
                                    >
                                        <ArrowDropDown/>
                                    </IconButton>
                                  <Menu
                                    id="menu-account"
                                    anchorEl={anchors.account}
                                    getContentAnchorEl={null}
                                    anchorOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                      vertical: 'top',
                                      horizontal: 'right',
                                    }}
                                    open={this.menuOpen('account')}
                                    onClose={this.handleClose('account')}
                                  >
                                    { user_dropdown_menu }
                                  </Menu>
                                </span>
                              ) : <a href="/accounts/login/"><Button variant="outlined" className={classes.topButton}>Login</Button></a>}
                            </div>
                        </Toolbar>
                    </div>
                </AppBar>
                <Drawer open={drawerOpen} onClose={this.toggleDrawer(false)}>
                  <div
                    tabIndex={0}
                    role="button"
                    onClick={this.toggleDrawer(false)}
                    onKeyDown={this.toggleDrawer(false)}
                  >
                    {drawer_menu}
                  </div>
                </Drawer>
            </div>
        );
    }
}

export default withRouter(withCookies(withStyles(styles)(TopBar)));
