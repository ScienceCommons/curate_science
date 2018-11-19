import React from 'react';

import {Typography} from '@material-ui/core';

class About extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };
    }

	render() {
		return <Typography variant="h1">About</Typography>
	}
}

export default About;