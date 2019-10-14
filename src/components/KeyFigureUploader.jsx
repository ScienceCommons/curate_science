import React, { useCallback, useState } from 'react'
import {useDropzone} from 'react-dropzone'
import { useCookies } from 'react-cookie';

import { concat } from 'lodash'
import { Button, Icon, Typography } from '@material-ui/core';

import FigureList from './shared/FigureList.jsx';
import Loader from './shared/Loader.jsx';


export default function KeyFigureUploader({ article_id, figures, onChange }) {
    const [cookies] = useCookies()
    const [number_images_loading, set_number_images_loading] = useState(0)

    const onDrop = useCallback(acceptedFiles => {
        let formData  = new FormData();
        acceptedFiles.forEach(file => formData.append('file', file))

        set_number_images_loading(acceptedFiles.length)

        fetch(`/api/articles/${article_id}/key_figures/upload/`, {
            method: 'PUT',
            headers: {
                'X-CSRFToken': cookies.csrftoken,
            },
            body: formData
        }).then(response => {
            if (response.ok) {
                return response.json()
            } else {
                set_number_images_loading(0)
                throw new Error('Error uploading images')
            }
        }).then(data => {
            onChange(data)
            set_number_images_loading(0)
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
                    <Typography variant="h4">Drop the files here</Typography> :
                    <div style={{display: 'flex', width: '50%', justifyContent: 'space-evenly'}}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Icon style={{ fontSize: '3rem' }} color="disabled">add</Icon>
                            <Icon style={{ fontSize: '3rem' }} color="disabled">photo_library</Icon>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography>
                                Drag and drop images here&nbsp;
                                <Typography color="textSecondary" component="span">
                                    (.png, .jpg, .gif or .pdf)
                                </Typography>
                            </Typography>
                            <Typography align="center" color="textSecondary">or</Typography>
                            <Button variant="outlined">
                                Browse to select image files
                            </Button>
                        </div>
                    </div>
                }
            </div>
            <FigureList
                figures={figures}
                show_delete={true}
                number_images_loading={number_images_loading}
                onChange={onChange}
            />
        </div>
    )
}
