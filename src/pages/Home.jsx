import React, { useCallback, useState } from 'react'
import { useCookies } from 'react-cookie';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

import { concat } from 'lodash'
import { makeStyles } from '@material-ui/styles';
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    areYou: {
        border: 'solid 1px',
    },
    buttontext: {
        fontSize: '0.875rem',
    },
    description: {
        fontSize: '1rem',
        color: '#666666',
    },
    divider: {
        backgroundColor: '#ccc',
        border: 0,
        height: 1,
        width: 10000000000000,
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
        marginLeft: -200,
        marginRight: -200,
    },
    homepage: {
        color: '#666666',
    },
    subheading: {
        fontSize: '1.8rem',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(4),
    },
    title: {
        fontSize: '1.5rem',
    },
}))


function ImageCarousel({ images }) {
    return (
        <Carousel
            autoPlay={true}
            infiniteLoop={true}
            showStatus={false}
            showThumbs={false}
        >
            {
                images.map((image, index) => {
                    return (
                        <div key={index}>
                            <img src={image}/>
                        </div>
                    )
                })
            }
        </Carousel>
    )
}


function AreYouCard({title, text, button_text}) {
    const classes = useStyles()

    return (
        <Card style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardContent>
                <Typography variant="h5" className={classes.title}>
                    {title}
                </Typography>
                <Typography style={{ marginTop: '1rem' }} className={classes.description}>
                    {text}
                </Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" color="secondary" style={{ marginTop: '1rem' }} className={classes.buttontext}>
                    {button_text}
                </Button>
            </CardActions>
        </Card>
    )
}

export default function Home({}) {
    const classes = useStyles()
    const [cookies] = useCookies()

    const images = [
        '/sitestatic/infographics/101-T-standards-LANDING-THUMBNAIL.png',
        '/sitestatic/infographics/102-article-card-ecosys-THUMBNAIL.png',
        '/sitestatic/infographics/103-author-page-LANDING-THUMBNAIL.png',
    ]

    // Props for the 'Are you a ...?' cards
    const are_you = [
        {
            title: 'Are you an author?',
            text: 'Be a transparent and credible researcher and accelerate your science with confidence.',
            button_text: 'Learn more'
        },
        {
            title: 'Are you a replicator?',
            text: 'Add your replication to our database to increase its visibility, discoverability, and impact.',
            button_text: 'Sign up'
        },
        {
            title: 'Are you an educator?',
            text: 'Find open data sets and study materials for your courses in statistics, research methodology, or meta-science.',
            button_text: 'Browse'
        },
    ]

    return (
        <Grid container className={classes.homepage}>
            <Grid container item justify="center">
                <Typography component="h2" className={classes.subheading}>
                    Transparent and credible scientific evidence.
                </Typography>
            </Grid>

            <Grid item>
                <ImageCarousel images={images}/>
            </Grid>

            <Grid container spacing={2} style={{marginTop: '2rem'}}>
                {
                    are_you.map((props, index) => {
                        return (
                            <Grid item xs={12} sm={4} key={index} style={{ display: 'flex' }}>
                                <AreYouCard {...props}/>
                            </Grid>
                        )
                    })
                }
            </Grid>

            <hr className={classes.divider}/>
        </Grid>
    )
}
