import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

import {Icon, Typography, TextField, Button, Paper, Grid,
	Snackbar, FormControl, FormControlLabel, RadioGroup, Radio} from '@material-ui/core';

import {json_api_req, summarize_api_errors, unspecified} from '../util/util.jsx'
import {clone} from 'lodash'
import { withStyles } from '@material-ui/core/styles';
import Or from '../components/shared/Or.jsx';

const styles = {

}

class AuthorPageCreator extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			form: {
				create_type: 'new'
			},
			snack_message: null
		}

		this.submit = this.submit.bind(this)
		this.create_author = this.create_author.bind(this)
		this.update_author = this.update_author.bind(this)
		this.handle_change = this.handle_change.bind(this)
        this.close_snack = this.close_snack.bind(this)
        this.show_snack = this.show_snack.bind(this)
	}

	 show_snack(message) {
    	this.setState({snack_message: message})
    }

    close_snack() {
    	this.setState({snack_message: null})
    }

    handle_change = event => {
        let {form} = this.state
        form[event.target.name] = event.target.value
        this.setState({form})
    }

    check_change = event => {
        let {form} = this.state
        form.create_type = event.target.value
	    this.setState({form})
    }

    create_author(name) {
		let {cookies, user_session} = this.props
		let csrf_token = cookies.get('csrftoken')
		let data = {
			name: name,
			is_activated: true
		}
		json_api_req('POST', `/api/authors/create/`, data, csrf_token, (res) => {
			console.log(res)
			let slug = res.slug
			window.location.replace(`/app/author/${slug}`)
		}, (err) => {
			let message = summarize_api_errors(err)
			if (message != null) this.show_snack(message)
		})
    }

    update_author(slug, data) {
		let {cookies, user_session} = this.props
		let csrf_token = cookies.get('csrftoken')
    	json_api_req('PATCH', `/api/authors/${slug}/update/`, data, csrf_token, (res) => {
			console.log(res)
			window.location.replace(`/app/author/${slug}`)
		}, (err) => {
			let message = summarize_api_errors(err)
			if (message != null) this.show_snack(message)
		})
    }

	submit() {
		let {cookies, user_session} = this.props
		let {form} = this.state
		let csrf_token = cookies.get('csrftoken')
		let data = clone(form)
		if (form.create_type == 'new') {
			if (user_session.admin) {
				// Admin creating new user & author page
				if (!unspecified(form.name)) this.create_author(form.name)
			} else {
				// User enabling own author page
				let author = user_session.author
				this.update_author(author.slug, {
					is_activated: true,
					name: form.name
				})
			}
		} else if (form.create_type == 'existing') {
			// Admin user activating an existing user's author page
			if (!unspecified(form.username)) {
				this.update_author(form.username, {
					is_activated: true
				})
			}
		}

	}

	render() {
		let {user_session, classes} = this.props
		let {form, snack_message} = this.state
		let admin = user_session.admin
		let title = admin ? "Create Author Page" : "Create Your Author Page"
		return (
			<div>
				<Grid container justify="center">
					<Grid item xs={6}>

						<Typography variant="h2">{title}</Typography>

						<Paper style={{padding: 10}}>

				          	<div hidden={!admin}>
					        	<FormControlLabel value='new' control={<Radio value='new' checked={form.create_type === 'new'} onChange={this.check_change} />} label="New user" />
					        </div>

							<TextField label="Full Name"
								placeholder="Full Name"
								name="name"
								value={form.name || ''}
								fullWidth
								variant="outlined"
								disabled={form.create_type != 'new'}
								onChange={this.handle_change} /><br/>

							<div hidden={!admin}>

								<Or />

						        <FormControlLabel value='existing' control={<Radio value='existing' checked={form.create_type === 'existing'} onChange={this.check_change} />} label="Pre-existing user" />

								<TextField label="Username"
									placeholder="Username"
									name="username"
									value={form.username || ''}
									fullWidth
									variant="outlined"
									disabled={form.create_type != 'existing'}
									onChange={this.handle_change} /><br/>
							</div>


					        <br/>

					        <div align="center">
								<Button variant="contained" color="primary" style={{marginTop: 10}} onClick={this.submit}>Create</Button>
							</div>
						</Paper>
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
				</Grid>
			</div>
		)
	}
}

AuthorPageCreator.defaultProps = {
};

export default withRouter(withCookies(withStyles(styles)(AuthorPageCreator)));
