import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import {
  AppBar,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Icon,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Slide,
  Snackbar,
  TextField,
  Toolbar,
} from '@material-ui/core';
import ChipInput from 'material-ui-chip-input'
import C from '../constants/constants';
import TransparencyIcon from '../components/shared/TransparencyIcon.jsx';
import FigureSelector from './FigureSelector.jsx';
import LabeledBox from '../components/shared/LabeledBox.jsx';
import Loader from '../components/shared/Loader.jsx';
import { withStyles } from '@material-ui/core/styles';
import { clone, debounce, get, includes, set, truncate } from 'lodash'
import {json_api_req, simple_api_req, unspecified, summarize_api_errors} from '../util/util.jsx'

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" {...props} ref={ref}/>;
})

function doi_lookup(doi) {
  return fetch(`https://api.crossref.org/v1/works/http://dx.doi.org/${doi}`)
    .then(res => res.json())
    .then((res) => {
      const success = res.status == 'ok'
      return {
        success,
        data: res.message
      }
    }, (err) => {
      // Failure of fetch or parse
      return {
        success: false,
        data: `Article with DOI ${doi} not found`
      }
    })
}

const styles = theme => ({
  root: {
    paddingTop: 10,
    flexGrow: 1
  },
  appBar: {
    position: 'relative'
  },
  box: {
    padding: theme.spacing(2),
  },
  flex: {
    flex: 1
  },
  content: {
    padding: 8,
    minHeight: 300,
    overflowX: 'hidden',
  },
  dialogRoot: {
    width: C.DIALOG_WIDTH + 'px'
  },
  formControl: {
    minWidth: 200
  },
  checkbox: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 10
  },
  radioButton: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  commentaryRow: {
    marginBottom: theme.spacing(1),
  },
  formRow: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  sectionHeading: {
    marginTop: theme.spacing(3)
  },
  transparencyIcon: {
    paddingTop: 10,
    marginRight: theme.spacing(1)
  },
  primaryBorder: {
    borderColor: '#000'
  },
  secondaryBorder: {
    borderColor: 'rgba(0, 0, 0, 0.23)'
  },
  input: {
    padding: theme.spacing(1),
  },
})

