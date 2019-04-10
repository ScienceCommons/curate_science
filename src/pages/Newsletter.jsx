import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import {Typography, Paper, Grid, Button} from '@material-ui/core';

const styles = {
	root: {
		display: 'block',
		maxWidth: 810,
		margin: '20px auto'
	},
	bottomless: {
		marginBottom: 0
	},
	grayList: {
		color: 'gray',
		fontSize: 14
	},
	question: {
		fontWeight: 'bold'
	},
	answer: {
		color: 'grey',
	    paddingLeft: 22,
	    lineHeight: '19px'
	}
}

class Help extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        }
    }

	render() {
		let {classes} = this.props
		return (
			<div className={"StaticPages " + classes.root}>
				<Typography variant="h3" justify="center" align="center">Newsletter</Typography>

				<div style={{fontize:16, textAlign: 'center', marginTop: 20}}>
					Please sign up below to receive the Curate Science Newsletter to be notifed about news and updates.<br/>
					See <a href="http://us8.campaign-archive2.com/home/?u=0833383918fc50773891d363a&id=aaad5734e3">past announcements</a>.
				  </div>
				  <br/>
				  <div id="mc_embed_signup" style={{margin: '0 auto', textAlign: 'center'}}>
					<form action="//curatescience.us8.list-manage.com/subscribe/post?u=0833383918fc50773891d363a&amp;id=aaad5734e3" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate form-search pull-center" target="_blank" noValidate>
						<input type="email" name="EMAIL" className="email span4" id="mce-EMAIL" placeholder="Enter email address!" size="20" type="text" required />
	   			    	<input type="hidden" name="b_d140eca9cfe4a96473dac6ea5_fba08af7dd" value="" />
					    <br/><br/>
					    <div>
						  	<Button variant="contained" color="primary" type="submit" name="subscribe" id="mc-embedded-subscribe">
						  		Sign up
						  	</Button>
				  	    </div>
					</form>
				  </div>
			</div>
		)
	}
}

export default withStyles(styles)(Help);