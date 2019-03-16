import React from 'react';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const CLOSE_DELAY = 1000

const styles = theme => ({
  popover: {

  },
  paper: {
    padding: theme.spacing.unit,
  },
  contentDiv: {

  }
});

class MouseOverPopover extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    }

    this.interval_id = null
    this.mouseOverPopover = this.mouseOverPopover.bind(this)
    this.schedulePopoverClose = this.schedulePopoverClose.bind(this)
  }

  handlePopoverOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  schedulePopoverClose() {
    this.interval_id = window.setTimeout(() => {
      this.handlePopoverClose()
    }, CLOSE_DELAY)
  }

  mouseOverPopover() {
    if (this.interval_id != null) {
      window.clearTimeout(this.interval_id)
      this.interval_id = null
    }
  }

  handlePopoverClose = () => {
    this.setState({ anchorEl: null })
  };

  render() {
    const { classes, target } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <span>
        <span
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseMove={this.handlePopoverOpen}
          onMouseLeave={this.schedulePopoverClose}
        >
          { target }
        </span>
        <Popover
          id="mouse-over-popover"
          className={classes.popover}
          classes={{
            paper: classes.paper,
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={this.handlePopoverClose}
          disableRestoreFocus
        >
          <div onMouseEnter={this.mouseOverPopover} onMouseLeave={this.handlePopoverClose} className={classes.contentDiv}>
          { this.props.children }
          </div>
        </Popover>
      </span>
    );
  }
}

MouseOverPopover.propTypes = {
  classes: PropTypes.object.isRequired,
  target: PropTypes.element
};

export default withStyles(styles)(MouseOverPopover);