const INPUT_SPECS = {
  'title': {
    label: 'Article title',
    placeholder: "e.g., Does exposure to erotica reduce attraction and love for romantic partners in men?",
    required: true,
    type: 'text',
    fullWidth: true,
    autoFocus: true,
    selectOnFocus: true
  },
  'author_list': {
    label: 'Authors',
    placeholder: "e.g., SS Smith, JJ Jones, & KK Pratt",
    required: true,
    type: 'text',
    fullWidth: true
  },
  'year': {
    label: 'Year',
    placeholder: "2016",
    required: true,
    type: 'number'
  },
  'in_press': {
    label: 'In press',
    type: 'checkbox'
  },
  'under_peer_review': {
    label: 'Under peer review',
    type: 'checkbox'
  },
  'journal': {
    label: 'Journal name',
    placeholder: "e.g., Social Psychology (leave blank for unpublished articles or preprints)",
    type: 'text',
    fullWidth: true
  },
  'abstract': {
    label: 'Abstract',
    placeholder: "e.g., In this article, we propose a unified theory of consciousness...",
    type: 'text',
    fullWidth: true,
    is_secondary: true,
    multiline: true
  },
  'keywords': {
    label: 'Keywords',
    placeholder: "e.g., attractiveness, replication (separate keywords using ',')",
    type: 'text',
    is_secondary: true,
    fullWidth: true
  },
  'article_type': {
    label: 'Article type',
    required: true,
    type: 'select',
    options: C.ARTICLE_TYPES.map((op) => ({value: op.id, label: op.label})),
    fullWidth: true
  },
  'doi': {
    label: 'DOI',
    placeholder: "leave blank for unpublished",
    type: 'text',
    fullWidth: true
  },
  'pdf_url': {
    label: 'PDF URL',
    placeholder: "http://",
    type: 'url',
    adornment: 'link',
    fullWidth: true
  },
  'html_url': {
    label: 'HTML URL',
    placeholder: "http://",
    type: 'url',
    adornment: 'link',
    fullWidth: true
  },
  'preprint_url': {
    label: 'Preprint URL',
    placeholder: "http://",
    type: 'url',
    adornment: 'link',
    fullWidth: true
  },
  'pdf_citations': {
    label: 'Citations',
    type: 'number',
    adornment: 'format_quote',
    fullWidth: true,
    zero_empty_str: true,
    is_secondary: true,
    min: 0
  },
  'pdf_downloads': {
    label: 'Downloads',
    type: 'number',
    adornment: 'cloud_download',
    fullWidth: true,
    zero_empty_str: true,
    is_secondary: true,
    min: 0
  },
  'preprint_downloads': {
    label: 'Downloads',
    type: 'number',
    adornment: 'cloud_download',
    fullWidth: true,
    zero_empty_str: true,
    is_secondary: true,
    min: 0
  },
  'pdf_views': {
    label: 'Views',
    type: 'number',
    adornment: 'remove_red_eye',
    fullWidth: true,
    zero_empty_str: true,
    is_secondary: true,
    min: 0
  },
  'html_views': {
    label: 'Views',
    type: 'number',
    adornment: 'remove_red_eye',
    fullWidth: true,
    zero_empty_str: true,
    is_secondary: true,
    min: 0
  },
  'preprint_views': {
    label: 'Views',
    type: 'number',
    adornment: 'remove_red_eye',
    fullWidth: true,
    zero_empty_str: true,
    is_secondary: true,
    min: 0
  },
  'author_contributions': {
    label: "Author contributions",
    placeholder: "e.g., E. P. LeBel conceived the general idea, drafted and revised the manuscript, created the figures, and executed the analytic...",
    type: 'text',
    fullWidth: true
  },
  'competing_interests': {
    label: "Competing interests",
    placeholder: "e.g., None to declare.",
    type: 'text',
    fullWidth: true
  },
  'funding_sources': {
    label: "Funding sources",
    placeholder: "e.g., European Commission (Marie-Curie grant, Project ID: 793669: EP LeBel, W Vanpaemel)",
    type: 'text',
    fullWidth: true
  },
  'peer_review_editor': {
    label: "Action editor",
    placeholder: "e.g., SS Smith",
    type: 'text',
    fullWidth: true
  },
  'peer_reviewers': {
    label: "Peer reviewers",
    placeholder: "e.g., SS Smith, Anonymous reviewer 2 (separate using ',')",
    type: 'text',
    fullWidth: true
  },
  'peer_review_url': {
    label: "Open peer-review URL",
    placeholder: "http://...",
    type: 'url',
    adornment: 'link',
    fullWidth: true
  },
  'prereg_protocol_url': {
    label: "Prereg. prot. URLs",
    type: 'transparency_url_list',
    url_type: 'PREREGISTRATION',
    adornment: 'link',
    fullWidth: true,
  },
  'prereg_protocol_type': {
    type: 'radio',
    label: '',
    options: C.PREREG_PROTOCOL_TYPES
  },
  'public_study_materials_url': {
    label: "Public study materials URLs",
    type: 'transparency_url_list',
    url_type: 'MATERIALS',
    adornment: 'link',
    fullWidth: true,
  },
  'materials_nontransparency_reason': {
    label: "",
    type: 'select',
    options: C.NONTRANSPARENCY_REASONS,
    fullWidth: true,
  },
  'public_data_url': {
    label: "Public data URLs",
    type: 'transparency_url_list',
    url_type: 'DATA',
    placeholder: 'http://...',
    adornment: 'link',
    fullWidth: true,
  },
  'data_nontransparency_reason': {
    label: "",
    type: 'select',
    options: C.NONTRANSPARENCY_REASONS,
    fullWidth: true,
  },
  'public_code_url': {
    label: "Public code URLs",
    type: 'transparency_url_list',
    url_type: 'CODE',
    placeholder: 'http://...',
    adornment: 'link',
    fullWidth: true,
  },
  'reporting_standards_type': {
    label: "Reporting standards",
    type: 'select',
    fullWidth: true,
    options: C.REPORTING_STANDARDS_TYPES
  },
  // Replication fields
  'number_of_reps': {
    label: "Number of reps",
    type: 'number',
    fullWidth: true,
    is_secondary: true,
    min: 0
  },
  'original_study': {
    label: "Original study",
    type: 'text',
    placeholder: 'e.g., Smith (2000) Study 2',
    is_secondary: true,
    fullWidth: true
  },
  'target_effects': {
    label: "Target effect(s)",
    type: 'text',
    placeholder: 'e.g., playboy effect',
    is_secondary: true,
    fullWidth: true
  },
  'original_article_url': {
    label: "Original article URL",
    type: 'url',
    placeholder: 'http://...',
    adornment: 'link',
    is_secondary: true,
    fullWidth: true
  },
  // Reproducibility fields
  'reproducibility_original_study': {
    label: "Original article/study",
    type: 'text',
    placeholder: 'e.g. Smith et al. (1989)',
    adornment: 'link',
    fullWidth: true
  },
  'reproducibility_original_study_url': {
    label: "Original article URL",
    type: 'url',
    placeholder: 'http://...',
    adornment: 'link',
    fullWidth: true
  },
  // Commentary fields
  'commentary_target': {
    label: "Target article",
    type: 'text',
    placeholder: 'e.g. Smith et al. (1989)',
    adornment: 'link',
    fullWidth: true
  },
  'commentary_target_url': {
    label: "Target article URL",
    type: 'url',
    placeholder: 'http://...',
    adornment: 'link',
    fullWidth: true
  },
  // Disclosure fields
  'excluded_data': {
    label: '1. Excluded data (subjects/observations)',
    type: 'text',
    placeholder: "e.g. '2 observations were excluded due to being outliers'",
    fullWidth: true,
    is_secondary: true,
  },
  'excluded_data_all_details_reported': {
    type: 'checkbox',
  },
  'conditions': {
    label: '2. Experimental conditions',
    type: 'text',
    placeholder: "e.g. '2 conditions not reported due to editorial request' or 'N/A (experimental studies)'",
    fullWidth: true,
    is_secondary: true,
  },
  'conditions_all_details_reported': {
    type: 'checkbox',
  },
  'outcomes': {
    label: '3. Outcome measures (dependent variables)',
    type: 'text',
    placeholder: "e.g. '3 other outcomes were not reported due to not being statistically significant'",
    fullWidth: true,
    is_secondary: true,
  },
  'outcomes_all_details_reported': {
    type: 'checkbox',
  },
  'sample_size': {
    label: '4. Sample size determination (& data collection stopping rule)',
    type: 'text',
    placeholder: "e.g. 'Data collection stopped at end of term (no data peeking)' or 'N/A (pre-existing data)'",
    fullWidth: true,
    is_secondary: true,
  },
  'sample_size_all_details_reported': {
    type: 'checkbox',
  },
  'analyses': {
    label: '5. Other analyses/Analytic plans',
    type: 'text',
    placeholder: "e.g. 'Analytic plans made after seeing data, Other analyses conducted but not reported'",
    fullWidth: true,
    is_secondary: true,
  },
  'analyses_all_details_reported': {
    type: 'checkbox',
  },
  'unreported_studies': {
    label: '6. Other related studies (unreported)',
    type: 'text',
    placeholder: "e.g. '2 additional studies also conducted but not reported due to measurement problems'",
    fullWidth: true,
    is_secondary: true,
  },
  'unreported_studies_all_details_reported': {
    type: 'checkbox',
  },
  'other_disclosures': {
    label: '7. Other disclosures',
    type: 'text',
    placeholder: "e.g. 'Unsuccessful manipulations checks were not reported'",
    fullWidth: true,
    is_secondary: true,
  },
  'other_disclosures_all_details_reported': {
    type: 'checkbox',
  },
  'disclosure_date': {
    type: 'date',
    label: 'Disclosure date',
    placeholder: 'DD/MM/YYYY',
  },
  'videos': {
    type: 'url_list',
    label: 'Video URLs',
    placeholder: 'http://...',
    fullWidth: true,
  },
  'presentations': {
    type: 'url_list',
    label: 'Slides/presentation URLs',
    placeholder: 'http://...',
    fullWidth: true,
  },
  'supplemental_materials': {
    type: 'url_list',
    label: 'Suppl. materials URLs',
    placeholder: 'http://...',
    fullWidth: true,
  },
}


