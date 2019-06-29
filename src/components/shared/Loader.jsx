import React from 'react';

export default function Loader ({size, no_wrapper}) {
	let img = <img
			   src={`/sitestatic/loader.svg`}
			   id="loader"
			   width={size}
			   height={size}
			   type="image/svg+xml" />
	if (no_wrapper) return img
	return <div style={{textAlign: 'center'}}>{ img }</div>
}

Loader.defaultProps = { size: 50, no_wrapper: false };
