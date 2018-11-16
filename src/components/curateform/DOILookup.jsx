import React from 'react';

import {TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput, InputBase} from '@material-ui/core';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.black, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.black, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing.unit * 3,
          width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

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
        this.handleSearchKeyPress = this.handleSearchKeyPress.bind(this)
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


    handleSearchKeyPress(e) {
        if (e.key == 'Enter') {
            this.refreshSearch()
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
		let {classes} = this.props
		let {error, doi, populated, loading} = this.state
		let ht = error ? "Invalid DOI" : ""
		let ph = loading ? "Looking up..." : "Lookup by DOI"
		return (
			<div className={classes.search}>
                <div className={classes.searchIcon}>
                    <Icon>search</Icon>
                </div>
                <InputBase
                    placeholder={ph}
                    onChange={this.handleChange}
                    error={error}
                    helperText={ht}
                    onKeyPress={this.handleSearchKeyPress}
                    value={doi || ''}
                    fullWidth={true}
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                />
            </div>
        )
	}
}

DOILookup.defaultProps = {
};

export default withStyles(styles)(DOILookup);