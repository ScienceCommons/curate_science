import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import {Typography, Avatar, Grid, Paper} from '@material-ui/core';

const styles = {}

class AdminInvite extends React.Component {
	constructor(props) {
        super(props);

    }

	render() {
		let {classes} = this.props
		return (
			<div style={{textAlign: 'center'}}>
				<div>
					<Typography variant="h1">Invite Users</Typography>
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(AdminInvite);