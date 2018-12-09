import React from 'react';

import { withRouter } from 'react-router-dom';

import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import {TextField, Button, Card, Grid, Typography, Menu, MenuItem, InputLabel,
	FormControl, FormControlLabel, RadioGroup, Radio, Checkbox,
	Select, OutlinedInput, Paper, Snackbar, Icon} from '@material-ui/core';

import C from '../constants/constants';

import TransparencyEditor from '../components/TransparencyEditor.jsx';
import StudyLI from '../components/listitems/StudyLI.jsx';
import DOILookup from '../components/curateform/DOILookup.jsx';
import StudyEditor from '../components/curateform/StudyEditor.jsx';
import JournalSelector from '../components/curateform/JournalSelector.jsx';
import AuthorSelector from '../components/curateform/AuthorSelector.jsx';
import ArticleSelector from '../components/curateform/ArticleSelector.jsx';
import FigureSelector from '../components/curateform/FigureSelector.jsx';
import URLInput from '../components/curateform/URLInput.jsx';

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
        	study_editor_idx: -1
        };

        this.handleDOILookupResults = this.handleDOILookupResults.bind(this)
        this.addNewStudy = this.addNewStudy.bind(this)
        this.closeStudyEditor = this.closeStudyEditor.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
        this.saveStudy = this.saveStudy.bind(this)
        this.snackClose = this.snackClose.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleStudyDelete = this.handleStudyDelete.bind(this)
        this.handleStudyEdit = this.handleStudyEdit.bind(this)
        this.authorsToAutocomplete = this.authorsToAutocomplete.bind(this)
        this.journalToAutocomplete = this.journalToAutocomplete.bind(this)

        this.TEXT_LINKS = [
        	{ label: 'PDF URL', property: 'pdf_url' },
        	{ label: 'HTML URL', property: 'html_url' },
        	{ label: 'Preprint URL', property: 'preprint_url' }
        ]
    }

    componentDidMount() {
    	let id = this.editing_id()
    	if (id != null) {
    		this.fetch_article(id)
    	}
    }

    fetch_article(id) {
    	fetch(`/api/articles/${id}`).then(res => res.json()).then((res) => {
    		console.log(res)
    		if (res.authors != null) res.authors = this.authorsToAutocomplete(res.authors)
    		if (res.journal != null) res.journal = this.journalToAutocomplete(res.journal)
    		this.setState({formdata: res})
    	})
    }

    editing_id() {
		let {match} = this.props
    	return match.params.id
    }

    editing() {
    	return this.editing_id() != null
    }

    snackClose() {
    	this.setState({snack_message: null})
    }

    handleStudyEdit(idx) {
    	console.log(`Edit ${idx}`)
    	this.setState({study_editor_idx: idx})
    }

    handleStudyDelete(idx) {
    	console.log(`Delete idx ${idx}`)
	    let {formdata} = this.state
	    let studies = formdata.studies
	    if (idx < studies.length) {
	    	studies.splice(idx, 1)
		    this.setState({formdata})
	    }
    }

    handleDOILookupResults(res) {
    	let {formdata} = this.state
    	formdata.title = res.title[0]
    	formdata.authors = res.author.map((author) => author.family).join(', ')
    	formdata.year = get(res, ['journal-issue', 'published-print', 'date-parts', 0, 0])
		this.setState({formdata: formdata, snack_message: "Found article"})
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

  	closeStudyEditor() {
  		this.setState({study_editor_idx: -1})
  	}

  	addNewStudy() {
  		let {formdata} = this.state
  		if (formdata.studies == null) formdata.studies = []
  		formdata.studies.push({method_similarity_type: 'close'}) // New blank study object
  		this.setState({formdata: formdata, study_editor_idx: formdata.studies.length - 1})
  	}

  	saveStudy(idx, study) {
  		this.closeStudyEditor()
  		let {formdata} = this.state
  		console.log(`Saving study ${idx}`)
  		console.log(study)
  		formdata.studies[idx] = study
  		this.setState({formdata})
  	}

  	handleSubmit(e) {
  		const { cookies } = this.props;
  		e.preventDefault()
  		// TODO: Add study data
  		// TODO: Confirm study deletion, figure deletion working
  		var form = document.getElementById('curateForm');
		let formData = new FormData(form);
  		let editing_id = this.editing_id()
  		let creating_new = editing_id == null
  		const USE_API_URL = true
  		let url = creating_new ? `/articles/create/` : `/articles/${editing_id}/update/`
  		let method = 'POST'
  		if (USE_API_URL) {
  			url = '/api' + url
  			method = creating_new ? 'POST' : 'PATCH'
  		}
  		let csrf_token = cookies.get('csrftoken')
  		let fetch_opts = {
		    credentials: 'include',
  			method: method,
  			body: formData,
  			headers: {
  				'X-CSRFToken': csrf_token
  			}
  		}
  		fetch(url, fetch_opts).then(res => res.json().then(data => {
  			console.log(res.status)
  			console.log(data)
    		if (res.ok) {
    			// Created or updated
    			window.location.replace(`/new/article/${creating_new ? data.id : editing_id}/`)
    		} else if (!res.ok) {
    			// Handle error
    			let detail = data.detail
    			if (detail != null) this.setState({snack_message: detail})
    		}
    	}))
  	}

  	authorsToAutocomplete(authors) {
  		if (authors == null) authors = []
  		return authors.map((author) => {
  			return {id: author.id, text: [author.first_name, author.last_name].join(' ')}
  		})
  	}

  	journalToAutocomplete(journal) {
  		return {id: journal.id, text: journal.name}
  	}

	render() {
		const { classes, cookies } = this.props;
		let {formdata, study_editor_idx, snack_message} = this.state
		let studies = formdata.studies || []
		let at = find(C.ARTICLE_TYPES, {id: formdata.article_type || 'ORIGINAL'})
		let show_reanalysis, show_commentary, show_study_section, show_replication
		let form_action = this.editing() ? "Edit" : "Add"
		if (at != null) {
			show_reanalysis = at.relevant_sections.indexOf('reanalysis') > -1
			show_commentary = at.relevant_sections.indexOf('commentary') > -1
			show_study_section = at.relevant_sections.indexOf('studies') > -1
			show_replication = at.relevant_sections.indexOf('replication') > -1
		}
		return (
			<div className={classes.root}>
				<Grid container className={classes.root} spacing={24}>
					<Grid item xs={12}>
						<Typography variant="h2">{form_action} Article</Typography>
					</Grid>
				</Grid>

				<form
					id="curateForm"
					autoComplete="off"
					onSubmit={this.handleSubmit}
					method="POST">

					<input type="hidden" name="doi" value={formdata.doi || ''} />

					<Grid container className={classes.root} spacing={24}>

						<Grid item xs={12}>
							<DOILookup
								onLookup={this.handleDOILookupResults}
								canLookup={!this.editing()}
								onChange={this.handleValueChange('doi')}
								value={formdata.doi || ''} />
						</Grid>

						<Grid xs={12} item>

					        <TextField
					          id="title"
					          label="Article title"
					          inputProps={{'data-lpignore': "true"}}
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

					        <AuthorSelector
					        	onChange={this.handleValueChange('authors')}
					        	value={formdata.authors} />

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
						            htmlFor="article_type"
						          >
						            Article Type
						        </InputLabel>
						        <Select
						            value={formdata.article_type || "ORIGINAL"}
						            onChange={this.handleChange('article_type')}
						            input={
						              <OutlinedInput
	  	                                labelWidth={80}
						                name="article_type"
						                id="article_type"
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
					        <JournalSelector
					        	onChange={this.handleValueChange('journal')}
					        	value={formdata.journal || null} />
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
					          name="year"
					          margin="none"
					          variant="outlined"
					          disabled={formdata.in_press}
					        />

				    		<FormControlLabel
				    			style={{paddingLeft: 15}}
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
					          name="abstract"
					          label="Abstract"
					          className={classes.textField}
					          value={formdata.abstract || ''}
					          onChange={this.handleChange('abstract')}
					          margin="none"
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

						<Grid item xs={12}>
							<Typography variant="h4">Full Text Links</Typography>

							{ this.TEXT_LINKS.map((link_type) => {
								return <URLInput
											key={link_type.property}
											id={link_type.property}
											url={formdata[link_type.property] || ''}
											label={link_type.label}
	  							            onChange={this.handleChange(link_type.property)} />
							})}
						</Grid>

						<Grid item xs={12} hidden={!show_study_section}>
							<Typography variant="h4" gutterBottom>Studies</Typography>
							{ studies.map((study, idx) => <StudyLI key={study.id}
															study={study}
															idx={idx}
															showReplicationDetails={show_replication}
															onDelete={this.handleStudyDelete}
															onEdit={this.handleStudyEdit}
															showActions={true} />) }
							<Button variant="contained" onClick={this.addNewStudy}>
								<Icon>add</Icon>
								Add Study
							</Button>
						</Grid>

						<Grid item xs={6}>
							<Button
								variant="contained"
								color="primary"
								size="large"
								type="submit">Save</Button>
						</Grid>

					</Grid>

					<StudyEditor
							 open={study_editor_idx != -1}
							 onClose={this.closeStudyEditor}
							 onSave={this.saveStudy}
							 article_type={formdata.type}
							 idx={study_editor_idx}
							 editStudy={studies[study_editor_idx]} />

				</form>

				<Snackbar
		          anchorOrigin={{
		            vertical: 'bottom',
		            horizontal: 'left',
		          }}
		          open={snack_message != null}
		          autoHideDuration={2000}
		          onClose={this.snackClose}
		          ContentProps={{
		            'aria-describedby': 'message-id',
		          }}
		          message={<span id="message-id">{ snack_message }</span>}
		          />
			</div>
		)
	}
}

Curate.propTypes = {
	cookies: instanceOf(Cookies).isRequired
}

export default withRouter(withCookies(withStyles(styles)(Curate)));
