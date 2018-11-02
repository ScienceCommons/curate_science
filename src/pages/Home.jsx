import React from 'react';

import { Link } from "react-router-dom";

class Home extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };
    }

	render() {
		return (
			<div>
				<h1>Home</h1>
				<Link onClick={this.forceUpdate} to="/2/about">About</Link>
			</div>
		)
	}
}

export default Home;