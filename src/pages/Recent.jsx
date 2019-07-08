import React from 'react';
import { withRouter } from 'react-router-dom';

import { includes, xor } from 'lodash'

import {
  Button,
  Checkbox,
  Chip,
  ClickAwayListener,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import ArticleList from '../components/ArticleList.jsx';
import TransparencyIcon from '../components/shared/TransparencyIcon.jsx';

const styles = theme => ({
  menuRoot: {
    position: 'relative'
  },
  menu: {
    position: 'absolute',
    top: '4rem',
    left: 0,
    zIndex: 10,
    width: 'auto',
  },
  menuTitle: {
    fontSize: 16,
  },
  transparencyGroup: {
    padding: 2*theme.spacing.unit,
  },
  filterChips: {
    paddingTop: theme.spacing.unit,
  },
  filterCheckbox: {
    paddingLeft: theme.spacing.unit
  },
  transparencyIcon: {
    paddingHorizontal: theme.spacing.unit
  }
})

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      filters: ['open_code', 'open_data', 'open_materials'],
      searched: false,
      sort_by: 'created',
      sort_by_menu_open: false,
    };

    this.sort_by_options = {
      created: 'Newest first',
      impact: 'Impact',
    }

    this.close_sort_by_menu = this.close_sort_by_menu.bind(this)
    this.handle_sort_by_menu_click = this.handle_sort_by_menu_click.bind(this)
    this.set_sort_by = this.set_sort_by.bind(this)
    this.update_articles = this.update_articles.bind(this)
    this.set_filters = this.set_filters.bind(this)
  }

  componentDidMount() {
    this.fetch_articles()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.sort_by !== this.state.sort_by || prevState.filters !== this.state.filters) {
      this.fetch_articles()
    }
  }

  articles_url() {
    let url = '/api/articles/'
    const { filters, sort_by } = this.state

    url += `?ordering=${sort_by}`

    if (filters.length) {
      const filter_string = filters.map(filter => `filter=${filter}`).join('&')
      url += `&${filter_string}`
    }

    return url
  }

  fetch_articles() {
    const url = this.articles_url()
    fetch(url).then(res => res.json()).then((res) => {
      this.setState({ articles: res })
    })
  }

  close_sort_by_menu() {
    this.setState({ sort_by_menu_open: false })
  }

  set_filters(filters) {
    this.setState({ filters: filters })
  }

  handle_sort_by_menu_click() {
    this.setState({ sort_by_menu_open: !this.state.sort_by_menu_open })
  }

  sorted_by() {
    const { sort_by } = this.state
    return this.sort_by_options[sort_by]
  }

  set_sort_by(value) {
    this.setState({ sort_by: value })
    this.close_sort_by_menu()
  }

  update_articles(articles) {
    this.setState({ articles: articles })
  }

  render() {
    let { articles, filters, searched, sort_by_menu_open } = this.state
    let { classes } = this.props
    const sorted_by = this.sorted_by()

    return (
      <Grid container justify="center">
        <Grid>
          <Grid container justify="space-between">
            <FilterButton filters={filters} onFilterUpdate={this.set_filters}/>

            <div className={classes.menuRoot}>
              <ClickAwayListener onClickAway={this.close_sort_by_menu}>
                <div>
                  <Button
                    onClick={this.handle_sort_by_menu_click}
                    size="large"
                  >
                    <Icon>sort</Icon>
                    Sort by: { sorted_by }
                  </Button>
                  { sort_by_menu_open ? (
                    <Paper className={classes.menu}>
                      <MenuList>
                          {
                            Object.keys(this.sort_by_options).map(value => 
                              <MenuItem onClick={this.set_sort_by.bind(this, value)} key={value}>
                                {this.sort_by_options[value]}
                              </MenuItem>
                            )
                          }
                      </MenuList>
                    </Paper>
                  ) : null}
                </div>
              </ClickAwayListener>
            </div>

          </Grid>

          <ArticleList
            articles={articles}
            onArticlesUpdated={this.update_articles}
            user_session={this.props.user_session}
          />
          </Grid>
        </Grid>
    )
  }
}

class Filter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menu_open: false,
      menu_filters: [],
    };

    this.filter_options = [
      { field: 'registered_report', icon: 'prereg', label: 'Registered Report'},
      { field: 'open_materials', icon: 'materials', label: 'Public study materials'},
      { field: 'open_data', icon: 'data', label: 'Public data'},
      { field: 'open_code', icon: 'code', label: 'Public code'},
      { field: 'reporting_standards', icon: 'repstd', label: 'Reporting standard compliance'},
    ]

    this.close_menu = this.close_menu.bind(this)
    this.delete_filter = this.delete_filter.bind(this)
    this.filter_checked = this.filter_checked.bind(this)
    this.handle_menu_click = this.handle_menu_click.bind(this)
    this.update_filters = this.update_filters.bind(this)
    this.set_filters = this.set_filters.bind(this)
  }

  open_menu() {
    const { filters } = this.props
    this.setState({ menu_open: true, menu_filters: filters })
  }

  close_menu() {
    this.setState({ menu_open: false })
  }

  delete_filter(filter_field) {
    let { filters, onFilterUpdate } = this.props
    onFilterUpdate(filters.filter(field => field !== filter_field))
  }

  filter_checked(field) {
    return includes(this.state.menu_filters, field)
  }

  update_filters(field) {
    let { menu_filters } = this.state
    this.setState({ menu_filters: xor(menu_filters, [field]) })
  }

  set_filters(field, event) {
    const { onFilterUpdate }  = this.props
    onFilterUpdate(this.state.menu_filters)
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
    let { classes, filters } = this.props

    return (
      <Grid className={classes.menuRoot}>
        <ClickAwayListener onClickAway={this.close_menu}>
          <div>
            <Button
              onClick={this.handle_menu_click}
              size="large"
            >
              <Icon>filter_list</Icon>
                Filter
            </Button>
              { menu_open ? (
                <Paper className={classes.menu}>
                  <div className={classes.transparencyGroup}>
                    <Typography className={classes.menuTitle}>Transparency</Typography>
                    <FormGroup>
                        { this.filter_options.map(filter =>
                          <div key={filter.field}>
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
                                      <span className={classes.filterCheckbox}>{filter.label}</span>
                                    </div>
                                  }
                                    />
                                    </div>
                        ) }
                                  </FormGroup>
                                </div>
                                <Button variant="contained" onClick={this.set_filters} style={{float: 'right', margin: '1rem'}}>Apply</Button>
                              </Paper>
              ) : null}
          </div>
        </ClickAwayListener>
        <div className={classes.filterChips}>
            { this.filter_options.map(filter => {
                if (includes(filters, filter.field)) {
                  return <Chip
                          label={<TransparencyIcon tt={{icon: filter.icon}} size={25}/>}
                          key={filter.field}
                          onDelete={this.delete_filter.bind(this, filter.field)}
                        />
                }
            })
            }
        </div>
      </Grid>
    )
  }
}

const FilterButton = withStyles(styles)(Filter)
export default withRouter(withStyles(styles)(Home));
