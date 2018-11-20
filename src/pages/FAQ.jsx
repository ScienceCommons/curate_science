import React from 'react';

import {Typography} from '@material-ui/core';

class FAQ extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };

        this.QUESTIONS = [
        	{q: "", a: ""}
        ]
    }

    render_qa(question, answer) {

    }

	render() {
		return (
			<div style={{textAlign: 'center'}}>
				<Typography variant="h1">FAQ</Typography>
				<Typography variant="h3">Origins/Beginnings</Typography>
				<Typography variant="h4">
					What was the original inspiration for Curate Science?
				</Typography>
				<Typography variant="body1">
					The idea behind Curate Science originated in 2014 amidst the bustling early days of the "open science movement" in psychology. Several new transparency and replication initiatives were emerging. The idea was to try to organize all this information in one place, creating a kind of public commons for the research community (or "science-commons", which was our original name).
				</Typography>
				<Typography variant="h4">
					Who started Curate Science?
				</Typography>
				<Typography variant="body1">
					Curate Science was started by 2 academic researchers (<a href="https://etiennelebel.com" target="_blank">Etienne LeBel</a> and <a href="https://scholar.google.ca/citations?user=W1SA9JcAAAAJ&hl=en" target="_blank">Christian Battista</a>) and 2 volunteer Silicon Valley software developers.
				</Typography>
				<Typography variant="h4">
					Why has progress been so slow?
				</Typography>
				<Typography variant="body1">
					Progress has been slow for various reasons. Curate Science has operated as a side project with very limited funding from 2014 to 2017 (with only occasional help from volunteer and paid freelance software developers; e.g., <a href="https://github.com/alexkyllo" target="_blank">Alex Kyllo</a>). Also, complexities emerged regarding the different ways transparency and replications are reported across studies and articles. However, based on curating over 1,200 replications of 200+ effects reported in hundreds of articles in the social and life sciences (the largest known curation effort of its kind), we have now developed a highly flexible ontology that is able to accommodate the curation of transparency and replications from heterogeneous kinds of studies and articles.
				</Typography>

				<Typography variant="h3">Present/Current Focus</Typography>

				<Typography variant="h4">
					What is our current focus/main activities?
				</Typography>
				<Typography variant="body1">
					We're currently focused on 2 main activities: (1) Curating the transparency of empirical articles (with respect to 5 fundamental transparency categories, see above) and (2) Tracking (new sample) replications of published effects. This primarily involves manual curation, however, we rely on several tools to increase curation efficiency and accuracy (e.g., various R scripts from the "shiny" R package and article metadata extraction tools using "scholar" and "rcrossref" R packages).
				</Typography>
				<Typography variant="h4">
					Who is currently working on Curate Science?
				</Typography>
				<Typography variant="body1">
					Etienne LeBel (project founder) is currently the main contributor. Wolf Vanpaemel contributes in major ways conceptually and in terms of grant funding leveraging. Touko Kuusi is currently the main volunteer curator. Randy McCarthy, Brian Earp, and Malte Elson (and Vanpaemel) are substantial contributors to the overarching framework <a href="http://curatescience.org/docs/lebeletal(2018,ampss)a-unified-framework-to-quantify-the-credibility-of-scientific-findings.pdf" target="_blank">white paper</a> that guides the design and development of the platform (recently <a href="http://curatescience.org/docs/lebeletal(2018,ampss)a-unified-framework-to-quantify-the-credibility-of-scientific-findings.pdf" target="_blank">published at <i>Advanced in Methods and Practices in Psychological Science</i> (LeBel, McCarthy, Earp, Elson, & Vanpaemel, in press</a>). Finally, our 17-person <a href="#people">advisory board</a>, composed of trailblazers in the transparency and replication movement, provide regular feedback regarding grant proposal applications and Curate Science activities.
				</Typography>
				<Typography variant="h4">
					Who is funding Curate Science?
				</Typography>
				<Typography variant="body1">
					We're currently funded by a 2-year grant from the European Commission (<a href="https://cordis.europa.eu/project/rcn/215183_en.html" target="_blank">Marie-Curie grant</a>). We have submitted two other large grants currently under review (totalling > CAD$1,000,000 over 4-years) to fund additional software developers and PhD student curators/editors (one from the not-for-profit sector, the other from a Belgium public granting agency).
				</Typography>

				<span className="FAQ-headings">Misconceptions/Public Relations</span>
				<Typography variant="h4">
					Is Curate Science a "debunking website"?
				</Typography>
				<Typography variant="body1">
					No. Curate Science is a platform to organize and track the transparency and replication information of empirical research as accurately and impartially as possible to allow the community of researchers to carefully interpret published findings in nuanced ways.
				</Typography>
				<Typography variant="h4">
					Is Curate Science a "central authority" that provide "official stamps of approval" of trustworthy research?
				</Typography>
				<Typography variant="body1">
					No. Similar to our approach to curating replications, our goal is to curate the transparency of empirical research as accurately as possible, rather than adjucating the quality of research. This then allows the community of researchers to more effectively scrutinize published findings. And given the crowdsourced nature of the platform (coming soon), we will be the opposite of a central authority: transparency and replications will be curated by the broadest/most inclusive group of researchers possible, thus maximizing theoretical and viewpoint diversity.

				</Typography>
				<Typography variant="h4">
					Curate Science seems to have good intentions, but isn't it going to "stigmatize" older research conducted according to different standards?
				</Typography>
				<Typography variant="body1">
					Kind of, but no. It <strong>is</strong> true that today's (much needed) higher transparency standards in some ways make older research seem less impressive. However, Curate Science is committed to rewarding positive scientific behaviors rather than punishing questionable behaviors. Indeed, we make it easy to get the most credit possible for conducting and reporting one's research only a little bit more transparently. That is, as transparent as you currently have time for and/or are comfortable with. For example, if you're uncomfortable publicly posting your data for an article, you could still earn credit by publicly posting your code and linking to it on Curate Science (only 1 transparency component is required to be eligible for being added to our database).
				</Typography>

				<span className="FAQ-headings">Future directions/Road Map</span>
				<Typography variant="h4">
					I want to add my transparently reported articles. When will I be able to do so?
				</Typography>
				<Typography variant="body1">
					We're currently finalizing specs to allow larger scale crowdsourced curation, which will soon be implemented. We will then test the platform with a small group of beta testers in the Fall of 2018. We plan to open up the platform to a larger group of researchers in early 2019. <a href="#newsletter">Sign up to receive our newsletter</a> to get regular updates on our progress!
				</Typography>
				<Typography variant="h4">
					What is coming ahead?
				</Typography>
				<Typography variant="body1">
					Many new features are currently in development that will make it even easier to access and interact with publicly available study components. See this <a href="articles-new-features.html">page</a> for some of these new features.
				</Typography>

			</div>
		)
	}
}

export default FAQ;