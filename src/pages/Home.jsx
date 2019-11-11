import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

import { concat } from 'lodash'

import { makeStyles } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@material-ui/core';


const textColor = '#666666'

const useStyles = makeStyles(theme => ({
    areYou: {
        border: 'solid 1px',
    },
    buttontext: {
        fontSize: '0.875rem',
    },
    description: {
        fontSize: '1rem',
        color: textColor,
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
    howItWorksDescription: {
        color: '#666666',
        fontSize: '1.25rem',
        paddingBottom: theme.spacing(2.5),
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
    },
    imageCarousel: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: theme.spacing(3),
        maxWidth: 700,
    },
    subheading: {
        fontSize: '1.8rem',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(4),
    },
    sectionHeading: {
        fontSize: '2rem',
        color: 'black',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: '1.5rem',
    },
    subtitle: {
        color: textColor,
        fontSize: '1.2rem',
        paddingTop: theme.spacing(),
        paddingBottom: theme.spacing(3),
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


function HomeButton({ fontSize, href, to, children }) {
    // `to` is used for links within the React app
    // `href` is used for links outside the React app (e.g. login/signup currently)
    fontSize = fontSize || '0.875rem'
    const button = (
        <Button
            variant="contained"
            color="secondary"
            style={{ fontSize }}
        >
            {children}
        </Button>
    )

    if (href) {
        return (
            <a href={href}>
                {button}
            </a>
        )
    }

    if (to) {
        return (
            <Link to={to}>
                {button}
            </Link>
        )
    }

    return null
}

function AreYouCard({title, text, button_text, to, href}) {
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
                <HomeButton href={href} to={to} style={{ marginTop: '1rem' }}>
                    {button_text}
                </HomeButton>
            </CardActions>
        </Card>
    )
}

export default function Home({}) {
    const classes = useStyles()

    // Media query used to determine if screen size is bigger than `md`
    // (used to reorder "For replicators" text and images on smaller screens)
    const biggerThanMD = useMediaQuery(theme => theme.breakpoints.up('md'));

    const images = [
        '/sitestatic/infographics/101-T-standards-LANDING-THUMBNAIL.png',
        '/sitestatic/infographics/102-article-card-ecosys-THUMBNAIL.png',
        '/sitestatic/infographics/103-author-page-LANDING-THUMBNAIL.png',
    ]

    const for_authors_images = [
        '/sitestatic/infographics/104.0-author-page-HIW-A-THUMBNAIL.png',
        '/sitestatic/infographics/104.5-T-standards-HIW-A-THUMBNAIL.png',
        '/sitestatic/infographics/105-external-author-page-HIW-A-THUMBNAIL.png',
    ]

    const for_replicators_images = [
        '/sitestatic/infographics/106-article-page-HIW-THUMBNAIL.png',
        '/sitestatic/infographics/107-COLLECTION-page-HIW-THUMBNAIL.png',
    ]

    const for_educators_images = [
        '/sitestatic/infographics/108-educator-DATA-THUMBNAIL.png',
        '/sitestatic/infographics/109-educator-MATERIALS-THUMBNAIL.png',
    ]

    // Props for the 'Are you a ...?' cards
    const are_you = [
        {
            title: 'Are you an author?',
            text: 'Be a transparent and credible researcher and accelerate your science with confidence.',
            button_text: 'Learn more',
            to: '#for-authors',
        },
        {
            title: 'Are you a replicator?',
            text: 'Add your replication to our database to increase its visibility, discoverability, and impact.',
            button_text: 'Sign up',
            href: '/accounts/signup/',
        },
        {
            title: 'Are you an educator?',
            text: 'Find open data sets and study materials for your courses in statistics, research methodology, or meta-science.',
            button_text: 'Browse',
            to: '/recent',
        },
    ]

    return (
        <Grid container className={classes.homepage}>
            <Grid container item justify="center">
                <Typography component="h2" className={classes.subheading} align="center">
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

            <Grid container item justify="center" direction="column">
                <Typography component="h3" className={classes.sectionHeading} align="center">
                    How it works
                </Typography>
                <Typography component="h4" align="center" className={classes.subtitle}>
                    Problems Curate Science solves
                </Typography>
            </Grid>

            <Card id="for-authors">
                <CardContent style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                    <Grid container>
                        <Grid item md={6}></Grid>
                        <Grid item md={6} xs={12}>
                            <Typography align="center" component="h4" style={{ color: '#455cc7', fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                For authors
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container style={{ marginTop: '2rem' }}>
                        <Grid item md={6} xs={12} className={classes.imageCarousel}>
                            <ImageCarousel images={for_authors_images}/>
                        </Grid>
                        <Grid item container md={6} xs={12} direction="column" alignItems="center">
                            <Typography className={classes.howItWorksDescription}>
                                Communicate the transparency and credibility of your research according to recognized transparency standards on your own (externally embeddable) author page.
                            </Typography>

                            <Typography className={classes.howItWorksDescription}>
                                Organize your publications (full-text URLs, key figures, etc.) and share and disseminate your research.
                            </Typography>

                            <Typography className={classes.howItWorksDescription}>
                                Increase the discoverability, accessibility, and impact of your research, giving yourself a competitive edge in hiring/grant contexts.
                            </Typography>

                            <Typography className={classes.howItWorksDescription}>
                                Feel confident inviting the world to both use and scrutinize your work.
                            </Typography>

                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item md={6}></Grid>
                        <Grid item container md={6} xs={12} direction="column" alignItems="center">
                            <HomeButton
                                style={{  marginTop: '1rem' }}
                                fontSize="1rem"
                                href="/accounts/signup/"
                            >
                                Create Author Page
                            </HomeButton>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card style={{ marginTop: '5rem' }}>
                <CardContent style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                    <Grid container>
                        <Grid item md={6} xs={12}>
                            <Typography align="center" component="h4" style={{ color: '#455cc7', fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                For replicators
                            </Typography>
                        </Grid>
                        <Grid item md={6}></Grid>
                    </Grid>
                    <Grid container style={{ marginTop: '2rem' }} direction={biggerThanMD ? "row" : "column-reverse"}>
                        <Grid item container md={6} xs={12} alignItems="center">
                            <Typography className={classes.howItWorksDescription}>
                                Link your replication to the original study to increase its visibility, discoverability, and impact, accelerating scientific self-correction.
                            </Typography>

                            <Typography className={classes.howItWorksDescription}>
                                Curate replication metadata on its own article page and easily share it.
                            </Typography>

                            <Typography className={classes.howItWorksDescription}>
                                Create collections of replications across different methods of testing an effect, and meta-analyze and track replication evidence (coming soon).
                            </Typography>

                        </Grid>
                        <Grid item md={6} xs={12} className={classes.imageCarousel}>
                            <ImageCarousel images={for_replicators_images}/>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item container md={6} xs={12} direction="column" alignItems="center">
                            <HomeButton
                                style={{ marginTop: '1rem' }}
                                fontSize="1rem"
                                href="/accounts/signup/"
                            >
                                Add Replication
                            </HomeButton>
                        </Grid>
                        <Grid item md={6}/>
                    </Grid>

                </CardContent>
            </Card>

            <Card style={{ marginTop: '5rem' }}>
                <CardContent style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                    <Grid container>
                        <Grid item md={6}></Grid>
                        <Grid item md={6} xs={12}>
                            <Typography align="center" component="h4" style={{ color: '#455cc7', fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                For educators
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container style={{ marginTop: '2rem' }}>
                        <Grid item md={6} xs={12} className={classes.imageCarousel}>
                            <ImageCarousel images={for_educators_images}/>
                        </Grid>
                        <Grid item container md={6} xs={12} direction="column" alignItems="center">
                            <Typography className={classes.howItWorksDescription}>
                                Find open data sets and analysis code on specific topics for your courses in statistics, research methodology, or meta-science.
                            </Typography>

                            <Typography className={classes.howItWorksDescription}>
                                Discover open study materials for course-related replication projects on topics relevant to your students&#700; interests.
                            </Typography>

                            <Typography className={classes.howItWorksDescription}>
                                Identify transparent and credible research findings to include in your courses.
                            </Typography>

                            <Typography className={classes.howItWorksDescription}>
                                Curate the transparency and credibility of seminal findings for your graduate seminar classes, organized in article lists re-usable by other instructors (coming soon).
                            </Typography>

                            <Typography className={classes.howItWorksDescription}>
                                Curate replication metadata on its own article page and easily share it.
                            </Typography>

                            <Typography className={classes.howItWorksDescription}>
                                Create collections of replications across different methods of testing an effect, and meta-analyze and track replication evidence (coming soon).
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item md={6}/>
                        <Grid item container md={6} xs={12} direction="column" alignItems="center">
                            <HomeButton
                                style={{ marginTop: '1rem' }}
                                fontSize="1rem"
                                to="/recent"
                            >
                                Browse
                            </HomeButton>
                        </Grid>
                    </Grid>

                </CardContent>
            </Card>

        </Grid>
    )
}
