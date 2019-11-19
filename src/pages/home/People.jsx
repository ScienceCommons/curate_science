import React from 'react'

import { Avatar, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
    name: {
        fontSize: 13,
        fontWeight: 700,
        marginTop: 3,
        lineHeight: '18px'
    },
    affiliation: {
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    title: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: '18px'
    },
    avatar: {
        width: 80,
        height: 80,
        margin: 15
    },
}))

function Person({person}) {
    const classes = useStyles()

    return (
        <Grid item xs={3} align="center">
            <a href={person.url} target="_blank">
                <Avatar src={person.image} className={classes.avatar} />
            </a>
            <Typography variant="h3" className={classes.name}>
                { person.name }
            </Typography>
            <Typography variant="h5" className={classes.affiliation}>
                { person.affiliation }
            </Typography>

            { person.title && <Typography variant="h5" className={classes.title}>{ person.title }</Typography> }
        </Grid>
    )
}


export default function People({homeStyles}) {

    const classes = useStyles()

    const MAIN_TEAM = [
        {
            url: "http://etiennelebel.com",
            image: "/sitestatic/people/lebel-hires.png",
            name: "Etienne P. LeBel",
            affiliation: "KU Leuven",
            title: "Founder & Lead"
        },
        {
            url: "https://ppw.kuleuven.be/okp/people/wolf_vanpaemel/",
            image: "/sitestatic/people/vanpaemel-hires.png",
            name: "Wolf Vanpaemel",
            affiliation: "KU Leuven",
            title: "Conceptual Advisor"
        },
        {
            url: "https://psychology.msu.edu/people/graduate-student/morri640",
            image: "/sitestatic/people/morrison-hires.png",
            name: "Mike Morrison",
            affiliation: "Michigan State University",
            title: "Technical Advisor"
        },
        {
            image: "/sitestatic/people/kuusi-hires.png",
            name: "Touko Kuusi",
            affiliation: "University of Helsinki",
            title: "Volunteer Curator"
        },
        {
            url: "https://github.com/alexkyllo",
            image: "/sitestatic/people/kyllo-hires.png",
            name: "Alex Kyllo",
            title: "Software Developer"
        }

    ]

    const ADVISORS = [
        {
            url: "https://www.coll.mpg.de/team/page/susann_fiedler",
            image: "/sitestatic/people/fiedler-hires.png",
            name: "Susann Fiedler",
            affiliation: "Max Planck Institute - Bonn",
        },
        {
            url: "https://www.universiteitleiden.nl/en/staffmembers/anna-van-t-veer#tab-1",
            image: "/sitestatic/people/vantveer-hires.png",
            name: "Anna van't Veer",
            affiliation: "Leiden University",
        },
        {
            url: "https://www.imprs-life.mpg.de/en/people/julia-m-rohrer",
            image: "/sitestatic/people/rohrer-hires.png",
            name: "Julia Rohrer",
            affiliation: "Max Planck Institute - Berlin",
        },
        {
            url: "https://mbnuijten.com/",
            image: "/sitestatic/people/nuijten-hires.png",
            name: "Michèle Nuijten",
            affiliation: "Tilburg University",
        },
        {
            url: "https://www.psy.ox.ac.uk/team/dorothy-bishop",
            image: "/sitestatic/people/bishop-hires.png",
            name: "Dorothy Bishop",
            affiliation: "University of Oxford",
        },
        {
            url: "http://www.psychology.illinois.edu/people/bwrobrts",
            image: "/sitestatic/people/roberts-hires.png",
            name: "Brent Roberts",
            affiliation: "University of Illinois - Urbana-Champaign",
        },
        {
            url: "http://www.psychology.ucsd.edu/people/profiles/hpashler.html",
            image: "/sitestatic/people/pashler-hires.png",
            name: "Hal Pashler",
            affiliation: "University of California - San Diego",
        },
        {
            url: "http://www.dansimons.com/",
            image: "/sitestatic/people/simons-hires.png",
            name: "Daniel Simons",
            affiliation: "University of Illinois - Urbana-Champaign",
        },
        {
            url: "http://www.psych.usyd.edu.au/staff/alexh/lab/",
            image: "/sitestatic/people/holcombe-hires.png",
            name: "Alex Holcombe",
            affiliation: "University of Sydney",
        },
        {
            url: "http://www.ejwagenmakers.com/",
            image: "/sitestatic/people/wagenmakers-hires.png",
            name: "E-J Wagenmakers",
            affiliation: "University of Amsterdam",
        },
        {
            url: "https://scienceofpsych.wordpress.com/katie/",
            image: "/sitestatic/people/corker-hires.png",
            name: "Katie Corker",
            affiliation: "Grand Valley State University",
        },
        {
            url: "http://www.simine.com/",
            image: "/sitestatic/people/vazire-hires.png",
            name: "Simine Vazire",
            affiliation: "University of California – Davis",
        },
        {
            url: "https://www.msu.edu/~lucasri/",
            image: "/sitestatic/people/lucas-hires.png",
            name: "Richard Lucas",
            affiliation: "Michigan State University",
        },
        {
            url: "https://www.unimib.it/marco-perugini",
            image: "/sitestatic/people/perugini-hires.png",
            name: "Marco Perugini",
            affiliation: "University of Milan-Bicocca",
        },
        {
            url: "http://publish.uwo.ca/~lcampb23/index.html",
            image: "/sitestatic/people/campbell-hires.png",
            name: "Lorne Campbell",
            affiliation: "University of Western Ontario",
        },
        {
            url: "http://psych.ubc.ca/persons/eric-eich/",
            image: "/sitestatic/people/eich-hires.png",
            name: "Eric Eich",
            affiliation: "University of British Columbia",
        },
        {
            url: "https://tbslaboratory.com/",
            image: "/sitestatic/people/brandt-hires.png",
            name: "Mark Brandt",
            affiliation: "Tilburg University",
        },
        {
            url: "http://shiffrin.cogs.indiana.edu/",
            image: "/sitestatic/people/shiffrin-hires.png",
            name: "Richard Shiffrin",
            affiliation: "Indiana University"
        }
    ]

    return (
        <div id="people">
            <Typography variant="h3" align="center" className={homeStyles.sectionHeading}>
                People
            </Typography>

            <Typography variant="h2" className={homeStyles.subsectionTitle} align="center" style={{ marginTop: '2rem' }}>
                Main Team
            </Typography>

            <Grid container>
                { MAIN_TEAM.map((person) => { return <Person person={person} key={person.image}/> }) }
            </Grid>

            <Typography variant="h2" className={homeStyles.subsectionTitle} align="center" style={{ marginTop: '2rem' }}>
                Advisory Board
            </Typography>

            <Grid container>
                { ADVISORS.map((person) => { return <Person person={person} key={person.image}/> }) }
            </Grid>
        </div>
    )
}
