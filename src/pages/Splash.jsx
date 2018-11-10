import React from 'react';
import { withRouter } from 'react-router-dom';

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
                <Carousel showThumbs={false} width="70%">
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
                <Grid container alignContent="center" spacing={32}>
                    <Grid item xs={6}>
                        <Typography variant="h3" color="textPrimary">
                            Are you an author?
                        </Typography>
                        <Typography variant="body1">
                            Find out how to get our transparency badges displayed on your article.
                        </Typography>
                        <Button variant="outlined">Find out more</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h3" color="textPrimary">
                            Are you a researcher?
                        </Typography>
                        <Typography variant="body1" color="textPrimary">
                            Search to find replications of previous findings.
                        </Typography>
                        <Button variant="outlined">Find out more</Button>
                    </Grid>
                </Grid>

			</div>
		)
	}
}

export default withRouter(Splash);