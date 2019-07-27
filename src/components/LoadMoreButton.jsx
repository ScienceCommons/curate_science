import React from 'react';

import {
  Button,
  CircularProgress,
  Icon,
} from '@material-ui/core';


class LoadMoreButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.load_more = this.load_more.bind(this)
  }

  load_more() {
    this.setState({ loading: true })
    this.props.load_more()
      .then(() => {
        this.setState({ loading: false })
      })
  }

  render() {
    const loading = this.state.loading
    const all_loaded_text = this.props.all_loaded_text || 'All loaded'

    if (this.props.more_available) {
      return (
        <Button onClick={this.load_more} disabled={loading} style={{position: 'relative'}}>
          <Icon>keyboard_arrow_down</Icon>
          Show More
          {
            loading &&
            <CircularProgress
              size={24}
              style={{position: 'absolute', top: '50%', left: '50%', marginTop: -12, marginLeft: -12}}
            />
          }
        </Button>
      )
    } 
    return <Button disabled>{all_loaded_text}</Button>
  }
}

export default LoadMoreButton;
