import React from 'react';

import {Dialog, Slide, AppBar, TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput, Toolbar, IconButton, List, ListItem,
	ListItemText, Divider, MenuItem} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import TransparencyEditor from '../../components/TransparencyEditor.jsx';
import ArticleSelector from '../../components/curateform/ArticleSelector.jsx';
import FigureSelector from '../../components/curateform/FigureSelector.jsx';

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
		this.handleFigureChange = this.handleFigureChange.bind(this)
		this.renderReplicationInput = this.renderReplicationInput.bind(this)
		this.handleAddTransparency = this.handleAddTransparency.bind(this)

		this.replicationInputs = [
			{
				name: 'target.effects',
				label: 'Target Effects',
				type: 'text',
				placeholder: "e.g., 'playboy effect'"
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
				type: 'text',
				placeholder: "e.g., 'erotica exposure vs. control'"
			},
			{
				name: 'dvs',
				label: 'DVs',
				type: 'text',
				placeholder: "e.g., 'partner love'"
			},
			{
				name: 'iv.methods',
				label: 'IV methods',
				type: 'text',
				placeholder: "e.g., 'Playboy centerfolds vs. abstract art images'"
			},
			{
				name: 'dv.methods',
				label: 'DV methods',
				type: 'text',
				placeholder: "e.g., 'Rubin Love Scale (13-item)'"
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

	handleFigureChange = figure_array => {
		let {formdata} = this.state
		formdata.figure_urls = figure_array
		this.setState({formdata})
	}

	handleAddTransparency(tt) {
		this.setState({transparencies: this.state.transparencies.concat({transparency_type: tt})})
	}

	renderReplicationInput(params) {
		let {classes} = this.props
		let {formdata} = this.state
		if (params.type == 'text') {
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
			return (
				<FormControl key={params.name} variant="outlined" fullWidth className={classes.formControl}>
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
		const { classes, open, editStudy } = this.props;
		let {formdata, transparencies} = this.state
		let creating_new = editStudy == null
		return (
			<div>
				<Dialog
					fullScreen
					open={open}
					onClose={this.handleClose}
					TransitionComponent={Transition}
				>
					<AppBar className={classes.appBar}>
						<Toolbar>
							<IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
								<Icon>close</Icon>
							</IconButton>
							<Typography variant="h6" color="inherit" className={classes.flex}>
								{ creating_new ? "Add" : "Edit" } Study
							</Typography>
							<Button color="inherit" onClick={this.handleSave}>
								save
							</Button>
						</Toolbar>
					</AppBar>

					<Grid container style={{padding: 10, marginTop: 70}}>

						<Grid item xs={6}>
							<TransparencyEditor
								transparencies={transparencies}
								onAddTransparency={this.handleAddTransparency} />
						</Grid>

						<Grid item xs={6}>
							<Typography variant="h5">Original Article/Study</Typography>
						</Grid>

						<Grid item xs={6}>
							<ArticleSelector selectStudy={true} />
						</Grid>

						<Grid item xs={6}>
							<Typography variant="h5" gutterBottom>Key Figures/Tables</Typography>
							<FigureSelector figure_urls={formdata.figure_urls || [""]} onChange={this.handleFigureChange} />
						</Grid>

						<Typography variant="h5" gutterBottom>Replication Details</Typography>

						{ this.replicationInputs.map(this.renderReplicationInput)}
					</Grid>
				</Dialog>
			</div>
			);
	}
}

StudyEditor.defaultProps = {
	open: false,
	editStudy: null
};

export default withStyles(styles)(StudyEditor);