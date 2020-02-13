import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import { Button, Icon } from '@material-ui/core';

import { get, includes, isEmpty } from 'lodash'

import { json_api_req, simple_api_req } from '../util/util.jsx'

import { makeStyles } from '@material-ui/core/styles';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


const useStyles = makeStyles(theme => ({
  menuItem: {
    margin: 0,
    padding: 0,
  },
}));

export default function ArticleActions({ article, cookies, user_session, onDelete, onEdit, onUpdate }) {

  // Only show if user is logged in
  if (!(user_session && user_session.authenticated)) return null

  const classes = useStyles()

  const userAuthorID = get(user_session, 'author.id')
  const userIsAuthor = includes(article.authors, userAuthorID)
  const userIsAdmin = user_session.admin

  // Show edit link if `this.props.user_session.admin || this.user_is_author()`
  const showEdit = user_session.admin || userIsAuthor

  // Show Link/Unlink if the user has an associated author profile
  const userHasAuthor = (typeof user_session.author !== 'undefined')

  // Don't render the action menu if the user doesn't have an author page or isn't an admin
  if (!(userHasAuthor || userIsAdmin)) return null

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const deleteArticle = () => {
    simple_api_req('DELETE', `/api/articles/${article.id}/delete/`, {}, cookies.get('csrftoken'), () => {
      onDelete()
      handleClose()
    }, (err) => {
      console.error(err)
    })
  }

  const editArticle = () => {
    onEdit()
    handleClose()
  }

  const toggleLink = () => {
    const authorSlug = get(user_session, 'author.slug')
    if (!authorSlug) return

    const data = [
      {
        article: article.id,
        linked: !userIsAuthor
      }
    ]
    json_api_req('POST', `/api/authors/${authorSlug}/articles/linkage/`, data, cookies.get('csrftoken'), () => {
      json_api_req('GET', `/api/articles/${article.id}/`, {}, null, (res) => {
        onUpdate(res)
      })
    })
  }

  const ActionButton = ({ icon, title, color }) => {
    color = color || 'secondary'
    return (
      <Button
        variant="outlined"
        size="small"
        color={color}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          padding: '0.5rem 0.5rem',
          border: 'none',
        }}
      >
        <Icon>{icon}</Icon>
        <span style={{ marginLeft: '0.5rem' }}>
          {title}
        </span>
      </Button>
    )
  }

  return (
    <div style={{marginLeft: '1rem'}}>
      <Button
        aria-controls="article-actions"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ padding: '4px 0', minWidth: 0, color: '#CCC' }}
      >
        <Icon>more_horiz</Icon>
      </Button>
      <Menu
        id="article-actions"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{ padding: 0 }}
      >
        { showEdit ?
          <MenuItem onClick={editArticle} className={classes.menuItem}>
            <ActionButton icon="edit" title="Edit"/>
          </MenuItem>
          : null
        }
        { userHasAuthor ?
          <MenuItem onClick={toggleLink} className={classes.menuItem}>
            <ActionButton
              icon={userIsAuthor ? 'link_off' : 'link' }
              title={userIsAuthor ? 'Unlink' : 'Link' }
            />
          </MenuItem>
          : null
        }
        { userIsAdmin ?
          <MenuItem onClick={deleteArticle} className={classes.menuItem} style={{ color: 'red' }}>
            <ActionButton icon="delete" title="Delete" color="inherit"/>
          </MenuItem>
          : null
        }
      </Menu>
    </div>
  )
}

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing(1)
  },
})
