import React from 'react';

import {Dialog, DialogTitle, DialogActions, DialogContent,
	Slide, AppBar, TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput, Toolbar, IconButton, List, ListItem,
	ListItemText, Divider, MenuItem} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import TransparencyEditor from '../../components/TransparencyEditor.jsx';
import ArticleSelector from '../../components/curateform/ArticleSelector.jsx';
import FigureSelector from '../../components/curateform/FigureSelector.jsx';
import AutocompleteReactSelect from '../../components/AutocompleteReactSelect.jsx';

import {merge} from 'lodash'

const styles = {

}

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class StudyEditor extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
			formdata: {},
			transparencies: []
		};

		this.handleChange = this.handleChange.bind(this)
		this.handleValueChange = this.handleValueChange.bind(this)
		this.handleFigureChange = this.handleFigureChange.bind(this)
		this.renderReplicationInput = this.renderReplicationInput.bind(this)
		this.handleAddTransparency = this.handleAddTransparency.bind(this)

		this.replicationInputs = [
			{
				name: 'target.effects',
				label: 'Target Effects',
				type: 'autocomplete',
				placeholder: "e.g., 'playboy effect'",
				list_url: "/api/effects/autocomplete/"
			},
			{
				name: 'repl.method.similarity',
				label: 'Replication Method Similarity',
				type: 'select',
				options: [
					{
						value: 'close',
						label: "Close"
					},
					{
						value: 'very_close',
						label: "Very Close"
					},
					{
						value: 'exact',
						label: "Exact"
					}
				]
			},
			{
				name: 'repl.differences',
				label: 'Replication Differences',
				type: 'text',
				placeholder: "e.g., 'diff. DV stimuli'"
			},
			{
				name: 'aux.hypotheses',
				label: 'Auxilliary Hypotheses',
				type: 'text',
				placeholder: "e.g., 'success. manip. check'"
			},
			{
				name: 'ivs',
				label: 'IVs',
				type: 'autocomplete',
				placeholder: "e.g., 'erotica exposure vs. control'",
				list_url: '/api/constructs/autocomplete/'
			},
			{
				name: 'dvs',
				label: 'DVs',
				type: 'autocomplete',
				placeholder: "e.g., 'partner love'",
				list_url: '/api/constructs/autocomplete/'
			},
			{
				name: 'iv.methods',
				label: 'IV methods',
				type: 'autocomplete',
				placeholder: "e.g., 'Playboy centerfolds vs. abstract art images'",
				list_url: '/api/methods/autocomplete/'
			},
			{
				name: 'dv.methods',
				label: 'DV methods',
				type: 'autocomplete',
				placeholder: "e.g., 'Rubin Love Scale (13-item)'",
				list_url: '/api/methods/autocomplete/'
			}
		]
	}

	handleClose = () => {
		this.props.onClose()
	}

	handleSave = () => {
		let {editStudy} = this.props
		let {formdata} = this.state
		let merged = merge(editStudy, formdata)
		this.props.onSave(merged)
	}

	handleChange = prop => event => {
		let {formdata} = this.state
		formdata[prop] = event.target.value
		this.setState({formdata})
	}

	handleValueChange = prop => value => {
		let {formdata} = this.state
		formdata[prop] = value
		this.setState({formdata})
	}

	handleFigureChange = figure_array => {
		let {formdata} = this.state
		formdata.figures = figure_array
		this.setState({formdata})
	}

	handleAddTransparency(tt) {
		this.setState({transparencies: this.state.transparencies.concat({transparency_type: tt})})
	}

	renderReplicationInput(params, i) {
		let {classes} = this.props
		let {formdata} = this.state
		if (params.type == 'autocomplete') {
			return (
			<AutocompleteReactSelect
								 key={i}
                                 creatable
                                 labelProp="text"
                                 listUrl={params.list_url}
                                 placeholder={params.label}
                                 multi
                                 onChange={this.handleValueChange(params.name)} />
			)
		} else if (params.type == 'text') {
			return (
				<TextField
			          id={params.name}
			          key={params.name}
			          label={params.label}
			          className={classes.textField}
			          value={formdata[params.name] || ''}
			          onChange={this.handleChange(params.name)}
			          margin="normal"
			          fullWidth
			          variant="outlined"
			        />
				)
		} else if (params.type == 'select') {
			let lw = params.label.length * 6
			return (
				<FormControl
					key={params.name}
					variant="outlined"
					fullWidth
					className={classes.formControl}>
			        <InputLabel
			            ref={ref => {
			              this.InputLabelRef = ref;
			            }}
			            htmlFor={params.name}
			          >
			            { params.label }
			        </InputLabel>
			        <Select
			            value={formdata[params.name] || params.options[0].value}
			            onChange={this.handleChange(params.name)}
			            input={
			              <OutlinedInput
			                name={params.name}
			                id={params.name}
			                labelWidth={lw}
			              />
			            }
			          >
			            { params.options.map((op) => {
			            	return <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
			            })}
			        </Select>
			    </FormControl>
				)
		}
	}

	render() {
		const { classes, open, editStudy, article_type } = this.props;
		let {formdata, transparencies} = this.state
		let creating_new = editStudy == null
		let replication_details
		if (article_type == "ORIGINAL") {
			replication_details = (
				<div>
					<Typography variant="h5" gutterBottom>Replication Details</Typography>
					{ this.replicationInputs.map(this.renderReplicationInput)}
				</div>
			)
		}
		return (
			<div>
				<Dialog
					fullWidth
					maxWidth='lg'
					open={open}
					onClose={this.handleClose}
					TransitionComponent={Transition}
				>
					<DialogTitle id="form-dialog-title">{ creating_new ? "Add" : "Edit" } Study</DialogTitle>

					<DialogContent>
						<Typography variant="h5">Original Article/Study</Typography>
						<ArticleSelector selectStudy={true} />

						<TransparencyEditor
								transparencies={transparencies}
								article_type={article_type || "ORIGINAL"}
								onAddTransparency={this.handleAddTransparency} />

						<Typography variant="h5" gutterBottom>Key Figures/Tables</Typography>
						<FigureSelector figures={formdata.figures || []} onChange={this.handleFigureChange} />

						{ replication_details }
					</DialogContent>

					<DialogActions>
						<Button color="inherit" variant="contained" color="primary" onClick={this.handleSave}>
							save
						</Button>
			            <Button onClick={this.handleClose} color="primary">
			              Cancel
			            </Button>
			          </DialogActions>
				</Dialog>
			</div>
			);
	}
}

StudyEditor.defaultProps = {
	open: false,
	article_type: "ORIGINAL",
	editStudy: null
};

export default withStyles(styles)(StudyEditor);