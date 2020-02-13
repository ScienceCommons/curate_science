import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { Button, Card, CardContent, Grid, Icon, IconButton, Typography } from '@material-ui/core';

import { get, includes, lowerCase, some } from 'lodash'

import ArticleContent from '../components/ArticleContent.jsx';
import ArticleEditor from '../components/ArticleEditor.jsx';
import ArticleSelector from '../components/curateform/ArticleSelector.jsx';
import Loader from '../components/shared/Loader.jsx';
import LabeledBox from '../components/shared/LabeledBox.jsx';

import { json_api_req, simple_api_req } from '../util/util.jsx'

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  card: {
    minWidth: 275,
    marginBottom: '9px'
  },
  cardContent: {
    padding: '0 12px',
  },
  articleList: {
    marginTop: '10px',
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
})

class ArticleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles_loading: false,
      loading: false,
      edit_article_modal_open: false,
      editing_article_id: null,
      view_figure_thumb: null,
      view_figure_full: null,
    }

    this.open_article_editor = this.toggle_article_editor.bind(this, true)
    this.close_article_editor = this.toggle_article_editor.bind(this, false)
    this.handle_edit = this.handle_edit.bind(this)
    this.handle_delete = this.handle_delete.bind(this)
    this.article_updated = this.article_updated.bind(this)
    this.show_article = this.show_article.bind(this)
    this.got_article_details = this.got_article_details.bind(this)
  }

  handle_delete(a) {
    let articles = this.props.articles
    articles = articles.filter(article => article.id != a.id)
    this.props.onArticlesUpdated(articles)
  }

  handle_edit(a) {
    this.setState({editing_article_id: a.id, edit_article_modal_open: true, loading: false})
  }

  article_updated(article) {
    let {articles} = this.props
    for (let i=0; i<articles.length; i++) {
      if (articles[i].id == article.id) {
        // Replace with updated object
        articles[i] = article
      }
    }
    this.setState({edit_article_modal_open: false, editing_article_id: null})
    this.props.onArticlesUpdated(articles)
  }

  got_article_details(article) {
    const { articles } = this.props

    // Replace the updated article
    const new_articles = articles.map(a => {
      if (a.id === article.id) {
        return article
      }
      return a
    })
    this.props.onArticlesUpdated(new_articles)
  }

  toggle_article_editor(open) {
    let st = {edit_article_modal_open: open}
    if (!open) st.editing_article_id = null
    this.setState(st)
  }

  show_article(article) {
      const { search_filter } = this.props
      if (!(search_filter && search_filter.length)) return true

      const fields_to_search = ['author_list', 'title']

      const text = fields_to_search.map(field => article[field] || '')
      return some(text, text => {
          return lowerCase(text).indexOf(lowerCase(search_filter)) > -1
      })
  }

  filtered_articles() {
    return this.props.articles.filter(this.show_article)
  }

  render() {
    let {classes, show_date, user_session} = this.props
    const filtered_articles = this.filtered_articles()
    let {
      edit_article_modal_open,
      editing_article_id,
      view_figure_thumb,
      view_figure_full,
      articles_loading,
      loading
    } = this.state

    return (
      <div className={classes.root}>
        <div className={classes.articleList}>
            { articles_loading ? <Loader /> : null }

            { !articles_loading && !filtered_articles.length ? <Typography>No articles found</Typography> : null }

              { filtered_articles.map(a => 
                <StyledArticleWithActions key={a.id}
                  article={a}
                  className={this.show_article(a) ? '' : classes.hidden}
                  user_session={user_session}
                  show_date={show_date}
                  onEdit={this.handle_edit}
                  onDelete={this.handle_delete}
                  onUpdate={this.article_updated}
                  onFetchedArticleDetails={this.got_article_details}
                />) }
          </div>

        <ArticleEditor article_id={editing_article_id}
          open={edit_article_modal_open}
          onUpdate={this.article_updated}
          onClose={this.close_article_editor} />

      </div>
    )
  }
}

class ArticleWithActions extends React.Component {
  constructor(props) {
    super(props);

    this.edit = this.edit.bind(this)
    this.delete = this.delete.bind(this)
    this.got_article_details = this.got_article_details.bind(this)
  }

  edit() {
    let {article} = this.props
    this.props.onEdit(article)
  }

  delete() {
    let {article} = this.props
    this.props.onDelete(article)
  }

  got_article_details(article) {
    this.props.onFetchedArticleDetails(article)
  }

  render() {
    let { article, classes, is_article_page, show_date, user_session } = this.props

    let article_ui_id = article.doi || article.id

    return (
      <div className="Article" id={article_ui_id}>
        <div className="ArticleCard">
          <Card className={classes.card} raised>
            <CardContent className={classes.cardContent} style={{ paddingBottom: 0 }}>
              <ArticleContent
                article={article}
                onFetchedArticleDetails={this.got_article_details}
                show_date={show_date}
                user_session={user_session}
                onDelete={this.delete}
                onEdit={this.edit}
                onUpdate={this.props.onUpdate}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
}

ArticleList.defaultProps = {
    articles: [],
    search_filter: '',
}

const StyledArticleWithActions = withCookies(withStyles(styles)(ArticleWithActions))
export { StyledArticleWithActions }

export default withRouter(withCookies(withStyles(styles)(ArticleList)));
