import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

import {Icon, Typography, TextField, Button, Paper, Grid} from '@material-ui/core';

import {json_api_req} from '../util/util.jsx'
import {clone} from 'lodash'
import { withStyles } from '@material-ui/core/styles';

const styles = {

}

class AuthorPageCreator extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			form: {}
		}

		this.create = this.create.bind(this)
		this.handle_change = this.handle_change.bind(this)
	}

    handle_change = event => {
        let {form} = this.state
        form[event.target.name] = event.target.value
        this.setState({form})
    }

	create() {
		let {cookies} = this.props
		let {form} = this.state
		let csrf_token = cookies.get('csrftoken')
		let data = clone(form)
		json_api_req('POST', '/api/authors/create/', data, csrf_token, (res) => {
			console.log(res)
			let slug = res.slug
			window.location.replace(`/app/author/${slug}`)
		}, (err) => {
			console.error(err)
		})
	}

	render() {
		let {user_session} = this.props
		let {form} = this.state
		let admin = user_session.admin
		return (
			<Grid container justify="center">
				<Grid item xs={8}>
					<Paper style={{padding: 15}}>
						<Typography variant="h2">Create Your Author Page</Typography>

						<TextField label="Full Name"
							placeholder="Full Name"
							name="name"
							value={form.name || ''}
							fullWidth
							onChange={this.handle_change} /><br/>

						<div hidden={!admin}>
							<TextField label="username (admin only)"
								placeholder="username (admin only)"
								name="account"
								value={form.account || ''}
								fullWidth
								onChange={this.handle_change} /><br/>
						</div>

						<Button variant="contained" color="primary" style={{marginTop: 10}} onClick={this.create}>Create</Button>
					</Paper>
				</Grid>
			</Grid>
		)
	}
}

AuthorPageCreator.defaultProps = {
};

export default withRouter(withCookies(withStyles(styles)(AuthorPageCreator)));
