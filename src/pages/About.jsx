import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import {Typography, Avatar, Grid, Paper} from '@material-ui/core';

const styles = {
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
	box: {
		padding: 25,
		margin: 15
	},
	boxHeader: {
		display: 'block',
		fontSize: 16,
		marginTop: 20,
		fontWeight: 'bold',
		color: 'CornflowerBlue',
		textAlign: 'center'
	},
	UL: {
		lineHeight: '18px'
	},
	OL: {
		fontSize: 16,
		lineHeight: '21px',
		marginTop: 3
	}
}

class About extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };

        this.render_person = this.render_person.bind(this)

        this.MAIN_TEAM = [
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

        this.ADVISORS = [
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
    }

    render_person(p) {
    	let {classes} = this.props
		return (
			<Grid item xs={3} align="center" justifyContent="center">
				<a href={p.url} target="_blank"><Avatar src={p.image} className={classes.avatar} /></a>
				<Typography variant="h3" className={classes.name}>{ p.name }</Typography>
				<Typography variant="h5" className={classes.affiliation}>{ p.affiliation }</Typography>
				{ p.title && <Typography variant="h5" className={classes.title}>{ p.title }</Typography> }
			</Grid>
		)
    }

	render() {
		let {classes} = this.props
		return (
			<div style={{margin: '10px auto', maxWidth: 800}} className="StaticPages">
				<div>
					<Typography variant="h3" align="center">About</Typography>

					<p>
						<strong>Science requires transparency.</strong> However, no platform currently exists to look up the transparency of scientific articles. <strong>Curate Science</strong> aims to solve this problem by developing a platform for researchers to <i>label</i> and <i>link</i> the transparency and replication of their research.
					</p>

					<img src="/sitestatic/about/transparency_labels.png" className="img-responsive" />

					<img src="/sitestatic/about/kinds_of_transparency.png" className="img-responsive" />

					<img src="/sitestatic/about/article_types.png" className="img-responsive" />

					<p><i>Why would researchers want to label and link the transparency of their research?</i></p>

					<p>Because it will selfishly benefit them in several ways:</p>
						<ol className={classes.OL}>
							<li><strong>It will increase the impact, value, and discoverability of their research:</strong>
								<ul className={classes.UL}>
									<li style={{marginTop: 3}}>Increase the number of citations, downloads, and views of their articles (postprints and preprints)</li>
									<li>Increase the number of downloads and views of their publicly available study materials, data, and code</li>
								</ul>
							</li>
							<li style={{marginTop: 3}}><strong>It is easiest and best way to organize their publications: </strong>
								<ul className={classes.UL}>
									<li style={{marginTop: 3}}>Fastest way to find article full-text and associated content (e.g., study materials, data, code, preregistered protocol)</li>
									<li>Fastest way to share an article and refer to specific figures and/or materials, data, or code in emails or on social media (for themselves and others, the latter which will further boost reuse and citation counts)</li>
								</ul>
							</li>
							<li style={{marginTop: 3}}><strong>It will give them a competitive edge in job applications, job promotions, and grant applications:</strong>
								<ul className={classes.UL}>
									<li style={{marginTop: 3}}>Most compelling way to communicate one's full commitment to open science</li>
								</ul>
							</li>
							<li style={{marginTop: 3}}><strong>It will maximize their research integrity and accountability to research funders and to the public</strong></li>
						</ol>
						<br/>
						Researchers should also want to do this because it will benefit the research community and students:
						<ol className={classes.OL}>
							<li style={{marginTop: 3}}>It will help the community reuse and reanalyze empirical findings (e.g., in meta-analyses), accelerating scientific progress</li>
							<li style={{marginTop: 3}}>It will make it substantially easier for the community to replicate and extend published findings, also accelerating progress</li>
							<li style={{marginTop: 3}}>It will yield rich metadata resources for teaching and meta-science research on transparency, reproducibility, and replication</li>
						</ol>
						<br/>
						For a full list of benefits of labeling transparency, see our <a href="/sitestatic/papers/lebeletal(2018,ampss)a-unified-framework-to-quantify-the-credibility-of-scientific-findings.pdf" target="_blank">white paper (Table 1)</a>. The paper also outlines the theoretical principles that guide the design and implementation of our platform.

				</div>

				<div style={{marginTop: 50}}>
					<Typography variant="h3" align="center" id="people">People</Typography>

					<Typography variant="h2" className={classes.boxHeader}>Main Team</Typography>

					<Grid container>
						{ this.MAIN_TEAM.map(this.render_person) }
					</Grid>

					<Typography variant="h2" className={classes.boxHeader}>Advisory Board (as of April 2019)</Typography>

					<Grid container>
						{ this.ADVISORS.map(this.render_person) }
					</Grid>

				</div>
			</div>
		)
	}
}

export default withStyles(styles)(About);
