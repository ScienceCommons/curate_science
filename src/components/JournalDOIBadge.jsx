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
		let name = journal || ""
		const doi_icon = <img
   			   key={`doi-icon`}
			   src={`/sitestatic/icons/doi.svg`}
			   width={16}
			   height={16}
			   style={{verticalAlign: 'bottom', marginLeft: '3px', opacity: 0.2}}
			   type="image/svg+xml" />
		let link = (doi != null && doi.length > 0) ? <a href={url} className={classes.doi} title="Go to journal publisher's website (opens in new window)" target="_blank">{ doi_icon }</a> : null
		return <span><span className="JournalBadge-Journal">{ name }</span> {link}</span>
	}
}

JournalDOIBadge.defaultProps = {
	journal: "",
	doi: ""
};

export default withStyles(styles)(JournalDOIBadge);