const BASIC_7_FIELDS = [
  'excluded_data',
  'conditions',
  'outcomes',
  'sample_size',
  'analyses',
  'unreported_studies',
  'other_disclosures',
]

function initialFormState() {
  return {
    article_type: 'ORIGINAL',
    key_figures: [],
    commentaries: [],
    media_coverage: [],
    transparency_urls: [],
  }
}

function OutlinedSelect(props) {
  const { border_class, disabled, id, input_class, label_style, onChange, value, specs } = props

  // Create reference and state to track the select label and set the
  // label width dynamically so it fits properly
  const inputLabel = React.useRef(null)
  const [labelWidth, setLabelWidth] = React.useState(0)

  React.useLayoutEffect(() => {
    const width = inputLabel.current ? inputLabel.current.offsetWidth : 0;
    setLabelWidth(width)
  }, [inputLabel.current])

  return (
    <FormControl variant="outlined" style={{ width: specs.fullWidth ? '100%' : 'auto' }} disabled={disabled}>
      <InputLabel htmlFor={id} ref={inputLabel} shrink={true} style={label_style}>{ specs.label }</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        displayEmpty
        input={
          <OutlinedInput labelWidth={labelWidth} name={id} id={id} classes={{notchedOutline: border_class, input: input_class}}/>
        }
      >
        { specs.options.map((op) => <MenuItem value={op.value} key={op.value} disabled={op.disabled}>{op.label}</MenuItem>) }
      </Select>
    </FormControl>
  )
}

function TransparencyURLList(props) {
  const { border_class, id, is_protected, onChange, urls, specs } = props
  const field_urls = urls
    .filter(url => { return url.transparency_type === specs.url_type })
    .map(url => truncate(url.url, { length: 20 }))

  function add_url(url) {
    urls.push({ url: url, transparency_type: specs.url_type, protected_access: is_protected(specs.url_type) })
    return onChange('transparency_urls', urls)
  }

  function delete_url(_url, index) {
    // Find exact transparency URL object to be deleted
    // (filter by url_type and then use the index from the ChipInput)
    const url_to_delete = urls.filter(url => url.transparency_type === specs.url_type)[index]
    onChange('transparency_urls', urls.filter(url => url !== url_to_delete))
  }

  return (
    <ChipInput
      id={id}
      onAdd={add_url}
      onDelete={delete_url}
      value={field_urls}
      variant="outlined"
      label={specs.label}
      InputLabelProps={{shrink: true, style: {color: '#000'}}}
      InputProps={{
        classes: {
          notchedOutline: border_class
        },
        style: {
          paddingTop: 8,
          paddingLeft: 8,
        }
      }}
      placeholder="Insert URL & hit ENTER"
      fullWidth={specs.fullWidth}
      fullWidthInput
    />
  )
}

function URLList(props) {
  const { border_class, id, onChange, specs, value } = props

  let urls = (value || []).map(url => truncate(url.url, { length: 20 }))

  function add_url(url) {
    value.push({ url })
    onChange(id, value)
  }

  function delete_url(_url, index) {
    onChange(id, value.filter((url, i) => i !== index))
  }

  return (
    <ChipInput
      id={id}
      onAdd={add_url}
      onDelete={delete_url}
      value={urls}
      variant="outlined"
      label={specs.label}
      InputLabelProps={{shrink: true, style: {color: '#000'}}}
      InputProps={{
        classes: {
          notchedOutline: border_class
        },
        style: {
          paddingTop: 8,
          paddingLeft: 8,
        }
      }}
      placeholder="Insert URL & hit ENTER"
      fullWidth={specs.fullWidth}
      fullWidthInput
    />
  )
}

class ArticleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: initialFormState(),
      snack_message: null,
      unsaved: false,
      loading: false,
      doi_loading: false,
    }

    this.clean_data = this.clean_data.bind(this)
    this.maybe_confirm_close = this.maybe_confirm_close.bind(this)
    this.handle_close = this.handle_close.bind(this)
    this.save = this.save.bind(this)
    this.handle_change = this.handle_change.bind(this)
    this.handle_check_change = this.handle_check_change.bind(this)
    this.add_commentary = this.add_commentary.bind(this)
    this.add_media_coverage = this.add_media_coverage.bind(this)
    this.delete_commentary = this.delete_commentary.bind(this)
    this.update_figures = this.update_figures.bind(this)
    this.show_snack = this.show_snack.bind(this)
    this.close_snack = this.close_snack.bind(this)
    this.handle_command_s_save = this.handle_command_s_save.bind(this)
    this.lookup_article_by_doi = this.lookup_article_by_doi.bind(this)
    this.update_data = this.update_data.bind(this)
    this.render_urls_protected_checkbox = this.render_urls_protected_checkbox.bind(this)
    this.urls_protected = this.urls_protected.bind(this)
  }

  componentDidMount() {
    // Set up listener for Ctrl/Command-S
    document.addEventListener("keydown", this.handle_command_s_save, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handle_command_s_save, false);
  }

  componentDidUpdate(prevProps, prevState) {
    const article_change = this.props.article_id != prevProps.article_id
    const open = this.props.open
    if (open && article_change) {
      // Fetch article from server to ensure up to date
      // Populate form
      const pk = this.props.article_id
      this.setState({loading: true}, () => {
        fetch(`/api/articles/${pk}`).then(res => res.json()).then((res) => {
          const form = clone(res)
          console.log(form)
          // delete form.key_figures
          if (form.title.startsWith(C.PLACEHOLDER_TITLE_PREFIX)) form.title = ""

          this.setState({form: form, unsaved: false, loading: false})

          // Add a default empty media coverage if none exists
          if (!(form.media_coverage && form.media_coverage.length)) {
            this.add_media_coverage()
          }

          // Add a default empty commentary if none exists
          if (!(form.commentaries && form.commentaries.length)) {
            this.add_commentary()
          }
        })
      })
    }
  }

  handle_command_s_save(e) {
    if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey))      {
      let {open} = this.props
      if (open) {
        this.save()
        e.preventDefault();
      }
    }
  }

  show_snack(message) {
    this.setState({snack_message: message})
  }

  close_snack() {
    this.setState({snack_message: null})
  }

  update_figures(figures) {
    let {form} = this.state
    form.key_figures = figures
    this.setState({form})
  }

  add_commentary() {
    let {form} = this.state
    let {article_id} = this.props
    let new_commentary = {authors_year: '', commentary_url: '', article: article_id}
    form.commentaries.push(new_commentary)
    this.setState({form})
  }

  delete_commentary = (idx) => {
    let {form} = this.state
    form.commentaries.splice(idx, 1)
    this.setState({form})
  }

  add_media_coverage() {
    const { form } = this.state
    const new_media_coverage = {media_source_name: '', url: ''}
    form.media_coverage.push(new_media_coverage)
    this.setState({form})
  }

  delete_media_coverage = (idx) => {
    const { form } = this.state
    form.media_coverage.splice(idx, 1)
    this.setState({form})
  }

  maybe_confirm_close() {
    // Confirm if unsaved changes
    let {unsaved, form} = this.state
    if (unsaved) {
      let message = form.is_live ? "You have unsaved changes, are you sure you want to continue without saving?" :
        "You have not yet saved this article, are you sure you want to continue without saving?"
      if (confirm(message)) {
        this.handle_close()
      }
    } else {
      this.handle_close()
    }
  }

  handle_close() {
    let {form} = this.state
    if (!form.is_live && form.id != null) {
      // Not yet live, delete article
      this.handle_delete()
    } else {
      // Live, just close without saving
      this.setState({form: initialFormState(), unsaved: false}, () => {
        this.props.onClose()
      })
    }
  }

  handle_delete(a) {
    let {cookies} = this.props
    let pk = this.props.article_id
    console.log(`Deleting ${pk}`)
    simple_api_req('DELETE', `/api/articles/${pk}/delete/`, {}, cookies.get('csrftoken'), () => {
      this.setState({form: initialFormState()}, () => {
        this.props.onClose()
      })
    }, (err) => {
      this.show_snack("Error deleting article")
      console.error(err)
    })
  }

  update_data(key, value) {
    const { form } = this.state
    set(form, key, value)
    this.setState({form: form, unsaved: true})
  }

  handle_change = event => {
    event.persist()
    const key = event.target.name
    const val = event.target.value
    this.update_data(key, val)
  }

  handle_check_change = event => {
    let {form} = this.state
    form[event.target.name] = event.target.checked
    this.setState({form: form, unsaved: true})
  }

  lookup_article_by_doi() {
    const { form } = this.state
    const doi = form.doi

    if (!doi) return

    this.setState({ doi_loading: true })

    return doi_lookup(doi)
      .then(res => {
        this.setState({ doi_loading: false })
        if (!res.success) return
        const data = res.data
        form.title = data.title[0]
        form.author_list = data.author.map((author) => author.family).join(', ')
        form.journal = get(data, ['container-title', 0])
        form.year = get(data, ['published-print', 'date-parts', 0, 0])
        this.setState({form})
      })
  }

  validate(data) {
    let valid = true
    let message = ''
    if (unspecified(data.author_list)) {
      valid = false
      message = "Please enter article authors"
    }
    if (unspecified(data.title)) {
      valid = false
      message = "Please enter article title"
    }
    if (unspecified(data.year) && !data.in_press) {
      valid = false
      message = "Please enter publication year"
    }
    return {
      valid: valid,
      message: message
    }
  }

  clean_data(form) {
    // Remove empty media coverage entries
    form.media_coverage = form.media_coverage.filter(coverage => coverage.media_source_name)
    // Remove empty commentaries
    form.commentaries = form.commentaries.filter(commentary => commentary.authors_year)
    return form
  }

  save() {
    let {cookies} = this.props
    let {form} = this.state
    let pk = this.props.article_id
    let data = clone(form)
    let {valid, message} = this.validate(data)

    data = this.clean_data(data)

    let key_figures = []
    if (!valid) this.show_snack(message)
    else {
      data.is_live = true  // Always set to live if saving
      if (data.in_press) data.year = null  // Otherwise server fails on non-integer
      if (data.key_figures) {
        key_figures = data.key_figures
        delete data.key_figures
      }
      // Server errors when trying to save empty string to numeric fields
      Object.keys(INPUT_SPECS).forEach((spec_key) => {
        let spec = INPUT_SPECS[spec_key]
        if (spec.zero_empty_str && data[spec_key] === '') {
          data[spec_key] = 0
        }
      })
      json_api_req('PATCH', `/api/articles/${pk}/update/`, data, cookies.get('csrftoken'), (res) => {
        data = res
        data.key_figures = key_figures // Re-add to update figures in article list
        data.updated = new Date().toISOString()
        // Set update date to now
        this.props.onUpdate(data)
      }, (err) => {
        let message = summarize_api_errors(err)
        this.show_snack(message)
        console.error(err)
      })
    }
  }

  get_relevant_transparency_badges() {
    let {form} = this.state
    let visible = {}
    C.TRANSPARENCY_BADGES.forEach((tb) => {
      visible[tb.id] = tb.article_types.indexOf(form.article_type) > -1
    })
    return visible
  }

  render_checkbox(id, value, specs) {
    let {classes} = this.props
    const checked = Boolean(value)
    return (
      <FormControlLabel
        control={
          <Checkbox key={id} id={id} name={id} checked={checked} onChange={this.handle_check_change} className={classes.checkbox} />
        }
            label={specs.label}
          />
    )
  }

  urls_protected(transparency_type) {
    const transparency_urls = this.state.form.transparency_urls || []
    const urls = transparency_urls.filter(url => url.transparency_type === transparency_type)
    return (urls.length > 0) && urls.every(url => url.protected_access)
  }

  render_urls_protected_checkbox(id, transparency_type) {
    const transparency_urls = this.state.form.transparency_urls || []
    const { classes } = this.props

    const is_protected = this.urls_protected(transparency_type)

    function update_protected_status() {
      transparency_urls.forEach(url => {
        if (url.transparency_type === transparency_type) {
          url.protected_access = !is_protected
        }
      })
      this.update_data('transparency_urls', transparency_urls)
    }

    update_protected_status = update_protected_status.bind(this)

    return (
      <FormControlLabel
        control={
          <Checkbox key={id} id={id} name={id} checked={is_protected} onChange={update_protected_status} className={classes.checkbox} />
        }
        label="Protected access"
      />
    )
  }


  render_radio_group(id, value, specs) {
    let {classes} = this.props
    return (
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">{specs.label}</FormLabel>
        <RadioGroup
          aria-label={id}
          name={id}
          className={classes.group}
          value={value}
          onChange={this.handle_change}
        >
            { specs.options.map((op) => {
              return <FormControlLabel key={op.value} value={op.value} control={<Radio className={classes.radioButton} />} label={op.label} />
            })}

            </RadioGroup>
          </FormControl>
    )
  }

  render_field(id) {
    const { classes } = this.props
    let {form} = this.state
    let specs = INPUT_SPECS[id] || {}

    const border_class = specs.is_secondary ? classes.secondaryBorder : classes.primaryBorder

    let value = form[id] || ''
    if (specs.type == 'checkbox') return this.render_checkbox(id, value, specs)
    else if (specs.type == 'radio') return this.render_radio_group(id, value, specs)
    else if (specs.type == 'select') {
      const label_style = specs.is_secondary ? null : { color: '#000' }
      return <OutlinedSelect id={id} value={value} specs={specs} onChange={this.handle_change} border_class={border_class} label_style={label_style} input_class={classes.input}/>
    }
    else if (specs.type === 'transparency_url_list') {
      return (
        <TransparencyURLList
          id={id}
          urls={form.transparency_urls || []}
          variant="outlined"
          onChange={this.update_data}
          specs={specs}
          border_class={border_class}
          is_protected={this.urls_protected}
        />
      )
    }
    else if (specs.type === 'url_list') {
      return (
        <URLList
          id={id}
          value={value}
          variant="outlined"
          onChange={this.update_data}
          specs={specs}
          border_class={border_class}
        />
      )
    }
    else {
      let disabled = id == 'year' && form.in_press === true

      // Disable the Basic 4/7 text input if "All details reported in article" is checked
      if (includes(BASIC_7_FIELDS, id)) {
        disabled = form[`${id}_all_details_reported`]
      }

      return (
        <StyledCSTextField
          id={id}
          value={value}
          specs={specs}
          disabled={disabled}
          onChange={this.handle_change}
        />
      )
    }
  }

  render_commentaries() {
    let {form} = this.state
    const { classes } = this.props
    let commentary_rows = form.commentaries.map((comm, idx, commentaries) => {
      let id_author = `commentaries.${idx}.authors_year`
      let id_url = `commentaries.${idx}.commentary_url`
      let spec_pubyear = {
        label: "Authors/publication year",
        placeholder: "e.g., Smith & Smith (2019)",
        fullWidth: true
      }
      let spec_url = {
        label: "Commentary URL",
        type: 'url',
        placeholder: 'http://...',
        adornment: 'link',
        fullWidth: true
      }

      const is_last_row = idx === commentaries.length - 1

      return (
        <Grid container spacing={1} key={idx} className={classes.commentaryRow}>
          <Grid item xs={5}>
            <StyledCSTextField id={id_author} value={comm.authors_year} specs={spec_pubyear} onChange={this.handle_change} />
          </Grid>
          <Grid item xs={5}>
            <StyledCSTextField id={id_url} value={comm.commentary_url} specs={spec_url} onChange={this.handle_change} />
          </Grid>
          <Grid item xs={2} style={{alignSelf: 'center'}}>
            <IconButton onClick={this.delete_commentary.bind(this, idx)}><Icon>delete</Icon></IconButton>
            <span hidden={!is_last_row}>
              <IconButton onClick={this.add_commentary}><Icon>add</Icon></IconButton>
            </span>
          </Grid>
        </Grid>
      )
    })
    return (
      <div>
        { commentary_rows }
      </div>
    )
  }

  render_media_coverage() {
    const { form } = this.state
    const { classes } = this.props

    const spec_media_source_name = {
      label: 'Media source name',
      placeholder: 'e.g. NYT',
      fullWidth: true
    }

    const spec_media_url = {
      label: 'Media coverage URL',
      placeholder: 'http://',
      fullWidth: true
    }

    const coverage_rows = form.media_coverage.map((coverage, idx, media_coverage) => {
      const { id, media_source_name, url } = coverage
      const source_id = `media_coverage.${idx}.media_source_name`
      const url_id = `media_coverage.${idx}.url`
      const is_last_row = idx === media_coverage.length - 1
      return (
        <Grid container spacing={1} key={idx} className={classes.commentaryRow}>
          <Grid item xs={5}>
            <StyledCSTextField
              id={source_id}
              value={media_source_name}
              specs={spec_media_source_name}
              onChange={this.handle_change}
            />
          </Grid>
          <Grid item xs={5}>
            <StyledCSTextField
              id={url_id}
              value={url}
              specs={spec_media_url}
              onChange={this.handle_change}
            />
          </Grid>
          <Grid item xs={2} style={{alignSelf: 'center'}}>
            <IconButton onClick={this.delete_media_coverage.bind(this, idx)}>
              <Icon>delete</Icon>
            </IconButton>
            <span hidden={!is_last_row}>
              <IconButton onClick={this.add_media_coverage}><Icon>add</Icon></IconButton>
            </span>
          </Grid>
        </Grid>
      )
    })
    return (
      <div>
        { coverage_rows }
      </div>
    )
  }
  render() {
    let {classes, article_id, open} = this.props
    let { doi_loading, form, snack_message, loading } = this.state
    let content = <Loader />

    const replication = form.article_type === 'REPLICATION'
    const reproducibility = form.article_type === 'REPRODUCIBILITY'
    const commentary = form.article_type === 'COMMENTARY'

    let visible_transparencies = this.get_relevant_transparency_badges()
    let dialog_title = form.is_live ? "Edit Article" : "New Article"
    const is_basic_4_7 = form.reporting_standards_type === 'BASIC_4_7_RETROACTIVE'

    if (!loading && article_id != null) content = (
      <Grid container spacing={3}>
        <Grid item className="ArticleEditorHalf">
          <Grid item xs={12}>
            <Typography variant="h4">BASIC METADATA</Typography>
          </Grid>
          <Grid container spacing={1} className={classes.formRow}>
            <Grid item xs={6}>
                { this.render_field('title') }
            </Grid>
            <Grid item container xs={6} spacing={1}>
              <Grid item xs={3}>
                  { this.render_field('pdf_citations') }
              </Grid>
              <Grid item xs={3}>
                  { this.render_field('pdf_downloads') }
              </Grid>
              <Grid item xs={3}>
                  { this.render_field('pdf_views') }
              </Grid>
              <Grid item xs={3}>
                  { this.render_field('pdf_url') }
              </Grid>
            </Grid>
          </Grid>

          <Grid container alignItems="center" spacing={1} className={classes.formRow}>
            <Grid item xs={3}>
                { this.render_field('author_list') }
            </Grid>
            <Grid item xs={1}>
                { this.render_field('year') }
            </Grid>
            <Grid item xs={2}>
                &nbsp;{ this.render_field('in_press') }
            </Grid>
            <Grid item container xs={6} spacing={1}>
              <Grid item xs={6}>
              </Grid>
              <Grid item xs={3}>
                  { this.render_field('html_views') }
              </Grid>
              <Grid item xs={3}>
                  { this.render_field('html_url') }
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={1} className={classes.formRow}>
            <Grid item xs={4}>
                { this.render_field('journal') }
            </Grid>
            <Grid item xs={2}>
                { this.render_field('under_peer_review') }
            </Grid>
            <Grid item container xs={6} spacing={1}>
              <Grid item xs={3}>
              </Grid>
              <Grid item xs={3}>
                  { this.render_field('preprint_downloads') }
              </Grid>
              <Grid item xs={3}>
                  { this.render_field('preprint_views') }
              </Grid>
              <Grid item xs={3}>
                  { this.render_field('preprint_url') }
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={1} className={classes.formRow}>
            <Grid item xs={4}>
                { this.render_field('doi') }
            </Grid>
            <Grid item xs={2}>
              <Button variant="outlined" onClick={this.lookup_article_by_doi} disabled={doi_loading} style={{ height: '100%' }}>
                  {
                    doi_loading &&
                    <CircularProgress
                      color="inherit"
                      size={24}
                      style={{position: 'absolute', top: '50%', left: '50%', marginTop: -12, marginLeft: -12}}
                    />
                  }
                      DOI Lookup
                  </Button>
                </Grid>
              </Grid>

              <Grid container spacing={1} className={classes.formRow}>
                <Grid item xs={6}>
                    { this.render_field('abstract') }
                </Grid>
                <Grid item xs={6}>
                    { this.render_field('keywords') }
                </Grid>
              </Grid>

              <Grid container spacing={1} className={classes.formRow}>
                <Grid item xs={3}>
                    { this.render_field('article_type') }
                </Grid>
                  {
                    replication ?
                      <Grid item xs={9}>
                        <Grid container spacing={1}>
                          <Grid item xs={3}>
                              { this.render_field('number_of_reps') }
                          </Grid>
                          <Grid item xs={3}>
                              { this.render_field('original_study') }
                          </Grid>
                          <Grid item xs={3}>
                              { this.render_field('target_effects') }
                          </Grid>
                          <Grid item xs={3}>
                              { this.render_field('original_article_url') }
                          </Grid>
                        </Grid>
                        <Typography variant="body2" color="textSecondary">'Close', 'Very close', or 'Exact' replications only. See <a href="/sitestatic/legacy/logos/replication-taxonomy-v4_small.png" target="_blank">replication taxonomy</a> for details.</Typography>
                      </Grid>
                      : null
                  }
                  {
                    reproducibility ?
                      <Grid item xs={9}>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                              { this.render_field('reproducibility_original_study') }
                          </Grid>
                          <Grid item xs={6}>
                              { this.render_field('reproducibility_original_study_url') }
                          </Grid>
                        </Grid>
                      </Grid>
                      : null
                  }
                  {
                    commentary ?
                      <Grid item xs={9}>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                              { this.render_field('commentary_target') }
                          </Grid>
                          <Grid item xs={6}>
                              { this.render_field('commentary_target_url') }
                          </Grid>
                        </Grid>
                      </Grid>
                      : null
                  }
              </Grid>

              <Grid container alignItems="center" spacing={1} className={classNames(classes.formRow, classes.sectionHeading)}>
                <Grid item xs={9}>
                  <Typography variant="h4">PRIMARY TRANSPARENCY</Typography>
                </Grid>
              </Grid>

              <Grid container spacing={1} className={classes.formRow}>
                <Grid item xs={6} style={{display: 'flex'}}>
                  <div className={classes.transparencyIcon}>
                    <TransparencyIcon tt={{icon: 'preregplus'}}/>
                  </div>
                  { this.render_field('prereg_protocol_url') }
                </Grid>
                <Grid item xs={6}>
                  { this.render_field('prereg_protocol_type') }
                </Grid>
              </Grid>

              {
                visible_transparencies.MATERIALS ? 
                (
                  <Grid container alignItems="center" spacing={1} className={classes.formRow}>
                    <Grid item xs={6} style={{display: 'flex'}}>
                      <div className={classes.transparencyIcon}>
                        <TransparencyIcon tt={{icon: 'materials'}}/>
                      </div>
                      { this.render_field('public_study_materials_url') }
                    </Grid>
                    <Grid item xs={3}>
                      { this.render_urls_protected_checkbox('public_study_materials_protected', 'MATERIALS') }
                    </Grid>
                    <Grid item xs={3}>
                      { this.render_field('materials_nontransparency_reason') }
                    </Grid>
                  </Grid>
                ) : null
              }

              {
                visible_transparencies.DATA ?
                (
                <Grid container alignItems="center" spacing={1} className={classes.formRow}>
                  <Grid item xs={6} style={{display: 'flex'}}>
                    <div className={classes.transparencyIcon}>
                      <TransparencyIcon tt={{icon: 'data'}}/>
                    </div>
                    { this.render_field('public_data_url') }
                  </Grid>
                  <Grid item xs={3}>
                    { this.render_urls_protected_checkbox('public_data_urls_protected', 'DATA') }
                  </Grid>
                  <Grid item xs={3}>
                    { this.render_field( 'data_nontransparency_reason') }
                  </Grid>
                </Grid>
                ) : null
              }

              {
                visible_transparencies.CODE ?
                (
                <Grid container alignItems="center" spacing={1} className={classes.formRow}>
                  <Grid item xs={6} style={{display: 'flex'}}>
                    <div className={classes.transparencyIcon}>
                      <TransparencyIcon tt={{icon: 'code'}}/>
                    </div>
                    { this.render_field('public_code_url') }
                  </Grid>
                </Grid>
                ): null
              }

              {
                visible_transparencies.REPSTD ?
                (
                <div>
                <Grid container spacing={1}>
                  <Grid item xs={6}></Grid>
                  <Grid item container xs={6}>
                    <Grid item xs={9}></Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle2" style={{textAlign: 'center'}}>
                        All details reported in article <sup>&dagger;</sup> (for all studies)
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container alignItems="flex-start" spacing={1} className={classes.formRow}>
                  <Grid item xs={6}>
                    <div style={{display: 'flex'}}>
                      <div className={classes.transparencyIcon} style={{display: 'flex', padding: 0}}>
                        <TransparencyIcon tt={{icon: 'repstd'}} />
                      </div>
                      { this.render_field('reporting_standards_type') }
                    </div>
                    <div
                      hidden={!is_basic_4_7}
                      style={{ paddingLeft: 40, paddingRight: 30, paddingTop: 10 }}
                    >
                      <Typography variant="body1">
                        Confirm the following methodological details were reported in your article
                        <sup>&dagger;</sup> by using the checkboxes on the right or enter the details
                        in the appropriate text boxes.
                      </Typography>
                      <Typography variant="body2" style={{ marginTop: 10 }}>
                        Completing first 4 earns you "Basic 4 (retroactive)" compliance
                        (<a href="https://psychdisclosure.org/">details</a>).
Completing all 7 earns you "Basic 7 (retroactive)" compliance
                        (<a href="https://medium.com/@IGDORE/retroactive-disclosure-statements-make-the-past-more-useful-c1b2e73f4bae">details</a>).
                      </Typography>
                      <Typography variant="body2" style={{ marginTop: 10 }}>
                        &dagger; or reported in (public/non-paywalled) preregistration protocol or supplementary
                        materials linked herein (URLs to these linked materials must be provided in the relevant fields).
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={6}>
                    {
                      (is_basic_4_7) ?
                      (
                        BASIC_7_FIELDS.map(field =>
                          <Grid container style={{marginBottom: '0.5rem'}} key={field}>
                            <Grid item xs={9}>
                                { this.render_field(field) }
                            </Grid>
                            <Grid item xs={3} style={{alignSelf: 'center', paddingLeft: '0.5rem', textAlign: 'center'}}>
                                { this.render_field(`${field}_all_details_reported`) }
                            </Grid>
                          </Grid>
                          )
                        ) : null
                    }
                    <Grid item xs={12} hidden={!is_basic_4_7}>
                      { this.render_field('disclosure_date') }
                    </Grid>
                  </Grid>
                </Grid>
              </div>
              ) :  null
              }
    </Grid>


    <Grid item className="ArticleEditorHalf">
      <Grid item xs={12}>
        <Typography variant="h4">SECONDARY TRANSPARENCY</Typography>
      </Grid>
      <Grid container alignItems="center" spacing={1} className={classes.formRow}>
        <Grid item xs={4}>
            { this.render_field('author_contributions') }
        </Grid>
        <Grid item xs={4}>
            { this.render_field('competing_interests') }
        </Grid>
        <Grid item xs={4}>
            { this.render_field('funding_sources') }
        </Grid>
      </Grid>

      <Typography variant="overline">Peer-review information</Typography>
      <Grid container spacing={1}>
        <Grid item xs={4}>
            { this.render_field('peer_review_editor') }
        </Grid>
        <Grid item xs={4}>
            { this.render_field('peer_reviewers') }
        </Grid>
        <Grid item xs={4}>
            { this.render_field('peer_review_url') }
        </Grid>
      </Grid>

      <div>
        <Typography variant="overline">Commentaries</Typography>
        { this.render_commentaries() }
      </div>

      <Grid container className={classNames(classes.formRow, classes.sectionHeading)}>
        <Grid item xs={12}>
          <Typography variant="h4">MEDIA &amp; ASSOCIATED CONTENT</Typography>
        </Grid>
        <Typography variant="overline">Key Figures</Typography>
        <Grid container>
          <Grid item xs={12}>
            <FigureSelector article_id={article_id}
              onChange={this.update_figures}
              figures={form.key_figures} />
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={1} className={classes.formRow}>
        <Grid item xs={4}>
          { this.render_field('videos') }
        </Grid>
        <Grid item xs={4}>
          { this.render_field('presentations') }
        </Grid>
        <Grid item xs={4}>
          { this.render_field('supplemental_materials') }
        </Grid>
      </Grid>

      <Grid container spacing={1} className={classes.formRow}>
        <Grid item xs={12}>
          <Typography variant="overline" display="block">
            Media Coverage
          </Typography>
        </Grid>
        <Grid item xs={12}>
          { this.render_media_coverage() }
        </Grid>
      </Grid>

      <Typography variant="body2" style={{marginTop: '1rem'}}>* indicates required field</Typography>
    </Grid>

  </Grid>
    )
    return (
  <div>
    <Dialog
      open={open}
      fullScreen
      onClose={this.maybe_confirm_close}
      TransitionComponent={Transition}
      classes={{paperWidthLg: classes.dialogRoot}}
      aria-labelledby="edit-article"
    >
      <AppBar className={classes.appBar} position='fixed'>
        <Toolbar>
          <IconButton color="inherit" onClick={this.maybe_confirm_close} aria-label="Close">
            <Icon>close</Icon>
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.flex}>
              { dialog_title }
          </Typography>
          <Button color="inherit" onClick={this.save} disabled={loading}>
              save
          </Button>
        </Toolbar>
      </AppBar>

      <DialogContent className={classes.content}>
        { content }
      </DialogContent>
    </Dialog>
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={snack_message != null}
      autoHideDuration={3000}
      onClose={this.close_snack}
      message={snack_message}
    />
    </div>
      )
      }
      }

