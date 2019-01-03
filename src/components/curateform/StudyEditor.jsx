import React from 'react';

import {Dialog, DialogTitle, DialogActions, DialogContent,
	Slide, AppBar, TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput, Toolbar, IconButton, List, ListItem,
	ListItemText, Divider, MenuItem} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import TransparencyEditor from '../../components/TransparencyEditor.jsx';
import ArticleSelector from '../../components/curateform/ArticleSelector.jsx';
import FigureSelector from '../../components/curateform/FigureSelector.jsx';
import AutocompleteCreateConfirmation from '../../components/shared/AutocompleteCreateConfirmation.jsx';

import C from '../../constants/constants';

import {merge, clone} from 'lodash'

const styles = {
	sectionHeading: {
		marginTop: 15,
		marginBottom: 15
	}
}

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class StudyEditor extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
			formdata: {}
		};

		this.handleChange = this.handleChange.bind(this)
		this.handleValueChange = this.handleValueChange.bind(this)
		this.handleFigureChange = this.handleFigureChange.bind(this)
		this.renderReplicationInput = this.renderReplicationInput.bind(this)
		this.handleAddTransparency = this.handleAddTransparency.bind(this)
		this.handleCopyTransparencies = this.handleCopyTransparencies.bind(this)
		this.handleChangeTransparency = this.handleChangeTransparency.bind(this)
		this.handleChangeReportingStandardsType = this.handleChangeReportingStandardsType.bind(this)
		this.handleDeleteTransparency = this.handleDeleteTransparency.bind(this)

		this.replicationInputs = [
			{
				name: 'effects',
				label: 'Target Effects',
				type: 'autocomplete',
				placeholder: "e.g., 'playboy effect'",
				listUrl: "/api/effects/autocomplete/",
				createUrl: "/api/effects/create/"
			},
			{
				name: 'method_similarity_type',
				label: 'Replication Method Similarity',
				type: 'select',
				options: C.METHOD_SIMILARITY
			},
			{
				name: 'method_differences',
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
				name: 'ind_vars',
				label: 'IVs',
				objectLabel: "construct",
				type: 'autocomplete',
				placeholder: "e.g., 'erotica exposure vs. control'",
				listUrl: '/api/constructs/autocomplete/',
				createUrl: '/api/constructs/create/',
				xs: 6
			},
			{
				name: 'dep_vars',
				label: 'DVs',
				objectLabel: "construct",
				type: 'autocomplete',
				placeholder: "e.g., 'partner love'",
				listUrl: '/api/constructs/autocomplete/',
				createUrl: '/api/constructs/create/',
				xs: 6
			},
			{
				name: 'ind_var_methods',
				label: 'IV methods',
				objectLabel: "method",
				type: 'autocomplete',
				placeholder: "e.g., 'Playboy centerfolds vs. abstract art images'",
				listUrl: '/api/methods/autocomplete/',
				createUrl: '/api/methods/create/',
				xs: 6
			},
			{
				name: 'dep_var_methods',
				label: 'DV methods',
				objectLabel: "method",
				type: 'autocomplete',
				placeholder: "e.g., 'Rubin Love Scale (13-item)'",
				listUrl: '/api/methods/autocomplete/',
				createUrl: '/api/methods/create/',
				xs: 6
			}
		]
	}

	componentWillReceiveProps(nextProps) {
		let opening = !this.props.open && nextProps.open && nextProps.editStudy != null
		if (opening) {
			let data = clone(nextProps.editStudy)
			this.setState({formdata: data})
		}
	}

	handleClose = () => {
		this.props.onClose()
	}

	handleSave = () => {
		let {idx} = this.props
		let {formdata} = this.state
		this.props.onSave(idx, formdata)
	}

	handleChange = prop => event => {
		let {formdata} = this.state
		formdata[prop] = event.target.value
		this.setState({formdata})
	}

	handleValueChange = prop => value => {
		let {formdata} = this.state
		value.name = value.text
		if (Array.isArray(value)) {
			value = value.map((val) => ({id: val.id, name: val.text}))
		} else {
			value = {id: value.id, name: value.text}
		}
		formdata[prop] = value
		this.setState({formdata})
	}

	handleFigureChange = figure_array => {
		let {formdata} = this.state
		formdata.key_figures = figure_array
		this.setState({formdata})
	}

	handleAddTransparency(tt) {
		let {formdata} = this.state
		if (formdata.transparencies == null) formdata.transparencies = []
		formdata.transparencies.push({transparency_type: tt})
		this.setState({formdata})
	}

	handleChangeTransparency(idx, tt) {
		let {formdata} = this.state
		formdata.transparencies[idx] = tt
		this.setState({formdata})
	}

	handleDeleteTransparency(idx) {
		let {formdata} = this.state
		formdata.transparencies.splice(idx, 1)
		this.setState({formdata})
	}

	handleCopyTransparencies(from_study) {
		let {formdata} = this.state
		formdata.transparencies = clone(from_study.transparencies)
		formdata.reporting_standards_type = from_study.reporting_standards_type
		this.setState({formdata})
	}

	handleChangeReportingStandardsType(event) {
		let {formdata} = this.state
		formdata.reporting_standards_type = event.target.value
		this.setState({formdata})
	}

	renderReplicationInput(params, i) {
		let {classes} = this.props
		let {formdata} = this.state
		let cell_content
		if (params.type == 'autocomplete') {
			let form_vals = formdata[params.name]
			let vals = []
			if (form_vals != null) {
				vals = form_vals.map((fv) => {
					return {id: fv.id, text: fv.name}
				})
			}
			cell_content = (
				<AutocompleteCreateConfirmation
					 key={i}
                     creatable
                     listUrl={params.listUrl}
                     createtUrl={params.createtUrl}
                     placeholder={params.label}
                     objectLabel={params.objectLabel}
                     multi
                     value={vals}
                     onChange={this.handleValueChange(params.name)} />
			)
		} else if (params.type == 'text') {
			cell_content = (
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
			cell_content = (
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
		return <Grid item xs={params.xs || 12} key={i}>{ cell_content }</Grid>
	}

	render() {
		const { classes, open, editStudy, article_type, all_studies } = this.props;
		let {formdata} = this.state
		let other_studies = all_studies.filter((s) => {
			return editStudy == null || s.id != editStudy.id
		})
		let transparencies = formdata.transparencies
		let creating_new = editStudy == null
		let replication_details
		if (article_type == "ORIGINAL") {
			replication_details = (
				<div>
					<Typography variant="h5" className={classes.sectionHeading}>Replication Details</Typography>
					<Grid container spacing={16}>
						{ this.replicationInputs.map(this.renderReplicationInput)}
					</Grid>
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
						<Typography variant="h5" className={classes.sectionHeading}>Study Number</Typography>
						<TextField
				          id="study_number"
				          key="study_number"
				          label="Study Number"
				          className={classes.textField}
				          value={formdata.study_number || ''}
				          onChange={this.handleChange('study_number')}
				          margin="normal"
				          fullWidth
				          required
				          variant="outlined"
				        />

						<Typography variant="h5" className={classes.sectionHeading}>Original Article/Study</Typography>
						<ArticleSelector selectStudy={true} withCreator={true} />

						<TransparencyEditor
								transparencies={transparencies}
								other_studies={other_studies}
								reporting_standards_type={formdata.reporting_standards_type}
								article_type={article_type || "ORIGINAL"}
								onChangeReportingStandardsType={this.handleChangeReportingStandardsType}
								onChangeTransparency={this.handleChangeTransparency}
								onDeleteTransparency={this.handleDeleteTransparency}
								onAddTransparency={this.handleAddTransparency}
								onCopyTransparencies={this.handleCopyTransparencies} />

						<Typography variant="h5" className={classes.sectionHeading}>Key Figures/Tables</Typography>
						<FigureSelector figures={formdata.key_figures || []} onChange={this.handleFigureChange} />

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
	editStudy: null,
	all_studies: []
};

export default withStyles(styles)(StudyEditor);