import React from 'react';
import C from '../constants/constants';


class TransparencyBadge extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };

        this.render_feature = this.render_feature.bind(this)
    }

	render_feature(f) {
		let {active, icon_size} = this.props
		let enabled = active.indexOf(f.id) > -1
		let icon = f.icon
		if (!enabled) icon += "_dis"
		return <object key={f.icon}
					   data={`/sitestatic/icons/${icon}.svg`}
					   width={icon_size}
					   height={icon_size}
					   type="image/svg+xml" />
	}

	render() {
		return C.BADGE_FEATURES.map(this.render_feature)
	}
}

TransparencyBadge.defaultProps = {
	active: [], // List of ids
	icon_size: 30
};

export default TransparencyBadge;