import React from 'react';

export default function Loader ({size}) {
	return (
		<div style={{textAlign: 'center'}}>
			<img
			   src={`/sitestatic/loader.svg`}
			   id="loader"
			   width={size}
			   height={size}
			   type="image/svg+xml" />
		</div>
	)
}

Loader.defaultProps = { size: 50 };
