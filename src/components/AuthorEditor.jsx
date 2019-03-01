import React from 'react';
import { withRouter } from 'react-router-dom';

import { Link } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import {List, Grid, Button, Icon, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions,
    TextField} from '@material-ui/core';

import C from '../constants/constants';

import {pick} from 'lodash'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    dialog: {
    },
    field: {

    },
    icon: {
        display: 'inline-block',
        opacity: 0.5,
        margin: '15px'
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
    }
].concat(C.AUTHOR_LINKS)

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
        let {author} = this.props
        let {form} = this.state
        // Save via API
        // TODO: Reformat profile URLs into JSON object
        let data = clone(form)
        let author_link_ids = C.AUTHOR_LINKS.map((al) => al.id)
        data.profile_urls = JSON.stringify(pick(form, [author_link_ids]))
        fetch(`api/authors/${author.slug}/update/`, {
            method: 'POST',
            data: data
        }).then(res => res.json()).then((res) => {
            console.log(res)
        })
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
                <Grid container key={id}>
                    <Grid item xs={1} style={{justifyContent: 'center'}}>
                        <span className={classes.icon}>{ io.icon }</span>
                    </Grid>
                    <Grid item xs={11}>
                        <span className={classes.formEl}>{ input_el }</span>
                    </Grid>
                </Grid>
            )
        })
    }

	render() {
        let {classes, author, open} = this.props
        let title = "Edit Author"
        if (author.name != null && author.name.length > 0) title += ` (${author.name})`
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

                        { this.render_inputs() }

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

AuthorEditor.defaultProps = {
    author: {}
}

export default withRouter(withStyles(styles)(AuthorEditor));
