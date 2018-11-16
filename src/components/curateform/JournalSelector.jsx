import React from 'react';

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

	render() {
		let {classes, name} = this.props
		return (
			<AutocompleteReactSelect
                                     creatable
                                     labelProp="text"
                                     listUrl="/api/journals/autocomplete/"
                                     createUrl="/api/journals/create/"
                                     placeholder="Journal name *"
                                     onChange={this.handleChange} />
        )
	}
}

JournalSelector.defaultProps = {

};

export default withStyles(styles)(JournalSelector);