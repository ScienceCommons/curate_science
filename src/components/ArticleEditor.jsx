import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import { Link } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import {List, Grid, Button, Icon, TextField,
        Dialog, DialogTitle, FormControlLabel, Checkbox,
        DialogContent, DialogContentText, DialogActions,
        Toolbar, IconButton, AppBar, MenuItem,
        Slide, InputAdornment, InputLabel, Select,
        FormControl, Radio, RadioGroup,
        FormLabel} from '@material-ui/core';
import C from '../constants/constants';
import TransparencyIcon from '../components/shared/TransparencyIcon.jsx';
import FigureSelector from './curateform/FigureSelector.jsx';
import { withStyles } from '@material-ui/core/styles';
import {json_api_req} from '../util/util.jsx'

function Transition(props) {
  return <Slide direction="up" {...props} />;
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
        padding: theme.spacing.unit * 2,
    },
    flex: {
        flex: 1
    },
    content: {
        padding: 8
    },
    formControl: {
        minWidth: 200
    }
    // cssInput: {
    //     padding: '2px'
    // },
    // cssLabel: {
    //     padding: '2px'
    // }
})

const INPUT_SPECS = {
    'authors': {
        label: 'Authors',
        placeholder: "e.g. RJ Balzarini, L Campbell, & K Dobson",
        required: true,
        type: 'text',
        fullWidth: true
    },
    'title': {
        label: 'Article title',
        placeholder: "e.g., Does exposure to erotica reduce attraction and love for romantic partners in men?",
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
        multiline: true
    },
    'keywords': {
        label: 'Keywords',
        placeholder: "e.g., attractiveness, replication (separate keywords using ',')",
        type: 'text',
        fullWidth: true
    },
    'article_type': {
        label: 'Article type',
        required: true,
        type: 'select',
        options: C.ARTICLE_TYPES,
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
        adornment: 'link'
    },
    'html_url': {
        label: 'HTML URL',
        placeholder: "http://",
        type: 'url',
        adornment: 'link'
    },
    'preprint_url': {
        label: 'Preprint URL',
        placeholder: "http://",
        type: 'url',
        adornment: 'link'

    },
    'pdf_citations': {
        label: 'Citations',
        type: 'number',
        adornment: 'format_quote'
    },
    'pdf_downloads': {
        label: 'Downloads',
        type: 'number',
        adornment: 'cloud_download'
    },
    'preprint_downloads': {
        label: 'Downloads',
        type: 'number',
        adornment: 'cloud_download'
    },
    'pdf_views': {
        label: 'Views',
        type: 'number',
        adornment: 'remove_red_eye'
    },
    'html_views': {
        label: 'Views',
        type: 'number',
        adornment: 'remove_red_eye'
    },
    'preprint_views': {
        label: 'Views',
        type: 'number',
        adornment: 'remove_red_eye'
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
        placeholder: "DJ Simons",
        type: 'text',
        fullWidth: true
    },
    'peer_reviewers': {
        label: "Peer reviewers",
        placeholder: "MB Nuijten, Anonymous reviewer 3 (separate using ';')",
        type: 'text',
        fullWidth: true
    },
    'peer_review_url': {
        label: "Open peer-review URL",
        placeholder: "https://osf.io/dsn72/",
        type: 'url',
        adornment: 'link',
        fullWidth: true
    },
    'prereg_protocol_url': {
        label: "Prereg. protocol URL",
        type: 'url',
        placeholder: 'http://...',
        adornment: 'link'
    },
    'prereg_protocol_type': {
        type: 'radio',
        label: 'Protocol Type',
        options: C.PREREG_PROTOCOL_TYPES
    },
    'public_study_materials_url': {
        label: "Public study materials URL",
        type: 'url',
        placeholder: 'http://...',
        adornment: 'link'
    },
    'public_data_url': {
        label: "Public data URL",
        type: 'url',
        placeholder: 'http://...',
        adornment: 'link'
    },
    'public_code_url': {
        label: "Public code URL",
        type: 'url',
        placeholder: 'http://...',
        adornment: 'link'

    },
    'reporting_standards_type': {
        label: "Reporting standards",
        type: 'select',
        options: C.REPORTING_STANDARDS_TYPES
    }
}

function initialFormState() {
    return {
        article_type: 'ORIGINAL',
    }
}

