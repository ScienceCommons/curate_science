import React from 'react';

import {Input, InputLabel, FormControl, TextField, InputAdornment, Icon,
	Button} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = {}

class URLInput extends React.Component {

	constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this)
	}

	handleChange(e) {
		this.props.onChange(e)
	}

	render() {
		let {label, url, id} = this.props
		let input = (
			<FormControl fullWidth key={id} margin="normal">
		        <InputLabel htmlFor={id}>{ label }</InputLabel>
		        <Input
		          id={id}
		          name={id}
		          fullWidth
		          onChange={this.handleChange}
		          type="url"
		          value={url || ''}
		          inputProps={{pattern: "https?://.+"}}
		          startAdornment={
		            <InputAdornment position="start">
		              <Icon>link</Icon>
		            </InputAdornment>
		          }
		        />
		    </FormControl>
		)
		return (
			<div>
				{ input }
			</div>
	    )
	}
}

URLInput.defaultProps = {
	id: "",
	label: "",
	url: ""
}

export default withStyles(styles)(URLInput);