ArticleEditor.defaultProps = {
    article_id: null
}

class CSTextField extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handle_change = this.handle_change.bind(this)
    this.debounced_change = debounce(this.props.onChange, 300)

    // We store an internal representation of the input value
    // so it's updated immediately and the global update is debounced
    this.state = {
      input_value: props.value,
      original_prop_value: props.value
    }
  }

  static getDerivedStateFromProps(props, state) {
    // Update the internal `input_value` only if the value passed in the prop
    // has changed from the original one
    if (props.value !== state.original_prop_value) {
      return {
        input_value: props.value,
        original_prop_value: props.value
      };
    }
    return null;
  }

  handle_change(e) {
    e.persist()
    // Update the local state for the input
    this.setState({ input_value: e.target.value })
    // Trigger a debounced update of the parent form state
    // to avoid lots of rerendering as user is typing
    this.debounced_change(e)
  }

  render() {
    let {id, value, specs, classes, disabled} = this.props
    const { input_value } = this.state
    const label = specs.label
    const border_class = specs.is_secondary ? classes.secondaryBorder : classes.primaryBorder
    const label_style = specs.is_secondary ? null : { color: '#000' }

    let attrs = {}
    if (specs.selectOnFocus) attrs.onFocus = (event) => {
      event.target.select()
    }
    if (specs.min != null) attrs.min = specs.min
    return <TextField
      id={id}
      key={id}
      name={id}
      label={label}
      onChange={this.handle_change}
      value={input_value}
      type={specs.type}
      placeholder={specs.placeholder}
      autoComplete="off"
      disabled={disabled}
      required={specs.required}
      element={specs.multiline ? 'textarea' : 'input'}
      autoFocus={specs.autoFocus}
      {...attrs}
      variant="outlined"
      fullWidth={specs.fullWidth}
      InputLabelProps={{
        shrink: true,
        style: label_style
      }}
      InputProps={{
        classes: {
          notchedOutline: border_class,
          input: classes.input
        }
      }}
    />
  }}

CSTextField.defaultProps = {
    id: '',
    value: '',
    specs: {},
}

const StyledCSTextField = withStyles(styles)(CSTextField)

export default withRouter(withCookies(withStyles(styles)(ArticleEditor)));
