import React from 'react';
import PropTypes from 'prop-types';

import AutocompleteReactSelect from './AutocompleteReactSelect.jsx';
import QuickAuthorCreator from '../../components/shared/QuickAuthorCreator.jsx';

import {ListItem, List, ListItemText, ListItemSecondaryAction, IconButton, Icon,
    Dialog, DialogContent, DialogTitle, DialogActions, Button, DialogContentText} from '@material-ui/core';
import Slide from '@material-ui/core/Slide';

import {json_api_req} from '../../util/util.jsx'

import { withStyles } from '@material-ui/core/styles';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = {}

class AutocompleteCreateConfirmation extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            confirmationShowing: false,
            create_value: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.showConfirmationDialog = this.showConfirmationDialog.bind(this)
        this.dismiss = this.dismiss.bind(this)
        this.create = this.create.bind(this)
        this.handleCreated = this.handleCreated.bind(this)
    }

    handleChange(value, action) {
        this.props.onChange(value)
    }

    showConfirmationDialog(input) {
        this.setState({confirmationShowing: true, create_value: input})
    }

    dismiss(input) {
        this.setState({confirmationShowing: false, create_value: ''})
    }

    create() {
        let {createUrl} = this.props
        let data = {}
        json_api_req('POST', createUrl, data, null, (res) => {
            this.handleCreated()
        }, (res) => {
            this.dismiss()
        })
    }

    handleCreated(obj) {
        let {value} = this.props
        value.push(obj)
        this.props.onChange(obj)
        this.dismiss()
    }

	render() {
		let {classes, value, objectLabel, labelProp, listUrl, createUrl, placeholder, name} = this.props
        let {confirmationShowing, create_value} = this.state
        let dialog = (
            <Dialog
              open={confirmationShowing}
              TransitionComponent={Transition}
              keepMounted
              onClose={this.dismiss}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    Create new { objectLabel }: <b>{ create_value }</b>?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={this.dismiss} color="primary">
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={this.create} color="primary">
                      Create
                    </Button>
                </DialogActions>
            </Dialog>
        )
		return (
            <div>
    			<AutocompleteReactSelect
                                 creatable
                                 labelProp='text'
                                 listUrl={listUrl}
                                 placeholder={placeholder}
                                 name={name}
                                 multi
                                 value={value}
                                 onChange={this.handleChange}
                                 onCreate={this.showConfirmationDialog} />
                { dialog }
            </div>
        )
	}
}

AutocompleteCreateConfirmation.propTypes = {
    listUrl: PropTypes.string,
    createUrl: PropTypes.string,
    objectLabel: PropTypes.string,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.array
}

AutocompleteCreateConfirmation.defaultProps = {
    listUrl: "/api/constructs/autocomplete/",
    createUrl: "/api/constructs/create/",
    objectLabel: "construct",
    placeholder: "e.g., 'erotica exposure vs. control'",
    name: "ind_vars",
    value: []
};

export default withStyles(styles)(AutocompleteCreateConfirmation);