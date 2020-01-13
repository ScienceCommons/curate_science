import React, { useCallback, useState } from 'react'
import { createContainer } from 'unstated-next'

import { concat } from 'lodash'
import { makeStyles } from '@material-ui/styles';
import { Button, Icon, IconButton } from '@material-ui/core'

import { TOPBAR_HEIGHT } from './TopBar.jsx';

const useStyles = makeStyles(theme => ({
    viewer: {
        [theme.breakpoints.down('lg')]: {
            display: 'none',
        }
    },
    viewerTopBar: {
        background: '#333',
        width: '100%',
        textAlign: 'right',
    },
}))


function useViewURL(initialState = null) {
    const [url, set_url] = useState(initialState)
    const update_url = (url) => set_url(url)
    const clear_url = () => set_url(null)
    return { url, update_url, clear_url }
}

const ViewURL = createContainer(useViewURL)

export { ViewURL }



export default function EmbeddedViewer({ props }) {
    const classes = useStyles()
    const view_url = ViewURL.useContainer()
    const width = (view_url.url === null) ? 0 : '50%'
    const visibility = (view_url.url === null) ? 'hidden' : 'visible'

    const style = {
        width,
        visibility,
        position: 'fixed',
        top: TOPBAR_HEIGHT,
        bottom: 0,
        right: 0,
        transition: 'width 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
    }

    const closeViewer = () => view_url.clear_url()
    
    // Hacky way to update the styles on .AppContent so it's independently scrollable when the viewer is visible
    // Doing it this way because relying on the ViewURL state to change the style causes the whole
    // .AppContent to be rerendered when the viewer is shown (clearing any filters etc.)
    // There's probably a better way to do this...
    const app_content_el = document.querySelector('.AppContent')
    if (app_content_el) {
        if (view_url.url === null) {
            // add class
            app_content_el.classList.remove('EmbeddedViewerVisible')
        } else {
            // remove class
            app_content_el.classList.add('EmbeddedViewerVisible')
        }
    }

    return (
        <div className={classes.viewer} style={style}>
            <div className={classes.viewerTopBar}> 
                <IconButton onClick={closeViewer} title="Close embedded viewer" style={{ color: '#999' }}>
                    <Icon>close</Icon>
                </IconButton>
            </div>
            <iframe style={{height: '100%', width: '100%', border: 'solid 1px', flex: 1}} src={view_url.url}></iframe>
        </div>
    )
}
