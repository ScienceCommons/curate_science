import React from 'react';

import {Input, InputLabel, FormControl, TextField, InputAdornment, Icon,
	Button} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = {}

class MultiURLInput extends React.Component {

	addURL() {
		this.props.onAddURL()
	}

	deleteURL() {

	}

	render() {
		let {label, urls} = this.props
		let inputs = urls.map((url) => {
			return (
				<FormControl key={url}>
			        <InputLabel htmlFor="materials">{ label }</InputLabel>
			        <Input
			          id="materials"
			          startAdornment={
			            <InputAdornment position="start">
			              <Icon>link</Icon>
			            </InputAdornment>
			          }
			        />
			    </FormControl>
			)
		})
		return (
			<div>
				{ inputs }
				<Button variant="contained" size="small" onClick={this.addURL}>
					<Icon>add</Icon>
					Add another URL
				</Button>
			</div>
	    )
	}
}

MultiURLInput.defaultProps = {
	label: "",
	urls: []
}

export default withStyles(styles)(MultiURLInput);