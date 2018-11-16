import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import {Paper, Tabs, Tab, TabContainer, RadioGroup, FormControl, FormLabel,
	FormControlLabel, Radio, Icon, InputLabel, Input, InputAdornment,
	AppBar, Typography, Button, TextField, Menu, MenuItem} from '@material-ui/core';

import {set, find} from 'lodash'

import MultiURLInput from '../components/curateform/MultiURLInput.jsx';

import C from '../constants/constants';

const styles = {
    root: {
    	padding: 10,
	    flexGrow: 1,
    },
    formControl: {

    },
    tab: {
    	label: {
    		fontSize: 8
    	}
    }
}

class URLInput extends React.Component {

	render() {
		let {label, urls} = this.props
		return (
			<FormControl>
		        <InputLabel htmlFor="materials">{ label }</InputLabel>
		        <Input
		          id="materials"
		          fullWidth
		          startAdornment={
		            <InputAdornment position="start">
		              <Icon>link</Icon>
		            </InputAdornment>
		          }
		        />
		    </FormControl>
			)
	}
}

class AddTransparencyMenuItem extends React.Component {

	constructor(props) {
        super(props);
        this.add = this.add.bind(this)
    }

	add() {
		let {transparency_type} = this.props
		this.props.onAddTransparency(transparency_type.id)
	}

	render() {
		let {transparency_type} = this.props
		let icon = (
			<img
			   src={`/sitestatic/icons/${transparency_type.icon}.svg`}
			   width={20}
			   height={20}
			   type="image/svg+xml" />
	   )
		return (
			<MenuItem onClick={this.add}>
				{ icon }
    			{ transparency_type.label }
			</MenuItem>
		)
	}
}

