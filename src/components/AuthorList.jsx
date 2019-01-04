import React from 'react';


class AuthorList extends React.Component {
	render() {
		let {authors, year} = this.props
		let name_list = authors.map(author => `${author.last_name}, ${author.first_name}`)
		let year_text = year || "In Press"
		return name_list.join(', ') + ` (${year_text})`
	}
}

AuthorList.defaultProps = {
	authors: [],
	year: null
};

export default AuthorList;