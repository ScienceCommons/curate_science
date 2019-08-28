import React from 'react';
import {Typography} from '@material-ui/core';

export default function Or () {
	return (
		<Typography style={{textAlign: 'center', margin: 15}} variant="body2">
			-- OR --
		</Typography>
	)
}

Or.defaultProps = { size: 50 };
