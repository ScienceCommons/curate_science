import React from 'react';

import {TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = {

}

class DOILookup extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	doi: '',
        	error: false,
        	loading: false,
        	populated: false
        };
        this.handleChange = this.handleChange.bind(this)
        this.lookup = this.lookup.bind(this)

        this.MIN_LEN = 4
    }

	handleChange = event => {
    	let doi = event.target.value
    	if (event.key == 'Enter') {
            this.lookup()
        } else {
		    this.setState({doi: doi, error: false, populated: false, loading: false});
        }
  	}

  	canLookup() {
  		let {doi} = this.state
  		return doi.length > this.MIN_LEN
  	}

  	lookup() {
  		let {doi} = this.state
  		if (doi.length > this.MIN_LEN) {
  			this.setState({loading: true}, () => {
		  		fetch(`https://api.crossref.org/v1/works/http://dx.doi.org/${doi}`).then(res => res.json()).then((res) => {
		  			let success = res.status == 'ok'
		  			this.setState({error: !success, loading: false, populated: success}, () => {
		  				this.props.onLookup(res.message)
		  			})
		    	})
  			})
  		} else {
  			this.setState({error: true})
  		}
  	}

	render() {
		let {error, doi, populated, loading} = this.state
		let ht = error ? "Invalid DOI" : ""
		let icon = populated ? <Icon>check</Icon> : <Icon>search</Icon>
		return (
			<Grid container>
				<Grid item xs={8}>
			        <TextField
			          id="doi"
			          label="DOI"
			          error={error}
			          helperText={ht}
			          value={doi}
			          onChange={this.handleChange}
			          margin="normal"
			          fullWidth
			          variant="outlined"
			        />
			    </Grid>
			    <Grid item xs={4}>
			        <Button variant="contained" onClick={this.lookup} disabled={!this.canLookup()}>
			        	{ loading ? "Looking up..." : "DOI Lookup" }
			        	{icon}
		        	</Button>
		        </Grid>
	        </Grid>
        )
	}
}

DOILookup.defaultProps = {
};

export default withStyles(styles)(DOILookup);