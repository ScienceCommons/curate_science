import React from 'react';
import { withRouter } from 'react-router-dom';

import qs from 'query-string';

import { Link } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import {List, Grid, Button, Icon, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions,
    TextField} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    dialog: {

    },
    field: {

    },
    icon: {
        display: 'inline-block',
        opacity: 0.5,
        padding: '15px'
    },
    formEl: {
        marginLeft: "60px"
    }
})

// TODO: Merge with constants.AUTHOR_LINKS (DRY)
const INPUTS = [
    {
        id: 'name',
        type: 'text',
        label: "Name",
        required: true
    },
    {
        id: 'title',
        type: 'text',
        label: "Position/Title"
    },
    {
        id: 'affiliation',
        type: 'text',
        label: "Affiliation",
        icon: <Icon>account_balance</Icon>
    },
    {
        id: 'gscholar',
        type: 'url',
        label: "Google Scholar profile URL",
        icon: <img width={30} src={`/sitestatic/icons/gscholar.svg`} />
    },
    {
        id: 'orcid',
        type: 'url',
        label: "ORC ID profile URL",
        icon: <img width={30} src={`/sitestatic/icons/orcid.svg`} />
    },
    {
        id: 'twitter',
        type: 'url',
        label: "Twitter profile URL",
        icon: <img width={30} src={`/sitestatic/icons/twitter.svg`} />
    },
    {
        id: 'researchgate',
        type: 'url',
        label: "ResearchGate profile URL",
        icon: <img width={30} src={`/sitestatic/icons/researchgate.svg`} />
    },
    {
        id: 'academia',
        type: 'url',
        label: "Academia.edu profile URL",
        icon: <img width={30} src={`/sitestatic/icons/academia.svg`} />
    },
    {
        id: 'blog',
        type: 'url',
        label: "Blog URL",
        icon: <img width={30} src={`/sitestatic/icons/blog.svg`} />
    },
    {
        id: 'email',
        type: 'email',
        label: "Email address",
        icon: <img width={30} src={`/sitestatic/icons/email.svg`} />
    },
    {
        id: 'website',
        type: 'url',
        label: "Website URL",
        icon: <img width={30} src={`/sitestatic/icons/internet.svg`} />
    },
    {
        id: 'osf',
        type: 'url',
        label: "OSF profile URL",
        icon: <img width={30} src={`/sitestatic/icons/osf.svg`} />
    }
]

class AuthorEditor extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            form: {}
        }

        this.handle_close = this.handle_close.bind(this)
        this.handle_change = this.handle_change.bind(this)
        this.save = this.save.bind(this)
    }

    componentDidMount() {
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
        // Save via API
        // TODO: Reformat profile URLs into JSON object
        // fetch()
    }

    render_inputs() {
        let {classes} = this.props
        let {form} = this.state
        return INPUTS.map((io) => {
            let id = io.id
            let value = form[id] || ''
            let input_el = <TextField
                      id={id}
                      key={id}
                      label={io.label}
                      className={classes.field}
                      value={value}
                      type={io.type}
                      onChange={this.handle_change}
                      margin="normal"
                      fullWidth
                      required={io.required}
                      variant="outlined"
                    />
            return (
                <Grid item xs={12} key={id}>
                    <span className={classes.icon}>{ io.icon }</span>
                    <span className={classes.formEl}>{ input_el }</span>
                </Grid>
            )
        })
    }

	render() {
        let {classes, author, open} = this.props
        let title = "Edit Author"
        if (author.name != null && author.name.length > 0) title += ` (${author.name}`
		return (
            <div>
                <Dialog open={open}
                        onClose={this.handle_close}
                        aria-labelledby="edit-author"
                        className={classes.dialog}
                        fullWidth>
                    <DialogTitle id="edit-author">{title}</DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                        </DialogContentText>

                        <Grid container>
                            { this.render_inputs() }
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



export default withRouter(withStyles(styles)(AuthorEditor));
