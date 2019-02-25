import React from 'react';

import {Icon} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  doi: {
  	color: "#CCC"
  }
}

class JournalDOIBadge extends React.Component {

	render() {
		let {journal, doi, classes} = this.props
		let url = `https://dx.doi.org/${doi}`
		let name = journal == null ? "Unknown Journal" : journal
		let link = <a href={url} className={classes.doi}>{ doi } <Icon fontSize="inherit">open_in_new</Icon></a>
		return <span><span className="JournalBadge-Journal">{ name }</span> {link}</span>
	}
}

JournalDOIBadge.defaultProps = {
	journal: {},
	doi: ""
};

export default withStyles(styles)(JournalDOIBadge);