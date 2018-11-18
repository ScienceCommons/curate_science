import React from 'react';

import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import {TextField, Button, Card, Grid, Typography, Menu, MenuItem, InputLabel,
	FormControl, FormControlLabel, RadioGroup, Radio, Checkbox,
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
		padding: 20
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
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
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

  	handleCheckChange = (prop) => (event, checked) => {
  		let {formdata} = this.state
  		formdata[prop] = checked
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
		const { classes, cookies } = this.props;
		let {formdata, study_editor_open, studies, study_editor_study} = this.state
		let at = find(C.ARTICLE_TYPES, {id: formdata.type || 'ORIGINAL'})
		let show_reanalysis, show_commentary, show_study_section, show_replication
		if (at != null) {
			show_reanalysis = at.relevant_sections.indexOf('reanalysis') > -1
			show_commentary = at.relevant_sections.indexOf('commentary') > -1
			show_study_section = at.relevant_sections.indexOf('studies') > -1
			show_replication = at.relevant_sections.indexOf('replication') > -1
		}
		let csrf_token = cookies.get('csrftoken')
		return (
			<div className={classes.root}>
				<Typography variant="h4">Add/Edit Article</Typography>

				<DOILookup onLookup={this.handleDOILookupResults} />

				<form noValidate
					autoComplete="off"
					action="/api/articles/create/"
					method="POST">

					<input type="hidden" name="csrfmiddlewaretoken" value={csrf_token} />

					<Grid container className={classes.root} spacing={24}>
						<Grid xs={12} item>

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

					    </Grid>
					    <Grid item xs={3}>
							<FormControl
								variant="outlined"
								fullWidth
								className={classes.formControl}>
						        <InputLabel
						            ref={ref => {
						              this.InputLabelRef = ref;
						            }}
						            htmlFor="research_area"
						          >
						            Research Area
						        </InputLabel>
						        <Select
						            value={formdata.research_area || "SOCIAL_SCIENCE"}
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
						</Grid>
						<Grid item xs={3}>
							<FormControl variant="outlined" fullWidth className={classes.formControl}>
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
						                name="article_type"
						                id="type"
						              />
						            }
						          >
						          { C.ARTICLE_TYPES.map((at) => {
						            	return <MenuItem key={at.id} value={at.id}>{at.label}</MenuItem>
						            })}
						        </Select>
						    </FormControl>
						</Grid>
						<Grid item xs={6}>
					        <JournalSelector onChange={this.handleValueChange('journal')} />
					    </Grid>
						<Grid item xs={6}>
						    <TextField
					          id="year"
					          label="Year (YYYY)"
					          className={classes.textField}
					          value={formdata.year || ''}
					          onChange={this.handleChange('year')}
					          inputProps={{pattern: "\d\d\d\d"}}
					          type="number"
					          margin="normal"
					          variant="outlined"
					          disabled={formdata.in_press}
					        />

				    		<FormControlLabel
					            control={
				    	            <Checkbox
				    	              checked={formdata.in_press}
				    	              onChange={this.handleCheckChange('in_press')}
				    	              checked={formdata.in_press}
				    	              value={'in_press'}
				    	              color="primary"
				    	            />
				    	          }
				                label="In press"
					        />
					    </Grid>
					    <Grid item xs={6}>
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

						<Grid item xs={12}>
							<Typography variant="h4">Key figures/tables (article-level)</Typography>
							<FigureSelector figures={formdata.figures} onChange={this.handleValueChange('figures')} />
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
						</Grid>

					</Grid>

					<StudyEditor open={study_editor_open}
								 onClose={this.closeStudyEditor}
								 onSave={this.saveStudy}
								 article_type={formdata.type}
								 editStudy={study_editor_study} />

				</form>
			</div>
		)
	}
}

Curate.propTypes = {
	cookies: instanceOf(Cookies).isRequired
}

export default withCookies(withStyles(styles)(Curate));
