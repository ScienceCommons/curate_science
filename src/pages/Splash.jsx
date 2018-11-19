import React from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from "react-router-dom";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import {Grid, Typography, Button} from '@material-ui/core';


class Splash extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };
    }

	render() {
		return (
			<div>
                <Grid container spacing={40} alignItems="center" alignContent="center" justify="center">
                    <Grid item xs={7} >
                        <Carousel showThumbs={false} width="100%" autoPlay>
                            <div>
                                <img src="/sitestatic/carousel-png1.png" />
                            </div>
                            <div>
                                <img src="/sitestatic/carousel-png2.png" />
                            </div>
                            <div>
                                <img src="/sitestatic/carousel-png3.png" />
                            </div>
                        </Carousel>
                    </Grid>
                    <Grid item xs={6} style={{textAlign: "center"}}>
                        <Typography variant="h3" color="textPrimary">
                            Are you an author?
                        </Typography>
                        <Typography variant="h5" color="textSecondary">
                            Find out how to get our transparency badges displayed on your article.
                        </Typography>
                        <Link to="/about"><Button variant="outlined">Find out more</Button></Link>
                    </Grid>
                    <Grid item xs={6} style={{textAlign: "center"}}>
                        <Typography variant="h3" color="textPrimary">
                            Are you a researcher?
                        </Typography>
                        <Typography variant="h5" color="textSecondary">
                            Search to find replications of previous findings.
                        </Typography>
                        <Link to="/about"><Button variant="outlined">Find out more</Button></Link>
                    </Grid>
                </Grid>

			</div>
		)
	}
}

export default withRouter(Splash);