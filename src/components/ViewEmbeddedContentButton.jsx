import React, { useCallback, useState } from 'react'

import { endsWith, includes, some, startsWith } from 'lodash'
import { makeStyles } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, Icon, IconButton } from '@material-ui/core';

import { ViewURL } from './EmbeddedViewer.jsx';


const useStyles = makeStyles(theme => ({
    button: {
        minWidth: 0,
        padding: 0,
    }
}))


export function is_url_valid(url, mediaType) {
    function url_contains(url, strings) {
        return some(strings, (string) => includes(url, string))
    }


    function pdf_url_is_valid(url) {
        const valid_urls = ['open.lnu.se/index.php', 'readcube.com/articles']
        const denied_urls = [
            'academia.edu.documents',
            'core.ac.uk',
            'github.com',
            'psycnet.apa.org/fulltext',
            'researchgate.net',
        ]

        if (url_contains(url, denied_urls)) return false
        if (url_contains(url, valid_urls)) return true

        return endsWith(url, '.pdf')
    }


    function html_url_is_valid(url) {
        const valid_urls = ['github.io', 'distill.pub']
        if (includes(url, 'frontiersin.org/articles') && endsWith(url, 'full')) return true
        if (url_contains(url, valid_urls)) return true
        return endsWith(url, '.html')
    }


    function preprint_url_is_valid(url) {
        const denied_urls = ['github.com', 'psycnet.apa.org/fulltext', 'academia.edu.documents']
        if (url_contains(url, denied_urls)) return false

        return endsWith(url, '.pdf')
    }


    function url_is_valid(url, mediaType) {
        // We can only embed content from https URLs
        if (!startsWith(url, 'https')) return false

        switch(mediaType) {
            case 'pdf':
                return pdf_url_is_valid(url)

            case 'html':
                return html_url_is_valid(url)

            case 'preprint':
                return preprint_url_is_valid(url)

            default:
                return false

        }
    }
    return url_is_valid(url, mediaType)
}

export default function ViewEmbeddedContentButton({ iconStyle, mediaType, style, url }) {
    const classes = useStyles()
    let view_url
    try {
        view_url = ViewURL.useContainer()
    } catch(error) {
        // Quick hack to avoid errors rendering the embedded author page
        // If trying to render outside of ViewURL.Provider we ignore the component and render nothing
        return null
    }

    // If the screen size is less than the XL breakpoint, don't show the embedded content button
    const lessThanXl = useMediaQuery('(max-width:1499px)')
    if (lessThanXl) return null

    if (!is_url_valid(url, mediaType)) return null

    if (mediaType === 'pdf') {
        url += '#view=FitH'
    }

    function toggle_viewer(url) {
        mediaType === 'pdf' ? url = url.replace('#view=FitH', '') : null
        if (view_url.url === url) {
            view_url.clear_url()
        } else {
            view_url.update_url(url)
        }
    }

    return (
        <Button style={style} onClick={() => toggle_viewer(url)} className={classes.button} title="View in embedded viewer">
            <Icon style={iconStyle}>zoom_out_map</Icon>
        </Button>
    )
}
