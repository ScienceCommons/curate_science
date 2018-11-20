import React from 'react';


class AuthorList extends React.Component {
	render() {
		let {authors} = this.props
		let name_list = authors.map(author => `${author.last_name}, ${author.first_name}`)
		return name_list.join(', ')
	}
}

AuthorList.defaultProps = {
	authors: []
};

export default AuthorList;