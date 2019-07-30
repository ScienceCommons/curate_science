import React from 'react';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import qs from 'query-string';

// Routing & routes
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';

// UI components
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography, IconButton, Button, Grid, Menu, MenuItem,
    Drawer, List, ListItem, ListItemText, Divider, ListSubheader} from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import C from '../constants/constants';

import SearchBox from './shared/SearchBox.jsx';

import {json_api_req, summarize_api_errors, unspecified} from '../util/util.jsx'

const TOPBAR_HEIGHT = 56

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    sitename: {
        color: 'white',
        fontSize: 10
    },
    appBar: {
        background: 'linear-gradient(0deg, #333 70%, #555 100%)',
    },
    toolbar: {
        boxShadow: 'none',
        height: TOPBAR_HEIGHT,
        minHeight: TOPBAR_HEIGHT,
        width: C.COL_WIDTH + 'px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    centeredCol: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: C.COL_WIDTH + 'px',
        height: TOPBAR_HEIGHT,
        margin: '0px auto'
    },
    sitelogo: {
        height: 20,
        verticalAlign: 'middle',
        marginRight: 10
    },
    drawer: {
        width: 300
    },
    topButton: {
        color: 'white',
        borderColor: 'white'
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
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        maxWidth: 400,
    },
})

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
        let drawer_menu = (
            <div className={classes.drawer} key="drawer">
                <List>
                    <Link to="/replications" key="replications">
                        <ListItem key="replications">
                            <ListItemText primary={"Replications"} />
                        </ListItem>
                    </Link>
                    <Link to="/about" key="about">
                        <ListItem>
                            <ListItemText primary="About" />
                        </ListItem>
                    </Link>
                    <Link to="/faq" key="faq">
                        <ListItem key="faq">
                            <ListItemText primary={"FAQ"} />
                        </ListItem>
                    </Link>
                    <Link to="/newsletter" key="newsletter">
                        <ListItem key="newsletter">
                            <ListItemText primary={"Newsletter"} />
                        </ListItem>
                    </Link>
                    <Link to="/help" key="help">
                        <ListItem key="help">
                            <ListItemText primary={"Help"} />
                        </ListItem>
                    </Link>
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
                <AppBar position="static" className={classes.appBar}>
                    <div className={classes.centeredCol}>
                        <Toolbar className={classes.toolbar} disableGutters>
                          <div style={{display: 'flex', alignItems: 'center'}}>
                            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
                                <MenuIcon />
                            </IconButton>
                            <a href="/app" id="sitename" className={classes.sitename}>
                                <Typography variant="h6" color="inherit">
                                  <img src="/sitestatic/icons/snail_white.svg" className={classes.sitelogo} /> {C.SITENAME} <sup><span style={{fontSize: '9px', marginLeft: '-2px'}}>BETA</span></sup>
                                </Typography>
                            </a>
                          </div>

                          <SearchBox/>

                            <div className={classes.rightSide} key="right">

                                <Link to="/help"><Button variant="text" className={classes.topLink}>Help</Button></Link>

                                {user_session.authenticated ? (
                                <span>
                                    <IconButton
                                        aria-owns={this.menuOpen('account') ? 'menu-account' : undefined}
                                        aria-haspopup="true"
                                        onClick={this.handleMenu('account')}
                                        color="inherit"
                                      >
                                        <AccountCircle />
                                  </IconButton>
                                  <Menu
                                    id="menu-account"
                                    anchorEl={anchors.account}
                                    anchorOrigin={{
                                      vertical: 'top',
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
                              ) : <a href="/accounts/login/"><Button variant="outlined" className={classes.topButton}>Login to Curate</Button></a>}
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
