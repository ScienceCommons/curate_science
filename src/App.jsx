import React from 'react';
import { withStyles } from '@material-ui/core/styles';

// Routing & routes
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';

// UI components
import {AppBar, Toolbar, Typography, IconButton, Button, Grid, Menu, MenuItem} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import C from './constants/constants';

// CS components
import ArticleLI from './components/ArticleLI.jsx';

import css from './App.css';
// import url('https://fonts.googleapis.com/css?family=Roboto');

// style.use();
const styles = {

};

class App extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
  };

  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
    	<Router>
        <div>
      	  <AppBar position="static">
        		<Toolbar>
      			<IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                {C.SITENAME}
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
                    <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                    <MenuItem onClick={this.handleClose}>My account</MenuItem>
                  </Menu>
                </div>
              )}
            </Toolbar>
          </AppBar>
          <Switch>
            <Route exact path="/2" component={Home} />
            <Route path="/2/about" component={About} />
            <Route path="/2/article" component={ArticleDetail} />
          </Switch>
        </div>
      </Router>
    );
  }
}

App.defaultProps = {
	user: {} // If signed in
}

export default withStyles(styles)(App);
