import React from 'react';


class AuthorList extends React.Component {
	render() {
		let {author_list, year, in_press} = this.props
		let year_text = in_press ? "In Press" : year
		let authors = author_list || '--'
		return <span>{authors} <b>({year_text})</b></span>
	}
}

AuthorList.defaultProps = {
	author_list: [],
	year: null
};

export default AuthorList;