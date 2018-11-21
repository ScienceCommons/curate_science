import React from 'react';
import PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const CLOSE_DELAY = 2000

const styles = theme => ({
  popover: {
  },
  paper: {
    padding: theme.spacing.unit,
  },
});

class MouseOverPopover extends React.Component {
  state = {
    anchorEl: null,
  };

  handlePopoverOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handlePopoverClose = () => {
    console.log("Closing")
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
          onMouseEnter={this.handlePopoverOpen}
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
          useLayerForClickAway={false}
        >
          <div onMouseLeave={this.handlePopoverClose}>
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