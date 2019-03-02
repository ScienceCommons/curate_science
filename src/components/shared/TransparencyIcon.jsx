import React from 'react';

export default function TransparencyIcon ({tt, size, style}) {
	if (!size) size = 30
	let st = style || {}
	return <img
			   src={`/sitestatic/icons/${tt.icon}.svg`}
			   width={size}
			   height={size}
			   style={st}
			   type="image/svg+xml" />
}

