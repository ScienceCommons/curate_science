import React from 'react';

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
		let name = journal == null ? "Unknown Journal" : journal.name
		return <span><span className="JournalBadge-Journal">{ name }</span> <a href={url} className={classes.doi}>{ doi }</a></span>
	}
}

JournalDOIBadge.defaultProps = {
	journal: {},
	doi: ""
};

export default withStyles(styles)(JournalDOIBadge);