class TransparencyEditor extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	tab: 0,
        	form: {
        		rs: 1
        	},
        	anchorEl: null
        };

        this.RS_TEXT = [
        	"<ol style='margin-top:5px;margin-bottom:5px;padding-left:10px;'><li><strong>Excluded data (subjects/observations):</strong> Full details reported in article.</li>  <li><strong>Experimental conditions:</strong> Full details reported in article.</li><li><strong>Outcome measures:</strong> Full details reported in article.</li>	   <li><strong>Sample size determination:</strong> Full details reported in article.</li></ol><input type='text' name='disclosureDate' placeholder='Retroactive disclosure date (MM/DD/YYYY)' style='color:#999999;' size='35'><br><br><a href='https://psychdisclosure.org/' target='_blank'>Details of the 'Basic 4 (retroactive) reporting standard (2012)'</a>",
			"<br/><a href='https://trialsjournal.biomedcentral.com/track/pdf/10.1186/s13063-018-2733-1' target='_blank'>Randomized trials of social and psychological interventions (CONSORT-SPI 2018; 26 items)</a> ",
			"<br/><a href='http://www.consort-statement.org/media/default/downloads/consort%202010%20checklist.pdf' target='_blank'>Parallel-group RCTs reporting checklist (CONSORT 2010; 25 items)</a>",
			"<br/><a href='http://www.apa.org/pubs/journals/releases/amp-amp0000191.pdf' target='_blank'>Journal article reporting standards for articles reporting new data (APA's JARS; see Table 1)</a>",
			"<br/><a href='https://www.strobe-statement.org/fileadmin/Strobe/uploads/checklists/STROBE_checklist_v4_combined.pdf' target='_blank'>Observational/correlational studies reporting checklist (STROBE 2007; 22 items)</a>",
			"<br/><a href='https://www.nc3rs.org.uk/sites/default/files/documents/Guidelines/NC3Rs%20ARRIVE%20Guidelines%20Checklist%20%28fillable%29.pdf' target='_blank'>Animal research reporting checklist (ARRIVE 2010; 20 items)</a>",
			"<br/><a href='https://www.nature.com/authors/policies/reporting.pdf' target='_blank'>Life Science research checklist (Nature Neuroscience, 2015)</a>",
			"<br/><a href='http://www.apa.org/pubs/journals/releases/amp-amp0000191.pdf' target='_blank'>Meta-Analysis Reporting Standards (APA's MARS; see Table 9)</a>",
			"<br/><a href='http://prisma-statement.org/documents/PRISMA%202009%20checklist.pdf' target='_blank'>Systematic reviews/meta-analyses reporting checklist (PRISMA 2009; 27 items)</a>",
			"<br/><a href='http://prisma-statement.org/documents/PRISMA-P-checklist.pdf' target='_blank'>Systematic reviews/meta-analyses reporting checklist (<b>Updated</b> PRISMA-P 2015; 17 items)</a>"
		]

		this.handleCreateMenuClick = this.handleCreateMenuClick.bind(this)
		this.handleCreateMenuClose = this.handleCreateMenuClose.bind(this)
		this.addTransparency = this.addTransparency.bind(this)
    }

    handleChange = (event, transp, key, value) => {
    	let {form} = this.state
    	set(form, [transp, key, value])
	    this.setState({form})
	}

    handleTabChange = (event, value) => {
	    this.setState({tab: value })
	}

	handleCreateMenuClick = event => {
	    this.setState({ anchorEl: event.currentTarget });
	}

	handleCreateMenuClose = () => {
	    this.setState({ anchorEl: null });
	}

	renderRSText(idx) {
		if (idx == null) idx = 0
		return {__html: this.RS_TEXT[idx]}
	}

	addTransparencyURL(url) {

	}

	addTransparency(type) {
		this.props.onAddTransparency(type)
		this.handleCreateMenuClose()
	}

	render_transparency(transparency, i) {
		let {classes} = this.props
		let {form} = this.state
		console.log(transparency)
		let tb = find(C.TRANSPARENCY_BADGES, {id: transparency.transparency_type})
		let content
		let protocol_url // TODO
		if (tb.id == 'prereg') {
			content = (
				<div key={i}>
					<FormControl component="fieldset" className={classes.formControl}>
			          <FormLabel component="legend">Preregistration Type</FormLabel>
			          <RadioGroup
			            aria-label="prereg_rg"
			            name="prereg_rg"
			            className={classes.group}
			            value={form.prereg_type}
			          >
			            <FormControlLabel value="format" control={<Radio />} label="Registered Report format" />
			            <FormControlLabel value="design_analysis" control={<Radio />} label="Preregistered design + analysis" />
			            <FormControlLabel value="design" control={<Radio />} label="Preregistered design" />
			          </RadioGroup>
			        </FormControl>

					<TextField
					  id='protocol-url'
					  label={`Preregistered protocol URL`}
					  value={protocol_url || ''}
					  onChange={this.handleChange}
					  margin="normal"
					  fullWidth
					  variant="outlined"
					/>
		        </div>
				)
		} else if (tb.id == 'materials') {
			content = <URLInput label="Study materials URL" urls={[""]} />
		} else if (tb.id == 'data') {
			content = <URLInput label="Data URL" urls={[""]} />
		} else if (tb.id == 'code') {
			content = <URLInput label="Code URL" urls={[""]} />
		} else if (tb.id == 'repstd') {
			content = (
				<div id="rs1">
					<span>Compliance to relevant reporting standard:</span>
					<br/>
					<select name="rs.name" value={form.rs}>
						<option value="1">Basic-4 (at submission; PSCI, 2014)</option>
						<option value="2">Basic-4 (retroactive; 2012)</option>
						<option value="3">CONSORT-SPI (2018)</option>
						<option value="4">CONSORT (2010)</option>
						<option value="5">JARS (2018)</option>
						<option value="6">STROBE (2007)</option>
						<option value="7">ARRIVE (2010)</option>
						<option value="8">Nature Neuroscience (2015)</option>
						<option value="9">MARS (2018)</option>
						<option value="10">PRISMA (2009)</option>
						<option value="11">PRISMA-P (2015)</option>
					</select>
					<div id="RS_TEXT_DIV" dangerouslySetInnerHTML={this.renderRSText(form.rs)}></div>
				</div>
			)
		}
		return content
	}

	render_create_menu() {
		const { anchorEl } = this.state;
		let relevant_transparencies = C.TRANSPARENCY_BADGES.filter(bf => true) // TODO
		return (
			<div>
		        <Button
		          aria-owns={anchorEl ? 'simple-menu' : undefined}
		          aria-haspopup="true"
		          onClick={this.handleCreateMenuClick}
		        >
		        	<Icon>add</Icon>
	  	          Add Transparency
		        </Button>
		        <Menu
		          id="simple-menu"
		          anchorEl={anchorEl}
		          open={Boolean(anchorEl)}
		          onClose={this.handleCreateMenuClose}
		        >
		        	{ relevant_transparencies.map((tt, i) => {
		        		return <AddTransparencyMenuItem
		        					key={i}
		        					onAddTransparency={this.addTransparency}
		        					transparency_type={tt} />
		        	})}
		        </Menu>
		      </div>
		)
	}

	render() {
		let {classes, transparencies} = this.props

		return (
			<Paper className={classes.root}>
			    <Typography component="h3">Transpariences</Typography>
			    { transparencies.map((t, i) => {
			    	return this.render_transparency(t, i)
			    }) }
			    <div>
			    { this.render_create_menu() }
			    </div>
	        </Paper>
		)
	}
}

TransparencyEditor.defaultProps = {
	transparencies: [], // List of objects (see Transparency serializer)
	icon_size: 20
};

export default withStyles(styles)(TransparencyEditor);