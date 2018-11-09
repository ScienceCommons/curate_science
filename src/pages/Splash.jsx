import React from 'react';
import { withRouter } from 'react-router-dom';

import { Link } from "react-router-dom";

import Typography from '@material-ui/core/Typography';


class Splash extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };
    }


    componentDidMount() {
    }

	render() {
		return (
			<div>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography variant="h3" color="textPrimary">
                            Are you an author?
                        </Typography>
                        <Typography variant="h3" color="textPrimary">
                            Find out how to get our transparency badges displayed on your article.
                        </Typography>
                        <Button variant="outlined">Find out more</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h3" color="textPrimary">
                            Are you a researcher?
                        </Typography>
                        <Typography variant="h3" color="textPrimary">
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