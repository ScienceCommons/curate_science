import React from 'react';

import {TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput, InputBase} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = {}

class FigureSelector extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };
    }

    addFigure() {
    	let {figure_urls} = this.props
    	figure_urls.push("")
    	this.props.onChange(figure_urls)
    }

    deleteFigure(idx) {
    	// TODO
    }

    handleChange(event) {

    }

    render_url_input(id, url) {
    	let num = id + 1
    	return (
    		<TextField
		          id={id}
		          key={id}
		          label={`Figure/Table ${num}`}
		          value={url || ''}
		          onChange={this.handleChange}
		          margin="normal"
		          fullWidth
		          variant="outlined"
		        />
        )
    }

	render() {
		let {classes, figure_urls} = this.props
		return (
			<div className={classes.search}>
				{ figure_urls.map((url, i) => this.render_url_input(i, url)) }
            </div>
        )
	}
}

FigureSelector.defaultProps = {
	figure_urls: []
};

export default withStyles(styles)(FigureSelector);