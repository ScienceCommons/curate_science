import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import {TextField, Button, Card, Grid, Typography, Menu, MenuItem, InputLabel,
	FormControl, FormControlLabel, RadioGroup, Radio,
	Select, OutlinedInput, Paper} from '@material-ui/core';

import C from '../constants/constants';

import TransparencyEditor from '../components/TransparencyEditor.jsx';
import StudyLI from '../components/listitems/StudyLI.jsx';
import DOILookup from '../components/curateform/DOILookup.jsx';
import StudyEditor from '../components/curateform/StudyEditor.jsx';
import JournalSelector from '../components/curateform/JournalSelector.jsx';
import AuthorSelector from '../components/curateform/AuthorSelector.jsx';
import ArticleSelector from '../components/curateform/ArticleSelector.jsx';
import FigureSelector from '../components/curateform/FigureSelector.jsx';

import {get, find} from 'lodash'
import {printDate} from '../util/util.jsx'

const styles = {
	root: {
		padding: 10
	},
	textField: {

	},
	root: {
		padding: 13
	},
	formControl: {

	}
}

class Curate extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	formdata: {},
        	studies: [],
        	study_editor_open: false,
        	study_editor_study: null
        };

        this.handleDOILookupResults = this.handleDOILookupResults.bind(this)
        this.openStudyEditor = this.toggleStudyEditor.bind(this, true)
        this.closeStudyEditor = this.toggleStudyEditor.bind(this, false)
        this.saveStudy = this.saveStudy.bind(this)
    }

    componentDidMount() {

    }

    handleDOILookupResults(res) {
    	let {formdata} = this.state
    	formdata.title = res.title[0]
    	formdata.authors = res.author.map((author) => author.family).join(', ')
    	formdata.year = get(res, ['journal-issue', 'published-print', 'date-parts', 0, 0])
		this.setState({formdata})
    }

    handleChange = prop => event => {
    	let {formdata} = this.state
    	formdata[prop] = event.target.value
	    this.setState({formdata});
  	}

    handleValueChange = prop => value => {
    	let {formdata} = this.state
    	formdata[prop] = value
	    this.setState({formdata});
  	}

  	toggleStudyEditor(open) {
  		this.setState({study_editor_open: open})
  	}

  	saveStudy(study) {
  		this.toggleStudyEditor(false)
  		let {studies} = this.state
  		studies.push(study)
  		this.setState({studies})
  	}


	render() {
		//
		const { classes } = this.props;
		let {formdata, study_editor_open, studies, study_editor_study} = this.state
		let at = find(C.ARTICLE_TYPES, {id: formdata.type || 'ORIGINAL'})
		let show_reanalysis, show_commentary, show_study_section, show_replication
		if (at != null) {
			show_reanalysis = at.relevant_sections.indexOf('reanalysis') > -1
			show_commentary = at.relevant_sections.indexOf('commentary') > -1
			show_study_section = at.relevant_sections.indexOf('studies') > -1
			show_replication = at.relevant_sections.indexOf('replication') > -1
		}
		return (
			<form noValidate
				autoComplete="off"
				action="/api/articles/create/"
				method="POST"
				className={classes.root}>
				<Grid container className={classes.root} spacing={24}>
					<Grid xs={12} item>
						<Typography variant="h4">Add/Edit Article</Typography>

						<DOILookup onLookup={this.handleDOILookupResults} />

				        <TextField
				          id="title"
				          label="Article title"
				          className={classes.textField}
				          value={formdata.title || ''}
				          onChange={this.handleChange('title')}
				          margin="normal"
				          name="title"
				          fullWidth
				          required
				          variant="outlined"
				        />
				    </Grid>
				    <Grid item xs={6}>

				        <AuthorSelector />

				        <JournalSelector onChange={this.handleValueChange('journal')} />

				    </Grid>
				    <Grid item xs={6}>
						<FormControl variant="outlined" className={classes.formControl}>
					        <InputLabel
					            ref={ref => {
					              this.InputLabelRef = ref;
					            }}
					            htmlFor="research_area"
					          >
					            Research Area
					        </InputLabel>
					        <Select
					            value={formdata.research_area || "social_science"}
					            onChange={this.handleChange('research_area')}
					            input={
					              <OutlinedInput
					                labelWidth={100}
					                name="research_area"
					                id="research_area"
					              />
					            }
					          >
					            { C.RESEARCH_AREAS.map((ra) => {
					            	return <MenuItem key={ra.id} value={ra.id}>{ra.label}</MenuItem>
					            })}
					        </Select>
					    </FormControl>

						<FormControl variant="outlined" className={classes.formControl}>
					        <InputLabel
					            ref={ref => {
					              this.InputLabelRef = ref;
					            }}
					            htmlFor="type"
					          >
					            Article Type
					        </InputLabel>
					        <Select
					            value={formdata.type || "ORIGINAL"}
					            onChange={this.handleChange('type')}
					            input={
					              <OutlinedInput
  	                                labelWidth={80}
					                name="type"
					                id="type"
					              />
					            }
					          >
					          { C.ARTICLE_TYPES.map((at) => {
					            	return <MenuItem key={at.id} value={at.id}>{at.label}</MenuItem>
					            })}
					        </Select>
					    </FormControl>

					    <TextField
				          id="year"
				          label="Year (or 'in press')"
				          className={classes.textField}
				          value={formdata.year || ''}
				          onChange={this.handleChange('year')}
				          margin="normal"
				          variant="outlined"
				        />

						<TextField
				          id="abstract"
				          label="Abstract"
				          className={classes.textField}
				          value={formdata.abstract}
				          onChange={this.handleChange('abstract')}
				          margin="normal"
				          fullWidth
				          multiline
				          variant="outlined"
				        />
				    </Grid>

					<Grid item xs={12}>
						<Typography variant="h4">Key figures/tables (article-level)</Typography>
						<FigureSelector onChange={""} />
					</Grid>

					<Grid item xs={12} hidden={!show_reanalysis}>
						<Typography variant="h4">Reanalysis Details</Typography>
						<FormControl component="fieldset" className={classes.formControl}>
				          <RadioGroup
				            aria-label="reanalysis_details"
				            name="reanalysis_details"
				            className={classes.group}
				            value={formdata.reanalysis_details}
				          >
				            <FormControlLabel value="reproducibility" control={<Radio />} label="Reproducibility" />
				            <FormControlLabel value="robustness" control={<Radio />} label="Robustness" />
				          </RadioGroup>
				        </FormControl>
						<ArticleSelector />
					</Grid>

					<Grid item xs={12} hidden={!show_commentary}>
						<Typography variant="h4">Commentary Details</Typography>
						<ArticleSelector />
					</Grid>

					<Grid item xs={12} hidden={!show_study_section}>
						<Typography variant="h3" gutterBottom>Studies</Typography>
						{ studies.map(study => <StudyLI key={study.id}
														study={study}
														showReplicationDetails={show_replication}
														showActions={true} />) }
						<Button variant="contained" onClick={this.openStudyEditor}>Add Study</Button>
					</Grid>

					<Grid item xs={6}>
						<Button variant="contained" color="primary" size="large" type="submit">Save</Button>
						<Button size="large">Cancel</Button>
					</Grid>

				</Grid>

				<StudyEditor open={study_editor_open}
							 onClose={this.closeStudyEditor}
							 onSave={this.saveStudy}
							 editStudy={study_editor_study} />

			</form>
		)
	}
}

Curate.defaultProps = {

}

export default withStyles(styles)(Curate);
