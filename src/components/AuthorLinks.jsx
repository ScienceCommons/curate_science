import React from 'react';

import {IconButton} from '@material-ui/core';
import C from '../constants/constants';

class AuthorLinks extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };

        this.render_link = this.render_link.bind(this)
    }

	render_link(url, link_type) {
		let st = {
			marginLeft: 5
		}
		return <IconButton href={url} key={url} style={st} target="_blank"><img width={50} src={`/sitestatic/icons/${link_type}.svg`} /></IconButton>
	}

	render() {
		let {links} = this.props
		let links_rendered = []
		Object.keys(C.AUTHOR_LINKS).forEach((al) => {
			if (links[al] != null) {
				links_rendered.push(this.render_link(links[al], al))
			}
		})
		return links_rendered
	}
}

AuthorLinks.defaultProps = {
	links: {}
};

export default AuthorLinks;