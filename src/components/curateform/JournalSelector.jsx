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
        console.log(value)
        this.props.onChange(value)
    }

	render() {
		let {classes, value} = this.props
		return (
			<AutocompleteReactSelect
                 creatable
                 labelProp="text"
                 value={value}
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