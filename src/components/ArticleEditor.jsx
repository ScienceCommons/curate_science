import React from 'react';
import { withRouter } from 'react-router-dom';


import { Link } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import {List, Grid, Button, Icon, Dialog, DialogTitle} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        paddingTop: 10,
        flexGrow: 1
    },
    box: {
        padding: theme.spacing.unit * 2,
    }
})

class ArticleEditor extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            form: {}
        }

        this.handle_close = this.handle_close.bind(this)
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    handle_close() {
        this.props.onClose()
    }

	render() {
        let {classes, article, open} = this.props
		return (
            <div>
                <Dialog open={open} onClose={this.handle_close} aria-labelledby="edit-article">
                    <DialogTitle id="edit-article">Edit Article</DialogTitle>
                </Dialog>
            </div>
		)
	}
}

ArticleEditor.defaultProps = {
    article_id: null
}

export default withRouter(withStyles(styles)(ArticleEditor));
