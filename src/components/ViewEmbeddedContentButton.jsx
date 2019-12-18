import React, { useCallback, useState } from 'react'

import { concat } from 'lodash'
import { makeStyles } from '@material-ui/styles';
import { Button, Icon, IconButton } from '@material-ui/core';

import { ViewURL } from './EmbeddedViewer.jsx';


const useStyles = makeStyles(theme => ({
    button: {
        minWidth: 0,
        padding: 0,
        [theme.breakpoints.down('lg')]: {
            display: 'none',
        }
    }
}))

export default function ViewEmbeddedContentButton({ iconStyle, mediaType, url }) {
    const classes = useStyles()
    const view_url = ViewURL.useContainer()

    if (mediaType === 'pdf') {
        url += '#view=FitH'
    }

    function toggle_viewer(url) {
        if (view_url.url === url) {
            view_url.clear_url()
        } else {
            view_url.update_url(url)
        }
    }

    return (
        <Button onClick={() => toggle_viewer(url)} className={classes.button}>
            <Icon style={iconStyle}>zoom_out_map</Icon>
        </Button>
    )
}
