import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import {TextField, Button, Card, Grid, Typography, Menu, MenuItem, InputLabel,
	FormControl, Select, OutlinedInput} from '@material-ui/core';

import C from '../constants/constants';
import TransparencyEditor from '../components/TransparencyEditor.jsx';

import {printDate} from '../util/util.jsx'

const styles = {
  textField: {

  },
  root: {
  	padding: 13
  },
  formControl: {

  }
};

class Curate extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	formdata: {}
        };
    }

    componentDidMount() {

    }

    fetch_metadata() {
    	let {match} = this.props
    	// fetch(`/api/articles/${match.params.id}`).then(res => res.json()).then((res) => {
    	// 	console.log(res)
    	// 	this.setState({article: res})
    	// })
    }

    handleChange = prop => event => {
    	let {formdata} = this.state
    	formdata[prop] = event.target.value
	    this.setState({formdata});
  	}


	render() {
		const { classes } = this.props;
		let {formdata} = this.state
		return (
			<form noValidate autoComplete="off">
				<Grid container className={classes.root} spacing={24}>
					<Grid xs={12} item>
						<Typography variant="h2">Add/Edit Article</Typography>

				        <TextField
				          id="doi"
				          label="DOI"
				          className={classes.textField}
				          value={formdata.doi}
				          onChange={this.handleChange('doi')}
				          margin="normal"
				          fullWidth
				          variant="outlined"
				        />
				        <Button>Populate via DOI</Button>

				        <TextField
				          id="title"
				          label="Article title"
				          className={classes.textField}
				          value={formdata.title}
				          onChange={this.handleChange('title')}
				          margin="normal"
				          fullWidth
				          variant="outlined"
				        />
				    </Grid>
				    <Grid item xs={6}>
				        <TextField
				          id="authors"
				          label="Authors"
				          className={classes.textField}
				          value={formdata.authors}
				          onChange={this.handleChange('authors')}
				          margin="normal"
				          fullWidth
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
					            	return <MenuItem value={ra.id}>{ra.label}</MenuItem>
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
					            	return <MenuItem value={at.id}>{at.label}</MenuItem>
					            })}
					        </Select>
					    </FormControl>

						<TextField
				          id="abstract"
				          label="Abstract"
				          className={classes.textField}
				          value={formdata.abstract}
				          onChange={this.handleChange('abstract')}
				          margin="normal"
				          fullWidth
				          multiLine
				          variant="outlined"
				        />
				    </Grid>
					<Grid item xs={6}>
						<TransparencyEditor />
					</Grid>
					<Grid item xs={6}>
					</Grid>
				</Grid>

				<div>
					<Button variant="raised" size="large">Save</Button>
					<Button size="large">Cancel</Button>
				</div>
			</form>
		)
	}
}

Curate.defaultProps = {

}

export default withStyles(styles)(Curate);
