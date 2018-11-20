import React from 'react';

import {Typography} from '@material-ui/core';

class About extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };
    }

	render() {
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
							<h5 className="about-section">Method/Data Transparency</h5>
							<img src='logos/method-data-transparency-diagram.png' width="275px" />
						</div>
						<div className="col-md-4 center" >
							<h5 className="about-section">Effect Replicability Transparency</h5>
							<img src='logos/sprite-icons/replicability-logo.png' />
							<img src='logos/sprite-icons/reproducible-code.png' className='shrunk-28'/>
							<br/>
							<span className="transp-text-description">Transparent new sample replications of published effects.</span>
							<div className="popUpOnHover" >
								<img src="logos/replicability-diagram-about-section.png"  className="responsive" />
								<span className='toDisplayRepDiagram popUpStyle'>
									<img src="logos/replicability-diagram-about-section.png" width="700px;" />
								</span>
							</div>
						</div>
						<div className="col-md-4 center" >
							<h5 className="about-section">Analytic Reproducibility Transparency</h5>
							<img src='logos/sprite-icons/scatterplot.png' className='shrunk-28'/>
							<img src='logos/sprite-icons/reproducible-code.png' className='shrunk-28'/>
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

					<h4 className="about-section"><a className="offset" id="people">People</a></h4>

					<div className="row" >
						<div >Current Contributors</div>
						<div >Current contributors are helping with conceptual developments of Curate Science, writing/editing of related manuscripts, and/or with curation.</div>

						<div className="col-sm-3 center" >
							<a href="http://etiennelebel.com" target="_blank"><img className="team" src="logos/lebel_o.jpg" /></a><br/>
							<font size="3px"><strong>Etienne P. LeBel</strong></font><br/>
							<i>KU Leuven</i><br/>
							Founder & Lead
						</div>
						<div className="col-sm-3 center" >
							<a href="https://ppw.kuleuven.be/okp/people/wolf_vanpaemel/" target="_blank"><img className="team" src="logos/vanpaemel_o.jpg" /></a><br/>
							<font size="3px"><strong>Wolf Vanpaemel</strong></font><br/>
							<i>KU Leuven</i>
						</div>
						<div className="col-sm-3 center" >
							<img className="team" src="logos/touko_o.jpg" /><br/>
							<font size="3px"><strong>Touko Kuusi</strong></font><br/>
							<i>University of Helsinki</i>
						</div>
						<div className="col-sm-3 center" >
							<a href="https://osf.io/xjhab/" target="_blank"><img className="team" src="logos/mccarthy_o.jpg" /></a><br/>
							<font size="3px"><strong>Randy McCarthy</strong></font><br/>
							<i>Northern Illinois University</i>
						</div>
					</div>
					<div className="row" >
						<div className="col-sm-3 center" >
							<a href="https://oxford.academia.edu/BrianDEarp" target="_blank"><img className="team" src="logos/earp_o.jpg" /></a><br/>
							<font size="3px"><strong>Brian Earp</strong></font><br/>
							<i>University of Oxford</i>
						</div>
						<div className="col-sm-3 center" >
							<a href="http://malte-elson.com/" target="_blank"><img className="team" src="logos/elson_o.jpg" /></a><br/>
							<font size="3px"><strong>Malte Elson</strong></font><br/>
							<i>Ruhr University Bochum</i>
						</div>

					</div>

					<div className="row" >
						<div >Current Advisory Board (as of June 2017)</div>
						<div >Advisory board members periodically provide feedback on grant proposal applications and related manuscripts and general advice regarding Curate Science's current focus areas and future directions.</div>

						<div className="col-sm-3 center" >
							<a href="https://www.coll.mpg.de/team/page/susann_fiedler" target="_blank"><img className="team" src="logos/fiedler_o.jpg" /></a><br/>
							<font size="3px"><strong>Susann Fiedler</strong></font><br/>
							<i>Max Planck Institute - Bonn</i>
						</div>
						<div className="col-sm-3 center" >
							<a href="https://www.universiteitleiden.nl/en/staffmembers/anna-van-t-veer#tab-1" target="_blank"><img className="team" src="logos/vantveer_o.jpg" /></a><br/>
							<font size="3px"><strong>Anna van't Veer</strong></font><br/>
							<i>Leiden University</i>
						</div>
						<div className="col-sm-3 center" >
							<a href="https://www.imprs-life.mpg.de/en/people/julia-m-rohrer" target="_blank"><img className="team" src="logos/rohrer_o.jpg" /></a><br/>
							<font size="3px"><strong>Julia Rohrer</strong></font><br/>
							<i>Max Planck Institute - Berlin</i>
						</div>
						<div className="col-sm-3 center" >
							<a href="https://mbnuijten.com/" target="_blank"><img className="team" src="logos/nuijten_o.jpg" /></a><br/>
							<font size="3px"><strong>Michèle Nuijten</strong></font><br/>
							<i>Tilburg University</i>
						</div>
					</div>
					<div className="row" >
						<div className="col-sm-3 center" >
							<a href="https://www.psy.ox.ac.uk/team/dorothy-bishop" target="_blank"><img className="team" src="logos/bishop_o.jpg" /></a><br/>
							<font size="3px"><strong>Dorothy Bishop</strong></font><br/>
							<i>University of Oxford</i>
						</div>
						<div className="col-sm-3 center" >
							<a href="http://www.psychology.illinois.edu/people/bwrobrts" target="_blank"><img className="team" src="logos/roberts_o.jpg" /></a><br/>
							<font size="3px"><strong>Brent Roberts</strong></font><br/>
							<i>University of Illinois - Urbana-Champaign</i>
						</div>
						<div className="col-sm-3 center" >
							<a href="http://www.psychology.ucsd.edu/people/profiles/hpashler.html" target="_blank"><img className="team" src="logos/pashler_o.jpg" /></a><br/>
							<font size="3px"><strong>Hal Pashler</strong></font><br/>
							<i>University of California - San Diego</i>
						</div>
						<div className="col-sm-3 center" >
							<a href="http://www.dansimons.com/" target="_blank"><img className="team" src="logos/simons_o.jpg" /></a><br/>
							<font size="3px"><strong>Daniel Simons</strong></font><br/>
							<i>University of Illinois - Urbana-Champaign</i>
						</div>
					</div>
					<div className="row" >
						<div className="col-sm-3 center" >
							<a href="http://www.psych.usyd.edu.au/staff/alexh/lab/" target="_blank"><img className="team" src="logos/holcombe_o.jpg" /></a><br/>
							<font size="3px"><strong>Alex Holcombe</strong></font><br/>
							<i>University of Sydney</i>
						</div>
						<div className="col-sm-3 center" >
							<a href="http://www.ejwagenmakers.com/" target="_blank"><img className="team" src="logos/wagenmakers_o.jpg" /></a><br/>
							<font size="3px"><strong>E-J Wagenmakers</strong></font><br/>
							<i>University of Amsterdam</i>
						</div>
						<div className="col-sm-3 center" >
							<a href="https://scienceofpsych.wordpress.com/katie/" target="_blank"><img className="team" src="logos/corker_o.jpg" /></a><br/>
							<font size="3px"><strong>Katie Corker</strong></font><br/>
							<i>Grand Valley State University</i>
						</div>
						<div className="col-sm-3 center" >
							<a href="http://www.simine.com/" target="_blank"><img className="team" src="logos/vazire_o.jpg" /></a><br/>
							<font size="3px"><strong>Simine Vazire</strong></font><br/>
							<i>University of California – Davis</i>
						</div>
					</div>
					<div className="row" >
						<div className="col-sm-3 center" >
							<a href="https://www.msu.edu/~lucasri/" target="_blank"><img className="team" src="logos/lucas_o.jpg" /></a><br/>
							<font size="3px"><strong>Richard Lucas</strong></font><br/>
							<i>Michigan State University</i>
						</div>
						<div className="col-sm-3 center" >
							<a href="https://www.unimib.it/marco-perugini" target="_blank"><img className="team" src="logos/perugini_o.jpg" /></a><br/>
							<font size="3px"><strong>Marco Perugini</strong></font><br/>
							<i>University of Milan-Bicocca</i>
						</div>
						<div className="col-sm-3 center" >
							<a href="http://publish.uwo.ca/~lcampb23/index.html" target="_blank"><img className="team" src="logos/campbell_o.jpg" /></a><br/>
							<font size="3px"><strong>Lorne Campbell</strong></font><br/>
							<i>University of Western Ontario</i>
						</div>
						<div className="col-sm-3 center" >
							<a href="http://psych.ubc.ca/persons/eric-eich/" target="_blank"><img className="team" src="logos/eich_o.jpg" /></a><br/>
							<font size="3px"><strong>Eric Eich</strong></font><br/>
							<i>University of British Columbia</i>
						</div>
					</div>
					<div className="row" >
						<div className="col-sm-3 center" >
							<a href="https://tbslaboratory.com/" target="_blank"><img className="team" src="logos/brandt_o.jpg" /></a><br/>
							<font size="3px"><strong>Mark Brandt</strong></font><br/>
							<i>Tilburg University</i>
						</div>
					</div>
					<div className="row" >
						<div >Technical Advisors</div>

						<div className="col-sm-3 center" >
							<a href="https://github.com/alexkyllo" target="_blank"><img className="team" src="logos/kyllo_o.jpg" /></a><br/>
							<font size="3px"><strong>Alex Kyllo</strong></font><br/>
						</div>
						<div className="col-sm-3 center" >
							<a href="https://psychology.msu.edu/people/graduate-student/morri640" target="_blank"><img className="team" src="logos/morrison_o.jpg" /></a><br/>
							<font size="3px"><strong>Mike Morrison</strong></font><br/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default About;