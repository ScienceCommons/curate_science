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
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: 200,
        },
    }
})

class ArticleSelector extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	search_term: '',
        	loading: false
        };
        this.handleSearchBoxChange = this.handleSearchBoxChange.bind(this)
        this.handleSearchKeyPress = this.handleSearchKeyPress.bind(this)
    }

    handleSearchBoxChange(e) {
        this.setState({search_term: e.target.value})
    }

    handleSearchKeyPress(e) {
        if (e.key == 'Enter') {
            this.search()
        }
    }

  	search() {
  		// let {doi} = this.state
  		// if (doi.length > this.MIN_LEN) {
  		// 	this.setState({loading: true}, () => {
		  // 		fetch(`https://api.crossref.org/v1/works/http://dx.doi.org/${doi}`).then(res => res.json()).then((res) => {
		  // 			let success = res.status == 'ok'
		  // 			this.setState({error: !success, loading: false, populated: success}, () => {
		  // 				this.props.onLookup(res.message)
		  // 			})
		  //   	})
  		// 	})
  		// } else {
  		// 	this.setState({error: true})
  		// }
  	}

	render() {
		let {classes} = this.props
		let {search_term} = this.state
		return (
			<div className={classes.search}>
                <div className={classes.searchIcon}>
                    <Icon>search</Icon>
                </div>
                <InputBase
                    placeholder="Search for articles… (by DOI, title, etc.)"
                    onChange={this.handleSearchBoxChange}
                    onKeyPress={this.handleSearchKeyPress}
                    value={search_term || ''}
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

ArticleSelector.defaultProps = {
};

export default withStyles(styles)(ArticleSelector);