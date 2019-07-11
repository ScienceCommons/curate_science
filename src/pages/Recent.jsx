import React from 'react';
import { withRouter } from 'react-router-dom';

import { concat } from 'lodash'

import {
  Button,
  CircularProgress,
  ClickAwayListener,
  Grid,
  Icon,
  MenuItem,
  MenuList,
  Paper,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import ArticleList from '../components/ArticleList.jsx';
import HomePageFilter from '../components/HomePageFilter.jsx';
import Loader from '../components/shared/Loader.jsx';

const styles = theme => ({
  menuRoot: {
    position: 'relative'
  },
  menu: {
    position: 'absolute',
    top: '4rem',
    left: 0,
    zIndex: 10,
  },
})

class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      articles_loading: true,
      content_filter: null,
      transparency_filters: ['open_code', 'open_data', 'open_materials'],
      sort_by: 'created',
      more_articles: true,
      current_page: 1,
    };

    this.PAGE_SIZE = 10

    this.fetch_more_articles = this.fetch_more_articles.bind(this)
    this.update_articles = this.update_articles.bind(this)
    this.set_filters = this.set_filters.bind(this)
    this.set_sort_by = this.set_sort_by.bind(this)
  }

  componentDidMount() {
    this.fetch_articles()
  }

  componentDidUpdate(prevProps, prevState) {
    const url_fields = ['sort_by', 'transparency_filters', 'content_filter']
    const changed = url_fields.some(field => prevState[field] !== this.state[field])
    if (changed) {
      this.fetch_articles()
    }
  }

  articles_url() {
    let url = '/api/articles/'
    const { content_filter, transparency_filters, sort_by } = this.state

    url += `?ordering=${sort_by}&page_size=${this.PAGE_SIZE}`

    if (transparency_filters.length) {
      const filter_string = transparency_filters.map(filter => `transparency=${filter}`).join('&')
      url += `&${filter_string}`
    }

    if (content_filter) {
      url += `&content=${content_filter}`
    }
    return url
  }

  fetch_articles() {
    const url = this.articles_url()
    this.setState({ articles_loading: true })
    fetch(url).then(res => res.json()).then((res) => {
      this.setState({
        articles: res,
        current_page: 1,
        articles_loading: false,
        more_articles: res.length === this.PAGE_SIZE
      })
    })
  }

  fetch_more_articles() {
    const next_page = this.state.current_page + 1
    const url = `${this.articles_url()}&page=${next_page}`

    return fetch(url)
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        if (res.status === 404) {
          // No more pages
          this.setState({ more_articles: false })
          throw new Error('All articles loaded')
        }
        throw new Error('Error loading more articles')
      })
      .then(res => {
        this.setState({
          articles: concat(this.state.articles, res),
          current_page: next_page,
          more_articles: res.length === this.PAGE_SIZE
        })
      })
  }

  set_filters({ transparency_filters, content_filter }) {
    this.setState({ transparency_filters, content_filter })
  }

  set_sort_by(value) {
    this.setState({ sort_by: value })
  }

  update_articles(articles) {
    this.setState({ articles: articles })
  }

  render() {
    const { articles, articles_loading, content_filter, transparency_filters, more_articles, sort_by } = this.state
    const { classes } = this.props

    return (
      <Grid container justify="center">
        <Grid className="HomeArticleList">
          <Grid container justify="space-between">
            <HomePageFilter
              transparency_filters={transparency_filters}
              content_filter={content_filter}
              onFilterUpdate={this.set_filters}
            />
            <SortByButton sort_by={sort_by} onSortByUpdate={this.set_sort_by}/>
          </Grid>

            { articles_loading ?
                <Loader /> :
                <div>
                  { articles.length === 0 ? <p><em>There are no articles matching the given filters</em></p> : null }
                  <ArticleList
                    articles={articles}
                    onArticlesUpdated={this.update_articles}
                    user_session={this.props.user_session}
                  />

                  { articles.length === 0 ? null :
                    <Grid container justify="center">
                      <LoadMoreButton more_articles={more_articles} fetch_more_articles={this.fetch_more_articles}/>
                    </Grid>
                  }

                </div>
            }

          </Grid>
        </Grid>
    )
  }
}

class LoadMoreButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.load_more = this.load_more.bind(this)
  }

  load_more() {
    this.setState({ loading: true })
    this.props.fetch_more_articles()
      .then(() => {
        this.setState({ loading: false })
      })
  }

  render() {
    const loading = this.state.loading
    if (this.props.more_articles) {
      return (
        <Button onClick={this.load_more} disabled={loading} style={{position: 'relative'}}>
          <Icon>keyboard_arrow_down</Icon>
          Show More
          {
            loading &&
            <CircularProgress
              size={24}
              style={{position: 'absolute', top: '50%', left: '50%', marginTop: -12, marginLeft: -12}}
            />
          }
        </Button>
      )
    } 
    return <Button disabled>All articles loaded</Button>
  }
}


class SortBy extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menu_open: false,
    };

    this.sort_by_options = {
      created: 'Newest first',
      impact: 'Impact',
    }

    this.close_menu = this.close_menu.bind(this)
    this.handle_menu_click = this.handle_menu_click.bind(this)
    this.set_sort_by = this.set_sort_by.bind(this)
  }

  close_menu() {
    this.setState({ menu_open: false })
  }

  set_sort_by(value) {
    const { onSortByUpdate }  = this.props
    onSortByUpdate(value)
    this.close_menu()
  }

  handle_menu_click() {
    this.setState({ menu_open: !this.state.menu_open })
  }

  sorted_by() {
    const { sort_by } = this.props
    return this.sort_by_options[sort_by]
  }

  render() {
    let { menu_open } = this.state
    let { classes } = this.props
    const sorted_by = this.sorted_by()

    return (
      <div className={classes.menuRoot}>
        <ClickAwayListener onClickAway={this.close_menu}>
          <div>
            <Button
              onClick={this.handle_menu_click}
              size="large"
            >
              <Icon>sort</Icon>
                Sort by: { sorted_by }
            </Button>
              { menu_open ? (
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
    )
  }
}

const SortByButton = withStyles(styles)(SortBy)
export default withRouter(withStyles(styles)(Home));
