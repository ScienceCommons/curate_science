import React from 'react';

import PropTypes from 'prop-types';
import AutocompleteReactSelect from '../AutocompleteReactSelect.jsx';

import { withStyles } from '@material-ui/core/styles';

const styles = {}

class JournalSelector extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(value) {
        this.props.onChange(value)
    }

    journal_option() {
        let {value} = this.props
        if (value == null) return null
        return {id: value.id, text: value.text != null ? value.text : value.name}
    }

	render() {
		let {classes, value} = this.props
		return (
			<AutocompleteReactSelect
                 creatable
                 labelProp="text"
                 name="journal"
                 value={this.journal_option()}
                 listUrl="/api/journals/autocomplete/"
                 createUrl="/api/journals/create/"
                 placeholder="Journal name *"
                 onChange={this.handleChange} />
        )
	}
}

JournalSelector.defaultProps = {
    value: PropTypes.object
};

export default withStyles(styles)(JournalSelector);