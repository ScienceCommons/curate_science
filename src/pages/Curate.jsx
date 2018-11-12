import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import {TextField, Button, Card, Grid, Typography, Menu, MenuItem, InputLabel,
	FormControl, Select, OutlinedInput, Paper} from '@material-ui/core';

import C from '../constants/constants';

import TransparencyEditor from '../components/TransparencyEditor.jsx';
import StudyLI from '../components/listitems/StudyLI.jsx';
import DOILookup from '../components/curateform/DOILookup.jsx';
import StudyEditor from '../components/curateform/StudyEditor.jsx';

import {get} from 'lodash'
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
		const { classes } = this.props;
		let {formdata, study_editor_open, studies, study_editor_study} = this.state
		return (
			<form noValidate autoComplete="off" className={classes.root}>
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
				          fullWidth
				          required
				          variant="outlined"
				        />
				    </Grid>
				    <Grid item xs={6}>
				        <TextField
				          id="authors"
				          label="Authors"
				          className={classes.textField}
				          value={formdata.authors || ''}
				          onChange={this.handleChange('authors')}
				          margin="normal"
				          fullWidth
				          required
				          variant="outlined"
				        />
				        <TextField
				          id="journal"
				          label="Journal name"
				          className={classes.textField}
				          value={formdata.journal}
				          onChange={this.handleChange('journal')}
				          margin="normal"
				          fullWidth
				          variant="outlined"
				        />
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
					            value={formdata.type || "social_science"}
					            onChange={this.handleChange('research_area')}
					            input={
					              <OutlinedInput
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
						<TransparencyEditor />
					</Grid>

					<Grid item xs={12}>
						<Typography variant="h3" gutterBottom>Studies</Typography>
						{ studies.map(study => <StudyLI key={study.id} study={study} showEditIcon={true} />) }
						<Button variant="contained" onClick={this.openStudyEditor}>Add Study</Button>
					</Grid>

					<Grid item xs={6}>
						<Button variant="contained" color="primary" size="large">Save</Button>
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
