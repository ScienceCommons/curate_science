import React from 'react';

import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import {Typography, Paper} from '@material-ui/core';

import { Link } from '../components/Link.jsx';


const styles = {
	section: {
		margin: 15
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
				name: "Origins and Evolution",
				qas: [
					{
						q: "What was the original inspiration for Curate Science?",
						a: 'The idea behind Curate Science originated in 2014 amidst the bustling early days of the "open science movement" in psychology. Several new transparency and replication initiatives were emerging. Our goal was to try to organize all of this transparency and replication information in one place at the article level, creating a public commons for the research community (or "Science Commons", which was our original name).',
					},
					{
						q: "How has Curate Science evolved since its inception?",
						a: "Our first transition involved focusing exclusively on curating replication studies and the replicability of effects. However, we soon realized that to correctly evaluate replication studies, one needs to ensure that each replication study is sufficiently transparent. We started developing tools to curate the transparency of replication studies, but realized that ensuring transparency was equally important for any study (including even non-empirical articles, where one still needs to consider COIs and funding sources). So we then developed a more general system to curate the transparency of all article types according to international transparency standards that were emerging. Finally, we realized that new sample replications are only one aspect of evaluating the credibility of evidence. So we expanded the scope of our credibility curation tools to also include critical commentaries, result reproducibility re-analyses, and robustness re-analyses (which are interrelated when evaluating credibility, hence must be curated in a harmonized manner)."
					}
				]
			},
			{
				name: "Present/Current Focus",
				qas: [
					{
						q: "What is our current focus?",
						a: "We are currently focused on scaling up our transparency and credibility curation tools for researchers. We are improving these tools based on beta users’ feedback and adding several new functionalities to achieve a more feature-rich product that can flexibly scale across the social, medical, and life sciences.",
					},
					{
						q: "How is Curate Science unique from other open science/publishing platforms?",
						a: "We are the only platform that allows researchers to curate the transparency and credibility of their unpublished and published articles. We are also unique in developing international transparency standards (and a corresponding transparency compliance system) that can be used by all research stakeholders to ensure that social, medical, and life science articles meet minimum transparency standards."
					},
					{
						q: "Isn’t Curate Science too ambitious?",
						a: "Curate Science is definitely an ambitious project. However, we confidently believe that it is feasible for several reasons. We’ve broken it down into manageable components, which we are successfully tackling piece-by-piece and in an interrelated manner. We have a strong team of interdisciplinarily talented, knowledgeable, and experienced leaders in the transparency and replication movement rapidly spreading globally. We’re highly passionate to seeing the project succeed because it will accelerate science and help us address serious societal problems like cancer, Alzheimer’s, heart disease, and suicide, which have personally affected our loved ones and families. We are henceforth personally committed to its cause and will continue to pour our blood, sweat, and tears into achieving our vision. We also feel it’s our ethical duty as public intellectuals to build such a platform, so that future generations of scientists can finally live in a world where research stakeholders are accountable to the people they serve."
					},
					{
						q: "Who is funding Curate Science?",
						a: <span>We previously received several seed grants from various organizations. We are currently funded by a 2-year grant from the European Commission (<a href="https://cordis.europa.eu/project/rcn/215183_en.html" target="_blank">Marie-Curie grant</a>) with a mandate to scale up the platform to allow transparency and credibility curation at a larger scale.</span>
					},
					{
						q: "What is Curate Science's business model?",
						a: <span>We currently operate as a not-for-profit entity. We are currently developing cost-covering mechanisms so that we can achieve financial sustainability in serving the research community. Our platform's code is open-source and our curated content is openly licensed (<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC-BY 4.0</a>) and accessible via an open API (see our <a href="https://github.com/ScienceCommons/curate_science" target="_blank">GitHub repo</a> for details).</span>
					},
					{
						q: "Where did the Replication studies table go?",
						a: <span>Due to our current scale up, we have moved the old legacy Replication studies table to a separate page (see <a href="/app/replications">here</a>). But these replications will soon be re-integrated into the main portion of the platform.</span>
					}
				]
			},
			{
				name: "Critiques and Concerns",
				qas: [
					{
						q: "Is Curate Science a central authority that provide official stamps of approval of trustworthy research?",
						a: "No. Our goal is to develop a crowdsourcing platform for the community to curate the transparency and credibility of research as accurately as possible. The community of researchers can then use this curated information to evaluate the merit of scholarly research in more nuanced ways.",
					},
					{
						q: "A lot is at stake when curating replication results (and credibility more generally). How will Curate Science ensure curation is done in ways that are fair to original authors?",
						a: <span>We have specifically designed the platform and user interface to be as fair and generous as possible to original authors and replicators. For instance, we allow original authors to link any commentary articles they’ve published in response to a replication paper. We will also allow users to notify the original authors when replications of their studies are posted, which gives them an opportunity to comment and/or correct inaccuracies. We are also developing a discrete error detection system that allows users to anonymously and confidentially request clarification from an author regarding possible errors in a published work, including revocable confidentiality of information escrow to hold each party accountable (<a href="https://events.stanford.edu/events/645/64543/" target="_blank">Broockman, 2015</a>).</span>
					},
					{
						q: "Curate Science seems to have good intentions, but isn't it going to stigmatize older research?",
						a: "Kind of, but not really. It is true that today's (much needed) higher transparency standards may make older research seem less impressive. However, Curate Science is focused primarily on rewarding more transparent scientific behaviors moving forward rather than punishing questionable behaviors of the past. Indeed, our system is specifically designed to reward you as generously as possible for conducting and reporting your research only a little bit more transparently. For example, if you cannot publicly post your data for an article, you can still earn a code badge for publicly posting your code and linking to it on Curate Science."
					},
					{
						q: "How will the quality and accuracy of the content be ensured (and more generally how will Curate Science be accountable to the research community)?",
						a: "Practising what we preach, several transparency and credibility measures will be implemented to ensure that we are accountable to our users, the research community, and the public. Transparency measures include the transparent logging of all user curation contributions including editors and volunteer/paid curators. All users must use their real name (and be affiliated with a research institute) and will have their own user page displaying all of their contributions/edits. Credibility measures include: (1) the ability to flag issues with content (e.g., inaccuracies/discrepancies, incomplete information, broken links) from any article card/article page, even when content is embedded externally and (2) a discrete communication system to allow users to anonymously and confidentially request clarification from an author regarding possible errors in a published work."
					},
					{
						q: "Aren’t researchers going to game the Curate Science system and its various transparency metrics?",
						a: "No because by definition transparency cannot be gamed. If researchers choose to repeatedly mischaracterize the transparency of their articles/research, it will be transparently obvious to the research community that they are doing so (at least eventually), which will impart serious reputational costs on such researchers."
					},
					{
						q: "Why would I want to curate the transparency of my article when I’ve already provided the relevant URLs to the study materials, data, etc. in the published paper?",
						a: <span>Because it substantially increases the value of your contribution and selfishly benefits you in several ways. Curating transparency signals to others that your article meets minimum transparency standards, which guarantees that your research gets the credibility it deserves. It also makes it more accessible and discoverable, making it easier for others to build on your work, re-use it to make new discoveries, and include it in meta-analyses and other re-analyses. It also helps you organize your publications, providing you with the fastest way to find, share, and disseminate your articles’ full-text, open content, and key figures. It also maximizes your research integrity and accountability to your employer, funder, and the general public. It may also give you a competitive edge in job applications, promotions, and grant applications (and dozens of additional benefits, see <a href="https://etiennelebel.com/logos/value-created-for-stakeholders.png" target="_blank">here</a>).</span>
					},
					{
						q: "Isn’t it problematic to allow sci-hub links to full-text PDFs of articles?",
						a: <span>This is indeed a tricky and complex moral and legal issue. It is true that sci-hub links to full-text PDFs of articles violate copyright in a technical sense. That said, copyrighting scientific information is antithetical to the goals of science. Hence, on logical and ethical grounds, scientific articles should never have been allowed to be copyrighted in the first place (indeed, the <a href="http://ccnmtl.columbia.edu/projects/mmt/udhr/article_27.html" target="_blank">Universal Declaration of Human Rights, Article 27</a>, unambiguously states that participating and benefiting from scientific research is a fundamental human right). A compelling case can be made that copyrighting (and pay-walling) scientific research is unethical. Indeed a growing number of European countries (e.g., <a href="https://openaccess.be/open-access-in-belgium/policies-mandates-in-belgium/" target="_blank">Belgium</a>) have passed legislation that requires all researchers to violate copyright law and make their publicly-funded research openly accessible to all (see <a href="https://www.sciencemag.org/news/2016/05/dramatic-statement-european-leaders-call-immediate-open-access-all-scientific-papers" target="_blank">here</a> for broader EU open access legislation developments). Given that proper scientific scrutiny requires full article and study details, we unquestionably must take the longview on this issue, even if such position entails some risks.</span>
					}
				]
			},
			{
				name: "Future directions/Road Map",
				qas: [
					{
						q: "I want to add my transparently reported articles. When will I be able to do so?",
						a: <span>We're currently in an early beta phase, hence sign up is currently limited to a small group of highly motivated researchers who are leading the transparency and replication movement in science. If you are such a researcher, please email us at curatescience@gmail.com and we will promptly invite you to the platform (you can also <Link to="/home#newsletter">sign up to our newsletter</Link> to stay updated about our public beta launch).</span>
					},
					{
						q: "What is Curate Science's roadmap/5-year plan?",
						a: <span>We’re currently seeking our next round of funding to expand Curate Science in two directions: We will (1) expand the scope of our transparency and credibility curation products so they can be used by the other 3 key research stakeholders (i.e.,  journals, universities, and funders) and (2) continue to improve/scale up the current curation products for researchers (see <a href="https://github.com/ScienceCommons/curate_science/issues/52" target="_blank">roadmap of upcoming features</a>). If you’re interested in participating in our next funding round, please contact us at curatescience@gmail.com.</span>
					},
					{
						q: "What's the story behind Curate Science's snail logo?",
						a: "Scientific research must be done carefully. Solid scientific facts accumulate slowly and gradually, as does scientific curation. Snails are slow but they reliably get to where they need to go. Snails are consequently a fitting symbol to convey the slow, careful, and gradual nature of science. Snails are also cute."
					}
				]
			}
		]
    }

    render_section(sec) {
    	let {classes, homeStyles} = this.props
    	return (
	    	<div className="section" key={sec.name}>
                <Typography
                    variant="h2"
                    align="center"
                    className={homeStyles.subsectionTitle}
                    style={{ padding: '2rem 0 1rem 0' }}
                >
                    {sec.name}
                </Typography>

	    		{ sec.qas.map((qa, i) => {
	    			return (
	    				<div key={i}>
                            <Typography className={homeStyles.howItWorksDescription} style={{paddingBottom: 0}}>
                                <strong>{ qa.q }</strong>
                            </Typography>
                            <Typography className={homeStyles.howItWorksDescription}>
                                { qa.a }
                            </Typography>
	    				</div>
                    )
	    		})}
	    	</div>
	    )
    }

	render() {
        const homeStyles = this.props.homeStyles

		return (
			<div id="faq" style={{ width: '100%' }} className={this.props.className}>
                <Typography variant="h3" align="center" className={homeStyles.sectionHeading}>
                    FAQ
                </Typography>

				{ this.SECTIONS.map(this.render_section) }

			</div>
		)
	}
}

export default withRouter(withStyles(styles)(FAQ));
