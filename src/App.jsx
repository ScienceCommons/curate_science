import React from 'react';
import PropTypes from 'prop-types';

// Routing & routes
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import TopBar from './components/TopBar.jsx';

import Splash from './pages/Splash.jsx';
import ArticleSearch from './pages/ArticleSearch.jsx';
import Recent from './pages/Recent.jsx';
import FAQ from './pages/FAQ.jsx';
import About from './pages/About.jsx';
import ArticleDetail from './pages/ArticleDetail.jsx';
import Curate from './pages/Curate.jsx';
import Footer from './components/Footer.jsx';

// UI components
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import {AppBar, Toolbar, Typography, IconButton, Button, Grid, Menu, MenuItem} from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

// Theme
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// import 'typeface-roboto'

import C from './constants/constants';

// CS components
import ArticleLI from './components/ArticleLI.jsx';

import css from './App.css';

const theme = createMuiTheme({
  palette: {
    secondary: { main: '#007CC9' },
  },
  typography: {
    useNextVariants: true,
    fontSize: 12
  }
});


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { classes, authenticated } = this.props;
        const { anchorEl, search_term } = this.state;
        const open = Boolean(anchorEl);
        return (
        	<Router forceRefresh={true} basename="/new">
                <div className="App">
                    <MuiThemeProvider theme={theme}>
                        <TopBar auth={authenticated} />
                        <div className="AppContent">
                            <Switch>
                                <Route exact path="/" component={Splash} />
                                <Route exact path="/recent" component={Recent} />
                                <Route path="/articles/search" component={ArticleSearch} />
                                <Route path="/articles/curate" component={Curate} />
                                <Route path="/about" component={About} />
                                <Route path="/faq" component={FAQ} />
                                <Route path="/article/:id(\d+)/edit" component={Curate} />
                                <Route path="/article/:id(\d+)" component={ArticleDetail} />
                            </Switch>
                        </div>
                        <Footer />
                    </MuiThemeProvider>
                </div>
            </Router>
        );
    }
}

App.defaultProps = {
	authenticated: false
}

export default App;
