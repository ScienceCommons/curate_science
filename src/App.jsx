import React from 'react';


// Routing & routes
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';

// UI components
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography, IconButton, Button, Grid, Menu, MenuItem} from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';
import C from './constants/constants';

// CS components
import ArticleLI from './components/ArticleLI.jsx';

import css from './App.css';
// import url('https://fonts.googleapis.com/css?family=Roboto');

// style.use();
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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: true,
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
            this.search()
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

    search() {
        let {search_term} = this.state
        fetch(`/api/articles/search/?q=${encodeURIComponent(search_term)}`).then(res => res.json()).then((res) => {
            console.log(res)
            // TODO: Router redirect to home with search in query string...
            this.setState({article: res})
        })
    }

    render() {
        const { classes } = this.props;
        const { auth, anchorEl, search_term } = this.state;
        const open = Boolean(anchorEl);
        return (
        	<Router>
                <div className="App">
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
                                    placeholder="Search articles…"
                                    onChange={this.handleSearchBoxChange}
                                    onKeyPress={this.handleSearchKeyPress}
                                    value={search_term || ''}
                                    classes={{
                                      root: classes.inputRoot,
                                      input: classes.inputInput,
                                    }}
                                />
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
                                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                                <MenuItem onClick={this.handleClose}>My account</MenuItem>
                              </Menu>
                            </div>
                          )}
                        </Toolbar>
                    </AppBar>
                    <div className="AppContent">
                        <Switch>
                            <Route exact path="/new" component={Home} />
                            <Route path="/new/about" component={About} />
                            <Route path="/new/article/:id" component={ArticleDetail} />
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
}

App.defaultProps = {
	user: {} // If signed in
}

export default withStyles(styles)(App);
