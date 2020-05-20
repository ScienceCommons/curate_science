import React from 'react';
import { withRouter } from 'react-router-dom';

import { concat } from 'lodash'

import {
  Grid,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import ArticleList from '../components/ArticleList.jsx';
import FilterChips from '../components/FilterChips.jsx';
import HomePageFilter from '../components/HomePageFilter.jsx';
import Loader from '../components/shared/Loader.jsx';
import LoadMoreButton from '../components/LoadMoreButton.jsx';
import SortArticlesButton from '../components/SortArticlesButton.jsx';


class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      articles_loading: true,
      content_filters: [],
      transparency_filters: ['open_code', 'open_data', 'open_materials'],
      sort_by: null,
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
    const url_fields = ['sort_by', 'transparency_filters', 'content_filters']
    const changed = url_fields.some(field => prevState[field] !== this.state[field])
    if (changed) {
      this.fetch_articles()
    }
  }

  articles_url() {
    let url = '/api/articles/'
    const { content_filters, transparency_filters, sort_by } = this.state

    url += `?ordering=${sort_by}&page_size=${this.PAGE_SIZE}`

    if (transparency_filters.length) {
      const filter_string = transparency_filters.map(filter => `transparency=${filter}`).join('&')
      url += `&${filter_string}`
    }

    if (content_filters.length) {
      const content_filter_string = content_filters.map( filter => `content=${filter}`).join('&')
      url += `&${content_filter_string}`
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

  set_filters({ transparency_filters, content_filters }) {
    this.setState({ transparency_filters, content_filters })
  }

  set_sort_by(value) {
    this.setState({ sort_by: value })
  }

  update_articles(articles) {
    this.setState({ articles })
  }

  render() {
    const { articles, articles_loading, content_filters, transparency_filters, more_articles, sort_by } = this.state
    const { classes } = this.props

    return (
      <Grid container justify="center">
        <Grid className="HomeArticleList">

          <Typography variant="h5" component="h2" style={{ marginTop: '1rem', textAlign: 'center' }}>
              Recently Added
          </Typography>

          <Grid container justify="space-between">
            <HomePageFilter
              transparency_filters={transparency_filters}
              content_filters={content_filters}
              onFilterUpdate={this.set_filters}
            />
            <SortArticlesButton sort_by={sort_by} onSortByUpdate={this.set_sort_by}/>
          </Grid>

          {(transparency_filters.length + content_filters.length) ?
            <FilterChips
              transparency_filters={transparency_filters}
              content_filters={content_filters}
              onFilterUpdate={this.set_filters}
            />
            : null
          }

          { articles_loading ?
              <Loader /> :
              <div>
                { articles.length === 0 ? <p><em>There are no articles matching the given filters</em></p> : null }
                <ArticleList
                  articles={articles}
                  onArticlesUpdated={this.update_articles}
                  user_session={this.props.user_session}
                  show_date={true}
                />

                { articles.length === 0 ? null :
                  <Grid container justify="center">
                    <LoadMoreButton
                      all_loaded_text="All articles loaded"
                      load_more={this.fetch_more_articles}
                      more_available={more_articles}
                    />
                  </Grid>
                }

              </div>
          }

          </Grid>
        </Grid>
    )
  }
}

export default withRouter(Home);
