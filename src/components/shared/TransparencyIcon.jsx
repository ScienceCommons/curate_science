import React from 'react';

export default function TransparencyIcon ({tt, size}) {
	if (!size) size = 30
	return <img
			   src={`/sitestatic/icons/${tt.icon}.svg`}
			   width={size}
			   height={size}
			   type="image/svg+xml" />
}