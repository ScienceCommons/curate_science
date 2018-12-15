import React from 'react';
import PropTypes from 'prop-types';

import {TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput, Dialog, DialogContent, DialogActions, DialogTitle} from '@material-ui/core';

import JournalSelector from '../../components/curateform/JournalSelector.jsx';
import AuthorSelector from '../../components/curateform/AuthorSelector.jsx';

import { withStyles } from '@material-ui/core/styles';

const styles = {

}

class QuickAuthorCreator extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            formdata: {}
        }
        this.save = this.save.bind(this)
        this.cancel = this.cancel.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        let {formdata} = this.state
        let opening = !this.props.open && nextProps.open
        if (opening && nextProps.name.length > 0) {
            // Populate formdata with input name (str)
            let names = nextProps.name.split(' ')
            if (names.length > 2) {
                formdata.first_name = names[0]
                formdata.middle_name = names[1]
                formdata.last_name = names[2]
            } else if (names.length == 2) {
                formdata.first_name = names[0]
                formdata.last_name = names[1]
            } else {
                formdata.last_name = names[0]
            }
            this.setState({formdata})
        }
    }

    handleChange = prop => event => {
        let {formdata} = this.state
        formdata[prop] = event.target.value
        this.setState({formdata});
    }

    save() {
        let {formdata} = this.state
        console.log(formdata)
        fetch("/api/authors/create/", {
            method: "POST",
            data: formdata
        }).then(res => res.json()).then((article) => {
            this.props.onCreate(article)
        })
    }

    cancel() {
        this.props.onClose()
    }

	render() {
		let {classes, open} = this.props
        let {formdata} = this.state
		return (
			<Dialog className={classes.root} open={open} onClose={this.cancel}>
                <DialogTitle>Create Author</DialogTitle>
                <DialogContent>
                      <TextField
                        id="title"
                        label="ORCID"
                        className={classes.textField}
                        value={formdata.orcid || ''}
                        onChange={this.handleChange('orcid')}
                        margin="normal"
                        name="orcid"
                        fullWidth
                        required
                        variant="outlined"
                      />
                      <TextField
                        id="title"
                        label="First name"
                        className={classes.textField}
                        value={formdata.first_name || ''}
                        onChange={this.handleChange('first_name')}
                        margin="normal"
                        name="first_name"
                        fullWidth
                        required
                        variant="outlined"
                      />
                      <TextField
                        id="title"
                        label="Middle name"
                        className={classes.textField}
                        value={formdata.middle_name || ''}
                        onChange={this.handleChange('middle_name')}
                        margin="normal"
                        name="middle_name"
                        fullWidth
                        variant="outlined"
                      />
                      <TextField
                        id="title"
                        label="Last name"
                        className={classes.textField}
                        value={formdata.last_name || ''}
                        onChange={this.handleChange('last_name')}
                        margin="normal"
                        name="last_name"
                        fullWidth
                        required
                        variant="outlined"
                      />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.cancel}>Cancel</Button>
                  <Button variant="outlined" onClick={this.save}>Save Author</Button>
                </DialogActions>
            </Dialog>
        )
	}
}

QuickAuthorCreator.propTypes = {
    onCreate: PropTypes.func,
    open: PropTypes.bool
}

QuickAuthorCreator.defaultProps = {
  open: false
};

export default withStyles(styles)(QuickAuthorCreator);