class ArticleEditor extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            form: initialFormState(),
            commentaries: []
        }

        this.handle_close = this.handle_close.bind(this)
        this.save = this.save.bind(this)
        this.handle_change = this.handle_change.bind(this)
        this.handle_check_change = this.handle_check_change.bind(this)
        this.add_commentary = this.add_commentary.bind(this)
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        let article_change = nextProps.article_id != this.props.article_id
        let open = nextProps.open
        // TODO
        // if (open && article_change) {
        //     // Fetch article from server to ensure up to date
        //     // Populate form
        //     let pk = nextProps.article_id
        //     fetch(`api/articles/${pk}`).then(res => res.json()).then((res) => {
        //     })
        // }
    }

    componentWillUnmount() {
    }

    add_commentary() {
        let {commentaries} = this.state
        this.setState({commentaries: commentaries.concat({authors: '', url: ''})})
    }

    handle_close() {
        this.props.onClose()
    }

    handle_change = event => {
        let {form} = this.state
        form[event.target.name] = event.target.value
        this.setState({form})
    }

    handle_check_change = event => {
        let {form} = this.state
        form[event.target.name] = event.target.checked
        this.setState({form})
    }

    save() {
        let {cookies} = this.props
        let pk = this.props.article_id
        let data = clone(form)
        json_api_req('PATCH', `/api/articles/${pk}/update/`, data, cookies.get('csrftoken'), (res) => {
            console.log(res)
        }, (err) => {
            console.error(err)
        })
    }

    render_checkbox(id, value, specs) {
        let {classes} = this.props
        return (
            <FormControlLabel
                  control={
                    <Checkbox key={id} id={id} name={id} checked={value} onChange={this.handle_check_change} />
                    }
                  label={specs.label}
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
                        return <FormControlLabel key={op.value} value={op.value} control={<Radio />} label={op.label} />
                    })}

                </RadioGroup>
            </FormControl>
        )
    }

    render_select(id, value, specs) {
        let {classes} = this.props
        return (
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor={id}>{ specs.label }</InputLabel>
                <Select
                    value={value}
                    onChange={this.handle_change}
                    inputProps={{
                      name: id,
                      id: id
                    }}
                  >
                    { specs.options.map((op) => <MenuItem value={op.value} key={op.value}>{op.label}</MenuItem>) }
                </Select>
            </FormControl>
        )
    }

    render_text_field(id, value, specs) {
        let {classes} = this.props
        let adornment = null
        let inputProps = {
            classes: {
                root: classes.cssInput
            }
        }
        if (specs.adornment != null) inputProps.startAdornment = <InputAdornment position="start"><Icon>{specs.adornment}</Icon></InputAdornment>
        return (
            <TextField
                  id={id}
                  key={id}
                  label={specs.label}
                  value={value}
                  type={specs.type}
                  onChange={this.handle_change}
                  placeholder={specs.placeholder}
                  margin="dense"
                  fullWidth={specs.fullWidth}
                  autoComplete="off"
                  InputLabelProps={{
                    classes: {
                        root: classes.cssLabel
                    }
                  }}
                  InputProps={{
                    classes: {
                        root: classes.cssLabel
                    }
                  }}
                  SelectProps={{
                    classes: {
                        root: classes.cssSelect
                    }
                  }}
                  InputProps={inputProps}
                  required={specs.required}
                  multiline={specs.multiline}
                  variant="outlined"
                />
            )
    }

    render_field(id) {
        let {form} = this.state
        let specs = INPUT_SPECS[id] || {}
        let value = form[id] || ''
        if (specs.type == 'checkbox') return this.render_checkbox(id, value, specs)
        else if (specs.type == 'radio') return this.render_radio_group(id, value, specs)
        else if (specs.type == 'select') return this.render_select(id, value, specs)
        else return this.render_text_field(id, value, specs)
    }

    render_commentaries() {
        let {commentaries} = this.state
        let commentary_rows = commentaries.map((comm) => {
            let id = ''
            let spec_pubyear = {
                label: "Authors/publication year",
                placeholder: "Smith & Smith (2019)",
                fullWidth: true
            }
            let spec_url = {
                label: "Commentary URL",
                type: 'url',
                placeholder: 'https://osf.io/dsn72/',
                adornment: 'link',
                fullWidth: true
            }
            return (
                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        { this.render_text_field(id, comm.authors, spec_pubyear) }
                    </Grid>
                    <Grid item xs={6}>
                        { this.render_text_field(id, comm.url, spec_url) }
                    </Grid>
                </Grid>
                )
        })
        return (
            <div>
                { commentary_rows }
                <Button onClick={this.add_commentary}><Icon fontSize="inherit">add</Icon> Add additional commentary</Button>
            </div>
        )
    }

	render() {
        let {classes, article_id, open} = this.props
        let content
        if (article_id != null) content = (
            <div className={classes.content}>
                <Grid container spacing={8}>
                    <Grid item xs={9}>
                        { this.render_field('title') }
                    </Grid>
                </Grid>
                <Grid container spacing={8}>
                    <Grid item xs={9}>
                        { this.render_field('authors') }
                    </Grid>
                    <Grid item xs={3}>
                        { this.render_field('year') }
                        { this.render_field('in_press') }
                    </Grid>
                </Grid>
                <Grid container spacing={8}>
                    <Grid item xs={9}>
                        { this.render_field('journal') }
                    </Grid>
                    <Grid item xs={3}>
                        { this.render_field('doi') }
                    </Grid>
                </Grid>
                <Grid container spacing={8}>
                    <Grid item xs={12}>
                        { this.render_field('abstract') }
                        { this.render_field('keywords') }
                    </Grid>
                </Grid>
                <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <FigureSelector />
                    </Grid>
                </Grid>
                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        { this.render_field('article_type') }
                    </Grid>
                </Grid>
                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        <Grid container spacing={8}>
                            <Grid item xs={1}>
                                <TransparencyIcon tt={{icon: 'prereg'}} style={{paddingTop: 15}} />
                            </Grid>
                            <Grid item xs={5}>
                                { this.render_field('prereg_protocol_url') }
                            </Grid>
                            <Grid item xs={6}>
                                { this.render_field('prereg_protocol_type') }
                            </Grid>
                        </Grid>
                        <div>
                            <TransparencyIcon tt={{icon: 'materials'}} style={{paddingTop: 15}} /> { this.render_field('public_study_materials_url') }
                        </div>
                        <div>
                            <TransparencyIcon tt={{icon: 'data'}} style={{paddingTop: 15}} /> { this.render_field('public_data_url') }
                        </div>
                        <div>
                            <TransparencyIcon tt={{icon: 'code'}} style={{paddingTop: 15}} /> { this.render_field('public_code_url') }
                        </div>
                        <div>
                            <TransparencyIcon tt={{icon: 'repstd'}} style={{paddingTop: 15}} /> { this.render_field('reporting_standards_type') }
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container spacing={8}>
                            <Grid item xs={3}>
                                { this.render_field('pdf_url') }
                            </Grid>
                            <Grid item xs={3}>
                                { this.render_field('pdf_citations') }
                            </Grid>
                            <Grid item xs={3}>
                                { this.render_field('pdf_downloads') }
                            </Grid>
                            <Grid item xs={3}>
                                { this.render_field('pdf_views') }
                            </Grid>
                        </Grid>
                        <Grid container spacing={8}>
                            <Grid item xs={3}>
                                { this.render_field('html_url') }
                            </Grid>
                            <Grid item xs={3}>
                            </Grid>
                            <Grid item xs={3}>
                            </Grid>
                            <Grid item xs={3}>
                                { this.render_field('html_views') }
                            </Grid>
                        </Grid>
                        <Grid container spacing={8}>
                            <Grid item xs={3}>
                                { this.render_field('preprint_url') }
                            </Grid>
                            <Grid item xs={3}>
                            </Grid>
                            <Grid item xs={3}>
                                { this.render_field('preprint_downloads') }
                            </Grid>
                            <Grid item xs={3}>
                                { this.render_field('preprint_views') }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={8}>
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
                <Grid container spacing={8}>
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

            </div>
        )
		return (
            <div>
                <Dialog open={open} onClose={this.handle_close} fullScreen aria-labelledby="edit-article">
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.handle_close} aria-label="Close">
                               <Icon>close</Icon>
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                Edit Article
                            </Typography>
                            <Button color="inherit" onClick={this.handle_close}>
                                save
                            </Button>
                        </Toolbar>
                    </AppBar>

                    { content }

                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.save}>save</Button>
                        <Button variant="text" onClick={this.handle_close}>cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
		)
	}
}

ArticleEditor.defaultProps = {
    article_id: null
}


export default withRouter(withCookies(withStyles(styles)(ArticleEditor)));
