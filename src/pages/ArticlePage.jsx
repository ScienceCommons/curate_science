import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import ArticleActions from '../components/ArticleActions.jsx';
import ArticleEditor from '../components/ArticleEditor.jsx';
import ArticleContent from '../components/ArticleContent.jsx';
import Loader from '../components/shared/Loader.jsx';
import { is_url_valid } from '../components/ViewEmbeddedContentButton.jsx'
import { ViewURL } from '../components/EmbeddedViewer.jsx';

import C from '../constants/constants';

import { json_api_req, simple_api_req } from '../util/util.jsx'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
const styles = theme => ({
  root: {
    paddingTop: 20,
    width: C.COL_WIDTH,
    margin: '0 auto',
  },
  card: {
    marginBottom: theme.spacing(1)
  },
  cardContent: {
    padding: theme.spacing(1.5)
  },
})

// prepare HOC to apply ViewURL hook in the class component
const withViewURL = (Component) => {
  function WrappedComponent(props) {
    let view_url = ViewURL.useContainer()
    return <Component view_url={view_url} {...props} />
  }
  return WrappedComponent
}

const withMediaQuery = (...args) => Component => props => {
  const mediaQuery = useMediaQuery(...args);
  return <Component media_query={mediaQuery} {...props} />;
}

class ArticlePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      article: null,
      loading: true,
      edit_article_modal_open: false,
      flscreen_on_load: true,
    }

    this.open_article_editor = this.toggle_article_editor.bind(this, true)
    this.close_article_editor = this.toggle_article_editor.bind(this, false)
    this.handle_edit = this.handle_edit.bind(this)
    this.handle_delete = this.handle_delete.bind(this)
    this.article_updated = this.article_updated.bind(this)
  }

  componentDidMount() {
    this.fetch_article()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.match.params.id !== prevState.current_id){
          const current_id = nextProps.match.params.id
          return { current_id }
      }
      return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.id !== this.state.current_id) {
      this.fetch_article()
    }
    if (this.state.flscreen_on_load) {
      this.load_flscreen()
    }
  }

  fetch_article() {
    const article_id = this.props.match.params.id
    this.setState({loading: true}, () => {
      json_api_req('GET', `/api/articles/${article_id}/`, {}, null, (res) => {
        this.setState({ article: res, loading: false })
      }, (err) => {
        this.setState({loading: false})
      })
    })
  }

  handle_delete(a) {
    alert('deleted! maybe redirect to homepage?')
  }

  handle_edit() {
    const article = this.state.article
    this.setState({editing_article_id: article.id, edit_article_modal_open: true, loading: false})
  }

  article_updated(article) {
    this.setState({ article, edit_article_modal_open: false, editing_article_id: null })
  }

  toggle_article_editor(open) {
    this.setState({ edit_article_modal_open: open })
    if (!open) {
      this.setState({ editing_article_id: null })
    }
  }

  load_flscreen() {
    const view_url = this.props.view_url
    const pdf_url = this.state.article.pdf_url
    const html_url = this.state.article.html_url
    const preprint_url = this.state.article.preprint_url
    if (!this.props.media_query) {
      if (is_url_valid(html_url, 'html')) {
        view_url.update_url(html_url)
      }

      else if (is_url_valid(pdf_url, 'pdf') && !is_url_valid(html_url)) {
        view_url.update_url(pdf_url) 
      }

      else if (is_url_valid(preprint_url, 'preprint') && !is_url_valid(html_url, 'html') && !is_url_valid(pdf_url, 'pdf')) {
        view_url.update_url(preprint_url) 
      }

      else {
        return null
      } 
    }

    else {
      null
    }
  this.setState({flscreen_on_load: false})    
}

  render() {
    const { classes, show_date, user_session} = this.props
    const {
      article,
      edit_article_modal_open,
      editing_article_id,
      loading,
    } = this.state

    return (
      <div className={classes.root}>
        { loading ?
        <Loader />
          :
            <div className="ArticleWithActions">
              <div className="Article">
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <ArticleContent
                      article={article}
                      is_article_page={true}
                      user_session={user_session}
                      onDelete={this.handle_delete}
                      onEdit={this.handle_edit}
                      onUpdate={this.article_updated}
                    />
                  </CardContent>
                </Card>
              </div>

              <ArticleEditor
                article_id={editing_article_id}
                open={edit_article_modal_open}
                onUpdate={this.article_updated}
                onClose={this.close_article_editor}
              />
            </div>

        }
      </div>
    )
  }
}

export default withMediaQuery('(max-width:1499px)')(withViewURL(withRouter(withCookies(withStyles(styles)(ArticlePage)))))
