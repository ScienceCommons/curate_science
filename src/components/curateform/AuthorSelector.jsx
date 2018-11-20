import React from 'react';

import AutocompleteReactSelect from '../AutocompleteReactSelect.jsx';

import {ListItem, List, ListItemText, ListItemSecondaryAction, IconButton, Icon} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = {}

class AuthorSelector extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            authors: []
        };
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(value, action) {
        console.log(action)
        let {authors} = this.state
        if (action == 'select-option') {
            authors.push(value.text)
        } else if (action == 'create-option') {
            authors.push(value.text)
        }
        this.setState({authors})
    }

	render() {
		let {classes, name} = this.props
        let {authors} = this.state
		return (
			<AutocompleteReactSelect
                                 creatable
                                 labelProp="text"
                                 listUrl="/api/authors/autocomplete/"
                                 createUrl="/api/authors/create/"
                                 placeholder="Authors *"
                                 multi
                                 onChange={this.handleChange} />
        )
	}
}

AuthorSelector.defaultProps = {

};

export default withStyles(styles)(AuthorSelector);