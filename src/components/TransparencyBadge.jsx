import React from 'react';

import PropTypes from 'prop-types';

import C from '../constants/constants';


class TransparencyBadge extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };

        this.render_feature = this.render_feature.bind(this)
    }

	render_feature(f) {
		let {transparencies, icon_size} = this.props
		let tdata = transparencies.filter(t => t.transparency_type.toUpperCase() == f.id.toUpperCase())
		let enabled = tdata.length > 0
		let url, label = ''
		let icon = f.icon
		if (enabled) {
			url = tdata[0].url
		} else {
			label = `${f.label} not available`
			icon += "_dis"
		}
		return <a href={url} title={label} key={icon} target="_blank">
					<img
					   src={`/sitestatic/icons/${icon}.svg`}
					   width={icon_size}
					   height={icon_size}
					   type="image/svg+xml" />
			   </a>
	}

	relevant_badges() {
		let {article_type} = this.props
		return C.TRANSPARENCY_BADGES.filter((tb) => {
			return tb.article_types.includes(article_type)
		})
	}

	render() {
		return this.relevant_badges().map(this.render_feature)
	}
}

TransparencyBadge.propTypes = {
	transparencies: PropTypes.array,
	article_type: PropTypes.string.required
}

TransparencyBadge.defaultProps = {
	transparencies: [], // List of objects (see Transparency serializer)
	article_type: "ORIGINAL",
	icon_size: 30
};

export default TransparencyBadge;