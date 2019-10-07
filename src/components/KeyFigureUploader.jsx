import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { useCookies } from 'react-cookie';

import { Button, Typography } from '@material-ui/core';

import FigureList from './shared/FigureList.jsx';


export default function KeyFigureUploader({ article_id, figures }) {
    const [cookies] = useCookies()
    const onDrop = useCallback(acceptedFiles => {
        let formData  = new FormData();
        acceptedFiles.forEach(file => formData.append('file', file))
        fetch(`/api/articles/${article_id}/key_figures/upload/`, {
            // TODO show loading images in FigureList
            method: 'PUT',
            headers: {
                'X-CSRFToken': cookies.csrftoken,
            },
            body: formData
        }).then(r => {
            // TODO update images in FigureList
            console.log('result', r)
        })
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div>
            <div
                {...getRootProps()}
                style={
                    {
                        backgroundColor: isDragActive ? 'rgba(0,255,0,0.05)' : null,
                        width: '100%',
                        height: '8rem',
                        borderRadius: 8,
                        border: 'dashed 2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }
                }
            >
                <input {...getInputProps()} accept=".png,.jpg,.gif,.pdf"/>
                {
                    isDragActive ?
                        <Typography>Drop the files here</Typography> :
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography>
                                Drag and drop images here&nbsp;
                                <Typography color="textSecondary" component="span">
                                    (.png, .jpg, .gif or .pdf)
                                </Typography>
                            </Typography>
                            <Typography align="center" color="textSecondary">or</Typography>
                            <Button variant="contained">
                                Browse to select image files
                            </Button>
                        </div>
                }
            </div>
            <FigureList figures={figures} />
        </div>
    )
}
