import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import { Link } from "react-router-dom";
import {DebounceInput} from 'react-debounce-input';

import Typography from '@material-ui/core/Typography';
import {List, Grid, Button, Icon, TextField,
        Dialog, DialogTitle, FormControlLabel, Checkbox,
        DialogContent, DialogContentText, DialogActions,
        Toolbar, IconButton, AppBar, MenuItem,
        Slide, InputAdornment, InputLabel, Select,
        FormControl, Radio, RadioGroup,
        FormLabel, Snackbar} from '@material-ui/core';
import C from '../constants/constants';
import TransparencyIcon from '../components/shared/TransparencyIcon.jsx';
import FigureSelector from './FigureSelector.jsx';
import LabeledBox from '../components/shared/LabeledBox.jsx';
import Loader from '../components/shared/Loader.jsx';
import { withStyles } from '@material-ui/core/styles';
import {clone, set} from 'lodash'
import {json_api_req, simple_api_req, unspecified, summarize_api_errors} from '../util/util.jsx'

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
        padding: 4
    }
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
        min: 0
    },
    'pdf_downloads': {
        label: 'Downloads',
        type: 'number',
        adornment: 'cloud_download',
        fullWidth: true,
        zero_empty_str: true,
        min: 0
    },
    'preprint_downloads': {
        label: 'Downloads',
        type: 'number',
        adornment: 'cloud_download',
        fullWidth: true,
        zero_empty_str: true,
        min: 0
    },
    'pdf_views': {
        label: 'Views',
        type: 'number',
        adornment: 'remove_red_eye',
        fullWidth: true,
        zero_empty_str: true,
        min: 0
    },
    'html_views': {
        label: 'Views',
        type: 'number',
        adornment: 'remove_red_eye',
        fullWidth: true,
        zero_empty_str: true,
        min: 0
    },
    'preprint_views': {
        label: 'Views',
        type: 'number',
        adornment: 'remove_red_eye',
        fullWidth: true,
        zero_empty_str: true,
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
        label: "Prereg. prot. URL",
        type: 'url',
        placeholder: 'http://...',
        adornment: 'link'
    },
    'prereg_protocol_type': {
        type: 'radio',
        label: 'Preregistration Type',
        options: C.PREREG_PROTOCOL_TYPES
    },
    'public_study_materials_url': {
        label: "Public study materials URL",
        type: 'url',
        placeholder: 'http://...',
        adornment: 'link',
        fullWidth: true
    },
    'public_data_url': {
        label: "Public data URL",
        type: 'url',
        placeholder: 'http://...',
        adornment: 'link',
        fullWidth: true
    },
    'public_code_url': {
        label: "Public code URL",
        type: 'url',
        placeholder: 'http://...',
        adornment: 'link',
        fullWidth: true
    },
    'reporting_standards_type': {
        label: "Reporting standards",
        type: 'select',
        options: C.REPORTING_STANDARDS_TYPES
    },
    // Replication fields
    'number_of_reps': {
        label: "Number of reps",
        type: 'number',
        fullWidth: true,
        min: 0
    },
    'original_study': {
        label: "Original study",
        type: 'text',
        placeholder: 'e.g., Smith (2000) Study 2',
        fullWidth: true
    },
    'target_effects': {
        label: "Target effect(s)",
        type: 'text',
        placeholder: 'e.g., playboy effect',
        fullWidth: true
    },
    'original_article_url': {
        label: "Original article URL",
        type: 'url',
        placeholder: 'http://...',
        adornment: 'link',
        fullWidth: true
    },

}

function initialFormState() {
    return {
        article_type: 'ORIGINAL',
        key_figures: [],
        commentaries: []
    }
}

