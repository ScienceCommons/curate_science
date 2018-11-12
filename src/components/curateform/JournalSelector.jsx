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
        let suggestions = [
            {value: "Nature", label: "Nature"},
            {value: "Science", label: "Science"}
        ] // TOOD
		return (
			<AutocompleteReactSelect suggestions={suggestions}
                                     placeholder="Journal name *"
                                     onChange={this.handleChange} />
        )
	}
}

JournalSelector.defaultProps = {

};

export default withStyles(styles)(JournalSelector);