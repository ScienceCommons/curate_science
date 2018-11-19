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
    Drawer, List, ListItem, ListItemText, Divider} from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import C from '../constants/constants';


const styles = theme => ({
    sitename: {
        color: 'white',
        fontSize: 10
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
    subSearchLinks: {
        color: 'gray',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 25
    },
    searchSection: {
        margin: 7,
        flexGrow: 1,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        maxWidth: 400,
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing.unit * 3,
          width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
        let {auth} = this.props
        const { anchors, menuOpen, search_term, drawerOpen } = this.state;
        const menu = (
            <div>
                <List>
                    <Link to="/about">
                        <ListItem key="about">
                            <ListItemText primary="About" />
                        </ListItem>
                    </Link>
                    <Link to="/faq">
                        <ListItem key="faq">
                            <ListItemText primary={"FAQ"} />
                        </ListItem>
                    </Link>
                </List>
                <Divider />
            </div>
        )
        return (
            <div>
                <AppBar position="static" className={classes.topBar}>
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <a href="/new" className={classes.sitename}>
                            <Typography variant="h6" color="inherit">
                              {C.SITENAME}
                            </Typography>
                        </a>
                        <div className={classes.searchSection}>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Search for articles… (try 'bias' or 'love')"
                                    onChange={this.handleSearchBoxChange}
                                    onKeyPress={this.handleSearchKeyPress}
                                    value={search_term || ''}
                                    fullWidth={true}
                                    classes={{
                                      root: classes.inputRoot,
                                      input: classes.inputInput,
                                    }}
                                />
                            </div>
                            <Typography className={classes.subSearchLinks}>
                                Browse: <Link to="/recent" className={classes.topLink}>Articles</Link> &middot; <Link to="/recent?f=replications,collec_replications" className={classes.topLink}>Replications</Link>
                            </Typography>
                        </div>

                        <Typography>
                            <Link to="/about" className={classes.topLink} style={{marginRight: 20}}>About</Link>
                        </Typography>

                        {auth ? (
                        <div>
                            <IconButton
                                    aria-owns={this.menuOpen('curate') ? 'menu-curate' : undefined}
                                    aria-haspopup="true"
                                    onClick={this.handleMenu('curate')}
                                    color="inherit"
                                  >
                                  <Button variant="outlined" className={classes.topButton}>Curate</Button>
                            </IconButton>
                            <Menu
                                id="menu-curate"
                                anchorEl={anchors.curate}
                                anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                                }}
                                open={this.menuOpen('curate')}
                                onClose={this.handleClose('curate')}
                              >
                                <Link to="/articles/curate"><MenuItem>Curate Article Transparency</MenuItem></Link>
                                <Link to="/articles/curate?r=1"><MenuItem>Add Replication</MenuItem></Link>
                            </Menu>
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
                            <MenuItem onClick={this.logout}>Logout</MenuItem>
                          </Menu>
                        </div>
                      ) : <a href="/accounts/login/"><Button variant="outlined" className={classes.topButton}>Login to Curate</Button></a>}
                    </Toolbar>
                </AppBar>
                <Drawer open={drawerOpen} onClose={this.toggleDrawer(false)}>
                  <div
                    tabIndex={0}
                    role="button"
                    onClick={this.toggleDrawer(false)}
                    onKeyDown={this.toggleDrawer(false)}
                  >
                    {menu}
                  </div>
                </Drawer>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(TopBar));
