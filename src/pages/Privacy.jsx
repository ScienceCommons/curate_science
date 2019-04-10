import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import {Typography, Avatar, Grid, Paper} from '@material-ui/core';

const styles = {}

class Privacy extends React.Component {
	constructor(props) {
        super(props);

    }

	render() {
		let {classes} = this.props
		return (
			<div style={{textAlign: 'center'}} className="StaticPages">
				<div>
					<Typography variant="h3" align="center">Terms of Service</Typography>

					<p>As a condition of use of this website, you promise (1) to be honest, (2) to curate scientific information as accurately and impartially as possible, and (3) to not be a jerk.</p>

					<Typography variant="h3" align="center">Privacy Policy</Typography>

					<p>We will never share or sell your personal information with anyone. Ever.</p>

				</div>
			</div>
		)
	}
}

export default withStyles(styles)(Privacy);