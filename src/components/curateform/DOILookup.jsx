import React from 'react';
import {TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput, InputBase} from '@material-ui/core';
import { upperFirst } from 'lodash';
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
export function retrieve_authors(authors) {
    // number of authors
    const authorsLen = authors.length;


    function countUpperCase(name) {
        let capitalCount = 0;
        name.split("")
            .forEach(function(letter) {
                if (letter === letter.toUpperCase() && letter !== letter.toLowerCase()) {
                    capitalCount += 1;
                }
            })
        return capitalCount;

    }
    // creating formatted list of authors (first initials + " " + last name)
    function formattedAuthor(authorName) {
        // family name and given name are not available
        if (authorName['family'] === undefined && authorName['given'] ===
            undefined) {
            // return 'name' field if not missing, otherwise throw error
            if (authorName['name'] !== undefined) {
                return upperFirst(authorName['name'])
            } else {
                throw "Error: Cannot extract author information"
            }
            // if family name or given name are available
        } else {
            let authInitials = authorName['given'].split(' ')
                .map(name => upperFirst(name[0]))
                .join("");
            let authorFamilyName = authorName['family'];

            // Reformat if family name is all capital OR if there's no capitals in the family name
            if (countUpperCase(authorFamilyName) === 0 || countUpperCase(
                    authorFamilyName) === authorFamilyName.length) {
                authorFamilyName = upperFirst(authorFamilyName.toLowerCase())
            }
            return `${authInitials} ${authorFamilyName}`
        }
    }

    // creating author string (1 author, 2 authors, >2 authors)
    let authorsExceptLast = authors.slice(0, -1)
        .slice(0, 6) // all authors except last (max 6)
    let lastAuthor = authors.slice(-1)[0] // last author

    let fullAuthString = ""
    // conditional formatting for instances in which there is
    if (authorsLen == 1) {
        fullAuthString = formattedAuthor(lastAuthor)
    } else if (authorsLen == 2) {
        fullAuthString =
            `${formattedAuthor(authorsExceptLast[0])} & ${formattedAuthor(lastAuthor)}`
    } else {
        authorsExceptLast.forEach(function(author) {
            fullAuthString += `${formattedAuthor(author)}, `

        })

        if (authorsLen > 7) {
            fullAuthString += `... , `
        }

        fullAuthString += `& ${formattedAuthor(lastAuthor)}`
    }

    return fullAuthString

};


export function retrieve_title(title, subtitle) {

    function periodColonFormatting(title) {
        // replace '.:' with '.'
        let newTitle = title
            .replace(/\.:/g, '.') // replace ".:" with "."
            .replace(/[:]\ [a-z]/g, upper => upper.toUpperCase()) //replace ": x" with uppercase ": X"

                // if '.' is at end, remove last character of title
                return (newTitle.slice(-1) === "." ? newTitle.slice(0, -1) :
                    newTitle)
            }

        let fullTitle = ''
        if (subtitle === null || subtitle === undefined || subtitle === "" ||
            fullTitle.includes(":")) {
            fullTitle = upperFirst(title.toLowerCase());

        } else {
            fullTitle =
                `${upperFirst(title.toLowerCase())}: ${upperFirst(subtitle.toLowerCase())}`;
        }

        return periodColonFormatting(fullTitle)
    };



    export function retrieve_abstract(abstract) {
        let abstractHtml = document.createElement('html');
        abstractHtml.innerHTML = abstract
        return abstractHtml.textContent.trim() || abstractHtml.innerText.trim()
    };
export default withStyles(styles)(DOILookup);
