import React from 'react';


class JournalDOIBadge extends React.Component {
	render() {
		let {journal, doi} = this.props
		let url = `https://dx.doi.org/${doi}`
		let name = journal == null ? "Unknown Journal" : journal.name
		return <span><span className="JournalBadge-Journal">{ name }</span> <a href={url} className="JournalBadge-DOI">{ doi }</a></span>
	}
}

JournalDOIBadge.defaultProps = {
	journal: {},
	doi: ""
};

export default JournalDOIBadge;