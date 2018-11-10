import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import {Paper, Tabs, Tab} from '@material-ui/core';

import C from '../constants/constants';

const styles = {
    root: {
	    flexGrow: 1,
	    maxWidth: 500,
    }
}

class TransparencyEditor extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	tab: 0
        };

        this.render_transparency_tab = this.render_transparency_tab.bind(this)
    }

    handleTabChange = (event, value) => {
	    this.setState({tab: value })
	}

	render_transparency_tab(f) {
		let {transparencies, icon_size} = this.props
		let tdata = transparencies.filter(t => t.transparency_type.toUpperCase() == f.id.toUpperCase())
		let icon = <img
					   src={`/sitestatic/icons/${f.icon}.svg`}
					   width={icon_size}
					   height={icon_size}
					   type="image/svg+xml" />
        return <Tab icon={icon} label={f.label} />
	}

	render() {
		let {classes} = this.props
		let relevant_transparencies = C.BADGE_FEATURES.filter(bf => true) // TODO
		let tabs = relevant_transparencies.map(this.render_transparency_tab)
		return (
			<Paper className={classes.root}>
			    <Tabs
		          value={this.state.tab}
		          onChange={this.handleTabChange}
		          fullWidth
		          indicatorColor="primary"
		          textColor="secondary"
		        >
			    	{ tabs }
			    </Tabs>
	        </Paper>
		)
	}
}

TransparencyEditor.defaultProps = {
	transparencies: [], // List of objects (see Transparency serializer)
	icon_size: 30
};

export default withStyles(styles)(TransparencyEditor);