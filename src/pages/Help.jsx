import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import {Typography, Paper, Grid} from '@material-ui/core';

const styles = {
	root: {
		display: 'block',
		maxWidth: 810,
		margin: '20px auto'
	},
	bottomless: {
		marginBottom: 0
	},
	grayList: {
		color: 'gray',
		fontSize: 14
	},
	question: {
		fontWeight: 'bold'
	},
	answer: {
		color: 'grey',
	    paddingLeft: 22,
	    lineHeight: '19px'
	}
}

class Help extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        }
    }

	render() {
		let {classes} = this.props
		return (
			<div className={classes.root}>
				<Typography variant="h3" justify="center" align="center">Help</Typography>

				<Typography variant="body1">

					<div style={{fontSize: 14}}>

						<p className={classes.bottomless + ' ' + classes.question}>
							Create/Find your author page
						</p>
						<p className={classes.answer}>
							Click the user avatar (on the right-hand side of the navigation bar). If your author page already exists, you’ll see the menu item “My Author Page”, which will bring you to your user page.
							<br/><br/>
							If your author page does not yet exist, you’ll see “Create Author Page.” Clicking this will create your author page and bring you to it.

						</p>
						<p className={classes.question + ' ' + classes.bottomless}>
							Add new articles to your author page
						</p>
						<p className={classes.answer + ' ' + classes.bottomless}>
							You can add articles to your author page in 2 ways:
							<ul className={classes.grayList}>
								<li><strong>Add new article</strong></li>
								<ul className={classes.grayList}>
									<li >Click “Add Article” </li>
									<li>This will open the “New article” modal window where you can enter an article’s information (see below for more details on entering/editing the various fields of your article).</li>
								</ul>

								<li><strong>Link pre-existing article</strong>
										<br/>
										If you want to add an article to your author page that is already in our database (for example, because a co-author has already added it on their author page), then:								</li>
									<ul className={classes.grayList}>
										<li>Click “ADD PREEXISTING ARTICLE”</li>
										<li>In the search box that appears, type a few words from the title of the article you want to link (*or* type the last name of one of the article’s authors)</li>
										<li>Select the article in the list, which will add the article to your author page.
										<br/>(Note: your article list is sorted by publication year (most recent first), so if you don’t see your article, it’s probably lower down in your article list.)
										</li>
									</ul>

							</ul>

						</p>
						<p className={classes.question + ' ' + classes.bottomless}>
							Edit an article
						</p>
						<p className={classes.answer}>
							Hover over the card of the article you want to edit, and click “EDIT”. This will open the “Edit Article” modal window where you can edit all article fields.
						</p>
						<p className={classes.question + ' ' + classes.bottomless}>
							Enter information for an article’s metadata fields (* indicates required fields):
						</p>
						<p className={classes.answer + ' ' + classes.bottomless}>
							<ul className={classes.grayList}>
								<li><strong>Title*</strong>: Enter the article’s title</li>
								<li><strong>Authors*</strong>: Enter the article’s authors (recommended format: “SS Smith, JJ Jones”; for long author lists, you can use “SS Smith, JJ Jones et al.” or “SS Smith, JJ Jones, … , & KK Kelvin”)</li>
								<li><strong>Publication year*</strong>: Use the current year for unpublished articles or preprints. For in press articles, please check the “In press” check box.
								<li><strong>Journal name</strong>: Enter the journal name. Please leave blank for unpublished or preprint articles.</li>
								<li><strong>DOI</strong>: Enter your article’s DOI. Please leave blank for unpublished or preprint articles.</li>
								<li><strong>Abstract</strong>: Enter the abstract text (or leave blank if no abstract available, for e.g., for commentary articles).</li>
								<li><strong>Key words</strong>: Enter an article’s key words, separating each key word with a comma (‘,’).</li>
								<li><strong>Article type</strong>: Select the article’s article type from the dropdown menu.</li>
									<ul className={classes.grayList}>
										<li><strong>Original</strong>: An empirical article that examines new questions not directly comparable to previous research.</li>
										<li><strong>Replication</strong>: An empirical article that reports at least 1 (new sample) replication study of a previously published effect, employing sufficiently-similar methodologies to the original study. Only studies employing methodologies that are 'Close', 'Very close', or 'Exact' according to our <a href="https://curatescience-staging.appspot.com/sitestatic/legacy/logos/replication-taxonomy-v4_small.png" target="_blank">replication taxonomy</a> are considered replications (e.g., at minimum employing the same general operationalizations to measure the independent variable(s) and dependent variable(s); see our <a href="https://curatescience-staging.appspot.com/sitestatic/legacy/logos/replication-taxonomy-v4_small.png" target="_blank">replication taxonomy</a> for more details).
										<br/>
										Replication-specific fields:</li>
											<ul className={classes.grayList}>
												<li><strong>Number of replications</strong>: Enter the number of ('Close', 'Very close', or 'Exact') replication studies reported in the article.</li>
												<li><strong>Original study</strong>: Enter the author names and publication year of the original study (e.g., “Smith & Jones (2011)”).</li>
												<li><strong>Target effect(s)</strong>: Enter the name of the effect(s) that were the target of the replication (e.g., “Macbeth effect”).</li>
												<li><strong>Original article URL</strong>: Enter a URL to the full-text article that reported the original study (if available).</li>
											</ul>
										<li><strong>Reanalysis – Reproducibility/Robustness</strong>: An article that reports a “result reproducibility” reanalysis (repeating the same statistical analyses on data of an existing published result) or a “result robustness” reanalysis (conducting different statistical analyses on data of an existing published result).</li>
										<li><strong>Reanalysis – Meta-analysis</strong>: An article reporting a (traditional) meta-analysis that combines evidence across previously published studies on a common topic.</li>
										<li><strong>Reanalysis – Meta-research</strong>: An article reporting other kinds of meta-research reanalyses (e.g., use/misuse of statistical tests across published articles/studies).</li>
										<li><strong>Commentary</strong>: A commentary on previous research (with or without collection of new data)</li>
										<li><strong>Conceptual</strong>: A non-empirical article that makes a theoretical or conceptual contribution (including methodological articles with or without use of simulation studies).</li>
									</ul>

								<li><strong>Key figures/tables</strong>: To add key figures/tables that best summarize your article’s main results: </li>
								<ul className={classes.grayList}>
									<li>Click the “+ Add” button</li>
									<li>
										Click the “Choose File” button and select the figure/table image file from a local folder on your computer.
										<br/><br/>
										The figure will automatically be added to the article (no need to click “Add Figure”). Repeat these steps to add additional key figures/tables (various enhancements to this feature will soon be implemented, e.g., multiple file uploading and figure/table extraction directly from PDF).
										<br/><br/>
										NOTE: Please ensure that the corresponding figure and table captions are included in the image files of the key figures/tables (<a href="/app/author/etienne-lebel" target="_blank">example</a>).
										<br/><br/>
										To delete an added figure, click on the image thumbnail of the figure you want to delete.
									</li>
								</ul>

								<li><strong>Transparency links/endorsements</strong>:</li>

								<ul className={classes.grayList}>
									<li><strong>Pre-registration</strong>: </li>
										<ul className={classes.grayList}>
											<li>Enter URL of the public registry where the preregistered protocol can be accessed.</li>
											<li>Select the preregistration type (“Preregistered study design + analysis”, “Preregistered study design”, or “Registered Report”). </li>
										</ul>

									<li><strong>Open materials</strong>: Enter URL of the public location where the materials/stimuli/questionnaires of an article’s study/studies can be accessed. If user/researcher registration at the URL is needed to access the study materials, please check the “Protected access” checkbox.</li>
									<li><strong>Open data</strong>: Enter URL of the public location where the data (raw or processed) of an article’s study/studies can be accessed. If user/researcher registration at the URL is needed to access the data, please check the “Protected access” checkbox.</li>
									<li><strong>Public code</strong>: Enter URL of the public location where the code/syntax files of an article’s study/studies can be accessed.</li>
									<li><strong>Reporting standards compliance</strong>: Select the methodology-appropriate reporting guidelines that your article complies with.</li>
								</ul>

								<li><strong>Article full-text links and corresponding impact/usage metrics</strong>:</li>
								<ul className={classes.grayList}>
									<li><strong>PDF</strong>: Enter URL of a PDF full-text (postprint, peer-reviewed) version of your article.</li>
										<ul className={classes.grayList}>
											<li><strong>Citations</strong>: Enter the total number of citations of your article (according to Google Scholar)</li>
											<li><strong>Downloads</strong>: Enter the number of times the article PDF (full-text postprint) has been downloaded (Note: only select journal publisher websites offer these values, e.g., <a href="https://journals.sagepub.com/doi/metrics/10.1177/1745691616664694" target="_blank">Sage</a>, <a href="https://link.springer.com/article/10.3758%2Fs13423-013-0549-2" target="_blank">Springer</a>)</li>
											<li><strong>Views</strong>: Enter the number of times the article PDF (full-text postprint) has been viewed (Note: only select journal publisher websites offer these values, e.g., <a href="http://science.sciencemag.org/content/349/6251/aac4716/tab-article-info" target="_blank">Science</a>, <a href="https://www.pnas.org/content/112/46/14224/tab-article-info" target="_blank">PNAS</a>)</li>
										</ul>

									<li><strong>HTML/online</strong>: Enter URL of an HTML/online full-text (post-print, peer-reviewed) version of your article</li>
										<ul className={classes.grayList}>
											<li><strong>Views</strong>: Enter the number of times the HTML/online (full-text) version of your article has been viewed (Note: only select journal publisher websites offer these values, e.g., <a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0177841" target="_blank">PLoS ONE</a>, <a href="https://www.frontiersin.org/articles/10.3389/fpsyg.2017.01691/full" target="_blank">Frontiers</a>)</li>
										</ul>
									<li><strong>Preprint</strong>: Enter URL of a preprint (non-copy-edited, non-peer-reviewed) version of your article.</li>
									<ul className={classes.grayList}>
										<li><strong>Downloads</strong>: Enter the number of times your article’s preprint has been downloaded.</li>
										<li><strong>Views</strong>: Enter the number of times your article’s preprint has been viewed (Note: only select preprint servers offer these values, e.g., <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2435572" target="_blank">SSRN</a>, <a href="https://www.preprints.org/manuscript/201902.0048/v1" target="_blank">Preprints.org</a>)</li>
									</ul>
								</ul>

								<li><strong>Author contributions</strong>: Enter each author’s scholarly contribution to the article.</li>
								<li><strong>Competing interests</strong>: Enter any competing interests held by any of the article’s authors. If none, enter “None to declare.”
								<br/><br/>
								A competing interest is defined as anything that interferes with, or could reasonably be perceived as interfering with, the full and objective presentation of research (please see <a href="https://publicationethics.org/competinginterests" target="_blank">COPE guidelines</a> for more details and examples). </li>

							<li><strong>Funding sources</strong>: Enter all sources of funding of the research.</li>
							<li><strong>Peer review information</strong></li>
							<ul className={classes.grayList}>
								<li><strong>Action editor</strong>: Enter the name of the editor, action editor, or guest editor who oversaw/was responsible for the peer-review and publication of the article (following the format “SS Smith”).</li>
								<li><strong>Peer reviewers</strong>: Enter the name(s) of the peer reviewers (if known) and/or the number of anonymous reviewers who reviewed the article (e.g., “Anonymous reviewer 1, Anonymous reviewer 2”)</li>
								<li><strong>Link to open peer-reviews</strong>: Enter the URL where the content of the peer reviews, author revisions, and editorial decision information can be publicly accessed.</li>
							</ul>
							<li><strong>Commentaries</strong>: To add a commentary about your article, click “ADD COMMENTARY”</li>
							<ul className={classes.grayList}>
								<li><strong>Commentary authors/publication year</strong>: Enter the author names and publication year of the commentary article (e.g., “Smith & Smith (2000)”).</li>
								<li><strong>Commentary URL</strong>: Enter a URL to the full-text article of the commentary (if available).</li>
							</ul>
						</li>
					</ul>
						</p>


						<p className={classes.question + ' ' + classes.bottomless}>
							Unlink an article from your author page
						</p>
						<p className={classes.answer}>
							Hover over the card of the article you want to unlink, and click “UNLINK”. This will unlink the article form your author page.
<br/><br/>
Please note that this does not unlink it from any other author pages nor does it delete it from the database (it is not currently possible for non-admin users to delete an article. Please <a href="mailto:curatescience@gmail.com">contact us</a> if you need help.)
						</p>
						<p className={classes.question + ' ' + classes.bottomless}>
							View article card secondary information and key figures
						</p>
						<p className={classes.answer + ' ' + classes.bottomless}>
							An article’s card initially displays only surface-level and/or primary information. Details and secondary information can be accessed in the following ways:

							<ul className={classes.grayList}>
								<li><strong>Transparency badge information</strong>: Hover over badges for links/info regarding open/public content</li>
								<li><strong>Replication details</strong>: Hover over the replication label to view the target effect(s) of the replication attempts (and original study info and URL, if available).</li>
								<li><strong>Commentaries details</strong>: Hover over the commentary label to see links to available commentaries.</li>
								<li><strong>Secondary article/transparency information</strong>: Click the “More button” (“down-chevron”) to expand the card to reveal additional article info and secondary transparency information (e.g., abstract, key words, key figures/tables, author contributions, competing interests, funding sources, and peer-review information).</li>
								<li><strong>Expand key figures</strong>: Click the image thumbnails to view the enlarged/full-screen versions of the key figure/table images.</li>
							</ul>
						</p>
					</div>
				</Typography>
			</div>
		)
	}
}

export default withStyles(styles)(Help);