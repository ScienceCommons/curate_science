import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import {Typography, Avatar, Grid, Paper, TextField, Button} from '@material-ui/core';

const styles = {}

class AdminInvite extends React.Component {
	constructor(props) {
        super(props);

    }

	render() {
		let {classes} = this.props
		return (
			<div style={{textAlign: 'center'}}>
				<Grid container justify="center">
					<Grid item xs={6}>
						<Typography variant="h1">Invite Users</Typography>

						<Paper style={{padding: 10}}>
							<TextField name="email" key="email" label="Email" placeholder="Email" type="email" fullWidth />
							<TextField name="name" key="name" label="Name" placeholder="Name" type="text" fullWidth />

							<Button variant="contained" color='primary' style={{marginTop: 15}}>Send Invite</Button>
						</Paper>
					</Grid>
				</Grid>
			</div>
		)
	}
}

export default withStyles(styles)(AdminInvite);