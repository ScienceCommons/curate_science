import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { Button, Grid, Icon, IconButton, Typography } from '@material-ui/core';

import { get, includes } from 'lodash'

import ArticleActions from '../components/ArticleActions.jsx';
import ArticleEditor from '../components/ArticleEditor.jsx';
import ArticleLI from '../components/ArticleLI.jsx';
import Loader from '../components/shared/Loader.jsx';
import LabeledBox from '../components/shared/LabeledBox.jsx';
import ArticleSelector from '../components/curateform/ArticleSelector.jsx';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import { json_api_req, simple_api_req } from '../util/util.jsx'

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  articleList: {
    marginTop: '10px',
    minWidth: 650,
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
      // Lightbox / gallery state
      gallery_images: [],
      gallery_showing: false,
      gallery_index: 0,
    }

    this.open_article_editor = this.toggle_article_editor.bind(this, true)
    this.close_article_editor = this.toggle_article_editor.bind(this, false)
    this.handle_edit = this.handle_edit.bind(this)
    this.handle_delete = this.handle_delete.bind(this)
    this.article_updated = this.article_updated.bind(this)
    this.show_figure = this.show_figure.bind(this)
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

  show_figure(figures, index) {
    // Currently shows only one at a time
    this.setState({gallery_images: figures.map((fig) => fig.image), gallery_index: index, gallery_showing: true})
  }

  render() {
    let {articles, classes, show_date, user_session} = this.props
    let {
      edit_article_modal_open,
      editing_article_id,
      view_figure_thumb,
      view_figure_full,
      articles_loading,
      gallery_showing,
      gallery_images,
      gallery_index,
      loading
    } = this.state

    let gallery
    if (gallery_showing && gallery_images.length > 0) gallery = (
      <Lightbox
        mainSrc={gallery_images[gallery_index]}
        nextSrc={gallery_images[(gallery_index + 1) % gallery_images.length]}
        prevSrc={gallery_images[(gallery_index + gallery_images.length - 1) % gallery_images.length]}
        onCloseRequest={() => this.setState({ gallery_showing: false })}
        onMovePrevRequest={() =>
            this.setState({
              gallery_index: (gallery_index + gallery_images.length - 1) % gallery_images.length,
            })
        }
        onMoveNextRequest={() =>
            this.setState({
              gallery_index: (gallery_index + 1) % gallery_images.length,
            })
        }
      />
    )
    return (
      <div className={classes.root}>
        <div className={classes.articleList}>
            { articles_loading ? <Loader /> : null }

            { !articles_loading && !articles.length ? <Typography>No articles found</Typography> : null }

              { articles.map(a => 
                <StyledArticleWithActions key={a.id}
                  article={a}
                  user_session={user_session}
                  show_date={show_date}
                  onEdit={this.handle_edit}
                  onDelete={this.handle_delete}
                  onUpdate={this.article_updated}
                  onFigureClick={this.show_figure}
                  onFetchedArticleDetails={this.got_article_details}
                />) }
          </div>

          { gallery }

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
    this.show_figure = this.show_figure.bind(this)
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

  show_figure(figures, index) {
    this.props.onFigureClick(figures, index)
  }

  got_article_details(article) {
    this.props.onFetchedArticleDetails(article)
  }

  render() {
    let { article, classes, is_article_page, show_date, user_session } = this.props

    let article_ui_id = article.doi || article.id

    return (
      <div key={article.id} className="ArticleWithActions" id={article_ui_id}>
        <div className="Article">
          <ArticleLI article={article}
            admin={false}
            is_article_page={is_article_page}
            onFetchedArticleDetails={this.got_article_details}
            onFigureClick={this.show_figure}
            show_date={show_date}
          />
        </div>
        <div className="ArticleLeftActions">
          <span className="ActionButton">
            <IconButton href={`#${article_ui_id}`} size="small" style={{color: 'gray'}}>
              <Icon>link</Icon>
            </IconButton>
          </span>
        </div>

        <ArticleActions
          article={article}
          user_session={user_session}
          onDelete={this.delete}
          onEdit={this.edit}
          onUpdate={this.props.onUpdate}
        />

      </div>
    )
  }
}

const StyledArticleWithActions = withCookies(withStyles(styles)(ArticleWithActions))
export { StyledArticleWithActions }

export default withRouter(withCookies(withStyles(styles)(ArticleList)));
