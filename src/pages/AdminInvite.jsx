import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

import { withStyles } from '@material-ui/core/styles';

import {Typography, Avatar, Grid, Paper, TextField, Button,
	Snackbar, RadioGroup, Radio, FormControlLabel, FormControl} from '@material-ui/core';

import {json_api_req, simple_api_req, unspecified, summarize_api_errors} from '../util/util.jsx'
import {clone} from 'lodash'
import Or from '../components/shared/Or.jsx';

const styles = {
	textfield: {
		marginBottom: 9
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

	check_change = event => {
        let {form} = this.state
        form.invite_type = event.target.value
	    this.setState({form})
    }

    show_snack(message) {
    	this.setState({snack_message: message})
    }

    close_snack() {
    	this.setState({snack_message: null})
    }

    valid() {
		let {form} = this.state
		if (unspecified(form.email)) {
			this.show_snack('Email is required')
			return false
		}
		if (form.invite_type == 'with_author_page' && unspecified(form.username)) {
			this.show_snack('Username is required when inviting user with existing author page')
			return false
		}
		if (form.invite_type == 'without_author_page' && unspecified(form.name)) {
			this.show_snack('Full name is required to create new user and author page')
			return false
		}
		return true
    }

    invite() {
    	let {cookies} = this.props
    	let {form} = this.state
    	let email = form.email
    	if (this.valid()) {
	    	let data = {
	    		email: email,
	    		author: {}
	    	}
	    	if (form.invite_type == 'without_author_page') data.author.name = form.name || ''
			else data.author.slug = form.username
	    	json_api_req('POST', `/api/invitations/create/`, data, cookies.get('csrftoken'), (res) => {
	    		this.setState({form: {}}, () => {
		    		this.show_snack(`Invite sent to ${email}!`)
	    		})
	    	}, (err) => {
				let message = summarize_api_errors(err)
				if (message != null) this.show_snack(message)
	    	})
    	}
    }

	render() {
		let {classes} = this.props
		let {snack_message, form} = this.state
		return (
			<div>
				<Grid container justify="center">
					<Grid item xs={6}>

						<Typography variant="h2">Invite Users</Typography>

						<Paper style={{padding: 10}}>

				          	<FormControlLabel value='with_author_page' control={<Radio value='with_author_page' checked={form.invite_type === 'with_author_page'} onChange={this.check_change} />} label={<span>Invite user with an existing author page</span>} />

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

							<Or/>

							<FormControlLabel value='without_author_page' control={<Radio value='without_author_page' checked={form.invite_type === 'without_author_page'} onChange={this.check_change} />} label={<span>Invite user without activating author page</span>} />

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

					        <br/>

					        <div align="center">
								<Button variant="contained" color='primary' style={{marginTop: 15}} onClick={this.invite}>Send Invite</Button>
							</div>

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
