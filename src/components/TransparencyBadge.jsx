import React from 'react';

import PropTypes from 'prop-types';

import C from '../constants/constants';
import {truncate, get_link_source_icon} from '../util/util.jsx'
import { find, get } from 'lodash'

import MouseOverPopover from '../components/shared/MouseOverPopover.jsx';

import {Icon, Typography, Menu} from '@material-ui/core';


class TransparencyBadge extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };

        this.render_feature = this.render_feature.bind(this)
    }

	render_feature(f, i) {
    let {article, icon_size, reporting_standards_type, prereg_protocol_type, classes, article_type} = this.props
    let repstd = f.id == 'REPSTD'
    let urls, subtitle
    let enabled = false

    if (f.url_prop != null) {
      // Filter relevant transparency URLs
      urls = this.props.transparency_urls.filter((url) => {
        return url.transparency_type === f.url_prop
      })
    }

    let reporting_standards = []
    // Collect this feature's transparencies across all studies
    let n = 0
    if (repstd) {
      enabled = reporting_standards_type != null
    } else {
      enabled = urls.length > 0
    }
    let label = ''
    let icon = f.icon

    const nontransparent_materials = (
      f.url_prop === 'MATERIALS' && article.materials_nontransparency_reason
    )
    const nontransparent_data = (
      f.url_prop === 'DATA' && article.data_nontransparency_reason
    )

    if (!enabled) {
      label = `${f.label_long} is not (yet) available`
      icon += "_dis"
    } else if (nontransparent_materials || nontransparent_data) {
      label = `${f.label} not available`
      const nontransparent_reason = get(article, `${f.url_prop.toLowerCase()}_nontransparency_reason`)
      if (nontransparent_reason) {
        const nontransparency_obj = find(C.NONTRANSPARENCY_REASONS, ['value', nontransparent_reason])
        if (nontransparency_obj) {
          label += `: ${nontransparency_obj.label}`
        }
      }
      icon += "_nontransparent"
    }

    // Define a function that returns the badge icon
    // We set a title only if there is no popover, otherwise the popover handles that info
    function badge_icon(title) {
      return (
        <img
          key={`badgeicon-${i}`}
          src={`/sitestatic/icons/${icon}.svg`}
          title={title}
          width={icon_size}
          height={icon_size}
          type="image/svg+xml"
        />
      )
    }

    if (!enabled || nontransparent_data || nontransparent_materials) {
      // If article type calls for transparencies to be bonuses, dont render disabled badges
      let tbonus = find(C.ARTICLE_TYPES, {id: article_type}).transparencies_bonus
      return tbonus ? null : badge_icon(label)
    }

    let popover_content
    if (repstd) {
      let rep_std_type = find(C.REPORTING_STANDARDS_TYPES, {value: reporting_standards_type})
      let rep_std_label = rep_std_type == null ? '?' : rep_std_type.label
      popover_content = <Typography variant="body2">{ rep_std_label }</Typography>
    } else {

      if (urls.length) {
        // Add source icons to URLs
        urls.forEach(url => {
          const source_icon_url = get_link_source_icon(url.url)
          if (source_icon_url != null) {
            url.source_icon = <img src={source_icon_url} width="13" style={{marginRight: 4}} />
          }
        })

        popover_content = urls.map(url =>
          <Typography variant="body2" key={`transparency-url-${url.id}`} style={{ whiteSpace: 'nowrap' }}>
            { url.source_icon }
            <a href={url.url} target="_blank">{ truncate(url.url, 15) } <Icon fontSize="inherit">open_in_new</Icon></a>
            { url.protected_access ? ' (protected access; login required)' : null }
          </Typography>
        )

        if (f.id === 'PREREG') {
          let ppt = find(C.PREREG_PROTOCOL_TYPES, {value: prereg_protocol_type})
          let display_label = ppt == null ? '' : ppt.label_detail || ppt.label || ''
          if (ppt != null) {
            subtitle = <Typography variant="body2" style={{color: 'gray', fontStyle: 'italic'}}>{ display_label }</Typography>
          }
        }
      }

      return (
        <MouseOverPopover target={badge_icon()} key={`mouseover-${i}`}>
          <div style={{padding: 10}}>
            <Typography variant="h5">{ f.label }</Typography>
            { subtitle }
            { popover_content }
          </div>
        </MouseOverPopover>
      )
    }
  }

	relevant_badges() {
		let {article_type} = this.props
		return C.TRANSPARENCY_BADGES.filter((tb) => {
			return tb.article_types.includes(article_type)
		})
	}

	render_commentaries() {
		return (
			<ul>
			{ this.props.commentaries.map((comm, i) => {
				return <li key={i}><Typography variant="body2"><a href={comm.commentary_url} target="_blank">{ comm.authors_year }</a></Typography></li>
			}) }
			</ul>
		)
	}

	render() {
		let {commentaries} = this.props
		let commentary_el, commentary_popover
		if (commentaries.length > 0) {
			commentary_el = <span className="ArticleBadgeWithCount ArticleCommentaryBadge">Commentaries <span className="Count">{ commentaries.length }</span></span>
			commentary_popover = (
				<MouseOverPopover target={commentary_el} key='commentary'>
					<div style={{padding: 10}}>
						<Typography variant="h5">Commentaries about this article:</Typography>
						{ this.render_commentaries() }
					</div>
				</MouseOverPopover>
			)
		}
		let badges = []
		this.relevant_badges().forEach((b, i) => {
			let badge_rendered = this.render_feature(b, i)
			if (badge_rendered != null) badges.push(badge_rendered)
		})
		if (badges.length == 0) return null
		else return (
			<div>
				<span style={{marginRight: 10}}>{ badges }</span>
				{ commentary_popover }
			</div>
		)
	}
}

TransparencyBadge.propTypes = {
	transparencies: PropTypes.array,
	article_type: PropTypes.string,
	reporting_standards_type: PropTypes.string,
  original_article_url: PropTypes.string,
  prereg_protocol_type: PropTypes.string,
  commentaries: PropTypes.array,
  transparency_urls: PropTypes.array,
}



TransparencyBadge.defaultProps = {
  article: {},
  reporting_standards_type: null,
  article_type: "ORIGINAL",
  icon_size: 30,
  original_article_url: null,
  prereg_protocol_type: null,
  commentaries: [],
  transparency_urls: [],
};

export default TransparencyBadge;
