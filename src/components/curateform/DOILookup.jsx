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
    button: {
        position: 'absolute',
        right: 5,
        top: 6
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
	    this.setState({error: null, populated: false, loading: false}, () => {
            this.props.onChange(doi)
        });
  	}

    handleSearchKeyPress(e) {
        if (e.key == 'Enter') {
            this.lookup()
        }
    }

  	canLookup() {
  		let {value} = this.props
  		return value.length > this.MIN_LEN
  	}

  	lookup() {
  		let {value} = this.props
  		if (value.length > this.MIN_LEN) {
  			this.setState({loading: true}, () => {
		  		fetch(`https://api.crossref.org/v1/works/http://dx.doi.org/${value}`).then(res => res.json()).then((res) => {
		  			let success = res.status == 'ok'
		  			this.setState({error: !success, loading: false, populated: success}, () => {
		  				this.props.onLookup(res.message)
		  			})
		    	}, (err) => {
                    // Failure of fetch or parse
                    this.setState({error: `Article with DOI '${value}' not found`, loading: false})
                })
  			})
  		} else {
  			this.setState({error: "DOI too short", loading: false})
  		}
  	}

	render() {
		let {classes, canLookup, value} = this.props
		let {error, populated, loading} = this.state
		let button_text = loading ? "Looking up..." : "Lookup"
        let icon = 'import_contacts'
        let doi_text = value || ''
		return (
            <div>
    			<div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <Icon>{icon}</Icon>
                    </div>
                    <InputBase
                        placeholder="Article DOI"
                        onChange={this.handleChange}
                        error={error!=null}
                        value={doi_text}
                        onKeyPress={this.handleSearchKeyPress}
                        fullWidth={true}
                        required
                        inputProps={{'data-lpignore': "true"}}
                        name='doi'
                        classes={{
                          root: classes.inputRoot,
                          input: classes.inputInput,
                        }}
                    />
                    <div className={classes.button}>
                        <Button disabled={!canLookup || doi_text.length == 0} onClick={this.lookup}>{button_text}</Button>
                    </div>
                </div>
                <Typography variant="subtitle1" className={classes.error} hidden={error==null}>{ error }</Typography>
            </div>
        )
	}
}

DOILookup.defaultProps = {
    canLookup: true,
    value: ''
};

export default withStyles(styles)(DOILookup);