import React from 'react';
import { withRouter } from 'react-router-dom';

import {
  Button,
  ClickAwayListener,
  Grid,
  Icon,
  MenuItem,
  MenuList,
  Paper,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import ArticleList from '../components/ArticleList.jsx';

const styles = theme => ({
  menuButton: {
    position: 'relative'
  },
  menu: {
    position: 'absolute',
    top: '4rem',
    left: 0,
    zIndex: 10,
  },
})

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      searched: false,
      sort_by: 'created',
      sort_by_menu_open: false,
    };

    this.sort_by_options = {
      created: 'Newest first',
      impact: 'Impact',
    }

    this.close_sort_by_menu = this.close_sort_by_menu.bind(this)
    this.handle_sort_by_menu_click = this.handle_sort_by_menu_click.bind(this)
    this.set_sort_by = this.set_sort_by.bind(this)
    this.update_articles = this.update_articles.bind(this)
  }

  componentDidMount() {
    this.fetch_articles()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.sort_by !== this.state.sort_by) {
      this.fetch_articles()
    }
  }

  articles_url() {
    let url = '/api/articles/'
    const { sort_by } = this.state
    return url + `?ordering=${sort_by}`
  }

  fetch_articles() {
    const url = this.articles_url()
    fetch(url).then(res => res.json()).then((res) => {
      this.setState({ articles: res })
    })
  }

  close_sort_by_menu() {
    this.setState({ sort_by_menu_open: false })
  }

  handle_sort_by_menu_click(event) {
    this.setState({ sort_by_menu_open: !this.state.sort_by_menu_open })
  }

  sorted_by() {
    const { sort_by } = this.state
    return this.sort_by_options[sort_by]
  }

  set_sort_by(value) {
    this.setState({ sort_by: value })
  }

  update_articles(articles) {
    this.setState({ articles: articles })
  }

  render() {
    let { articles, searched, sort_by_menu_open } = this.state
    let { classes } = this.props
    const sorted_by = this.sorted_by()

    return (
      <Grid container justify="center">
        <Grid>
          <ClickAwayListener onClickAway={this.close_sort_by_menu}>
            <div>
              { this.articles_url() }
              <Button
                className={classes.MenuButton}
                onClick={this.handle_sort_by_menu_click}
                size="large"
              >
                <Icon>sort</Icon>
                Sort by: { sorted_by }
                { sort_by_menu_open ? (
                  <Paper className={classes.menu}>
                    <MenuList>
                        {
                          Object.keys(this.sort_by_options).map(value => 
                            <MenuItem onClick={this.set_sort_by.bind(this, value)} key={value}>
                              {this.sort_by_options[value]}
                            </MenuItem>
                          )
                        }
                    </MenuList>
                  </Paper>
                ) : null}
              </Button>
            </div>
          </ClickAwayListener>
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

export default withRouter(withStyles(styles)(Home));
