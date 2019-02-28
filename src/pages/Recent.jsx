import React from 'react';
import { withRouter } from 'react-router-dom';

class Home extends React.Component {
	constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

	render() {
    const st = {
      border: 0,
      margin: 0
    }
		return (
			<div>

        <iframe src="/sitestatic/legacy/recent.html" width="100%" height="1000px" style={st} />

      </div>
    )
	}
}

export default withRouter(Home);