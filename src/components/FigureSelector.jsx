import React from 'react';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import {TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput, InputBase, RadioGroup, FormControlLabel,
    Radio, FormGroup, Paper} from '@material-ui/core';

import FigureList from './shared/FigureList.jsx';

import {simple_api_req} from '../util/util.jsx'

import {find} from 'lodash'
import { withStyles } from '@material-ui/core/styles';

const styles = {
    radioGroup: {
        margin: 17
    }
}

function initialForm() {
    return {
        url: '',
        file: null
    }
}

class FigureSelector extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            form: initialForm(),
            creator_showing: false
        };

        this.create_figure = this.create_figure.bind(this)
        this.handle_delete = this.handle_delete.bind(this)
        this.show_creator = this.show_creator.bind(this)
        this.hide_creator = this.hide_creator.bind(this)
        this.file_selected = this.file_selected.bind(this)
    }

    show_creator() {
        this.setState({creator_showing: true})
    }

    hide_creator() {
        this.setState({creator_showing: false})
    }

    figure_valid() {
        let {form} = this.state
        let url_ok = form.url.length > 5 && form.url.startsWith('http')
        let file_ok = form.file != null
        return url_ok || file_ok
    }

    file_selected(event) {
        let {form} = this.state
        form.file = event.target.files[0]
        this.setState({form})
    }

    create_figure() {
        // Upload figure or create via URL
        let {form} = this.state
        let {figures, article_id, cookies} = this.props
        let formData  = new FormData();
        formData.append('file', form.file);
        fetch(`/api/articles/${article_id}/key_figures/upload/`, {
            method: 'PUT',
            headers: {
                'X-CSRFToken': cookies.get('csrftoken'),
            },
            body: formData
        }).then(r => {
            if (r.ok && r.status == 201) {
                r.json().then(data => {
                    figures.push(data)
                    if (this.props.onChange != null) this.props.onChange(figures)
                    this.setState({form: initialForm(), creator_showing: false})
                })
            } else {
                console.error(r)
            }
        })
    }

    handle_delete(idx) {
    	let {figures, cookies} = this.props
        let pk = figures[idx].id
        simple_api_req('DELETE', `/api/key_figures/${pk}/delete/`, null, cookies.get('csrftoken'), (res) => {
            figures.splice(idx, 1)
            if (this.props.onChange != null) this.props.onChange(figures)
        }, (err) => {
            console.error(err)
        })
    }

    handleChange = prop => event => {
        let {form} = this.state
        form[prop] = event.target.value
        this.setState({form})
    }

	render() {
		let {classes, figures} = this.props
        let {form, creator_showing} = this.state
		return (
			<div>
				<FigureList
                    figures={figures}
                    renderHiddenInputs={true}
                    showDelete={true}
                    showAdd={true}
                    onDelete={this.handle_delete}
                    onAdd={this.show_creator} />

                <div hidden={!creator_showing}>
                    <Paper style={{padding: 10, margin: 10}} elevation={3}>
                        <Typography variant="overline">Add a figure...</Typography>
                        <Grid container spacing={8}>
                            <Grid item xs={6}>
                                <TextField
                                  id='tfFigure'
                                  label="Enter figure or table image URL"
                                  placeholder="http://..."
                                  value={form.url || ''}
                                  onChange={this.handleChange('url')}
                                  inputProps={{'data-lpignore': "true"}}
                                  margin="normal"
                                  fullWidth
                                  variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1">Or...</Typography>
                                <input type="file" name="file" onChange={this.file_selected} style={{paddingTop: 10}}/>
                            </Grid>
                        </Grid>

        				<Button variant="contained"
                                disabled={!this.figure_valid()}
                                onClick={this.create_figure}>Add Figure</Button>
                        <Button onClick={this.hide_creator}>Cancel</Button>
                    </Paper>
                </div>
            </div>
        )
	}
}

FigureSelector.propTypes = {
    article_id: PropTypes.number,
    onChange: PropTypes.func,
    figures: PropTypes.array
}

FigureSelector.defaultProps = {
    article_id: null,
	figures: []
};

export default withCookies(withStyles(styles)(FigureSelector));