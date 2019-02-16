import React from 'react';

import {Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	box: {
		border: '2px solid black',
		padding: 8,
		position: 'relative'
	},
	label: {
		background: theme.palette.bg,
		paddingLeft: 12,
		paddingRight: 12,
		position: 'absolute',
		top: -10,
		left: 10
	}
})

class LabeledBox extends React.Component {
	constructor(props) {
        super(props);
    }

	render() {
		let {label, classes} = this.props
		return (
			<div className={classes.box}>
				<Typography className={classes.label} variant="button">{ label }</Typography>
				{ this.props.children }
			</div>
		)
	}
}

LabeledBox.defaultProps = {
	label: "Box"
};

export default withStyles(styles)(LabeledBox);
