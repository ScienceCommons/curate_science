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


export default function People({homeStyles, ...props}) {

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
            url: "https://github.com/alexkyllo",
            image: "/sitestatic/people/kyllo-hires.png",
            name: "Alex Kyllo",
            title: "Software Developer"
        },
        {
            url: "https://github.com/dokterbob",
            image: "/sitestatic/people/debruin-hires.png",
            name: "Mathijs de Bruin",
            affiliation: "Visualspace",
            title: "Technical Advisor"
        },
        {
            image: "/sitestatic/people/kuusi-hires.png",
            name: "Touko Kuusi",
            affiliation: "University of Helsinki",
            title: "Volunteer Curator"
        }
    ]

    const ADVISORS = [
        {
            url: "http://www.psychology.ucsd.edu/people/profiles/hpashler.html",
            image: "/sitestatic/people/pashler-hires.png",
            name: "Hal Pashler",
            affiliation: "University of California - San Diego",
        },
        {
            url: "https://www.psy.ox.ac.uk/team/dorothy-bishop",
            image: "/sitestatic/people/bishop-hires.png",
            name: "Dorothy Bishop",
            affiliation: "University of Oxford",
        },
        {
            url: "https://www.coll.mpg.de/team/page/susann_fiedler",
            image: "/sitestatic/people/fiedler-hires.png",
            name: "Susann Fiedler",
            affiliation: "Max Planck Institute - Bonn",
        },
        {
            url: "https://mbnuijten.com/",
            image: "/sitestatic/people/nuijten-hires.png",
            name: "Michèle Nuijten",
            affiliation: "Tilburg University",
        },
        {
            url: "http://publish.uwo.ca/~lcampb23/index.html",
            image: "/sitestatic/people/campbell-hires.png",
            name: "Lorne Campbell",
            affiliation: "University of Western Ontario",
        }
    ]

    return (
        <div id="people" {...props}>
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
                Advisory Board (2018 - 2020)
            </Typography>

            <Grid container>
                { ADVISORS.map((person) => { return <Person person={person} key={person.image}/> }) }
            </Grid>
        </div>
    )
}
