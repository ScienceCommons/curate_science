import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

import {Icon, Typography, TextField, Button, Paper, Grid,
	Snackbar} from '@material-ui/core';

import {json_api_req, summarize_api_errors} from '../util/util.jsx'
import {clone} from 'lodash'
import { withStyles } from '@material-ui/core/styles';

const styles = {

}

class AuthorPageCreator extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			form: {},
			snack_message: null
		}

		this.create = this.create.bind(this)
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
			let message = summarize_api_errors(err)
			if (message != null) this.show_snack(message)
		})
	}

	render() {
		let {user_session} = this.props
		let {form, snack_message} = this.state
		let admin = user_session.admin
		let title = admin ? "Create Author Page" : "Create Your Author Page"
		return (
			<Grid container justify="center">
				<Grid item xs={8}>
					<Paper style={{padding: 15, marginTop: 15}}>
						<Typography variant="h2">{title}</Typography>

						<TextField label="Full Name"
							placeholder="Full Name"
							name="name"
							value={form.name || ''}
							fullWidth
							onChange={this.handle_change} /><br/>

						<Button variant="contained" color="primary" style={{marginTop: 10}} onClick={this.create}>Create</Button>
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
		)
	}
}

AuthorPageCreator.defaultProps = {
};

export default withRouter(withCookies(withStyles(styles)(AuthorPageCreator)));
