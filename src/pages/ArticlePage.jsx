import React from 'react';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';

import ArticleActions from '../components/ArticleActions.jsx';
import ArticleEditor from '../components/ArticleEditor.jsx';
import ArticleContent from '../components/ArticleContent.jsx';
import Loader from '../components/shared/Loader.jsx';

import C from '../constants/constants';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

import { json_api_req, simple_api_req } from '../util/util.jsx'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';


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


class ArticlePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      article: null,
      loading: true,
      edit_article_modal_open: false,
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
  }

  componentDidMount() {
    this.fetch_article()
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

  show_figure(figures, index) {
    // Currently shows only one at a time
    this.setState({gallery_images: figures.map((fig) => fig.image), gallery_index: index, gallery_showing: true})
  }

  render() {
    const { classes, show_date, user_session} = this.props
    const {
      article,
      edit_article_modal_open,
      editing_article_id,
      loading,
      view_figure_thumb,
      view_figure_full,
      gallery_showing,
      gallery_images,
      gallery_index,
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
        { loading ?
        <Loader />
          :
            <div className="ArticleWithActions">
              <div className="Article">

                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <ArticleContent
                      article={article}
                      onFigureClick={this.show_figure}
                      is_article_page={true}
                    />
                  </CardContent>
                </Card>
              </div>

              <ArticleActions
                article={article}
                user_session={user_session}
                onDelete={this.handle_delete}
                onEdit={this.handle_edit}
                onUpdate={this.article_updated}
              />

              { gallery }

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

export default withRouter(withCookies(withStyles(styles)(ArticlePage)))
