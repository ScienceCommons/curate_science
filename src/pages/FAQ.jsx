import React from 'react';

import { withRouter } from 'react-router-dom';
import { Link } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';

import {Typography, Paper} from '@material-ui/core';

const styles = {
	section: {
		margin: 15
	},
	sectionHeader: {
		fontSize: 14,
		fontWeight: 600,
		color: 'CornflowerBlue',
		textAlign: 'left',
		textTransform: 'none'
	},
	q: {
		marginTop: 3,
		fontWeight: 500,
		textAlign: 'left'
	},
	a: {
		textAlign: 'left',
		color: 'grey',
		paddingLeft: 20,
		marginBottom: 10,
		marginTop: 10,
	}
}

class FAQ extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };
        this.render_section = this.render_section.bind(this)

        this.SECTIONS = [
			{
				name: "Origins/Beginnings",
				qas: [
					{
						q: "What was the original inspiration for Curate Science?",
						a: 'The idea behind Curate Science originated in 2014 amidst the bustling early days of the "open science movement" in psychology. Several new transparency and replication initiatives were emerging. The idea was to try to organize all this information in one place, creating a kind of public commons for the research community (or "science-commons", which was our original name).',
					},
					{
						q: "Who started Curate Science?",
						a: <span>Curate Science was started by 2 academic researchers (<a href="https://etiennelebel.com" target="_blank">Etienne LeBel</a> and <a href="https://scholar.google.ca/citations?user=W1SA9JcAAAAJ&hl=en" target="_blank">Christian Battista</a>) and 2 volunteer Silicon Valley software developers.</span>
					}
				]
			},
			{
				name: "Present/Current Focus",
				qas: [
					{
						q: "What is our current focus?",
						a: "Our current focus is scaling up our platform to allow authors to curate the transparency and replication of their research. This allows researchers to label and link (1) the transparency of their articles (with respect to 5 fundamental transparency categories, see above) and (2) replications and reanalyses of previously reported findings.",
					},
					{
						q: "How is Curate Science unique from other open science/publishing platforms?",
						a: "We are the only platform that allows the curation of transparency and replication information of unpublished and published articles."
					},
					{
						q: "Who is currently working on Curate Science?",
						a: <span>Etienne LeBel is the founder and current lead, Wolf Vanpaemel contributes conceptually, and Touko Kuusi is a volunteer curator. Randy McCarthy, Brian Earp, and Malte Elson (and Vanpaemel) were substantial contributors to the unified framework <a href="/sitestatic/papers/lebeletal(2018,ampss)a-unified-framework-to-quantify-the-credibility-of-scientific-findings.pdf" target="_blank">white paper</a> that guides the design and development of the platform (recently <a href="/sitestatic/papers/lebeletal(2018,ampss)a-unified-framework-to-quantify-the-credibility-of-scientific-findings.pdf" target="_blank">published at <i>Advanced in Methods and Practices in Psychological Science</i> (LeBel, McCarthy, Earp, Elson, &amp; Vanpaemel, 2018</a>). Finally, our 17-person <Link to="/about">advisory board</Link>, composed of trailblazers in the transparency and replication movement, provide regular feedback regarding grant proposal applications and Curate Science activities.</span>
					},
					{
						q: "Who is funding Curate Science?",
						a: <span>We are currently funded by a 2-year grant from the European Commission (<a href="https://cordis.europa.eu/project/rcn/215183_en.html" target="_blank">Marie-Curie grant</a>) with a mandate to scale up the platform to allow curation at a larger scale.</span>
					},
					{
						q: "What is Curate Science's business model?",
						a: <span>We operate as a not-for-profit entity and are currently developing cost-covering mechanisms so that we can achieve financial sustainability in serving the research community. Our platform's code is open-source and our curated content is openly licensed (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC-BY 4.0</a>) and accessible via an open API (see our <a href="https://github.com/ScienceCommons/curate_science" target="_blank">github repo</a> for details).</span>
					}
				]
			},
			{
				name: "Misconceptions",
				qas: [
					{
						q: "Is Curate Science a \"central authority\" that provide \"official stamps of approval\" of trustworthy research?",
						a: "No. Our goal is to develop a crowdsourcing platform for the community to curate the transparency and replication of empirical research as accurately and impartially as possible. The community of researchers can then use this curated information to evaluate and interpret empirical findings in more nuanced ways.",
					},
					{
						q: "A lot is at stake when curating replication results. How will Curate Science ensure curation is done in ways that are fair to original authors?",
						a: "We have specifically designed the platform and user interface to be as fair and generous as possible to original authors. For instance, we allow the linking of (original author) commentary articles about replication papers and will also allow users to notify original authors when replications of their studies have been posted (in case they want to comment or correct any inaccuracies)."
					},
					{
						q: <span>Curate Science seems to have good intentions, but isn't it going to "stigmatize" older research conducted according to different standards</span>,
						a: <div>Kind of, but no. It is true that today's (much needed) higher transparency standards in some ways make older research seem less impressive. However, Curate Science is focused on rewarding positive scientific behaviors rather than punishing questionable behaviors. Indeed, we make it easy to get the most credit possible for conducting and reporting one's research only a little bit more transparently. That is, as transparent as you currently have time for and/or are comfortable with. For example, if you're uncomfortable publicly posting your data for an article, you could still earn credit by publicly posting your code and linking to it on Curate Science.</div>
					}
				]
			},
			{
				name: "Future directions/Road Map",
				qas: [
					{
						q: "I want to add my transparently reported articles. When will I be able to do so?",
						a: <span>We are in an early beta testing phase, hence the platform is currently only open to a small group of researchers. Our public beta launch is planned for early 2020. Please <Link to="/newsletter">sign up to receive our newsletter</Link> to be notified of updates regarding our public launch.</span>
					},
					{
						q: "What's the story behind Curate Science's new snail logo?",
						a: <span>Scientific research must be done carefully and solid scientific facts accumulate slowly and gradually (as does scientific curation). Snails are slow but they reliably get to where they need to go (<em>Slowly but surely, mostly slowly</em>). Snails, consequently, are a fitting symbol to convey the slow, careful, and gradual nature of science. Snails are also cute.</span>
					}
				]
			}
		]
    }

    render_section(sec) {
    	let {classes} = this.props
    	return (
	    	<div className="section" key={sec.name}>
	    		<Typography variant="h2" className={classes.sectionHeader}>{sec.name}</Typography>

	    		{ sec.qas.map((qa, i) => {
	    			return (
	    				<div key={i}>
	    					<Typography variant="body1" className={classes.q}>{ qa.q }</Typography>
	    					<Typography variant="body1" className={classes.a}>{ qa.a }</Typography>
	    				</div>
	    				)
	    		})}
	    	</div>
	    )
    }

	render() {
		return (
			<div style={{margin: '10px auto', maxWidth: 800}} className="StaticPages">
				<Typography variant="h3" align="center">FAQ</Typography>

				{ this.SECTIONS.map(this.render_section) }

			</div>
		)
	}
}

export default withRouter(withStyles(styles)(FAQ));