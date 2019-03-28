import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

import { withStyles } from '@material-ui/core/styles';

import {Typography, Avatar, Grid, Paper, TextField, Button,
	Snackbar, RadioGroup, Radio, FormControlLabel, FormControl} from '@material-ui/core';

import {json_api_req, simple_api_req} from '../util/util.jsx'
import {clone} from 'lodash'

const styles = {
	textfield: {
		marginBottom: 5
	}
}

class AdminInvite extends React.Component {
	constructor(props) {
        super(props);

        this.state = {
        	form: {
        		invite_type: 'with_author_page'
        	},
        	snack_message: null
        }

        this.close_snack = this.close_snack.bind(this)
        this.show_snack = this.show_snack.bind(this)
        this.invite = this.invite.bind(this)
        this.handle_change = this.handle_change.bind(this)
    }

    handle_change(event) {
    	let {form} = this.state
    	form[event.target.name] = event.target.value
    	this.setState({form})
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
    	let email = form.email
    	if (email != null && email.length > 0) {
	    	let data = {
	    		email: email,
	    		author: {
					name: form.name || ''
				}
	    	}
	    	json_api_req('POST', `/api/invitations/create/`, data, cookies.get('csrftoken'), (res) => {
	    		this.setState({form: {}}, () => {
		    		this.show_snack(`Invite sent to ${email}!`)
	    		})
	    	}, (err) => {
	    		this.show_snack('Error inviting!')
	    	})
    	}
    }

	render() {
		let {classes} = this.props
		let {snack_message, form} = this.state
		return (
			<div style={{textAlign: 'center'}}>
				<Grid container justify="center">
					<Grid item xs={6}>
						<Typography variant="h2">Invite Users</Typography>

						<Paper style={{padding: 10}}>

							<FormControl component="fieldset" className={classes.formControl}>
					          <RadioGroup
					            aria-label="Invite Type"
					            name="invite_type"
					            className={classes.group}
					            value={form.invite_type}
					            onChange={this.handle_change}
					          >

					          	<FormControlLabel value='with_author_page' control={<Radio />} label={<span>Invite user <u>with</u> pre-enabled author page</span>} />

								<TextField name="email" key="email1" label="Email"
										   placeholder="Email" type="email"
										   fullWidth autoComplete="off"
										   className={classes.textfield}
										   onChange={this.handle_change}
										   variant="outlined"
										   required
										   disabled={form.invite_type != 'with_author_page'}
										   value={form.email||''}/>

								<TextField name="username" key="username" label="Username / Author page URL"
										   placeholder="Username / Author page URL" type="text"
										   fullWidth autoComplete="off"
										   className={classes.textfield}
										   onChange={this.handle_change}
										   variant="outlined"
										   required
										   disabled={form.invite_type != 'with_author_page'}
										   value={form.username||''}/>

								<FormControlLabel value='without_author_page' control={<Radio />} label={<span>Invite user <u>without</u> pre-enabled author page</span>} />

								<TextField name="email" key="email2" label="Email"
										   placeholder="Email" type="email"
										   fullWidth autoComplete="off"
										   className={classes.textfield}
										   onChange={this.handle_change}
										   variant="outlined"
										   required
										   disabled={form.invite_type != 'without_author_page'}
										   value={form.email||''}/>

								<TextField name="name" key="name" label="Full name"
										   placeholder="Full name" type="text"
										   fullWidth autoComplete="off"
										   className={classes.textfield}
										   onChange={this.handle_change}
										   variant="outlined"
										   required
										   disabled={form.invite_type != 'without_author_page'}
										   value={form.name||''}/>

					          </RadioGroup>
					        </FormControl>

					        <br/>
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
