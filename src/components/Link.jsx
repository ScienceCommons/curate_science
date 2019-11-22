import React from 'react'
import { HashLink } from 'react-router-hash-link';

import { TOPBAR_HEIGHT } from './TopBar.jsx';


export function Link({ to, children, ...props }) {
    return (
        <HashLink
            to={to}
            scroll={el => window.scroll(0, el.offsetTop - TOPBAR_HEIGHT)}
            {...props}
        >
            {children}
        </HashLink>
    )
}
