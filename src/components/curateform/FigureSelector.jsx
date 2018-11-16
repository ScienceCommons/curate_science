import React from 'react';
import PropTypes from 'prop-types';

import {TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput, InputBase} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = {}

class FigureSelector extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };
        this.addFigure = this.addFigure.bind(this)
    }

    addFigure() {
    	let {figure_urls} = this.props
    	figure_urls.push("")
    	if (this.props.onChange != null) this.props.onChange(figure_urls)
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
		          id={`url-${id}`}
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

				<Button onClick={this.addFigure}>Add Figure</Button>

            </div>
        )
	}
}

FigureSelector.propTypes = {
    onChange: PropTypes.func.required
}

FigureSelector.defaultProps = {
	figure_urls: []
};

export default withStyles(styles)(FigureSelector);