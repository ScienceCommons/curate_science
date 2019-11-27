import React from 'react';

import { Link } from "react-router-dom";
import {Typography, Grid} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import C from '../constants/constants';

const style = {
	footer: {
		fontSize: 13,
		minHeight: 250,
		marginTop: 30,
		textAlign: 'center',
		backgroundColor: 'whitesmoke',
		paddingTop: 30,
		margin: '0 auto'
	},
	bottomText: {
		fontStyle: 'italic',
		textAalign: 'center',
		paddingTop: 20,
		paddingBottom: 20,
		color: 'grey'
	}
}

class Footer extends React.Component {

	render() {
		let {classes} = this.props
		let year = new Date().getFullYear()
		return (
			<div className={classes.footer + " Footer"}>
                <div className="AppContent">

                    <Grid container spacing={5}>
                        <Grid item sm={4} xs={12}>
                            <b>Current Funders</b>
                            <br/>
                            <a href="https://cordis.europa.eu/project/rcn/215183_en.html"><img src="/sitestatic/legacy/logos/european-commission-icon.png" style={{marginTop: 15, width:128}} /></a>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <b>Previous Funders</b>
                            <br/>
                            <a href="https://cos.io/"><img src="/sitestatic/legacy/logos/COS-logo.png" style={{marginTop: 15}} /></a>
                            <a href="http://www.bitss.org/" style={{marginLeft: 20}} target="_blank"><img src="/sitestatic/legacy/logos/BITSS-logo.png" style={{marginTop: 15}} /></a>
                        </Grid>
                        <Grid item sm={4} xs={12}>
                            <span style={{fontWeight: 'bold', marginBottom: 15}}>Contact Details</span>
                                <p style={{lineHeight: '1.2em', marginTop: 15}}>
                                    KU Leuven<br/>
                                    Quantitative Psychology and Individual Differences Unit<br/>
                                    Tiensestraat 102, Leuven, Belgium 3000 <br/>
                                    email: curatescience@gmail.com<br/>
                                    <a href="https://twitter.com/curatescience"><i className="fab fa-twitter fa-2" aria-hidden="true"></i></a>
                                    <a href="https://github.com/ScienceCommons/curate_science" style={{marginLeft: 5}}><i className="fab fa-github fa-2" aria-hidden="true"></i></a>
                                </p>
                        </Grid>
                    </Grid>

                    <div className={classes.bottomText}>
                        Use of this website implies consent to its use of HTML cookies.
                        <br/>
                        <div style={{marginTop: 10, marginBottom: 10}}>
                            <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
                                <img alt="Creative Commons License" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" title="This work is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License" />
                            </a>
                        </div>
                        <Link to="/privacy" >Terms of Service</Link>
                        &nbsp;&bull;&nbsp;
                        <Link to="/privacy">Privacy Policy</Link>
                    </div>

                </div>
			</div>
		)
	}
}

export default withStyles(style)(Footer);
