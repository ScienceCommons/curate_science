import React from 'react';

import {TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput, InputBase} from '@material-ui/core';

import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    error: {
        color: 'red'
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        paddingLeft: theme.spacing.unit * 6,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: 200,
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.black, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.black, 0.25),
        },
        width: '100%',
    },
    searchIcon: {
        width: theme.spacing.unit * 6,
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
        	error: null,
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
	    this.setState({doi: doi, error: null, populated: false, loading: false});
  	}

    handleSearchKeyPress(e) {
        console.log(e)
        if (e.key == 'Enter') {
            this.lookup()
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
		    	}, (err) => {
                    // Failure of fetch or parse
                    this.setState({error: `Article with DOI '${doi}' not found`, loading: false})
                })
  			})
  		} else {
  			this.setState({error: "DOI too short", loading: false})
  		}
  	}

	render() {
		let {classes} = this.props
		let {error, doi, populated, loading} = this.state
		let ph = loading ? "Looking up..." : "Lookup by DOI"
		return (
            <div>
    			<div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <Icon>search</Icon>
                    </div>
                    <InputBase
                        placeholder={ph}
                        onChange={this.handleChange}
                        error={error!=null}
                        value={doi || ''}
                        onKeyPress={this.handleSearchKeyPress}
                        fullWidth={true}
                        classes={{
                          root: classes.inputRoot,
                          input: classes.inputInput,
                        }}
                    />
                </div>
                <Typography variant="subtitle1" className={classes.error} hidden={error==null}>{ error }</Typography>
            </div>
        )
	}
}

DOILookup.defaultProps = {
};

export default withStyles(styles)(DOILookup);