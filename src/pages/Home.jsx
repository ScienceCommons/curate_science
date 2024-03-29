import React, { useEffect } from 'react'

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '@fancyapps/fancybox/dist/jquery.fancybox.min.css';
import { Carousel } from 'react-responsive-carousel';

import { forEach } from 'lodash'

import { makeStyles } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@material-ui/core';

import { Link } from '../components/Link.jsx';

import FAQ from './FAQ.jsx';
import Newsletter from './Newsletter.jsx';
import People from './home/People.jsx';

import { FancyBoxViewer } from 'util/fancybox'


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
        [theme.breakpoints.up('md')]: {
            paddingLeft: theme.spacing(5),
            paddingRight: theme.spacing(5),
        }
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
        width: '100%',
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
        [theme.breakpoints.up('md')]: {
            width: 'calc(100% + 16rem)',
            marginLeft: '-8rem',
            marginRight: '-8rem',
        }
    },
    homepage: {
        color: textColor,
    },
    howItWorksDescription: {
        color: textColor,
        fontSize: '1.125rem',
        paddingBottom: theme.spacing(2.5),
    },
    imageCarousel: {
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: theme.spacing(3),
        maxWidth: 700,
    },
    section: {
        marginTop: theme.spacing(10),
    },
    subsectionTitle: {
        color: '#455cc7',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    subheading: {
        fontSize: '1.4rem',
        lineHeight: 1.3,
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


const images = {
    landing: [
        {
            thumbnail: '/sitestatic/infographics/104.5-AP-beautiful-on-all-devices-LANDING-THUMBNAIL.png',
            full: '/sitestatic/infographics/4.5-AP-beautiful-on-all-devices-L-HIW-A-HD.png',
        },
        { 
            thumbnail: '/sitestatic/infographics/104.1-author-page-LANDING-THUMBNAIL.png',
            full: '/sitestatic/infographics/4.1-author-page-L-HIW-HD.png',
        },
        {
            thumbnail: '/sitestatic/infographics/105.0-external-author-page-LANDING-THUMBNAIL.png',
            full: '/sitestatic/infographics/5.0-external-author-page-L-HIW-A-HD.png',
        },
    ],
    authors: [
        {
            thumbnail: '/sitestatic/infographics/104.25-author-page-beautiful-on-all-devices-HIW-A-THUMBNAIL.png',
            full: '/sitestatic/infographics/4.5-AP-beautiful-on-all-devices-L-HIW-A-HD.png',
        },
        {
            thumbnail: '/sitestatic/infographics/104.0-author-page-HIW-A-THUMBNAIL.png',
            full: '/sitestatic/infographics/4.1-author-page-L-HIW-HD.png',
        },
        {
            thumbnail: '/sitestatic/infographics/105-external-author-page-HIW-A-THUMBNAIL.png',
            full: '/sitestatic/infographics/5.0-external-author-page-L-HIW-A-HD.png',
        },
    ],
    unisHIW: [
        {
            thumbnail: '/sitestatic/infographics/112.0-uni-researcher-list-ABOUT-THUMBNAIL.png',
            full: '/sitestatic/infographics/12.0-uni-researcher-list-ABOUT-HD.png',
        },
        {
            thumbnail: '/sitestatic/infographics/105.5-uni-OS-dashboard-01-home-UofB-THUMBNAIL.png',
            full: '/sitestatic/infographics/5.5-uni-OS-dashboard-01-home-UofB.png',
        },
        {
            thumbnail: '/sitestatic/infographics/113-T-leaderboard-UNIS-THUMBNAIL.png',
            full: '/sitestatic/infographics/13.0-T-leaderboard-UNIS-HD.png',
        },
    ],
    fundersHIW: [
         {
            thumbnail: '/sitestatic/infographics/114-funders-output-list-Gates-THUMBNAIL.png',
            full: '/sitestatic/infographics/14.0-funders-output-list-Gates.png',
        },
        {
            thumbnail: '/sitestatic/infographics/114-funders-grantee-list-CIHR-ABOUT-THUMBNAIL.png',
            full: '/sitestatic/infographics/14.0-funders-grantee-list-CIHR-ABOUT-HD.png',
        },
    ],    
    replicators: [
        {
            thumbnail: '/sitestatic/infographics/106-article-page-HIW-THUMBNAIL.png',
            full: '/sitestatic/infographics/6.0-article-page-HIW-HD.png',
        },
        {
            thumbnail: '/sitestatic/infographics/107-COLLECTION-page-HIW-THUMBNAIL.png',
            full: '/sitestatic/infographics/7.0-COLLECTION-page-HIW-HD.png',
        },
    ],
    researchers: [
        {
            thumbnail: '/sitestatic/infographics/104.0-author-page-HIW-A-THUMBNAIL.png',
            full: '/sitestatic/infographics/4.1-author-page-A-HD.png',
        },
        {
            thumbnail: '/sitestatic/infographics/104.5-T-standards-A-THUMBNAIL.png',
            full: '/sitestatic/infographics/1.0-T-standards-A-HD.png',
        },
        {
            thumbnail: '/sitestatic/infographics/105-external-author-page-HIW-A-THUMBNAIL.png',
            full: '/sitestatic/infographics/5.0-external-author-page-L-HIW-A-HD.png',
        },
    ],
    journals: [
        {
            thumbnail: '/sitestatic/infographics/110.0-journal-article-list-ABOUT-THUMBNAIL.png',
            full: '/sitestatic/infographics/10.0-journal-article-list-ABOUT-HD.png',
        },
        {
            thumbnail: '/sitestatic/infographics/110.5-journal-article-list-ABOUT-BMJ-open-THUMBNAIL.png',
            full: '/sitestatic/infographics/10.5-journal-article-list-ABOUT-HD-BMJ-Open.png',
        },
        {
            thumbnail: '/sitestatic/infographics/110.75-journal-article-editor-widget-MP-A-THUMBNAIL.png',
            full: '/sitestatic/infographics/10.75-journal-article-editor-widget-MP-A-HD.png',
        },
        {
            thumbnail: '/sitestatic/infographics/111-T-leaderboards-JOURNALS-THUMBNAIL.png',
            full: '/sitestatic/infographics/11.0-T-leaderboards-JOURNALS-HD.png',
        },
    ],
    universities: [
        {
            thumbnail: '/sitestatic/infographics/105.5-uni-OS-dashboard-01-home-UofB-THUMBNAIL.png',
            full: '/sitestatic/infographics/5.5-uni-OS-dashboard-01-home-UofB.png',
        },
        {
            thumbnail: '/sitestatic/infographics/112.5-uni-T-compliance-dashboard-A-THUMBNAIL.png',
            full: '/sitestatic/infographics/12.5-uni-T-compliance-dashboard-A-HD.png',
        },        
    ],
    funders: [
        {
            thumbnail: '/sitestatic/infographics/114.5-funder-OS-dashboard-01-home-THUMBNAIL.png',
            full: '/sitestatic/infographics/14.5-funder-OS-dashboard-01-home.png',
        },
        {
            thumbnail: '/sitestatic/infographics/114.5-funder-OS-dashboard-02-grants-THUMBNAIL.png',
            full: '/sitestatic/infographics/14.5-funder-OS-dashboard-02-grants.png',
        },
        {
            thumbnail: '/sitestatic/infographics/114.5-funder-OS-dashboard-03-unis-THUMBNAIL.png',
            full: '/sitestatic/infographics/14.5-funder-OS-dashboard-03-unis.png',
        },
        {
            thumbnail: '/sitestatic/infographics/114.5-funder-OS-dashboard-04-researchers-THUMBNAIL.png',
            full: '/sitestatic/infographics/14.5-funder-OS-dashboard-04-researchers.png',
        },
        {
            thumbnail: '/sitestatic/infographics/114.5-funder-OS-dashboard-05-outputs-THUMBNAIL.png',
            full: '/sitestatic/infographics/14.5-funder-OS-dashboard-05-outputs.png',
        },
    ],
}

// The lightbox cycles through all images on the page so we add
// an index to each image to use so we know which to open when clicked
let index = 0
let full_size_images = []
forEach(images, function(sectionImages) {
    forEach(sectionImages, function(image) {
        image.index = index++
        full_size_images.push({
            src: image.full,
            thumb: image.thumbnail,
        })
    })
})


const viewer = FancyBoxViewer({
    initial_images: full_size_images,
    hash: 'gallery'
})

function ImageCarousel({ images, autoPlay }) {
    const multiple_images = images.length > 1

    const expand = function(event) {
        event.preventDefault()
        const index = event.target.dataset.index || 0
        viewer.show_image(full_size_images, index)
    }

    return (
        <Carousel
            autoPlay={autoPlay}
            interval={9000}
            transitionTime={350}
            infiniteLoop={true}
            showStatus={false}
            showThumbs={false}
            showArrows={multiple_images}
            showIndicators={multiple_images}
        >
            {
                images.map((image, index) => {
                    return (
                        <a
                            href={image.full}
                            key={image.index}
                            style={{ display: 'block', backgroundColor: 'white' }}
                            onClick={expand}
                            data-index={image.index}
                        >
                            <img src={image.thumbnail}/>
                        </a>
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
            <CardActions style={{ padding: '1rem', paddingTop: 0 }}>
                <HomeButton href={href} to={to} style={{ marginTop: '1rem' }}>
                    {button_text}
                </HomeButton>
            </CardActions>
        </Card>
    )
}

function About(props) {
    const classes = useStyles()
 
    const biggerThanMD = useMediaQuery(theme => theme.breakpoints.up('md'));

    return (
        <div id="about" {...props}>
            <Grid container item justify="center">
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

                    <Grid item container xs={12} alignItems="center" style={{marginTop: '2rem'}}>
                        <Typography className={classes.howItWorksDescription}>
                            Every year, millions of people suffer and/or die from serious conditions like cancer, Alzheimer’s, heart disease, anxiety/mood disorders, and suicide.
                            To make progress on these and other problems, funded scientific research must be, at minimum, <strong>transparent and credible</strong> (credible research is transparent evidence that survives scrutiny from peers).
                            Transparent and credible evidence can then be built upon, which allows ever more precise theories/hypotheses to be tested (solid cumulative knowledge cannot be built on quicksand).
                            Sadly, there is a growing body of compelling evidence that a great deal of current academic research (if not the majority: 
                            <a href="https://journals.plos.org/plosmedicine/article%3Fid%3D10.1371/journal.pmed.0020124" target="_blank">1</a>,&nbsp;
                            <a href="https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.1001747" target="_blank">2</a>) is neither minimally transparent nor credible 
                            (<a href="https://pdfs.semanticscholar.org/3813/c9cb1bbbf699998b622fe4c8dbb02c9db482.pdf" target="_blank">1</a>,&nbsp;
                            <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0200303" target="_blank">2</a>,&nbsp;
                            <a href="https://www.nature.com/articles/tp2017203" target="_blank">3</a>,&nbsp;
                            <a href="https://osf.io/preprints/metaarxiv/6uhg5/" target="_blank">4</a>,&nbsp;
                            <a href="http://bioinformatics.sph.harvard.edu/ngs-workshops/documents/introduction/Nat%20Genet%202009%20Ioannidis.pdf" target="_blank">5</a>,&nbsp;
                            <a href="https://www.federalreserve.gov/econresdata/feds/2015/files/2015083pap.pdf" target="_blank">6</a>,&nbsp;
                            <a href="https://tomhardwicke.netlify.com/files/Hardwicke_reproducibility_2018.pdf" target="_blank">7</a>,&nbsp;
                            <a href="https://psyarxiv.com/fk8vh/" target="_blank">8</a>,&nbsp;
                            <a href="https://etiennelebel.com/documents/osc(2015,science).pdf" target="_blank">9</a>,
                            <a href="https://www.nature.com/articles/nrd3439-c1" target="_blank">10</a>,&nbsp;
                            <a href="https://www.nature.com/articles/483531a" target="_blank">11</a>,&nbsp;
                            <a href="https://osf.io/8srcd/" target="_blank">12</a>,&nbsp;
                            <a href="https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.1002165" target="_blank">13</a>,&nbsp;
                            <a href="https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.1002333" target="_blank">14</a>,&nbsp;
                            <a href="https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.2006930" target="_blank">15</a>,&nbsp;
                            <a href="https://academic.oup.com/clinchem/article/63/5/963/5612947" target="_blank">16</a>). Worse, there’s no systematic way to differentiate credible evidence from untrustworthy evidence.
                        </Typography>

                        <Typography className={classes.howItWorksDescription}>
                            Curate Science is an integrated system and curation platform to verify that research is <strong>transparent and credible</strong> (for a visual overview, <a href="https://etiennelebel.com/cs/cs-state-of-and-roadmap.html" target="_blank">see hyperlinked diagram</a>). It will allow researchers, journals, universities, funders, teachers, journalists, and the general public to ensure:
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
                            This will ensure that researchers, journals, universities, and funders are <strong>accountable</strong> to the people they serve. A unified platform to differentiate <em>credible evidence</em> (from untrustworthy evidence) will substantially accelerate the development of cumulative scientific knowledge and applied innovations across the natural and social sciences. The implications for human welfare are large.
                        </Typography>

                        <Grid id="about-researchers" container spacing={3} style={{ marginTop: '4rem' }}>
                            <Grid item xs={12}>
                                <Typography align="center" component="h4" className={classes.subsectionTitle}>
                                    Researchers
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container style={{ marginTop: '2rem' }} spacing={3}>
                            <Grid item md={6} xs={12} className={classes.imageCarousel}>
                                <ImageCarousel images={images.researchers}/>
                            </Grid>
                            <Grid item container md={6} xs={12} alignItems="center">
                                <Typography className={classes.howItWorksDescription}>
                                    Researchers can ensure their publications meet minimum transparency standards (across <a href="/sitestatic/infographics/1.0-4-T-standards-across-article-types-A.png" target="_blank">13 article types</a>) via their own (externally embeddable) Curate Scholar author page, in addition to a host of other benefits (see <Link to="#how-it-works">HOW IT WORKS section</Link>; example author pages: <Link to="/author/etienne-p-lebel">1</Link>, <Link to="/author/anna-vant-veer">2</Link>, <Link to="/author/lorne-campbell">3</Link>).
                                </Typography>

                                <Typography className={classes.howItWorksDescription}>
                                    This makes researchers accountable to (1) their employer, (2) the government/taxpayer who funds their research (if publicly funded), and (3) the public, given researchers’ societal responsibility as public intellectuals.
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid id="about-journals" container spacing={3} style={{ marginTop: '4rem' }}>
                            <Grid item xs={12}>
                                <Typography align="center" component="h4" className={classes.subsectionTitle}>
                                    Journals
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container style={{ marginTop: '2rem' }} spacing={3} direction={biggerThanMD ? "row" : "column-reverse"}>
                            <Grid item container md={6} xs={12} alignItems="center">
                                <Typography className={classes.howItWorksDescription}>
                                    Journals can ensure that submitted articles meet a minimum transparency standard of their choice, and ensure that follow-up scrutiny of published papers is automatically linked within their journal issue article lists.
                                </Typography>

                                <Typography className={classes.howItWorksDescription}>
                                    Our Curate Journal product holds journals accountable to what they publish, making them accountable to (1) the research community they serve, (2) the parent professional society that owns the journal (if applicable), and (3) organizations who rely on peer-reviewed journal articles for evidence-based decision-making.
                                </Typography>
                            </Grid>
                            <Grid item md={6} xs={12} className={classes.imageCarousel}>
                                <ImageCarousel images={images.journals}/>
                            </Grid>
                        </Grid>

                        <Grid id="about-unis" container spacing={3} style={{ marginTop: '4rem' }}>
                            <Grid item xs={12}>
                                <Typography align="center" component="h4" className={classes.subsectionTitle}>
                                    Universities / Research Institutes
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container style={{ marginTop: '2rem' }} spacing={3}>
                            <Grid item md={6} xs={12} className={classes.imageCarousel}>
                                <ImageCarousel images={images.universities}/>
                            </Grid>
                            <Grid item container md={6} xs={12} alignItems="center">
                                <Typography className={classes.howItWorksDescription}>
                                    Ensure your professors&#700; published research meets accepted minimum transparency standards and survives follow-up scrutiny (see <a href="https://etiennelebel.com/dashboards/uni-os-dashboard.html#home" target="_blank">interactive prototype</a>).                                    
                                </Typography>

                                <Typography className={classes.howItWorksDescription}>
                                    Base hiring and promotion decisions on researchers&#700; transparency track record and impact (see <a href="https://etiennelebel.com/dashboards/uni-os-dashboard-Charite.html#promotion" target="_blank">interactive prototype</a>).
                                </Typography>

                                <Typography className={classes.howItWorksDescription}>
                                    Our Curate University product makes universities accountable to their stakeholders: (1) tuition-fee paying students, (2) the government/taxpayer (for public universities), and/or (3) private/corporate donors.
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid id="about-funders" container spacing={3} style={{ marginTop: '4rem' }}>
                            <Grid item xs={12}>
                                <Typography align="center" component="h4" className={classes.subsectionTitle}>
                                    Funders / Funding Agencies
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container style={{ marginTop: '2rem' }} spacing={3} direction={biggerThanMD ? "row" : "column-reverse"}>
                            <Grid item container md={6} xs={12} alignItems="center">
                                <Typography className={classes.howItWorksDescription}>
                                    Ensure that grantees&#700; publications meet a minimum transparency standard and survive follow-up scrutiny (see <a href="https://etiennelebel.com/dashboards/funder-os-dashboard.html#home" target="_blank">interactive prototype</a>).
                                </Typography>

                                <Typography className={classes.howItWorksDescription}>
                                    Use researchers&#700;/grantees&#700; transparency track record to inform grant selection and grant renewal decisions.
                                </Typography>

                                <Typography className={classes.howItWorksDescription}>
                                    Our Curate Funder product makes funding agencies accountable to their stakeholders: (1) the taxpayer (for public funding agencies) and/or (2) the philanthropist donors (for private/non-profit foundations).
                                </Typography>
                            </Grid>
                            <Grid item md={6} xs={12} className={classes.imageCarousel}>
                                <ImageCarousel images={images.funders}/>
                            </Grid>
                        </Grid>

                        <Grid id="about-cs-accountability" container spacing={3} style={{ marginTop: '4rem' }}>
                            <Grid item xs={12}>
                                <Typography align="center" component="h4" className={classes.subsectionTitle}>
                                    CURATE SCIENCE ACCOUNTABILITY
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container style={{ marginTop: '2rem' }} spacing={3}>
                            <Grid item container xs={12} alignItems="center">
                                <Typography className={classes.howItWorksDescription}>
                                    Practising what we preach, several transparency and credibility measures have been (or will be) implemented to ensure that we are accountable to our own stakeholders that we serve: (1) our users, (2) the research community, and (3) the public:
                                </Typography>

                                <Typography className={classes.howItWorksDescription}>
                                    <strong>Transparency measures</strong>
                                </Typography>

                                <Typography className={classes.howItWorksDescription} component="ul">
                                    <li><a href="https://github.com/ScienceCommons/curate_science" target="_blank">Open-source code base</a>, open ontologies, and open standards.</li>
                                    <li>Openly-licensed curated content, accessible via an open database/open API, which can be easily re-used/re-posted via embeddable widgets. This enables the scholarly community/users to be in full control of their curated publications/content, unlike other platforms where content is either not flexible or accessible (Google Scholar) or only accessible to logged-in users (like Academia.edu and ResearchGate, who use a lock-in model).</li>
                                    <li>Transparent logging of all user curation contributions including editors and volunteer/paid curators. All users must use their real name (and be affiliated with a research institute) and will have their own user page displaying all of their contributions/edits.</li>
                                </Typography>

                                <Typography className={classes.howItWorksDescription}>
                                    <strong>Credibility measures</strong>
                                </Typography>

                                <Typography className={classes.howItWorksDescription} component="ul">
                                    <li>Flag issues with content (e.g., inaccuracies/discrepancies, incomplete information, broken links) from any article card/article page, even when content is embedded externally.</li>
                                    <li>Incentivize high quality information that is sensitive to the power/political dynamics in academia:
                                        <ul>
                                            <li>
                                                Discrete error detection system that allows users to anonymously and confidentially request clarification from an author regarding possible errors in a published work, including revocable confidentiality of information escrow to hold each party accountable (<a href="https://www.youtube.com/watch?v=0pgCaXMI-ps&feature=youtu.be&t=2093" target="_blank">Broockman, 2015</a>).
                                            </li>
                                            <li>
                                                Bug bounty functionality that provides financial rewards to researchers who identify errors in published research, conduct reproducibility re-analyses, or replication checks (financial bounties provided by original authors, journals, or outside donors).
                                            </li>
                                        </ul>
                                    </li>
                                </Typography>

                            </Grid>
                        </Grid>


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

    // Props for the 'Are you a ...?' cards
    const are_you = [
        {
            title: 'Are you an author?',
            text: 'Make your science deliciously user-friendly to consume, ultimately accessible, and beautiful on all devices.',
            button_text: 'Learn more',
            to: '#how-it-works',
        },
        {
            title: 'Are you a university official?',
            text: "Track the transparency of your researchers' outputs using our next-generation open science dashboard for institutions.",
            button_text: 'Learn more',
            to: '#for-unis',
        },
        {
            title: 'Are you a funder?',
            text: 'Ensure the research you fund is transparent and accessible to maximize your impact and return on investment.',
            button_text: 'Learn more',
            to: '#for-funders',
        },
    ]

    return (
        <Grid container className={classes.homepage}>
            <Grid container item justify="center">
                <Typography component="h2" className={classes.subheading} align="center">
                    Curation products for all research stakeholders.
                </Typography>
            </Grid>

            <Grid item>
                <ImageCarousel images={images.landing} autoPlay={true}/>
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

            <Grid container item justify="center" direction="column" id="how-it-works" className={classes.section}>
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
                            <Typography align="center" component="h4" className={classes.subsectionTitle}>
                                For authors
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container style={{ marginTop: '2rem' }} spacing={3}>
                        <Grid item md={6} xs={12} className={classes.imageCarousel}>
                            <ImageCarousel images={images.authors}/>
                        </Grid>
                        <Grid item container md={6} xs={12} alignItems="center">
                            <Typography className={classes.howItWorksDescription}>
                                Organize your publications on your own Curate Scholar author page to make your science deliciously user-friendly, ultimately accessible, and beautiful on all devices (example author pages: <Link to="/author/etienne-p-lebel">1</Link>, <Link to="/author/anna-vant-veer">2</Link>, <Link to="/author/lorne-campbell">3</Link>).
                            </Typography>

                            <Typography className={classes.howItWorksDescription}>
                                View full-text PDF and HTML versions of your articles directly within your author page.
                            </Typography>

                            <Typography className={classes.howItWorksDescription}>
                                Expose key figures in your publication list so your readers can jump directly into your research via a delightful touch-enabled media viewer.
                            </Typography>
                            
                            <Typography className={classes.howItWorksDescription}>
                                Curate links to associated content to save your reader and yourself time (e.g., URLs to open data, talks/videos).
                            </Typography>

                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item md={6}></Grid>
                        <Grid item container md={6} xs={12} alignItems="center">
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

            <Card id="for-unis" style={{ marginTop: '5rem' }} className={classes.card}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item md={6}></Grid>
                        <Grid item md={6} xs={12}>
                            <Typography align="center" component="h4" className={classes.subsectionTitle}>
                                For universities
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container style={{ marginTop: '2rem' }} direction={biggerThanMD ? "row" : "column-reverse"} spacing={3}>
                        <Grid item container md={6} xs={12} alignItems="center">
                            <Typography className={classes.howItWorksDescription}>
                                Make your researchers&#700; publications easy to access, interactive, and deliciously user-friendly to consume on your university&#700;s departmental pages.
                            </Typography>

                            <Typography className={classes.howItWorksDescription}>
                                Track the open science practices of your researchers, and monitor your progress in achieving transparency targets prioritized by your institution (see <a href="https://etiennelebel.com/dashboards/uni-os-dashboard-Charite.html#home" target="_blank">interactive prototype</a>).
                            </Typography>

                            <Typography className={classes.howItWorksDescription}>
                                University departments can then be ranked by their transparency track record, which graduate students and job candidates can use to inform their decisions at what university to work.
                            </Typography>

                        </Grid>
                        <Grid item md={6} xs={12} className={classes.imageCarousel}>
                            <ImageCarousel images={images.unisHIW}/>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item md={6}/>
                        <Grid item container md={6} xs={12} alignItems="center">
                            <HomeButton
                                style={{ marginTop: '1rem' }}
                                fontSize="1rem"
                                href="/accounts/signup/"
                            >
                                Sign up
                            </HomeButton>
                        </Grid>
                    </Grid>

                </CardContent>
            </Card>

            <Card id="for-funders" style={{ marginTop: '5rem' }} className={classes.card}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item md={6}></Grid>
                        <Grid item md={6} xs={12}>
                            <Typography align="center" component="h4" className={classes.subsectionTitle}>
                                For funders
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container style={{ marginTop: '2rem' }} spacing={3}>
                        <Grid item md={6} xs={12} className={classes.imageCarousel}>
                            <ImageCarousel images={images.fundersHIW}/>
                        </Grid>
                        <Grid item container md={6} xs={12} alignItems="center">
                            <Typography className={classes.howItWorksDescription}>
                                Make your grantees&#700; research outputs easy to access, interactive, and deliciously user-friendly to consume for all research stakeholders (e.g., policy analysts, innovators, citizens, etc.).
                            </Typography>

                            <Typography className={classes.howItWorksDescription}>
                                 Track the transparency of the research you fund, and monitor your progress in requiring higher levels of research transparency (see <a href="https://etiennelebel.com/dashboards/funder-os-dashboard.html#home" target="_blank">interactive prototype</a>).                                
                            </Typography>
                            
                            <Typography className={classes.howItWorksDescription}>
                                 Monitor your progress in funding a larger proportion of studies that report independent replications and reproducibility re-analyses.                                
                            </Typography>

                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item md={6}/>
                        <Grid item container md={6} xs={12} alignItems="center">
                            <HomeButton
                                style={{ marginTop: '1rem' }}
                                fontSize="1rem"
                                href="/accounts/signup/"
                            >
                                Sign up
                            </HomeButton>
                        </Grid>
                    </Grid>

                </CardContent>
            </Card>            
            
            <Card id="for-replicators" style={{ marginTop: '5rem' }} className={classes.card}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                            <Typography align="center" component="h4" className={classes.subsectionTitle}>
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
                            <ImageCarousel images={images.replicators}/>
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item container md={6} xs={12} alignItems="center">
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

            <About className={classes.section}/>

            <People homeStyles={classes} className={classes.section}/>

            <FAQ homeStyles={classes} className={classes.section}/>

            <Newsletter homeStyles={classes} className={classes.section}/>
        </Grid>

    )
}
