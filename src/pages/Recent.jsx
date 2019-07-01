import React from 'react';
import { withRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';

import ArticleList from '../components/ArticleList.jsx';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      searched: false
    };

    this.update_articles = this.update_articles.bind(this)
  }

  componentDidMount() {
    this.fetch_recent_articles()
  }

  fetch_recent_articles() {
    fetch(`/api/articles/`).then(res => res.json()).then((res) => {
      this.setState({ articles: res })
    })
  }

  update_articles(articles) {
    this.setState({ articles: articles })
  }

  render() {
    let {articles, searched} = this.state
    return (
      <Grid container justify="center">
        <Grid>
          <ArticleList
            articles={articles}
            onArticlesUpdated={this.update_articles}
            user_session={this.props.user_session}
          />
          </Grid>
        </Grid>
    )
  }
}

export default withRouter(Home);
