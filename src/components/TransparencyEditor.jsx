import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import {Paper, Tabs, Tab, TabContainer, RadioGroup, FormControl, FormLabel,
	FormControlLabel, Radio, Icon, InputLabel, Input, InputAdornment,
	AppBar, Typography, IconButton, Button, TextField, Menu, MenuItem, Grid} from '@material-ui/core';

import {set, find} from 'lodash'

import URLInput from '../components/curateform/URLInput.jsx';

import C from '../constants/constants';

const styles = {
    root: {
    	padding: 15,
	    flexGrow: 1,
    },
    formControl: {

    },
    radio: {
        margin: 0,
        padding: 4
    },
    radioGroup: {
    	margin: 0,
    	paddingLeft: 7
    }
}

const TransparencyHeader = ({badge}) => {
	return (
		<div style={{borderBottom: `1px solid ${badge.color}`, width: '100%'}}>
			<Typography variant="button" align="center" justify="center"><TransparencyIcon tt={{icon: badge.icon}} size={30} /> { badge.label }</Typography>
		</div>
	)
}

const TransparencyIcon = ({tt, size}) => {
	return <img
			   src={`/sitestatic/icons/${tt.icon}.svg`}
			   width={size}
			   height={size}
			   type="image/svg+xml" />
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
		return (
			<MenuItem onClick={this.add}>
				<TransparencyIcon tt={transparency_type} size={30} />
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
		this.render_transparency = this.render_transparency.bind(this)
		this.render_transparency_section = this.render_transparency_section.bind(this)
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

	deleteTransparency = idx => (event) => {
		this.props.onDeleteTransparency(idx)
	}

	changeTransparency = (idx, prop) => (event) => {
		let {transparencies} = this.props
		let tt = transparencies[idx]
		tt[prop] = event.target.value
		this.props.onChangeTransparency(idx, tt)
	}

	render_transparency_section(badge) {
		let {transparencies} = this.props
		let type_transparencies = transparencies.filter((t) => t.transparency_type == badge.id)
		if (type_transparencies.length > 0) {
			return (
				<div>
					<TransparencyHeader badge={badge} />
		   		    { type_transparencies.map((tt, idx) => {
		   		    	return this.render_transparency(tt, idx, badge)
		   		    }) }
				</div>
			)
		}
		else return null
	}

	render_transparency(transparency, i, badge) {
		let {classes} = this.props
		let content
		if (badge.id == 'prereg') {
			content = (
				<div key={i}>
					<FormControl component="fieldset" className={classes.formControl}>
			          <FormLabel component="legend">Preregistration Type</FormLabel>
			          <RadioGroup
			            aria-label="prereg_rg"
			            name="prereg_rg"
			            className={classes.radioGroup}
			            value={transparency.prereg_type}
			          >
			            <FormControlLabel value="format" control={<Radio className={classes.radio} />} label="Registered Report format" />
			            <FormControlLabel value="design_analysis" control={<Radio className={classes.radio} />} label="Preregistered design + analysis" />
			            <FormControlLabel value="design" control={<Radio className={classes.radio} />} label="Preregistered design" />
			          </RadioGroup>
			        </FormControl>

			        <URLInput
			        	id="prereg"
			        	label="Preregistered protocol URL"
			        	onChange={this.changeTransparency(i, 'url')}
			        	url={transparency.url} />
		        </div>
				)
		} else if (badge.id == 'materials') {
			content = <URLInput
						id="materials"
						label="Study materials URL"
						onChange={this.changeTransparency(i, 'url')}
						url={transparency.url} />
		} else if (badge.id == 'data') {
			content = <URLInput
						id="data"
						label="Data URL"
						onChange={this.changeTransparency(i, 'url')}
						url={transparency.url} />
		} else if (badge.id == 'code') {
			content = <URLInput label="Code URL"
						id="code"
						onChange={this.changeTransparency(i, 'url')}
						url={transparency.url} />
		} else if (badge.id == 'repstd') {
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
		return (
			<div>
				<IconButton onClick={this.deleteTransparency(i)}>
					<Icon>delete</Icon>
				</IconButton>
				{ content }
			</div>
		)
	}

	relevant_transparencies() {
		let {article_type} = this.props
		return C.TRANSPARENCY_BADGES.filter((tb) => {
			return tb.article_types.includes(article_type)
		})
	}

	render_create_menu() {
		const { anchorEl } = this.state;
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
		        	{ this.relevant_transparencies().map((tt, i) => {
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
		let {classes} = this.props
		return (
			<Paper className={classes.root}>
			    <Typography variant="h5" gutterBottom>Transpariences</Typography>
			    { this.relevant_transparencies().map((tt, i) => {
			    	return this.render_transparency_section(tt)
			    }) }
			    <div style={{marginTop: 20}}>
				    { this.render_create_menu() }
			    </div>
	        </Paper>
		)
	}
}

TransparencyEditor.defaultProps = {
	transparencies: [], // List of objects (see Transparency serializer)
	article_type: "ORIGINAL",
	icon_size: 20
};

export default withStyles(styles)(TransparencyEditor);