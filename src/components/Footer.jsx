import React from 'react';

import { Link } from "react-router-dom";

import {Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const style = {
	footer: {
		minHeight: 250,
		background: "#666",
		padding: 30,
		marginTop: 30,
		color: "white",
		textAlign: 'center'
	},
	text: {
		color: 'white'
	},
	link: {
		color: 'gray',
		marginRight: 10
	}
}

class Footer extends React.Component {

	render() {
		let {classes} = this.props
		let year = new Date().getFullYear()
		return (
			<div className={classes.footer}>
				<Typography className={classes.text}>
					Copyright &copy; 2018-{year}, Curate Science <br/>
					<Link to="/about" className={classes.link}>About</Link>
					<Link to="/privacy" className={classes.link}>Privacy Policy</Link>
				</Typography>

			</div>
		)
	}
}

export default withStyles(style)(Footer);