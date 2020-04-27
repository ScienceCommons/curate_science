import React, { useCallback, useEffect, useState } from 'react'
import { withRouter } from "react-router-dom";
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



export default withRouter(function EmbeddedViewer({ history }) {
    const classes = useStyles()
    const view_url = ViewURL.useContainer()
    const viewer_visible = !(view_url.url === null)

    const width = viewer_visible ? '50%' : 0
    const visibility = viewer_visible ? 'visible' : 'hidden'

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
    const top_bar_ev = document.querySelector('.TopBar')
    const viewer_visible_class = 'EmbeddedViewerVisible'

    if (app_content_el) {
        const class_already_added = app_content_el.classList.contains(viewer_visible_class)
        if (viewer_visible && !class_already_added) {
            // Store window scroll position to be applied to AppContent div
            const scroll_position = window.scrollY
            // add class
            app_content_el.classList.add(viewer_visible_class)
            top_bar_ev.classList.add(viewer_visible_class)
            app_content_el.scrollTop = scroll_position
        } else if (!viewer_visible) {
            // Store AppContent scroll position to be applied to window
            const scroll_position = app_content_el.scrollTop
            // remove class
            app_content_el.classList.remove(viewer_visible_class)
            top_bar_ev.classList.remove(viewer_visible_class)   
            window.scrollTo(0, scroll_position)
        }
    }

    // Close viewer on navigation
    useEffect(() => {
        closeViewer()
    }, [history.location.pathname])

    // Close viewer on ESC
    useEffect(() => {
        if (viewer_visible) {
            function close_on_escape(event) {
                if (event.key === 'Escape') {
                    closeViewer()
                }
            }

            window.addEventListener('keyup', close_on_escape);
            return () => window.removeEventListener('keyup', close_on_escape);
        }
    }, [viewer_visible]);

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
})
