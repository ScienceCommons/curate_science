import React from 'react';
import PropTypes from 'prop-types';

// Routing & routes
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import Home from './pages/Home.jsx';
import FAQ from './pages/FAQ.jsx';
import About from './pages/About.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import TopBar from './components/TopBar.jsx';

// UI components
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography, IconButton, Button, Grid, Menu, MenuItem} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import C from './constants/constants';

// CS components
import ArticleLI from './components/ArticleLI.jsx';

import css from './App.css';
// import url('https://fonts.googleapis.com/css?family=Roboto');

const styles = theme => ({
})

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: true,
        };
    }

    render() {
        const { classes } = this.props;
        const { auth, anchorEl, search_term } = this.state;
        const open = Boolean(anchorEl);
        return (
        	<Router forceRefresh={true} basename="/new">
                <div className="App">
                    <TopBar auth={auth} />
                    <div className="AppContent">
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path="/articles" component={Home} />
                            <Route path="/about" component={About} />
                            <Route path="/faq" component={FAQ} />
                            <Route path="/article/:id" component={ArticleDetail} />
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
