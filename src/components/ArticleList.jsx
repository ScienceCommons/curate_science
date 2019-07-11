import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { Button, Grid, Icon, IconButton } from '@material-ui/core';

import { get, includes } from 'lodash'

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
    paddingTop: 10,
    flexGrow: 1
  },
  articleList: {
    marginTop: '10px'
  },
  leftIcon: {
    marginRight: theme.spacing.unit
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
    let pk = a.id
    let {articles, cookies} = this.props
    simple_api_req('DELETE', `/api/articles/${pk}/delete/`, {}, cookies.get('csrftoken'), () => {
      articles = articles.filter(article => article.id != a.id)
      this.props.onArticlesUpdated(articles)
    }, (err) => {
      console.error(err)
    })
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

  got_article_details(id, figures, commentaries) {
    let {articles} = this.props
    for (let i=0; i<articles.length; i++) {
      if (articles[i].id == id) {
        // Replace with updated object
        articles[i].key_figures = figures
        articles[i].commentaries = commentaries
      }
    }
    this.props.onArticlesUpdated(articles)
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
    this.user_is_author = this.user_is_author.bind(this)
    this.got_article_details = this.got_article_details.bind(this)
    this.toggle_link = this.toggle_link.bind(this)
  }

  edit() {
    let {article} = this.props
    this.props.onEdit(article)
  }

  delete() {
    let {article} = this.props
    this.props.onDelete(article)
  }

  update_linkage(linked) {
    let { article, cookies, user_session } = this.props
    const author_slug = get(user_session, 'author.slug')
    if (author_slug != null) {
      // Update author to remove article_id from articles member
      let data = [
        {
          article: article.id,
          linked: linked
        }
      ]
      json_api_req('POST', `/api/authors/${author_slug}/articles/linkage/`, data, cookies.get('csrftoken'), () => {
        json_api_req('GET', `/api/articles/${article.id}/`, {}, null, (res) => {
          this.props.onUpdate(res)
        })
      })
    }
  }

  toggle_link() {
    if (this.user_is_author()) {
      this.update_linkage(false)
    } else {
      this.update_linkage(true)
    }
  }

  show_figure(figures, index) {
    this.props.onFigureClick(figures, index)
  }

  got_article_details(id, figures, commentaries) {
    this.props.onFetchedArticleDetails(id, figures, commentaries)
  }

  user_has_associated_author() {
    let { user_session } = this.props
    return (typeof user_session.author !== 'undefined')
  }

  user_is_author() {
    let { article, user_session } = this.props
    const user_author_id = get(user_session, 'author.id')
    return includes(article.authors, user_author_id)
  }

  editable() {
    // Show edit function if the user is an admin or the user is one of the authors
    return this.props.user_session.admin || this.user_is_author()
  }

  render() {
    let { article, classes, show_date } = this.props
    const admin = this.props.user_session.admin
    const editable = this.editable()
    const user_has_associated_author = this.user_has_associated_author()
    const user_is_author = this.user_is_author()

    const ST = {
      marginRight: 10
    }
    const DELETE_ST = {
      borderColor: 'red',
      color: 'red'
    }
    let article_ui_id = article.doi || article.id
    return (
      <div key={article.id} className="ArticleWithActions" id={article_ui_id}>
        <div className="Article">
          <ArticleLI article={article}
            admin={false}
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
        <div className="ArticleActions">
          <span hidden={!editable}>
            <span className="ActionButton">
              <Button variant="outlined" size="small" color="secondary" onClick={this.edit} style={ST}>
                <Icon className={classes.leftIcon}>edit</Icon>
                  Edit
              </Button>
            </span>
          </span>
          <span hidden={!user_has_associated_author}>
            <span className="ActionButton">
              <Button variant="outlined" size="small" color="secondary" onClick={this.toggle_link} style={ST}>
                <Icon className={classes.leftIcon}>{user_is_author ? 'link_off' : 'link'}</Icon>
                  {user_is_author ? 'Unlink' : 'Link'}
              </Button>
            </span>
          </span>
          <span hidden={!admin}>
            <span className="ActionButton">
              <Button variant="outlined" size="small" onClick={this.delete} style={DELETE_ST}>
                <Icon color="inherit" className={classes.leftIcon}>delete</Icon>
                  Delete
              </Button>
            </span>
          </span>
        </div>
      </div>
    )
  }
}

const StyledArticleWithActions = withCookies(withStyles(styles)(ArticleWithActions))

export default withRouter(withCookies(withStyles(styles)(ArticleList)));
