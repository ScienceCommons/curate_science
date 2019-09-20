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
        paddingTop: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(6),
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
        width: theme.spacing(6),
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
        let valid_input = doi_text.length > 0
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
                        inputProps={{'data-lpignore': "true"}}
                        name='doi'
                        classes={{
                          root: classes.inputRoot,
                          input: classes.inputInput,
                        }}
                    />
                    <div className={classes.button} hidden={!canLookup}>
                        <Button disabled={!valid_input} onClick={this.lookup}>{button_text}</Button>
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






export function retrieve_authors(author) {

	Array.prototype.last = function() {
	 return this[this.length - 1];
	};

	String.prototype.last = function() {
	 return this[this.length - 1];
	}





  const authors = author;
  // retrieve list of authors
           const authorsLen = authors.length;
          let authorList = []
          for (var i = 0; i < authorsLen; i++) {
            let authConcat = authors[i]['given'] + " " + authors[i]['family']
            authorList.push(authConcat)
          };
           var fullCitation = ''

//Formatting for author loop
				var beginning = ""
				 	var end = ""
					  function authorFormatting(auth, fullCitation, beginning, end){

					  if (auth.split(" ").length == 1) {
					 	 fullCitation += beginning +
					 		auth.split(" ").last() + end
					  } else if (auth.split(" ").length == 2) {
					 	 fullCitation += beginning +
					 		auth.split(" ")[0][0] +
					 		 " " + auth.split(" ").last() +
					 			end
					  } else if (auth.split(" ").length == 3) {
					 	 fullCitation += beginning +
					 		auth.split(" ")[0][0] +
					 			auth.split(" ")[1][0] +
					 			 " " + auth.split(" ").last() +
					 				end
					  } else if (auth.split(" ").length == 4) {
					 	 fullCitation += beginning + auth.split(" ")[0][0] +
					 		 auth.split(" ")[1][0] +
					 		 auth.split(" ")[2][0] +
					 		 " " +  auth.split(" ").last()  +
					 			end
					  } else if (auth.split(" ").length == 5) {
					 	 fullCitation += beginning +  auth.split(" ")[0][0] +
					 		auth.split()[1][0] +
					 		 auth.split(" ")[2][0] +
					 			auth.split(" ")[3][0] +
					 			" " + auth.split(" ").last() +
					 			 end
					  }

					  return fullCitation

					};

					// Loop to get author names prettied up
           for (var i = 0; i < authorList.length; i++) {
             let aut = authorList[i]


             // Logic for article with more than 7 authors (per APA format)
               // this section applies to the 6th author (adds "..." at the end of 6th author; [a1, a2, a3, a4, a5, a6 ... alast])
             if (authorList.length > 7 && authorList[5] == aut) {
               // logic to properly place initials depending on how many the author has
							fullCitation = authorFormatting(aut, fullCitation, beginning = "", end = ", ... , & ");

							fullCitation = authorFormatting(authorList.last(), fullCitation,  beginning = "", end = "");
							i = authorList.length
								break;

               // logic below applies if
                 // citation has < 7 authors and current author is not final author in loop...
                 // OR if citation has only one author
               // formats the last name and initials for each author
               //
             } else if (authorList.last() != aut || authorList.length == 1) {
							 fullCitation = authorFormatting(aut, fullCitation, beginning = "", end = "");


               // If citation has only one author, add a space intead of a comma
               if (authorList.length == 1) {
                 fullCitation += ' '
               } else {
                 fullCitation += ', '
               }
               // logic below applies to last author in citation (for < 7 authors)
             } else {
							 fullCitation = authorFormatting(aut, fullCitation, beginning = "& ", end = "");

             }
           };
           return fullCitation;

};

export default withStyles(styles)(DOILookup);
