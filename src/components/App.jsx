import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import {AppBar, Toolbar, Typography, IconButton, Button, Grid, Menu, MenuItem} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import C from '../constants/constants';

import ArticleLI from './ArticleLI.jsx';

import css from '../App.css';
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
    let a = {
    	title: "From motive dispositions to states to outcomes: An intensive experience sampling study on communal motivational dynamics in couples",
    	authors: "Zygar, Hagemeyer, Pusch, & Schönbrodt (2018)",
    	journals: "European Journal of Personality 10.1002/per.2145",
    	editor: "chiefeditor",
    	edit_date: "August 01 2018"
    }
    return (
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

		<Grid container style={{flexGrow: 1, padding: '10px'}} spacing={16}>
	        <Grid item xs={12}>
	        	<ArticleLI article={a} />
	        </Grid>
	    </Grid>

        </div>
    );
  }
}

export default withStyles(styles)(App);
