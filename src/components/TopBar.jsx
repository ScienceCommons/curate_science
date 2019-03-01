import React from 'react';
import PropTypes from 'prop-types';

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


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    sitename: {
        color: 'white',
        fontSize: 10
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
    topBar: {
        background: 'linear-gradient(0deg, #333 70%, #555 100%)',
        boxShadow: 'none'
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

        this.handleSearchBoxChange = this.handleSearchBoxChange.bind(this)
        this.handleSearchKeyPress = this.handleSearchKeyPress.bind(this)
    }

    logout() {
        window.location.replace('/accounts/logout/')
    }

    handleSearchBoxChange(e) {
        this.setState({search_term: e.target.value})
    }

    handleSearchKeyPress(e) {
        if (e.key == 'Enter') {
            this.refreshSearch()
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

    menuOpen = menu_id => {
        let {anchors} = this.state
        return Boolean(anchors[menu_id])
    }

    refreshSearch() {
        let {search_term} = this.state
        let parsed = qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
        let f = parsed.f || ''
        let query = encodeURIComponent(search_term)
        this.props.history.replace(`/articles/search?q=${query}&f=${f}`);
    }

    toggleDrawer = (open) => () => {
        this.setState({drawerOpen: !this.state.drawerOpen})
    }

    render() {
        const { classes } = this.props;
        let {user_session} = this.props
        let { anchors, menuOpen, search_term, drawerOpen } = this.state;
        let admin = user_session.admin
        let has_author_page = user_session.has_page;
        let drawer_menu = (
            <div className={classes.drawer} key="drawer">
                <List>
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
                    <Link to="/replications" key="replications">
                        <ListItem key="replications">
                            <ListItemText primary={"Replications"} />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
            </div>
        )
        const user_dropdown_menu = [
            <div key="ddmenu">
                <ListSubheader>Signed in as <b>{ user_session.username }</b></ListSubheader>
                <Link to={`/author/${user_session.username}`} key="author_page"><MenuItem>{ has_author_page ? "My author page" : "Create author page" }</MenuItem></Link>
                <Link to="/article/new" key="new_article"><MenuItem onClick={this.logout}>Add new article</MenuItem></Link>
                <Link to="/invite" key="invite"><MenuItem>Invite new users</MenuItem></Link>
                <Divider />
                <MenuItem onClick={this.logout}>Logout</MenuItem>
            </div>
        ]
        return (
            <div className={classes.root}>
                <AppBar position="static" className={classes.topBar}>
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <a href="/app" className={classes.sitename}>
                            <Typography variant="h6" color="inherit">
                              <img src="/sitestatic/icons/snail_white.svg" className={classes.sitelogo} /> {C.SITENAME}
                            </Typography>
                        </a>

                        <div className={classes.grow} key="grow" />

                        <div className={classes.rightSide} key="right">

                            <Link to="/about"><Button variant="text" className={classes.topLink}>About</Button></Link>

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

export default withRouter(withStyles(styles)(TopBar));
