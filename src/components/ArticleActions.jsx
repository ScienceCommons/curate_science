import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { Button, Icon } from '@material-ui/core';

import { get, includes } from 'lodash'

import { json_api_req, simple_api_req } from '../util/util.jsx'

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit
  },
})


class ArticleActions extends React.PureComponent {
  constructor(props) {
    super(props);

    this.edit = this.edit.bind(this)
    this.delete = this.delete.bind(this)
    this.user_is_author = this.user_is_author.bind(this)
    this.toggle_link = this.toggle_link.bind(this)
  }

  edit() {
    let {article} = this.props
    this.props.onEdit(article)
  }

  delete() {
    const { article, cookies, onDelete } = this.props
    simple_api_req('DELETE', `/api/articles/${article.id}/delete/`, {}, cookies.get('csrftoken'), () => {
      onDelete(article)
    }, (err) => {
      console.error(err)
    })
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
    let { article, classes } = this.props
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

    return (
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
    )
  }
}


export default withRouter(withCookies(withStyles(styles)(ArticleActions)));
