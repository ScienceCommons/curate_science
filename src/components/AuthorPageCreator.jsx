import React from 'react';

import {Icon, Typography, TextField, Button, Paper, Grid} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = {

}

class AuthorPageCreator extends React.Component {

	render() {
		return (
			<Grid container justify="center">
				<Grid item xs={8}>
					<Paper style={{padding: 15}}>
						<Typography variant="h2">Create Your Author Page</Typography>
						<TextField name="slug" label="Author ID" placeholder="Author ID" fullWidth />
						<Button variant="contained" color="primary" style={{marginTop: 10}}>Create</Button>
					</Paper>
				</Grid>
			</Grid>
		)
	}
}

AuthorPageCreator.defaultProps = {
};

export default withStyles(styles)(AuthorPageCreator);