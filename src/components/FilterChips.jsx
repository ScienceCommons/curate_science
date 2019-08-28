import React from 'react';

import { filter, includes } from 'lodash'

import { Button, Chip, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import C from '../constants/constants';

import ArticleType from './ArticleType.jsx';
import TransparencyIcon from '../components/shared/TransparencyIcon.jsx';

const styles = theme => ({
  filterChip: {
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  filterChips: {
    paddingTop: theme.spacing(1),
  },
  filtersLabel: {
    opacity: 0.4,
    marginRight: theme.spacing(0.5),
    paddingTop: theme.spacing(0.6),
  },
})

class FilterChips extends React.PureComponent {
  constructor(props) {
    super(props);

    this.filter_options = C.TRANSPARENCY_FILTER_OPTIONS

    const content_filter_ids = ['ORIGINAL', 'REPLICATION', 'REPRODUCIBILITY', 'META_ANALYSIS']
    this.content_filter_options = filter(C.ARTICLE_TYPES, type => includes(content_filter_ids, type.id))

    this.clear_all_filters = this.clear_all_filters.bind(this)
    this.delete_filter = this.delete_filter.bind(this)
    this.delete_content_filter = this.delete_content_filter.bind(this)
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

  clear_all_filters() {
    this.props.onFilterUpdate({ transparency_filters: [], content_filters: [] })
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

  render() {
    let { classes } = this.props
    const number_filters = this.props.transparency_filters.length + this.props.content_filters.length
    const show_clear_filters_button = number_filters > 1

    return (
      <Grid container wrap="nowrap" className={classes.filterChips}>
        <div className={classes.filtersLabel}>Filters: </div>
        <div>
          { this.selected_transparency_filters().map(filter => {
              return <Chip
                      className={classes.filterChip}
                      title={filter.label}
                      label={
                        (filter.field === 'registered_report') ?
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <TransparencyIcon tt={{icon: filter.icon}} size={25} style={{marginRight: 4}}/>
                          <span className="ArticleBadgeWithCount" style={{ border: 'solid 1px', color: C.REGISTERED_REPORT_COLOR, opacity: 0.6, margin: 0 }}>
                            {filter.label}
                          </span>
                        </div>
                        :
                        <TransparencyIcon tt={{icon: filter.icon}} size={25}/>
                      }
                      key={filter.field}
                      onDelete={this.delete_filter.bind(this, filter.field)}
                    />
            })
          }
          { this.selected_content_filters().map(filter => {
              return <Chip
                      className={classes.filterChip}
                      title={filter.label}
                      label={
                        <ArticleType type={filter.id} label_styles={{ opacity: 0.8, margin: 0 }} />
                      }
                      key={filter.id}
                      onDelete={this.delete_content_filter.bind(this, filter.id)}
                    />
            })
          }

          <Button
            onClick={this.clear_all_filters}
            style={{ color: '#999', visibility: show_clear_filters_button ? 'visible' : 'hidden' }}
          >
            Clear All
          </Button>
        </div>
      </Grid>
    )
  }
}

export default withStyles(styles)(FilterChips)
