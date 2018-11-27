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
        this.render_author = this.render_author.bind(this)
    }

    handleChange(value, action) {
        console.log(action)
        console.log(value)
        if (action == 'create-option') {
            // authors.push(value.text)
        }
        this.props.onChange(value)
    }

    render_author(author) {
        return [author.first_name, author.last_name].join(' ')
    }

	render() {
		let {classes, value} = this.props
        let {authors} = this.state
		return (
			<AutocompleteReactSelect
                                 creatable
                                 listUrl="/api/authors/autocomplete/"
                                 createUrl="/api/authors/create/"
                                 placeholder="Authors *"
                                 optionRenderer={this.render_author}
                                 multi
                                 value={value}
                                 onChange={this.handleChange} />
        )
	}
}

AuthorSelector.defaultProps = {
    value: []
};

export default withStyles(styles)(AuthorSelector);