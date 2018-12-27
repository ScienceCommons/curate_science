import React from 'react';
import PropTypes from 'prop-types';

import AutocompleteReactSelect from '../shared/AutocompleteReactSelect.jsx';
import QuickAuthorCreator from '../../components/shared/QuickAuthorCreator.jsx';

import {ListItem, List, ListItemText, ListItemSecondaryAction, IconButton, Icon} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = {}

class AuthorSelector extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            creatorShowing: false,
            name: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.showCreator = this.showCreator.bind(this)
        this.closeCreator = this.closeCreator.bind(this)
        this.authorCreated = this.authorCreated.bind(this)
    }

    handleChange(value, action) {
        this.props.onChange(value)
    }

    showCreator(input) {
        this.setState({creatorShowing: true, name: input})
    }

    closeCreator(input) {
        this.setState({creatorShowing: false, name: ''})
    }

    authorCreated(a) {
        console.log(a)
        let {value} = this.props
        value.push(a)
        this.props.onChange(value)
    }

	render() {
		let {classes, value, withCreator} = this.props
        let {name, creatorShowing} = this.state
        let creator
        if (withCreator) creator = (
            <QuickAuthorCreator
                onCreate={this.authorCreated}
                onClose={this.closeCreator}
                open={creatorShowing}
                name={name} />
        )
		return (
            <div>
    			<AutocompleteReactSelect
                                 creatable
                                 labelProp="text"
                                 listUrl="/api/authors/autocomplete/"
                                 placeholder="Authors *"
                                 name="authors"
                                 multi
                                 value={value}
                                 onChange={this.handleChange}
                                 onCreate={this.showCreator} />
                { creator }
            </div>
        )
	}
}

AuthorSelector.propTypes = {
    withCreator: PropTypes.bool
}

AuthorSelector.defaultProps = {
    value: [],
    withCreator: true
};

export default withStyles(styles)(AuthorSelector);