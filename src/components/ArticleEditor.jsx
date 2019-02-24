import React from 'react';
import { withRouter } from 'react-router-dom';


import { Link } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import {List, Grid, Button, Icon, TextField,
        Dialog, DialogTitle,
        DialogContent, DialogContentText, DialogActions} from '@material-ui/core';

import FigureSelector from './curateform/FigureSelector.jsx';
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

const INPUT_SPECS = {
    'authors': {
        label: 'Authors',
        placeholder: "e.g. RJ Balzarini, L Campbell, & K Dobson",
        required: true,
        type: 'text'
    },
    'title': {
        label: 'Article title',
        placeholder: "e.g., Does exposure to erotica reduce attraction and love for romantic partners in men?",
        required: true,
        type: 'text'
    },
    'year': {
        label: 'Year',
        placeholder: "2016",
        required: true,
        type: 'number'
    },
    'in_press': {
        label: 'In press',
        type: 'checkbox'
    },
    'journal': {
        label: 'Journal name',
        placeholder: "e.g., Social Psychology (leave blank for unpublished articles or preprints)",
        type: 'text'
    },
    'abstract': {
        label: 'Abstract',
        placeholder: "e.g., In this article, we propose a unified theory of consciousness...",
        type: 'text'
    },
    'keywords': {
        label: 'Keywords',
        placeholder: "e.g., attractiveness, replication (separate keywords using ',')",
        type: 'text'
    },
    'article_type': {
        label: 'Article type',
        required: true,
        type: 'select'
    },
    'doi': {
        label: 'DOI',
        placeholder: "leave blank for unpublished",
        type: 'text'
    }

}

class ArticleEditor extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            form: {}
        }

        this.handle_close = this.handle_close.bind(this)
        this.save = this.save.bind(this)
        this.handle_change = this.handle_change.bind(this)
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        let article_change = nextProps.article_id != this.props.article_id
        let open = nextProps.open
        if (open && article_change) {
            // Fetch article from server to ensure up to date
            // Populate form
            fetch()
        }
    }

    componentWillUnmount() {
    }

    handle_close() {
        this.props.onClose()
    }

    handle_change = event => {
        let {form} = this.state
        form[event.target.name] = event.target.value
        this.setState({form})
    }

    save() {

    }

    render_field(id) {
        let {form} = this.state
        let specs = INPUT_SPECS[id] || {}
        let value = form[id] || ''
        return (
            <TextField
                  id={id}
                  key={id}
                  label={specs.label}
                  value={value}
                  type={specs.type}
                  onChange={this.handle_change}
                  placeholder={specs.placeholder}
                  margin="normal"
                  fullWidth
                  required={specs.required}
                  variant="outlined"
                />
            )
    }

	render() {
        let {classes, article, open} = this.props
		return (
            <div>
                <Dialog open={open} onClose={this.handle_close} aria-labelledby="edit-article">
                    <DialogTitle id="edit-article">Edit Article</DialogTitle>
                    <DialogContent>
                        <Grid container>
                            <Grid item xs={9}>
                                { this.render_field('title') }
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={9}>
                                { this.render_field('authors') }
                            </Grid>
                            <Grid item xs={3}>
                                { this.render_field('year') }
                                { this.render_field('in_press') }
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={9}>
                                { this.render_field('journal') }
                            </Grid>
                            <Grid item xs={3}>
                                { this.render_field('doi') }
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={9}>
                                { this.render_field('abstract') }
                                { this.render_field('keywords') }
                            </Grid>
                            <Grid item xs={3}>
                                <FigureSelector />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.save}>save</Button>
                        <Button variant="text" onClick={this.handle_close}>cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
		)
	}
}

ArticleEditor.defaultProps = {
    article_id: null
}

export default withRouter(withStyles(styles)(ArticleEditor));
