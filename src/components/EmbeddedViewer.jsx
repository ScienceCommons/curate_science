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
    const width = (view_url.url === null) ? 0 : '66%'

    const style = {
        width,
        marginTop: TOPBAR_HEIGHT,
        transition: 'width 0.2s ease-in-out',
    }

    const closeViewer = () => view_url.clear_url()

    return (
        <div className={classes.viewer} style={style}>
            <div className={classes.viewerTopBar}> 
                <IconButton onClick={closeViewer} title="Close embedded viewer" style={{ color: '#999' }}>
                    <Icon>close</Icon>
                </IconButton>
            </div>
            <iframe style={{height: '100%', width: '100%', border: 'solid 1px'}} src={view_url.url}></iframe>
        </div>
    )
}
