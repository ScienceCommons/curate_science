import React from 'react';
import PropTypes from 'prop-types';
import {Tooltip, Popover} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const CLOSE_DELAY = 1000

const styles = theme => ({
  tooltip: {
    backgroundColor: 'white',
    color: 'black',
    boxShadow: theme.shadows[1],
    maxWidth: 450,
  },
  popper: {
    opacity: 1.0
  },
  tooltipPlacementTop: {
    margin: '2px 0'
  },
  contentDiv: {

  }
});

class MouseOverPopover extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }


  render() {
    let { classes, target } = this.props;
    const { anchorEl } = this.state;
    const popperProps = {}
    let content_fragment = (
      <React.Fragment>
        <div className={classes.contentDiv}>
          { this.props.children }
        </div>
      </React.Fragment>
    )
    const cls = {
      tooltip: classes.tooltip,
      popper: classes.popper,
      tooltipPlacementTop: classes.tooltipPlacementTop
    }
    return (
      <span>
        <Tooltip
          interactive
          placement="top"
          enterDelay={250}
          leaveDelay={100}
          classes={cls}
          PopperProps={popperProps}
          title={content_fragment}>
        { target }
        </Tooltip>
      </span>
    );
  }
}

MouseOverPopover.propTypes = {
  classes: PropTypes.object.isRequired,
  target: PropTypes.element
};

export default withStyles(styles)(MouseOverPopover);
