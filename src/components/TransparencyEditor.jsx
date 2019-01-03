import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import {Paper, Tabs, Tab, TabContainer, RadioGroup, FormControl, FormLabel,
	FormControlLabel, Radio, Icon, InputLabel, Input, InputAdornment,
	AppBar, Typography, IconButton, Button, TextField, Menu, MenuItem, Grid,
	ListItemIcon, ListItemText, Select} from '@material-ui/core';

import {set, find} from 'lodash'

import URLInput from '../components/curateform/URLInput.jsx';
import TransparencyIcon from '../components/shared/TransparencyIcon.jsx';

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
    },
    one_transparency: {
    	marginTop: 10
    }
}

const TransparencyHeader = ({badge}) => {
	return (
		<div style={{borderBottom: `1px solid ${badge.color}`, width: '100%'}}>
			<Typography variant="button" align="center" justify="center">
				<TransparencyIcon tt={{icon: badge.icon}} size={20} style={{marginRight: 5}} />
				{ badge.label }
			</Typography>
		</div>
	)
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
				<ListItemIcon>
					<TransparencyIcon tt={transparency_type} size={30} />
				</ListItemIcon>
    			<ListItemText primary={ transparency_type.label } />
			</MenuItem>
		)
	}
}

class TransparencyEditor extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	tab: 0,
        	anchorEl: null,
        	copyAnchorEl: null
        };

		this.handleCreateMenuClick = this.handleCreateMenuClick.bind(this)
		this.handleCreateMenuClose = this.handleCreateMenuClose.bind(this)
		this.handleCopyMenuClick = this.handleCopyMenuClick.bind(this)
		this.handleCopyMenuClose = this.handleCopyMenuClose.bind(this)
		this.changeReportingStandardsType = this.changeReportingStandardsType.bind(this)
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

	handleCopyMenuClick = event => {
	    this.setState({ copyAnchorEl: event.currentTarget });
	}

	handleCopyMenuClose = () => {
	    this.setState({ copyAnchorEl: null });
	}

	renderRSText(rst) {
		let o = find(C.REPORTING_STANDARDS_TYPES, {value: rst})
		if (o != null) return {__html: o.html_detail}
		else return null
	}

	copyTransparencies = study => () => {
		this.props.onCopyTransparencies(study)
		this.handleCopyMenuClose()
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

	changeReportingStandardsType(val) {
		this.props.onChangeReportingStandardsType(val)
	}

	transparencies_of_type(type) {
		let res = []
		this.props.transparencies.forEach((t, i) => {
			if (t.transparency_type.toUpperCase() == type) {
				t.original_index = i  // Used to update correct value in original array
				res.push(t)
			}
		})
		return res
	}

	render_transparency_section(badge) {
		let {transparencies} = this.props
		let type_transparencies = this.transparencies_of_type(badge.id)
		if (type_transparencies.length > 0) {
			return (
				<div key={badge.id}>
					<TransparencyHeader badge={badge} />
		   		    { type_transparencies.map((tt, idx) => {
		   		    	return this.render_transparency(tt, idx, badge)
		   		    }) }
				</div>
			)
		}
		else return null
	}

	render_reporting_standards() {
		let {reporting_standards_type, article_type} = this.props
		const REP_STD = find(C.TRANSPARENCY_BADGES, {id: 'REPSTD'})
		let show = REP_STD.article_types.includes(article_type)
		if (!show) return
		return (
			<div id="rs1">
				<TransparencyHeader badge={REP_STD} />
				<Typography>Compliance to relevant reporting standard:</Typography>
				<br/>
				<Select
					value={reporting_standards_type || ''}
					variant="outlined"
					displayEmpty
					onChange={this.changeReportingStandardsType}>
					{ C.REPORTING_STANDARDS_TYPES.map((opt) => {
						return <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
					}) }
				</Select>
				<div id="RS_TEXT_DIV" dangerouslySetInnerHTML={this.renderRSText(reporting_standards_type)}></div>
			</div>
		)
	}

	render_transparency(transparency, i, badge) {
		let {classes} = this.props
		let content
		let idx = transparency.original_index
		if (badge.id == 'PREREG') {
			content = (
				<div key={i}>
					<FormControl component="fieldset" className={classes.formControl}>
			          <FormLabel component="legend">Preregistration Type</FormLabel>
			          <RadioGroup
			            aria-label="prereg_rg"
			            name="prereg_rg"
			            className={classes.radioGroup}
			            onChange={this.changeTransparency(idx, 'prereg_type')}
			            value={transparency.prereg_type || 'format'}
			          >
			            <FormControlLabel value="format" control={<Radio className={classes.radio} />} label="Registered Report format" />
			            <FormControlLabel value="design_analysis" control={<Radio className={classes.radio} />} label="Preregistered design + analysis" />
			            <FormControlLabel value="design" control={<Radio className={classes.radio} />} label="Preregistered design" />
			          </RadioGroup>
			        </FormControl>

			        <URLInput
			        	id="prereg"
			        	label="Preregistered protocol URL"
			        	onChange={this.changeTransparency(idx, 'url')}
			        	url={transparency.url} />
		        </div>
			)
		} else if (badge.id == 'MATERIALS') {
			content = <URLInput
						id="materials"
						key={i}
						label="Study materials URL"
						onChange={this.changeTransparency(idx, 'url')}
						url={transparency.url} />
		} else if (badge.id == 'DATA') {
			content = <URLInput
						id="data"
						key={i}
						label="Data URL"
						onChange={this.changeTransparency(idx, 'url')}
						url={transparency.url} />
		} else if (badge.id == 'CODE') {
			content = <URLInput label="Code URL"
						id="code"
						key={i}
						onChange={this.changeTransparency(idx, 'url')}
						url={transparency.url} />
		}
		return (
			<div className={classes.one_transparency} key={i}>
				<Grid container>
					<Grid item xs={10}>
						{ content }
					</Grid>
					<Grid item xs={2}>
						<Button onClick={this.deleteTransparency(i)}>
							<Icon>delete</Icon>
							Remove
						</Button>
					</Grid>
				</Grid>
			</div>
		)
	}

	relevant_transparencies() {
		let {article_type} = this.props
		return C.TRANSPARENCY_BADGES.filter((tb) => {
			return tb.article_types.includes(article_type) && !tb.singular
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

	render_copy_menu() {
		const { copyAnchorEl } = this.state;
		let {other_studies} = this.props
		if (other_studies.length == 0) return
		return (
			<div>
		        <Button
		          aria-owns={copyAnchorEl ? 'copy-menu' : undefined}
		          aria-haspopup="true"
		          onClick={this.handleCopyMenuClick}
		        >
		        	<Icon>copy</Icon>
	  	          Copy from study
		        </Button>
		        <Menu
		          id="copy-menu"
		          anchorEl={copyAnchorEl}
		          open={Boolean(copyAnchorEl)}
		          onClose={this.handleCopyMenuClose}
		        >
		        	{ other_studies.map((study, i) => {
		        		return <MenuItem
		        					key={i}
		        					onClick={this.copyTransparencies(study)}>Study { study.study_number }</MenuItem>
		        	}) }
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
			    { this.render_reporting_standards() }
			    <div style={{marginTop: 20}}>
				    { this.render_create_menu() }
				    { this.render_copy_menu() }
			    </div>
	        </Paper>
		)
	}
}

TransparencyEditor.defaultProps = {
	transparencies: [], // List of objects (see Transparency serializer)
	other_studies: [],
	reporting_standards_type: null, // This transparency is singular, and so stored separately
	article_type: "ORIGINAL",
	icon_size: 20
};

export default withStyles(styles)(TransparencyEditor);