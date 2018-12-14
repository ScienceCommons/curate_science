import React from 'react';
import PropTypes from 'prop-types';

import {TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput, InputBase} from '@material-ui/core';

import FigureList from '../shared/FigureList.jsx';

import { withStyles } from '@material-ui/core/styles';

const styles = {}

class FigureSelector extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            form: {
                url: ''
            }
        };
        this.addFigure = this.addFigure.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }

    validUrl() {
        let {form} = this.state
        return form.url.length > 5
    }

    addFigure() {
        let {form} = this.state
        let {figures} = this.props
        if (this.validUrl()) {
            figures.push({image_url: form.url, figure_number: figures.length + 1})
            form.url = ''
            if (this.props.onChange != null) this.props.onChange(figures)
            this.setState({form})
        }
    }

    handleDelete(idx) {
    	let {figures} = this.props
        figures.splice(idx, 1)
        if (this.props.onChange != null) this.props.onChange(figures)
    }

    handleChange = prop => event => {
        let {form} = this.state
        form[prop] = event.target.value
        this.setState({form})
    }

	render() {
		let {classes, figures} = this.props
        let {form} = this.state
		return (
			<div>
				<FigureList
                    figures={figures}
                    onDelete={this.handleDelete}
                    renderHiddenInputs={true}
                    showDelete={true} />

                <Grid container>
                    <Grid item xs={8}>
                        <TextField
                          id='tfFigure'
                          label={`Enter figure or table image URL...`}
                          value={form.url || ''}
                          onChange={this.handleChange('url')}
                          inputProps={{'data-lpignore': "true"}}
                          margin="normal"
                          fullWidth
                          variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4} style={{padding: 23}}>
        				<Button disabled={!this.validUrl()} onClick={this.addFigure}>Add Figure</Button>
                    </Grid>
                </Grid>

            </div>
        )
	}
}

FigureSelector.propTypes = {
    onChange: PropTypes.func
}

FigureSelector.defaultProps = {
	figures: []
};

export default withStyles(styles)(FigureSelector);