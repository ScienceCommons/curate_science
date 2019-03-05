import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

import { withStyles } from '@material-ui/core/styles';

import {Typography, Avatar, Grid, Paper, TextField, Button,
	Snackbar} from '@material-ui/core';

import {json_api_req, simple_api_req} from '../util/util.jsx'
import {clone} from 'lodash'

const styles = {}

class AdminInvite extends React.Component {
	constructor(props) {
        super(props);

        this.state = {
        	form: {},
        	snack_message: null
        }

        this.close_snack = this.close_snack.bind(this)
        this.show_snack = this.show_snack.bind(this)
        this.invite = this.invite.bind(this)
    }

    show_snack(message) {
    	this.setState({snack_message: message})
    }

    close_snack() {
    	this.setState({snack_message: null})
    }

    invite() {
    	let {cookies} = this.props
    	let {form} = this.state
    	let data = clone(form)
    	simple_api_req('POST', `/api/invitations/create/`, data, cookies.get('csrftoken'), (res) => {
    		this.show_snack('Invite sent!')
    	}, (err) => {
    		this.show_snack('Error inviting!')
    	})
    }

	render() {
		let {classes} = this.props
		let {snack_message} = this.state
		return (
			<div style={{textAlign: 'center'}}>
				<Grid container justify="center">
					<Grid item xs={6}>
						<Typography variant="h2">Invite Users</Typography>

						<Paper style={{padding: 10}}>
							<TextField name="email" key="email" label="Email" placeholder="Email" type="email" fullWidth autoComplete="off" />
							<TextField name="name" key="name" label="Name" placeholder="Name" type="text" fullWidth autoComplete="off" />

							<Button variant="contained" color='primary' style={{marginTop: 15}} onClick={this.invite}>Send Invite</Button>
						</Paper>
					</Grid>
				</Grid>

				<Snackbar
		          anchorOrigin={{
		            vertical: 'bottom',
		            horizontal: 'left',
		          }}
		          open={snack_message != null}
		          autoHideDuration={3000}
		          onClose={this.close_snack}
		          message={snack_message}
		        />
			</div>
		)
	}
}

export default withRouter(withCookies(withStyles(styles)(AdminInvite)));
