import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { Button, Grid, Icon, IconButton } from '@material-ui/core';

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
    this.unlink = this.unlink.bind(this)
    this.link_existing_article = this.link_existing_article.bind(this)
    this.article_updated = this.article_updated.bind(this)
    this.show_figure = this.show_figure.bind(this)
    this.got_article_details = this.got_article_details.bind(this)
  }

  editable() {
    // Show edit functions if admin or user-owned author page
    let {user_session} = this.props
    let {author} = this.state
    let admin = user_session.admin
    let me = author != null && user_session.author != null && user_session.author.id == author.id
    return admin || me
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

  update_linkage(a, linked) {
    let {articles, cookies} = this.props
    let {author} = this.state
    if (author != null) {
      // Update author to remove article_id from articles member
      let data = [
        {
          article: a.id,
          linked: linked
        }
      ]
      json_api_req('POST', `/api/authors/${this.slug()}/articles/linkage/`, data, cookies.get('csrftoken'), (res) => {
        if (linked) {
          // Get full article object to add to list
          json_api_req('GET', `/api/articles/${a.id}/`, {}, null, (res) => {
            articles.unshift(res) // Add object to array
            this.props.onArticlesUpdated(articles)
          }, (err) => {
            console.error(err)
          })
        } else {
          // Remove unlinked from list
          articles = articles.filter(article => article.id != a.id)
          this.props.onArticlesUpdated(articles)
        }
      })
    }
  }

  unlink(a) {
    this.update_linkage(a, false)
  }

  link_existing_article(a) {
    this.update_linkage(a, true)
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
    let {articles, classes, user_session} = this.props
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
    let editable = this.editable()

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
                  editable={editable}
                  onEdit={this.handle_edit}
                  onDelete={this.handle_delete}
                  onUnlink={this.unlink}
                  onFigureClick={this.show_figure}
                  onFetchedArticleDetails={this.got_article_details}
                  admin={user_session.admin}
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
    this.unlink = this.unlink.bind(this)
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

  unlink() {
    let {article} = this.props
    this.props.onUnlink(article)
  }

  show_figure(figures, index) {
    this.props.onFigureClick(figures, index)
  }

  got_article_details(id, figures, commentaries) {
    this.props.onFetchedArticleDetails(id, figures, commentaries)
  }

  render() {
    let {article, admin, editable, classes} = this.props
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
            onFigureClick={this.show_figure} />
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
            <span className="ActionButton">
              <Button variant="outlined" size="small" color="secondary" onClick={this.unlink} style={ST}>
                <Icon className={classes.leftIcon}>link_off</Icon>
                  Unlink
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

ArticleWithActions.defaultProps = {
    editable: false
}

const StyledArticleWithActions = withStyles(styles)(ArticleWithActions)

export default withRouter(withCookies(withStyles(styles)(ArticleList)));
