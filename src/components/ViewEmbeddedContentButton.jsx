import React, { useCallback, useState } from 'react'

import { endsWith, includes, some } from 'lodash'
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



function url_contains(url, strings) {
    return some(strings, (string) => includes(url, string))
}


function pdf_url_is_valid(url) {
    const valid_urls = ['open.lnu.se/index.php', 'readcube.com/articles']
    const denied_urls = ['github.com', 'psycnet.apa.org/fulltext', 'academia.edu.documents']

    if (url_contains(url, denied_urls)) return false
    if (url_contains(url, valid_urls)) return true

    return endsWith(url, '.pdf')
}


function html_url_is_valid(url) {
    if (includes(url, 'frontiersin.org/articles') && endsWith(url, 'full')) return true
    if (includes(url, 'github.io')) return true
    return endsWith(url, '.html')
}


function preprint_url_is_valid(url) {
    const denied_urls = ['github.com', 'psycnet.apa.org/fulltext', 'academia.edu.documents']
    if (url_contains(url, denied_urls)) return false

    return endsWith(url, '.pdf')
}


function url_is_valid(url, mediaType) {
    switch(mediaType) {
        case 'pdf':
            return pdf_url_is_valid(url)

        case 'html':
            return html_url_is_valid(url)

        case 'preprint':
            return preprint_url_is_valid(url)

    }

    return true
}


export default function ViewEmbeddedContentButton({ iconStyle, mediaType, url }) {
    const classes = useStyles()
    const view_url = ViewURL.useContainer()

    if (!url_is_valid(url, mediaType)) return null

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
        <Button onClick={() => toggle_viewer(url)} className={classes.button} title="View in embedded viewer">
            <Icon style={iconStyle}>zoom_out_map</Icon>
        </Button>
    )
}
