import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import {Typography, Avatar, Grid, Paper} from '@material-ui/core';

const styles = {
	name: {
		fontSize: 16
	},
	affiliation: {
		fontSize: 12,
		color: "#CCC"
	},
	title: {
		fontSize: 12,
		color: "#444"
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
		fontSize: 32,
		color: 'gray',
		textAlign: 'center'
	}
}

class About extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };

        this.render_person = this.render_person.bind(this)

        this.CONTRIBUTORS = [
	        {
	        	url: "http://etiennelebel.com",
	        	image: "/sitestatic/people/lebel_o.jpg",
	        	name: "Etienne P. LeBel",
	        	affiliation: "KU Leuven",
	        	title: "Founder & Lead"
	        },
	        {
	        	url: "https://ppw.kuleuven.be/okp/people/wolf_vanpaemel/",
	        	image: "/sitestatic/people/vanpaemel_o.jpg",
	        	name: "Wolf Vanpaemel",
	        	affiliation: "KU Leuven",
	        },
	        {
	        	image: "/sitestatic/people/touko_o.jpg",
	        	name: "Touko Kuusi",
	        	affiliation: "University of Helsinki",
	        },
	        {
	        	url: "https://osf.io/xjhab/",
	        	image: "/sitestatic/people/mccarthy_o.jpg",
	        	name: "Randy McCarthy",
	        	affiliation: "Northern Illinois University",
	        },
	        {
	        	url: "https://oxford.academia.edu/BrianDEarp",
	        	image: "/sitestatic/people/earp_o.jpg",
	        	name: "Brian Earp",
	        	affiliation: "University of Oxford",
	        },
	        {
	        	url: "http://malte-elson.com/",
	        	image: "/sitestatic/people/elson_o.jpg",
	        	name: "Malte Elson",
	        	affiliation: "Ruhr University Bochum",
	        }
        ]

        this.ADVISORS = [
	        {
	        	url: "https://www.coll.mpg.de/team/page/susann_fiedler",
	        	image: "/sitestatic/people/fiedler_o.jpg",
	        	name: "Susann Fiedler",
	        	affiliation: "Max Planck Institute - Bonn",
	        },
	        {
	        	url: "https://www.universiteitleiden.nl/en/staffmembers/anna-van-t-veer#tab-1",
	        	image: "/sitestatic/people/vantveer_o.jpg",
	        	name: "Anna van't Veer",
	        	affiliation: "Leiden University",
	        },
	        {
	        	url: "https://www.imprs-life.mpg.de/en/people/julia-m-rohrer",
	        	image: "/sitestatic/people/rohrer_o.jpg",
	        	name: "Julia Rohrer",
	        	affiliation: "Max Planck Institute - Berlin",
	        },
	        {
	        	url: "https://mbnuijten.com/",
	        	image: "/sitestatic/people/nuijten_o.jpg",
	        	name: "Michèle Nuijten",
	        	affiliation: "Tilburg University",
	        },
	        {
	        	url: "https://www.psy.ox.ac.uk/team/dorothy-bishop",
	        	image: "/sitestatic/people/bishop_o.jpg",
	        	name: "Dorothy Bishop",
	        	affiliation: "University of Oxford",
	        },
	        {
	        	url: "http://www.psychology.illinois.edu/people/bwrobrts",
	        	image: "/sitestatic/people/roberts_o.jpg",
	        	name: "Brent Roberts",
	        	affiliation: "University of Illinois - Urbana-Champaign",
	        },
	        {
	        	url: "http://www.psychology.ucsd.edu/people/profiles/hpashler.html",
	        	image: "/sitestatic/people/pashler_o.jpg",
	        	name: "Hal Pashler",
	        	affiliation: "University of California - San Diego",
	        },
	        {
	        	url: "http://www.dansimons.com/",
	        	image: "/sitestatic/people/simons_o.jpg",
	        	name: "Daniel Simons",
	        	affiliation: "University of Illinois - Urbana-Champaign",
	        },
	        {
	        	url: "http://www.psych.usyd.edu.au/staff/alexh/lab/",
	        	image: "/sitestatic/people/holcombe_o.jpg",
	        	name: "Alex Holcombe",
	        	affiliation: "University of Sydney",
	        },
	        {
	        	url: "http://www.ejwagenmakers.com/",
	        	image: "/sitestatic/people/wagenmakers_o.jpg",
	        	name: "E-J Wagenmakers",
	        	affiliation: "University of Amsterdam",
	        },
	        {
	        	url: "https://scienceofpsych.wordpress.com/katie/",
	        	image: "/sitestatic/people/corker_o.jpg",
	        	name: "Katie Corker",
	        	affiliation: "Grand Valley State University",
	        },
	        {
	        	url: "http://www.simine.com/",
	        	image: "/sitestatic/people/vazire_o.jpg",
	        	name: "Simine Vazire",
	        	affiliation: "University of California – Davis",
	        },
	        {
	        	url: "https://www.msu.edu/~lucasri/",
	        	image: "/sitestatic/people/lucas_o.jpg",
	        	name: "Richard Lucas",
	        	affiliation: "Michigan State University",
	        },
	        {
	        	url: "https://www.unimib.it/marco-perugini",
	        	image: "/sitestatic/people/perugini_o.jpg",
	        	name: "Marco Perugini",
	        	affiliation: "University of Milan-Bicocca",
	        },
	        {
	        	url: "http://publish.uwo.ca/~lcampb23/index.html",
	        	image: "/sitestatic/people/campbell_o.jpg",
	        	name: "Lorne Campbell",
	        	affiliation: "University of Western Ontario",
	        },
	        {
	        	url: "http://psych.ubc.ca/persons/eric-eich/",
	        	image: "/sitestatic/people/eich_o.jpg",
	        	name: "Eric Eich",
	        	affiliation: "University of British Columbia",
	        },
	        {
	        	url: "https://tbslaboratory.com/",
	        	image: "/sitestatic/people/brandt_o.jpg",
	        	name: "Mark Brandt",
	        	affiliation: "Tilburg University",
	        }
        ]

        this.TECHNICAL_ADVISORS = [
	        {
	        	url: "https://github.com/alexkyllo",
	        	image: "/sitestatic/people/kyllo_o.jpg",
	        	name: "Alex Kyllo",
	        },
	        {
	        	url: "https://psychology.msu.edu/people/graduate-student/morri640",
	        	image: "/sitestatic/people/morrison_o.jpg",
	        	name: "Mike Morrison",
	        }
        ]
    }

    render_person(p) {
    	let {classes} = this.props
		return (
			<Grid item xs={3} align="center" justify="center">
				<a href={p.url} target="_blank"><Avatar src={p.image} className={classes.avatar} /></a>
				<Typography variant="h3" className={classes.name}>{ p.name }</Typography>
				{ p.title && <Typography variant="h5" className={classes.title}>{ p.title }</Typography> }
				<Typography variant="h5" className={classes.affiliation}>{ p.affiliation }</Typography>
			</Grid>
		)
    }

	render() {
		let {classes} = this.props
		return (
			<div style={{textAlign: 'center'}}>
				<div>
					<Typography variant="h1">About</Typography>

					<Typography variant="h3">Our Approach</Typography>
					<p>(See our <a href="http://curatescience.org/docs/lebeletal(2018,ampss)a-unified-framework-to-quantify-the-credibility-of-scientific-findings.pdf" target="_blank">white paper</a> for full details of our approach.)</p>
					<p>
						Science requires <u><i>transparency</i></u>. Different transparency standards, however, apply to different kinds of empirical research. <strong>Curate Science</strong> is a community platform to organize the <i>transparency</i> of published findings according to the relevant standards. It does so for the 3 most fundamental aspects of transparency:
					</p>
				</div>

				<div >
						<div className="row" >
							<div className="col-md-4 center">
								<Typography variant="h3" className={classes.about}>Method/Data Transparency</Typography>
								<img src='/sitestatic/about/method-data-transparency-diagram.png' width="275px" />
							</div>
							<div className="col-md-4 center" >
								<Typography variant="h3" className={classes.about}>Effect Replicability Transparency</Typography>
								<img src='/sitestatic/about/replicability-logo.png' />
								<img src='/sitestatic/about/reproducible-code.png' className='shrunk-28'/>
								<br/>
								<span className="transp-text-description">Transparent new sample replications of published effects.</span>
								<div className="popUpOnHover" >
									<img src="/sitestatic/about/replicability-diagram-about-section.png"  className="responsive" />
								</div>
							</div>
							<div className="col-md-4 center" >
								<Typography variant="h3" className={classes.about}>Analytic Reproducibility Transparency</Typography>
								<img src='/sitestatic/about/scatterplot.png' className='shrunk-28'/>
								<img src='/sitestatic/about/reproducible-code.png' className='shrunk-28'/>
								<div className="transp-text-description">Transparent analytic reproducibility and robustness re-analyses.</div>
								<div className="transp-text-description" >Analytic Reproducibility:</div>
								<div className="transp-text-description" >A study's primary result is reproducible by repeating the <i>same</i> statistical analyses (and data processing choices) on the data.</div>
								<div className="transp-text-description" >Analytic Robustness:</div>
								<div className="transp-text-description" >A study's primary result is <i>robust</i> across <i>all justifiable (alternative)</i> statistical analyses and data processing choices.</div>
							</div>
						</div>
				</div>
				<div >
						<p >The platform allows researchers to label the transparency of their empirical research: <span >Think nutritional labels for scientific papers</span> (but much more!). This publicly recognizes researchers who take the extra effort to report their research transparently, but also maximizes the re-use, value, and impact of research (in addition to several other distinct benefits for various research stakeholders, see our <a href="http://curatescience.org/docs/lebeletal(2018,ampss)a-unified-framework-to-quantify-the-credibility-of-scientific-findings.pdf" target="_blank">white paper's Table 1</a> for a full list of benefits).
						<p>Practicing what we preach, the platform is developed openly, with an <a href="https://github.com/eplebel/science-commons" target="_blank">open-source code base</a>, an <a href="http://creativecommons.org/licenses/by-sa/4.0/" target="_blank">open license</a>, and eventually an open API. For more details regarding the theoretical framework that guides the design of our platform, see our recently <a href="http://curatescience.org/docs/lebeletal(2018,ampss)a-unified-framework-to-quantify-the-credibility-of-scientific-findings.pdf" target="_blank">published paper at <i>Advanced in Methods and Practices in Psychological Science</i> (LeBel, McCarthy, Earp, Elson, & Vanpaemel, in press</a>).
						</p>
						</p>
						<p>Thanks to a 2-year grant from the European Commission (<a href="https://cordis.europa.eu/project/rcn/215183_en.html" target="_blank">Marie-Curie grant</a>), we will soon be scaling up the website to allow curation at a larger scale.
						</p>

						<Typography variant="h3" className={classes.about}><a className="offset" id="people">People</a></Typography>

						<Paper className={classes.box}>
							<Grid container>
								<Typography variant="h2" className={classes.boxHeader}>Current Contributors</Typography>
								<Typography variant="body1">Current contributors are helping with conceptual developments of Curate Science, writing/editing of related manuscripts, and/or with curation.</Typography>
								{ this.CONTRIBUTORS.map(this.render_person) }
							</Grid>
						</Paper>

						<Paper className={classes.box}>
							<Grid container>
								<Typography variant="h2" className={classes.boxHeader}>Current Advisory Board (as of Nov 2018)</Typography>
								<Typography variant="body1">Advisory board members periodically provide feedback on grant proposal applications and related manuscripts and general advice regarding Curate Science's current focus areas and future directions.</Typography>
								{ this.ADVISORS.map(this.render_person) }
							</Grid>
						</Paper>

						<Paper className={classes.box}>
							<Grid container>
								<Typography variant="h2" className={classes.boxHeader}>Technical Advisors</Typography>
								{ this.TECHNICAL_ADVISORS.map(this.render_person) }
							</Grid>
						</Paper>
					</div>
				</div>
		)
	}
}

export default withStyles(styles)(About);