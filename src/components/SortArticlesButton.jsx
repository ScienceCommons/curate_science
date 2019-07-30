import React from 'react';
import { withRouter } from 'react-router-dom';

import { concat } from 'lodash'

import {
  Button,
  ClickAwayListener,
  Icon,
  MenuItem,
  MenuList,
  Paper,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import ArticleList from '../components/ArticleList.jsx';
import FilterChips from '../components/FilterChips.jsx';
import HomePageFilter from '../components/HomePageFilter.jsx';
import Loader from '../components/shared/Loader.jsx';


const styles = theme => ({
  menuRoot: {
    position: 'relative'
  },
  menu: {
    position: 'absolute',
    top: '4rem',
    left: 0,
    zIndex: 10,
  },
})

class SortBy extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menu_open: false,
    };

    this.sort_by_options = {
      created: 'Newest first',
      impact: 'Impact',
    }

    this.close_menu = this.close_menu.bind(this)
    this.handle_menu_click = this.handle_menu_click.bind(this)
    this.set_sort_by = this.set_sort_by.bind(this)
  }

  close_menu() {
    this.setState({ menu_open: false })
  }

  set_sort_by(value) {
    const { onSortByUpdate }  = this.props
    onSortByUpdate(value)
    this.close_menu()
  }

  handle_menu_click() {
    this.setState({ menu_open: !this.state.menu_open })
  }

  sorted_by() {
    const { sort_by } = this.props
    return this.sort_by_options[sort_by]
  }

  render() {
    let { menu_open } = this.state
    let { classes } = this.props
    const sorted_by = this.sorted_by()

    return (
      <div className={classes.menuRoot}>
        <ClickAwayListener onClickAway={this.close_menu}>
          <div>
            <Button
              onClick={this.handle_menu_click}
              size="large"
              style={{color: "#999"}}
            >
              <Icon>sort</Icon>
              Sort by { sorted_by ? <span>: { sorted_by }</span> : null }
            </Button>
              { menu_open ? (
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
          </div>
        </ClickAwayListener>
      </div>
    )
  }
}
export default withStyles(styles)(SortBy)
