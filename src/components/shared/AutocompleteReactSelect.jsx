import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import AsyncCreatableSelect from 'react-select/async-creatable';
import Async from 'react-select/async';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import debounce from 'lodash.debounce';


const styles = theme => ({
  root: {
    marginBottom: 15
  },
  input: {
    display: 'flex',
    padding: 10,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: `${theme.spacing(0.5)}px ${theme.spacing(0.25)}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
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
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing(2),
  },
});

function NoOptionsMessage(props) {
  let text = "Start typing to search..."
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
  return (
    <TextField
      fullWidth
      variant="outlined"
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
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
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
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

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
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
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

class AutocompleteReactSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}

    this.handleChange = this.handleChange.bind(this)
    this.loadOptions = debounce(this.loadOptions.bind(this), 400)
    this.validateNew = this.validateNew.bind(this)
    this.handleCreateOption = this.handleCreateOption.bind(this)
    this.filterOption = this.filterOption.bind(this)
    this.renderOptionLabel = this.renderOptionLabel.bind(this)
    this.renderOptionValue = this.renderOptionValue.bind(this)
    this.newOptionData = this.newOptionData.bind(this)
    this.formatCreateLabel = this.formatCreateLabel.bind(this)
  }

  handleChange = (value, action) => {
    this.props.onChange(value, action)
  }

  loadOptions(inputValue, cb) {
    let {listUrl, filterFn} = this.props
    this.setState({loading: true}, () => {
      let query = encodeURIComponent(inputValue)
      return fetch(`${listUrl}?q=${query}`).then((res) => {
        return res.json()
      }).then((json) => {
        return this.setState({loading: false}, () => {
          let res = json.results
          if (filterFn != null) res = res.filter(filterFn)
          cb(res)
        })
      })
    })
  }

  validateNew(inputValue, selectValue, selectOptions) {
    let valid = inputValue.length >= 3
    return valid
  }

  handleCreateOption(input) {
    this.props.onCreate(input)
  }

  filterOption(op, text) {
    let label = op.data.text
    if (text.length == 0) return false
    else return label != null && label.toLowerCase().indexOf(text.toLowerCase()) > -1
  }

  renderOptionLabel(option) {
    let {labelProp, optionRenderer} = this.props
    if (optionRenderer != null) return optionRenderer(option)
    else return option[labelProp]
  }

  renderOptionValue(option) {
    return option.id
  }

  formatCreateLabel(inputValue) {
    let text = `Create '${inputValue}'`
    return <span>{ text }</span>
  }

  newOptionData(inputValue, optionLabel) {
    let {labelProp} = this.props
    let op = {id: '0'}
    op[labelProp] = inputValue
    op.label = inputValue
    return op
  }

  render() {
    const { classes, theme, suggestions, placeholder, creatable,
      multi, labelProp, name, value, autoFocus } = this.props;
    let {loading} = this.state

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };
    let sel
    let params = {
      classes: classes,
      styles: selectStyles,
      components: components,
      value: value,
      placeholder: placeholder,
      name: name
    }
    if (creatable) {
      sel = (
        <AsyncCreatableSelect
          onChange={this.handleChange}
          onCreateOption={this.handleCreateOption}
          cacheOptions={false}
          isLoading={loading}
          allowCreateWhileLoading
          isValidNewOption={this.validateNew}
          filterOption={this.filterOption}
          getOptionLabel={this.renderOptionLabel}
          getOptionValue={this.renderOptionValue}
          getNewOptionData={this.newOptionData}
          formatCreateLabel={this.formatCreateLabel}
          loadOptions={this.loadOptions}
          isMulti={multi}
          autoFocus={autoFocus}
          {...params} />
        )
    } else {
      sel = (
        <Async
          onChange={this.handleChange}
          isLoading={loading}
          loadOptions={this.loadOptions}
          isMulti={multi}
          autoFocus={autoFocus}
          getOptionLabel={this.renderOptionLabel}
          getOptionValue={this.renderOptionValue}
          {...params} />
      )
    }
    return (
      <div className={classes.root}>
        <NoSsr>
          { sel }
        </NoSsr>
      </div>
    );
  }
}

AutocompleteReactSelect.defaultProps = {
  placeholder: "Start typing...",
  creatable: false,
  listUrl: null,
  createUrl: null,
  autoFocus: false,
  labelProp: 'text',
  multi: false
}

AutocompleteReactSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  creatable: PropTypes.bool,
  autoFocus: PropTypes.bool,
  listUrl: PropTypes.string,
  createUrl: PropTypes.string,
  labelProp: PropTypes.string,
  name: PropTypes.string,
  multi: PropTypes.bool,
  onChange: PropTypes.func,
  onCreate: PropTypes.func,
  filterFn: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(AutocompleteReactSelect);
