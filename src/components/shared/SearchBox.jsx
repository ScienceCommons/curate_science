import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Async from 'react-select/async';

import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import { concat } from 'lodash'
import debounce from 'lodash.debounce';

import AuthorList from '../AuthorList.jsx';


const styles = theme => ({
  root: {
    width: '100%'
  },
  input: {
    display: 'flex',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: '4px 0 0 4px',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  noOptionsMessage: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 10,
    fontSize: 14,
    color: '#DCDCDC',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  searchBox: {
    paddingRight: 0,
  },
  searchButton: {
    backgroundColor: 'white',
    borderRadius: '0 4px 4px 0',
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'white',
    }
  }
});

function NoOptionsMessage(props) {
  let text
  if (!props.selectProps.query) {
    text = 'Start typing to search...'
  } else {
    text = 'No results'
  }

  return (
    <Typography
      variant="body2"
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {text}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  const classes = props.selectProps.classes

  const searchButton = (
    <IconButton type="submit" className={classes.searchButton} onClick={props.selectProps.goToSearchPage}>
      <Icon>search</Icon>
    </IconButton>
  )

  return (
    <TextField
      fullWidth
      variant="outlined"
      InputProps={{
        classes: {adornedEnd: classes.searchBox},
        endAdornment: searchButton,
        inputComponent,
        inputProps: {
          className: classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  const data = props.data

  let content

  if (data.search_result_type === 'SEARCH') {
     content = (
       <p>View all search results for: <em>{data.value}</em></p>
     )
  }
  // Layout for article result
  else if (data.search_result_type === 'ARTICLE') {
    const article = data
    const authors = article.author_list || '--'
    const year = article.in_press ? 'In Press' : article.year

    content = (
      <div style={{whiteSpace: 'normal'}}>
        <p style={{margin: 0, fontSize: 14}}>{article.title}</p>
        <Typography style={{ color: '#009933'}} variant="body2">
          {authors} <b>({year})</b>
        </Typography>
      </div>
    )
  // Layout for author result
  } else if (data.search_result_type === 'AUTHOR') {
    const author = data
    content = (
      <Grid container>
        <Icon style={{fontSize: '2.5rem', marginRight: '0.75rem', color: '#999999'}}>person</Icon>
        <div>
          <p style={{fontWeight: 'bold', letterSpacing: '0.025em', margin: 0}}>
            {author.name}
          </p>
          <p style={{margin: 0}}>
            <em>{author.affiliations}</em>
          </p>
        </div>
      </Grid>
    )
  }

  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
        height: 'auto',
      }}
      {...props.innerProps}
    >
      {content}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography variant="body2" className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps} style={{zIndex: 1000}}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
  DropdownIndicator: null
};

class SearchBox extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      stored_query: ''
    };

    this.goToPage = this.goToPage.bind(this)
    this.goToSearchPage = this.goToSearchPage.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.loadOptions = debounce(this.loadOptions.bind(this), 400)
    this.focusOnSearchBox = this.focusOnSearchBox.bind(this)
  }

  handleChange(value, action) {
    if (action.action === 'select-option') {
      this.goToPage(value)
    }
  }

  handleInputChange(value, action) {
    this.setState({query: value})

    // `stored_query` is used as a workaround so that we have access to the input value when clicking on the
    // search button.
    // The input is cleared on blur (none of the workarounds worked - https://github.com/JedWatson/react-select/issues/805)
    // So instead we store the value whenever the action is an 'input-change' i.e. a user typing and it
    // doesn't get cleared on blur. This means clicking the search button works but also if the user clicks
    // somewhere else and then later clicks the search button they'll be taken to the search page for that last query
    // even though the search box is empty.
    if (action.action === 'input-change') {
      this.setState({stored_query: value})
    }
  }

  goToSearchPage() {
    const clean_query = this.state.stored_query.trim()
    if (!clean_query.length) {
      return
    }
    const query = encodeURIComponent(clean_query)
    this.props.history.push(`/search/?q=${query}`)
  }

  goToPage(data) {
    if (data.search_result_type === 'SEARCH') {
      this.props.history.push(`/search/?q=${data.value}`)
    }
    else if (data.search_result_type === 'ARTICLE') {
      this.props.history.push(`/article/${data.id}`)
    } else if (data.search_result_type === 'AUTHOR') {
      this.props.history.push(`/author/${data.slug}`)
    }
  }

  loadOptions(inputValue, cb) {
    const searchURL = '/api/search'
    this.setState({loading: true}, () => {
      let query = encodeURIComponent(inputValue)
      return fetch(`${searchURL}/?q=${query}`)
        .then((res) => {
          return res.json()
        })
        .then((json) => {
          this.setState({loading: false})
          let res = concat(json.authors, json.articles)
          if (res.length) {
            const searchPageResult = {search_result_type: 'SEARCH', value: inputValue}
            res.unshift(searchPageResult)
          }
          cb(res)
        })
      })
  }

  focusOnSearchBox(event) {
    if (event.key === '/') {
      // Ignore the keypress if the user is inputting text
      const targetTagName = (event.target.nodeType == 1) ? event.target.nodeName.toUpperCase() : ''
      const inTextField = /INPUT|SELECT|TEXTAREA/.test(targetTagName)
      if (inTextField) return

      event.preventDefault()
      this.searchBox.focus()
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.focusOnSearchBox);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.focusOnSearchBox);
  }

  render() {
    const {
      autoFocus,
      classes,
      labelProp,
      multi,
      name,
      placeholder,
      suggestions,
      theme,
      value,
    } = this.props;

    const {loading, query} = this.state

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    const params = {
      classes: classes,
      styles: selectStyles,
      components: components,
      value: value,
      placeholder: placeholder,
      name: name
    }

    return (
      <div className={classes.root}>
        <Async
          ref={ref => { this.searchBox = ref }}
          onChange={this.handleChange}
          onInputChange={this.handleInputChange}
          isLoading={loading}
          loadOptions={this.loadOptions}
          autoFocus={autoFocus}
          query={query}
          goToSearchPage={this.goToSearchPage}
          {...params}
        />
      </div>
    );
  }
}

SearchBox.defaultProps = {
  placeholder: 'Search for articles or authors',
  creatable: false,
  createUrl: null,
  autoFocus: false,
  labelProp: 'text',
  multi: false
}

SearchBox.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  creatable: PropTypes.bool,
  autoFocus: PropTypes.bool,
  labelProp: PropTypes.string,
  name: PropTypes.string,
  multi: PropTypes.bool,
  onChange: PropTypes.func,
  onCreate: PropTypes.func,
  filterFn: PropTypes.func
};

export default withRouter(withStyles(styles, { withTheme: true })(SearchBox));
