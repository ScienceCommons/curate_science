import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { concat } from 'lodash'

import ArticleLI from '../components/ArticleLI.jsx';
import ArticleList from '../components/ArticleList.jsx';
import AuthorCard from '../components/AuthorCard.jsx';
import FilterChips from '../components/FilterChips.jsx';
import HomePageFilter from '../components/HomePageFilter.jsx';
import Loader from '../components/shared/Loader.jsx';
import LoadMoreButton from '../components/LoadMoreButton.jsx';
import SortArticlesButton from '../components/SortArticlesButton.jsx';

import C from '../constants/constants';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import { json_api_req, simple_api_req } from '../util/util.jsx'
import queryString from 'query-string'

import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  root: {
    paddingTop: 20,
    width: C.COL_WIDTH,
    margin: '0 auto',
  },
  header: {
    borderBottom: 'solid 1px #999999',
    marginBottom: 2*theme.spacing.unit,
  }
})


class SearchResultsPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      authors: [],
      content_filters: [],
      current_page: 1,
      more_results: true,
      query: null,
      searching: false,
      sort_by: null,
      transparency_filters: [],
    }

    this.PAGE_SIZE = 10

    this.fetch_next_page = this.fetch_next_page.bind(this)
    this.search = this.search.bind(this)
    this.set_filters = this.set_filters.bind(this)
    this.set_sort_by = this.set_sort_by.bind(this)
  }

  componentDidMount() {
    this.search()
  }

  componentDidUpdate(prevProps, prevState) {
    const url_fields = ['sort_by', 'transparency_filters', 'content_filters']
    const changed = url_fields.some(field => prevState[field] !== this.state[field])
    if (changed) {
      this.search()
    }
  }

  search_url() {
    const values = queryString.parse(this.props.location.search)
    const query = values.q
    this.setState({ query })

    let url = `/api/search/?q=${query}&page_size=${this.PAGE_SIZE}`

    const { content_filters, transparency_filters, sort_by } = this.state

    if (sort_by) {
      url += `&ordering=${sort_by}`
    }

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

  update_results(results) {
    const { authors, articles } = results
    if (authors.length) {
      this.setState({ authors: concat(this.state.authors, authors) })
    }
    if (articles.length) {
      this.setState({ articles: concat(this.state.articles, articles) })
    }
    this.setState({ more_results: articles.length + authors.length === this.PAGE_SIZE })
  }

  search() {
    const { cookies } = this.props

    this.setState({ searching: true })

    return json_api_req(
      'GET',
      this.search_url(),
      {},
      cookies.get('csrftoken'),
      (results) => {
        this.setState({
          searching: false,
        })
        this.update_results(results)
      },
      (err) => {
        this.show_snack('Error searching')
        this.setState({ searching: false })
        console.error(err)
      }
    )
  }

  fetch_next_page() {
    const next_page = this.state.current_page + 1
    const url = `${this.search_url()}&page=${next_page}`

    return fetch(url)
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        if (res.status === 404) {
          // No more pages
          this.setState({ more_results: false })
          throw new Error('All articles loaded')
        }
        throw new Error('Error loading more articles')
      })
      .then(res => {
        this.update_results(res)
        this.setState({
          current_page: next_page,
        })
      })
  }

  set_filters({ transparency_filters, content_filters }) {
    this.setState({ transparency_filters, content_filters })
  }

  set_sort_by(value) {
    this.setState({ sort_by: value })
  }

  render() {
    const { classes } = this.props
    const {
      authors,
      articles,
      content_filters,
      more_results,
      query,
      searching,
      sort_by,
      transparency_filters
    } = this.state
    const number_results = authors.length + articles.length

    return (
      <div className={classes.root}>
        <Grid container justify="space-between" className={classes.header}>
          <div style={{alignSelf: 'center', color: '#999999'}}>
            {
              searching ? 'Searching...' :
              <span>{number_results} results for "{query}"</span>
            }
          </div>
          <Grid style={{display: 'flex'}}>
            <HomePageFilter
              align_right={true}
              transparency_filters={transparency_filters}
              content_filters={content_filters}
              onFilterUpdate={this.set_filters}
            />
            <SortArticlesButton sort_by={sort_by} onSortByUpdate={this.set_sort_by}/>
          </Grid>
          {(transparency_filters.length + content_filters.length) ?
            <FilterChips
              style={{padding: 0}}
              transparency_filters={transparency_filters}
              content_filters={content_filters}
              onFilterUpdate={this.set_filters}
            />
            : null
          }
        </Grid>

        <div style={{width: C.CARD_COL_WIDTH}}>
          { 
            searching ?
            <Loader/> :
            <div>
              { authors.map(author => <AuthorCard key={author.id} author={author}/>) }

              <ArticleList
                style={{paddingTop: 0}}
                articles={articles}
                onArticlesUpdated={() => {}}
                user_session={this.props.user_session}
                show_date={true}
              />
            </div>
          }

          {
            !searching && number_results === 0 ?
            <div>
              No results found for "{query}". <Link to="/">Browse</Link> recently added articles.
            </div>
            : null
          }

          { !searching && number_results > 0 ?
            <Grid container justify="center">
              <LoadMoreButton
                all_loaded_text="No more results"
                load_more={this.fetch_next_page}
                more_available={more_results}
              />
            </Grid>
            : null
          }
        </div>
      </div>
    )
  }
}

export default withRouter(withCookies(withStyles(styles)(SearchResultsPage)))
