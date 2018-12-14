import React from 'react';

import AutocompleteReactSelect from '../AutocompleteReactSelect.jsx';

import {ListItem, List, ListItemText, ListItemSecondaryAction, IconButton, Icon} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = {}

class AuthorSelector extends React.Component {
	constructor(props) {
        super(props);
        this.state = {}
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(value, action) {
        if (action == 'create-option') {

        }
        this.props.onChange(value)
    }

	render() {
		let {classes, value} = this.props
        let {authors} = this.state
		return (
			<AutocompleteReactSelect
                                 creatable
                                 labelProp="text"
                                 listUrl="/api/authors/autocomplete/"
                                 createUrl="/api/authors/create/"
                                 placeholder="Authors *"
                                 name="authors"
                                 multi
                                 value={value}
                                 onChange={this.handleChange}
                                 onCreate={this.handleCreate} />
        )
	}
}

AuthorSelector.defaultProps = {
    value: []
};

export default withStyles(styles)(AuthorSelector);