import React from 'react';
import PropTypes from 'prop-types';

import {TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput, InputBase, RadioGroup, FormControlLabel,
    Radio, FormGroup} from '@material-ui/core';

import FigureList from '../shared/FigureList.jsx';

import {find} from 'lodash'
import { withStyles } from '@material-ui/core/styles';

const styles = {
    radioGroup: {
        margin: 17
    }
}

class FigureSelector extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            form: {
                url: '',
                type: 'figure'
            },
            creator_showing: false
        };
        this.addFigure = this.addFigure.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleTypeChange = this.handleTypeChange.bind(this)
        this.showCreator = this.showCreator.bind(this)
        this.hideCreator = this.hideCreator.bind(this)
    }

    showCreator() {
        this.setState({creator_showing: true})
    }

    hideCreator() {
        this.setState({creator_showing: false})
    }

    validUrl() {
        let {form} = this.state
        return form.url.length > 5 && form.url.startsWith('http')
    }

    addFigure() {
        let {form} = this.state
        let {figures} = this.props
        if (this.validUrl()) {
            figures.push({
                image_url: form.url,
                figure_number: figures.length + 1,
                is_figure: form.type == 'figure',
                is_table: form.type == 'table'
            })
            form.url = ''
            if (this.props.onChange != null) this.props.onChange(figures)
            this.setState({form: form, creator_showing: false})
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

    handleTypeChange(event) {
        let {form} = this.state
        form.type = event.target.value
        this.setState({ form })
    }

	render() {
		let {classes, figures} = this.props
        let {form, creator_showing} = this.state
		return (
			<div>
				<FigureList
                    figures={figures}
                    onDelete={this.handleDelete}
                    renderHiddenInputs={true}
                    showDelete={true}
                    showAdd={true}
                    onAdd={this.showCreator} />

                <div hidden={!creator_showing}>
                    <TextField
                      id='tfFigure'
                      label={`Enter figure or table image URL`}
                      placeholder="http..."
                      value={form.url || ''}
                      onChange={this.handleChange('url')}
                      inputProps={{'data-lpignore': "true"}}
                      margin="normal"
                      fullWidth
                      variant="outlined"
                    />
    				<Button disabled={!this.validUrl()} onClick={this.addFigure}>Add Figure</Button>
                    <Button onClick={this.hideCreator}>Cancel</Button>
                </div>
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