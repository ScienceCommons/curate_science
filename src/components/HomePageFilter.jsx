import React from 'react';

import { filter, includes, xor } from 'lodash'

import {
  Button,
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  Paper,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import C from '../constants/constants';

import ArticleType from './ArticleType.jsx';
import TransparencyIcon from '../components/shared/TransparencyIcon.jsx';

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  menuRoot: {
    position: 'relative'
  },
  menu: {
    position: 'absolute',
    top: '4rem',
    zIndex: 10,
  },
  menuTitle: {
    fontSize: 16,
  },
  transparencyGroup: {
    padding: 2*theme.spacing.unit,
    whiteSpace: 'nowrap',
  },
  filterCheckbox: {
    paddingLeft: theme.spacing.unit
  },
})

class HomePageFilter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menu_open: false,
      menu_content_filters: [],
      menu_transparency_filters: [],
    };

    this.filter_options = C.TRANSPARENCY_FILTER_OPTIONS

    const content_filter_ids = ['ORIGINAL', 'REPLICATION', 'REPRODUCIBILITY', 'META_ANALYSIS']
    this.content_filter_options = filter(C.ARTICLE_TYPES, type => includes(content_filter_ids, type.id))

    this.close_menu = this.close_menu.bind(this)
    this.delete_filter = this.delete_filter.bind(this)
    this.delete_content_filter = this.delete_content_filter.bind(this)
    this.filter_checked = this.filter_checked.bind(this)
    this.content_filter_checked = this.content_filter_checked.bind(this)
    this.handle_menu_click = this.handle_menu_click.bind(this)
    this.clear_all_filters = this.clear_all_filters.bind(this)
    this.update_filters = this.update_filters.bind(this)
    this.update_content_filters = this.update_content_filters.bind(this)
    this.set_filters = this.set_filters.bind(this)
  }

  selected_transparency_filters() {
    return this.filter_options.filter(filter => {
      return includes(this.props.transparency_filters, filter.field)
    })
  }

  selected_content_filters() {
    return this.content_filter_options.filter(filter => {
      return includes(this.props.content_filters, filter.id)
    })
  }

  open_menu() {
    const { content_filters, transparency_filters } = this.props
    this.setState({ menu_open: true, menu_transparency_filters: transparency_filters, menu_content_filters: content_filters })
  }

  close_menu() {
    this.setState({ menu_open: false })
  }

  clear_all_filters() {
    this.setState({ menu_transparency_filters: [], menu_content_filters: [] })
  }

  delete_filter(filter_field) {
    let { content_filters, transparency_filters, onFilterUpdate } = this.props
    onFilterUpdate({ transparency_filters: transparency_filters.filter(field => field !== filter_field), content_filters })
  }

  delete_content_filter(filter_field) {
    let { content_filters, transparency_filters, onFilterUpdate } = this.props
    onFilterUpdate({
      transparency_filters,
      content_filters: content_filters.filter(field => field !== filter_field)
    })
  }
  filter_checked(field) {
    return includes(this.state.menu_transparency_filters, field)
  }

  content_filter_checked(field) {
    return includes(this.state.menu_content_filters, field)
  }

  update_filters(field) {
    const { menu_transparency_filters } = this.state
    this.setState({ menu_transparency_filters: xor(menu_transparency_filters, [field]) })
  }

  update_content_filters(field) {
    const { menu_content_filters } = this.state
    this.setState({ menu_content_filters: xor(menu_content_filters, [field]) })
  }

  set_filters(field, event) {
    const { onFilterUpdate }  = this.props
    onFilterUpdate({
      transparency_filters: this.state.menu_transparency_filters,
      content_filters: this.state.menu_content_filters
    })
    this.close_menu()
  }

  handle_menu_click() {
    if (this.state.menu_open) {
      this.close_menu()
    } else {
      this.open_menu()
    }
  }

  render() {
    let { menu_open } = this.state
    let { align_right, classes, transparency_filters } = this.props

    let menu_styles
    if (align_right) {
      menu_styles = {right: 0}
    } else {
      menu_styles = {left: 0}
    }

    const { menu_content_filters, menu_transparency_filters } = this.state

    return (
      <Grid className={classes.menuRoot}>
        <ClickAwayListener onClickAway={this.close_menu}>
          <div>
            <Button
              onClick={this.handle_menu_click}
              size="large"
              style={{color: "#999"}}
            >
              <Icon className={classes.leftIcon}>filter_list</Icon>
                Filter
            </Button>
              { menu_open ? (
                <Paper className={classes.menu} style={menu_styles}>
                  <div className={classes.transparencyGroup}>
                    <Grid container wrap="nowrap">
                      <Grid item xs={6}>
                        <Typography className={classes.menuTitle}>Transparency</Typography>
                        <FormGroup>
                            { this.filter_options.map(filter =>
                              <div key={filter.field} style={{marginLeft: filter.field === 'registered_report' ? 35 : null }}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={this.filter_checked(filter.field)}
                                      onChange={this.update_filters.bind(this, filter.field)}
                                      value={filter.field}/>
                                  }
                                  label={
                                      <div style={{display: 'flex', alignItems: 'center'}}>
                                        <TransparencyIcon tt={{icon: filter.icon}} size={25} />
                                          {
                                          (filter.field === 'registered_report') ?
                                            <span className={classes.filterCheckbox} style={{ display: 'flex', alignItems: 'center' }}>
                                              <span className="ArticleBadgeWithCount" color="inherit" style={{ border: 'solid 1px', color: C.REGISTERED_REPORT_COLOR, opacity: 0.6 }}>
                                                  {filter.label}
                                              </span>
                                              format
                                            </span>
                                          : <span className={classes.filterCheckbox}>{filter.label}</span>
                                          }
                                      </div>
                                    }
                                  
                                />
                              </div>
                            ) }
                        </FormGroup>
                      </Grid>

                      <Grid item xs={6} style={{marginLeft: '4rem'}}>
                        <Typography className={classes.menuTitle}>Content Type</Typography>
                        <FormGroup>
                            { this.content_filter_options.map((filter) => {
                              return <div key={filter.id}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={this.content_filter_checked(filter.id)}
                                      onChange={this.update_content_filters.bind(this, filter.id)}
                                      value={filter.id}
                                    />
                                  }
                                  label={
                                    <ArticleType type={filter.id} label_styles={{ opacity: 0.8, margin: 0 }} />
                                  }
                                />
                              </div>
                            } ) }
                        </FormGroup>
                      </Grid>
                    </Grid>
                  </div>

                  <Grid container justify="flex-end">
                    <Button variant="contained" onClick={this.set_filters} style={{float: 'right', margin: '1rem'}}>Apply</Button>
                  </Grid>

                </Paper>
              ) : null}
          </div>
        </ClickAwayListener>
      </Grid>
    )
  }
}

export default withStyles(styles)(HomePageFilter)
