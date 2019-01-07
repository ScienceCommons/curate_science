import React from 'react';

export default function Loader ({size}) {
	return <img
			   src={`/sitestatic/loader.svg`}
			   width={size}
			   height={size}
			   type="image/svg+xml" />

}

Loader.defaultProps = { size: 30 };