class ArticleEditor extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            form: initialFormState(),
            snack_message: null,
            unsaved: false,
            loading: false
        }

        this.maybe_confirm_close = this.maybe_confirm_close.bind(this)
        this.handle_close = this.handle_close.bind(this)
        this.save = this.save.bind(this)
        this.handle_change = this.handle_change.bind(this)
        this.handle_check_change = this.handle_check_change.bind(this)
        this.add_commentary = this.add_commentary.bind(this)
        this.delete_commentary = this.delete_commentary.bind(this)
        this.update_figures = this.update_figures.bind(this)
        this.show_snack = this.show_snack.bind(this)
        this.close_snack = this.close_snack.bind(this)
        this.handle_command_s_save = this.handle_command_s_save.bind(this)
    }

    componentDidMount() {
        // Set up listener for Ctrl/Command-S
        document.addEventListener("keydown", this.handle_command_s_save, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handle_command_s_save, false);
    }

    componentWillReceiveProps(nextProps) {
        let article_change = nextProps.article_id != this.props.article_id
        let open = nextProps.open
        if (open && article_change) {
            // Fetch article from server to ensure up to date
            // Populate form
            let pk = nextProps.article_id
            this.setState({loading: true}, () => {
                fetch(`/api/articles/${pk}`).then(res => res.json()).then((res) => {
                    let form = clone(res)
                    console.log(form)
                    // delete form.key_figures
                    if (form.title.startsWith(C.PLACEHOLDER_TITLE_PREFIX)) form.title = ""
                    this.setState({form: form, unsaved: false, loading: false})
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

    handle_change = event => {
        let {form} = this.state
        event.persist()
        let key = event.target.name
        let val = event.target.value
        if (key.indexOf('.') > -1) {
            // Key as path
            set(form, key, val)
        } else {
            form[event.target.name] = val
        }
        this.setState({form: form, unsaved: true})
    }

    handle_check_change = event => {
        let {form} = this.state
        form[event.target.name] = event.target.checked
        this.setState({form: form, unsaved: true})
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

    save() {
        let {cookies} = this.props
        let {form} = this.state
        let pk = this.props.article_id
        let data = clone(form)
        let {valid, message} = this.validate(data)
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
        return (
            <FormControlLabel
                  control={
                    <Checkbox key={id} id={id} name={id} checked={value} onChange={this.handle_check_change} className={classes.checkbox} />
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
                        return <FormControlLabel key={op.value} value={op.value} control={<Radio className={classes.radioButton} />} label={op.label} />
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

    render_field(id) {
        let {form} = this.state
        let specs = INPUT_SPECS[id] || {}
        let value = form[id] || ''
        if (specs.type == 'checkbox') return this.render_checkbox(id, value, specs)
        else if (specs.type == 'radio') return this.render_radio_group(id, value, specs)
        else if (specs.type == 'select') return this.render_select(id, value, specs)
        else {
            let disabled = id == 'year' && form.in_press === true
            return <StyledCSTextField id={id}
                                      value={value}
                                      specs={specs}
                                      disabled={disabled}
                                      onChange={this.handle_change} />
        }
    }

    render_commentaries() {
        let {form} = this.state
        let commentary_rows = form.commentaries.map((comm, idx) => {
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
            return (
                <Grid container spacing={8} key={idx}>
                    <Grid item xs={5}>
                        <StyledCSTextField id={id_author} value={comm.authors_year} specs={spec_pubyear} onChange={this.handle_change} />
                    </Grid>
                    <Grid item xs={5}>
                        <StyledCSTextField id={id_url} value={comm.commentary_url} specs={spec_url} onChange={this.handle_change} />
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton style={{margin: 8}} onClick={this.delete_commentary.bind(this, idx)}><Icon>delete</Icon></IconButton>
                    </Grid>
                </Grid>
                )
        })
        return (
            <div>
                { commentary_rows }
                <Button onClick={this.add_commentary}><Icon fontSize="inherit">add</Icon> Add commentary</Button>
            </div>
        )
    }

	render() {
        let {classes, article_id, open} = this.props
        let {form, snack_message, loading} = this.state
        let content
        let replication = form.article_type == 'REPLICATION'
        let visible_transparencies = this.get_relevant_transparency_badges()
        let dialog_title = form.is_live ? "Edit Article" : "New Article"
        if (!loading && article_id != null) content = (
            <div className={classes.content}>
                <Grid container spacing={8}>
                    <Grid item xs={9}>
                        { this.render_field('title') }
                    </Grid>
                </Grid>
                <Grid container spacing={8}>
                    <Grid item xs={9}>
                        { this.render_field('author_list') }
                    </Grid>
                    <Grid item xs={3}>
                        { this.render_field('year') }
                        &nbsp;{ this.render_field('in_press') }
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
                    <Grid item xs={4}>
                        { this.render_field('article_type') }
                    </Grid>
                    <Grid item xs={8} hidden={!replication}>
                        <Typography variant="h6">Replication details</Typography>
                        <Grid container spacing={8}>
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
                </Grid>
                <Typography variant="overline">Key Figures</Typography>
                <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <FigureSelector article_id={article_id}
                            onChange={this.update_figures}
                            figures={form.key_figures} />
                    </Grid>
                </Grid>
                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        <Grid container spacing={8}>
                            <Grid item xs={1}>
                                <TransparencyIcon tt={{icon: 'preregplus'}} style={{paddingTop: 10}} />
                            </Grid>
                            <Grid item xs={5}>
                                { this.render_field('prereg_protocol_url') }
                            </Grid>
                            <Grid item xs={6}>
                                { this.render_field('prereg_protocol_type') }
                            </Grid>
                        </Grid>
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
                    <Grid item xs={6}>
                        <div hidden={!visible_transparencies.MATERIALS}>
                            <Grid container spacing={8}>
                                <Grid item xs={1}>
                                    <TransparencyIcon tt={{icon: 'materials'}} style={{paddingTop: 10}} />
                                </Grid>
                                <Grid item xs={11}>
                                    { this.render_field('public_study_materials_url') }
                                </Grid>
                            </Grid>
                        </div>
                        <div hidden={!visible_transparencies.DATA}>
                            <Grid container spacing={8}>
                                <Grid item xs={1}>
                                    <TransparencyIcon tt={{icon: 'data'}} style={{paddingTop: 10}} />
                                </Grid>
                                <Grid item xs={11}>
                                { this.render_field('public_data_url') }
                                </Grid>
                            </Grid>
                        </div>
                        <div hidden={!visible_transparencies.CODE}>
                            <Grid container spacing={8}>
                                <Grid item xs={1}>
                                    <TransparencyIcon tt={{icon: 'code'}} style={{paddingTop: 10}} />
                                </Grid>
                                <Grid item xs={11}>
                                    { this.render_field('public_code_url') }
                                </Grid>
                            </Grid>
                        </div>
                        <div hidden={!visible_transparencies.REPSTD}>
                            <Grid container spacing={8}>
                                <Grid item xs={1}>
                                    <TransparencyIcon tt={{icon: 'repstd'}} style={{paddingTop: 10}} />
                                </Grid>
                                <Grid item xs={11}>
                                    { this.render_field('reporting_standards_type') }
                                </Grid>
                            </Grid>
                        </div>
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

                <Typography>* indicates required field</Typography>

            </div>
        )
		return (
            <div>
                <Dialog open={open}
                        onClose={this.maybe_confirm_close}
                        TransitionComponent={Transition}
                        maxWidth='lg'
                        classes={{paperWidthLg: classes.dialogRoot}}
                        aria-labelledby="edit-article">
                    <AppBar className={classes.appBar} position='fixed'>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.maybe_confirm_close} aria-label="Close">
                               <Icon>close</Icon>
                            </IconButton>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                { dialog_title }
                            </Typography>
                            { loading ? <Loader /> :
                            <Button color="inherit" onClick={this.save}>
                                save
                            </Button>
                            }
                        </Toolbar>
                    </AppBar>

                    { content }

                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.save}>save</Button>
                        <Button variant="text" onClick={this.maybe_confirm_close}>cancel</Button>
                    </DialogActions>
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

const csinput_styles = {
    input: {
        padding: 2,
        boxSizing: 'border-box',
        display: 'block',
        borderRadius: '3px',
        border: '1px solid #CCC'
    }
}

class CSTextField extends React.Component {
    constructor(props) {
        super(props);
        this.handle_change = this.handle_change.bind(this)
    }

    handle_change(e) {
        this.props.onChange(e)
    }

    render() {
        let {id, value, specs, classes, disabled} = this.props
        let st = {}
        if (specs.fullWidth) st.width = '100%'
        let label = specs.label
        if (specs.required) label += '  *'
        let attrs = {}
        if (specs.selectOnFocus) attrs.onFocus = (event) => {
            event.target.select()
        }
        if (specs.min != null) attrs.min = specs.min
        return <LabeledBox bgcolor="#FFF" fontSize='0.55rem' label={label} inlineBlock={!specs.fullWidth}>
                    <DebounceInput
                      id={id}
                      key={id}
                      name={id}
                      onChange={this.handle_change}
                      value={value || ''}
                      type={specs.type}
                      placeholder={specs.placeholder}
                      autoComplete="off"
                      disabled={disabled}
                      required={specs.required}
                      element={specs.multiline ? 'textarea' : 'input'}
                      className={classes.input}
                      autoFocus={specs.autoFocus}
                      style={st}
                      {...attrs}
                    />
                </LabeledBox>
    }}

CSTextField.defaultProps = {
    id: '',
    value: '',
    specs: {}
}

const StyledCSTextField = withStyles(csinput_styles)(CSTextField)


export default withRouter(withCookies(withStyles(styles)(ArticleEditor)));
