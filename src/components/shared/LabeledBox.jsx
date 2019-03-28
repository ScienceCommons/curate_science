import React from 'react';

import {Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
	box: {
		border: '2px solid black',
		padding: 2,
		position: 'relative',
		marginTop: 10
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
		let {label, classes, bgcolor, fontSize, inlineBlock, addClass} = this.props
		let st = {}
		if (bgcolor != null) st.backgroundColor = bgcolor
		if (fontSize != null) st.fontSize = fontSize
		if (inlineBlock) st.display = 'inline-block'
		let cls = 'LabeledBox ' + classes.box + ' ' + addClass
		return (
			<div className={cls} style={st}>
				<Typography className={classes.label} variant="button" style={st}>{ label }</Typography>
				{ this.props.children }
			</div>
		)
	}
}

LabeledBox.defaultProps = {
	label: "Box",
	bgcolor: null,
	fontSize: '0.75rem',
	inlineBlock: false,
	addClass: ''
};

export default withStyles(styles)(LabeledBox);
