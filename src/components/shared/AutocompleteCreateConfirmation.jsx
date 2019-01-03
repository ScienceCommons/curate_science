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

const styles = {
    error: {
        color: 'red'
    }
}

class AutocompleteCreateConfirmation extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            confirmationShowing: false,
            entered_value: '',
            error_message: null
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
        this.setState({confirmationShowing: true, entered_value: input})
    }

    showError(msg) {
      this.setState({error_message: msg})
    }

    dismiss(input) {
        this.setState({confirmationShowing: false, entered_value: '', error_message: null})
    }

    create() {
        let {createUrl, csrftoken, enteredValuePropName, objectLabel} = this.props
        let {entered_value} = this.state
        let data = {}
        data[enteredValuePropName] = entered_value
        json_api_req('POST', createUrl, data, csrftoken, (res) => {
          this.handleCreated(res)
        }, (res) => {
          this.showError(`Error creating ${objectLabel} - Duplicate?`)
        })
    }

    handleCreated(obj) {
        let {value} = this.props
        obj.text = obj.name
        delete obj.name
        value.push(obj)
        this.props.onChange(value)
        this.dismiss()
    }

	render() {
		let {classes, value, objectLabel, labelProp, listUrl, createUrl, placeholder, name} = this.props
        let {confirmationShowing, entered_value, error_message} = this.state
        let error
        if (error_message != null) error = <DialogContentText>
            <div className={classes.error}>{ error_message }</div>
        </DialogContentText>
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
                    Create new { objectLabel }: <b>{ entered_value }</b>?
                </DialogTitle>
                <DialogContent>
                    { error }
                </DialogContent>
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
    value: PropTypes.array,
    csrftoken: PropTypes.string,
    enteredValuePropName: PropTypes.string
}

AutocompleteCreateConfirmation.defaultProps = {
    listUrl: "/api/constructs/autocomplete/",
    createUrl: "/api/constructs/create/",
    objectLabel: "construct",
    placeholder: "e.g., 'erotica exposure vs. control'",
    name: "ind_vars",
    enteredValuePropName: 'name',
    value: [],
    csrftoken: null
};

export default withStyles(styles)(AutocompleteCreateConfirmation);