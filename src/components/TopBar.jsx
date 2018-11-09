import React from 'react';
import PropTypes from 'prop-types';

// Routing & routes
import { Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';

// UI components
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography, IconButton, Button, Grid, Menu, MenuItem} from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import C from '../constants/constants';


const styles = theme => ({
    sitename: {
        color: 'white',
        textDecoration: 'none'
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
        this.state = {
            anchorEl: null,
            search_term: ''
        };

        this.handleSearchBoxChange = this.handleSearchBoxChange.bind(this)
        this.handleSearchKeyPress = this.handleSearchKeyPress.bind(this)
    }

    handleSearchBoxChange(e) {
        this.setState({search_term: e.target.value})
    }

    handleSearchKeyPress(e) {
        if (e.key == 'Enter') {
            this.goto_search()
        }
    }

    handleChange = event => {
        this.setState({ auth: event.target.checked });
    };

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    goto_search() {
        let {search_term} = this.state
        let query = encodeURIComponent(search_term)
        this.props.history.replace(`/articles?q=${query}`);
    }

    render() {
        const { classes } = this.props;
        let {auth} = this.props
        const { anchorEl, search_term } = this.state;
        const open = Boolean(anchorEl);
        return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton>
                    <a href="/new">
                        <Typography variant="h6" color="inherit" className={classes.sitename}>
                          {C.SITENAME}
                        </Typography>
                    </a>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search for articles… (try 'bias' or 'love')"
                            onChange={this.handleSearchBoxChange}
                            onKeyPress={this.handleSearchKeyPress}
                            value={search_term || ''}
                            classes={{
                              root: classes.inputRoot,
                              input: classes.inputInput,
                            }}
                        />
                    </div>
                    <div>
                        Browse: <Link to="/home">Articles</Link> &middot; <Link to="/home">Replications</Link>
                    </div>

                    <div>
                        <Button>Curate Article Transparency</Button>
                        <Button>Add a replication</Button>
                    </div>

                    <div>
                        <Link to="/about">About</Link> &middot; <Link to="/faq">FAQ</Link>
                    </div>

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
        );
    }
}

export default withRouter(withStyles(styles)(TopBar));
