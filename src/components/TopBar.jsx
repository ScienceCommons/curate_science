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
        color: 'white'
    },
    topBar: {
        background: 'linear-gradient(0deg, #EEE 10%, #BBB 100%)',
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
        width: '100%',
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
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: 200,
        },
    },
})

class TopBar extends React.Component {
    constructor(props) {
        super(props);

        let q = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).q || ''

        this.state = {
            anchorEl: null,
            search_term: q || '',
            drawerOpen: false
        };

        this.handleSearchBoxChange = this.handleSearchBoxChange.bind(this)
        this.handleSearchKeyPress = this.handleSearchKeyPress.bind(this)
    }

    handleSearchBoxChange(e) {
        this.setState({search_term: e.target.value})
    }

    handleSearchKeyPress(e) {
        if (e.key == 'Enter') {
            this.refreshSearch()
        }
    }

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

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
        const { anchorEl, search_term, drawerOpen } = this.state;
        const open = Boolean(anchorEl);
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
                                Browse: <Link to="/recent">Articles</Link> &middot; <Link to="/recent">Replications</Link>
                            </Typography>
                        </div>

                        <div className={classes.grow}>
                            <Link to="/articles/curate"><Button variant="outlined" size="small">Curate Article Transparency</Button></Link>
                            <Link to="/articles/curate"><Button variant="outlined" size="small" href="/articles/curate">Add a replication</Button></Link>
                        </div>

                        <Typography>
                            <Link to="/about">About</Link>
                        </Typography>

                        {auth && (
                        <div>
                          <IconButton
                            aria-owns={open ? 'menu-appbar' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleMenu}
                            color="inherit"
                          >
                            <AccountCircle />
                          </IconButton>
                          <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                            open={open}
                            onClose={this.handleClose}
                          >
                            <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                          </Menu>
                        </div>
                      )}
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
