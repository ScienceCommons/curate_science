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
    aboutIcon: {
        width: '5rem',
        marginRight: theme.spacing(2),
    },
    aboutTitle: {
        color: '#999999',
        fontSize: '1.25rem',
        textTransform: 'uppercase',
        marginBottom: theme.spacing(2),
    },
    areYou: {
        border: 'solid 1px',
    },
    card: {
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
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

function About({}) {
    const classes = useStyles()

    return (
        <div>
            <Grid container item justify="center" direction="column">
                <Typography component="h3" className={classes.sectionHeading} align="center">
                    About
                </Typography>
            </Grid>

            <Card className={classes.card} style={{ marginTop: '2rem' }}>
                <CardContent>
                    <Grid container spacing={4}>
                        <Grid item md={6} xs={12}>
                            <Grid container wrap="nowrap">
                                <Typography align="center" className={classes.aboutTitle} style={{ flex: 1}}>
                                    Mission
                                </Typography>
                            </Grid>
                            <Grid container wrap="nowrap">
                                <div>
                                    <img className={classes.aboutIcon} src="/sitestatic/icons/mission-icon-180px.png"/>
                                </div>
                                <Typography className={classes.description}>
                                    Accelerate science by developing the best <em>transparency and credibility curation tools</em> for all research stakeholders.
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Grid container wrap="nowrap">
                                <Typography align="center" className={classes.aboutTitle} style={{ flex: 1}}>
                                    Vision
                                </Typography>
                            </Grid>
                            <Grid container wrap="nowrap">
                                <div>
                                    <img className={classes.aboutIcon} src="/sitestatic/icons/vision-icon-180px.png"/>
                                </div>
                                <Typography className={classes.description}>
                                    Create an <em>accountable</em> research world brimming with <em>transparent</em> and <em>credible</em> evidence.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item container xs={12} direction="column" alignItems="center" style={{marginTop: '2rem'}}>
                        <Typography className={classes.howItWorksDescription}>
                            Every year, millions of people suffer and/or die from serious conditions like cancer, Alzheimer’s, heart disease, anxiety/mood disorders, and suicide.
                            To make progress on these and other problems, funded scientific research must be, at minimum, <strong>transparent and credible</strong> (credible research is transparent evidence that survives scrutiny from peers).
                            Transparent and credible evidence can then be built upon, which allows ever more precise theories/hypotheses to be tested (solid cumulative knowledge cannot be built on quicksand).
                            Sadly, there is a growing body of credible evidence that the majority of (current) academic research is not minimally transparent nor credible 
                            (<a href="https://pdfs.semanticscholar.org/3813/c9cb1bbbf699998b622fe4c8dbb02c9db482.pdf">1</a>,&nbsp;
                            <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0200303">2</a>,&nbsp;
                            <a href="https://www.nature.com/articles/tp2017203">3</a>,&nbsp;
                            <a href="https://osf.io/preprints/metaarxiv/6uhg5/">4</a>,&nbsp;
                            <a href="http://bioinformatics.sph.harvard.edu/ngs-workshops/documents/introduction/Nat%20Genet%202009%20Ioannidis.pdf">5</a>,&nbsp;
                            <a href="https://www.federalreserve.gov/econresdata/feds/2015/files/2015083pap.pdf">6</a>,&nbsp;
                            <a href="https://tomhardwicke.netlify.com/files/Hardwicke_reproducibility_2018.pdf">7</a>,&nbsp;
                            <a href="https://psyarxiv.com/fk8vh/">8</a>,&nbsp;
                            <a href="https://etiennelebel.com/documents/osc(2015,&nbsp;science).pdf">9</a>,
                            <a href="https://www.nature.com/articles/nrd3439-c1">10</a>,&nbsp;
                            <a href="https://www.nature.com/articles/483531a">11</a>,&nbsp;
                            <a href="https://osf.io/8srcd/">12</a>,&nbsp;
                            <a href="https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.1002165">13</a>).
                        </Typography>

                        <Typography className={classes.howItWorksDescription}>
                            Curate Science is a unified curation system and platform to verify that research is <strong>transparent and credible</strong>. It will allow researchers, journals, universities, and funders to ensure:
                        </Typography>

                        <Typography component="ol" className={classes.howItWorksDescription}>
                                <li>
                                    <span style={{borderBottom: 'solid 1px'}}>Transparency</span>:
                                    Ensure research meets minimum transparency standards appropriate to the article type and employed methodologies.
                                </li>
                                <li>
                                    <span style={{borderBottom: 'solid 1px'}}>Credibility</span>:
                                    Ensure follow-up scrutiny is linked to its parent paper, including critical commentaries, reproducibility/robustness re-analyses, and new sample replications.
                                </li>
                        </Typography>

                        <Typography className={classes.howItWorksDescription}>
                            By ensuring <strong>transparency and credibility</strong>, research stakeholders are held accountable to the people/groups they serve.
                        </Typography>

                    </Grid>
                </CardContent>
            </Card>
        </div>
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

            <Card id="for-authors" className={classes.card}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item md={6}></Grid>
                        <Grid item md={6} xs={12}>
                            <Typography align="center" component="h4" style={{ color: '#455cc7', fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                For authors
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container style={{ marginTop: '2rem' }} spacing={3}>
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

            <Card style={{ marginTop: '5rem' }} className={classes.card}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                            <Typography align="center" component="h4" style={{ color: '#455cc7', fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                For replicators
                            </Typography>
                        </Grid>
                        <Grid item md={6}></Grid>
                    </Grid>
                    <Grid container style={{ marginTop: '2rem' }} direction={biggerThanMD ? "row" : "column-reverse"} spacing={3}>
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

            <Card style={{ marginTop: '5rem' }} className={classes.card}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item md={6}></Grid>
                        <Grid item md={6} xs={12}>
                            <Typography align="center" component="h4" style={{ color: '#455cc7', fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                For educators
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container style={{ marginTop: '2rem' }} spacing={3}>
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

            <hr className={classes.divider}/>

            <About/>
        </Grid>

    )
}
