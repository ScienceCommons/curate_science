import React from 'react';

import PropTypes from 'prop-types';

import C from '../constants/constants';
import {truncate, get_link_source_icon} from '../util/util.jsx'
import { find, get } from 'lodash'

import MouseOverPopover from '../components/shared/MouseOverPopover.jsx';
import TruncatedText from './shared/TruncatedText.jsx';

import {Icon, Typography, Menu} from '@material-ui/core';


class TransparencyBadge extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };

        this.render_feature = this.render_feature.bind(this)
    }

  _basic_4_7_text(number_fields) {
    const { article } = this.props

    const basic_4_7_fields = [
      {
        title: 'Excluded data (subjects/observations)',
        text_field: 'excluded_data',
        in_article: 'excluded_data_all_details_reported',
      },
      {
        title: 'Experimental conditions',
        text_field: 'conditions',
        in_article: 'conditions_all_details_reported',
      },
      {
        title: 'Outcome measures',
        text_field: 'outcomes',
        in_article: 'outcomes_all_details_reported',
      },
      {
        title: 'Sample size determination',
        text_field: 'sample_size',
        in_article: 'sample_size_all_details_reported',
      },
      {
        title: 'Unreported analyses/Anayltic plans',
        text_field: 'analyses',
        in_article: 'analyses_all_details_reported',
      },
      {
        title: 'Unreported related studies',
        text_field: 'unreported_studies',
        in_article: 'unreported_studies_all_details_reported',
      },
      {
        title: 'Other disclosures',
        text_field: 'other_disclosures',
        in_article: 'other_disclosures_all_details_reported',
      },
    ]

    const fields = basic_4_7_fields.slice(0, number_fields)

    const text_rows = (
        fields.map(field => {
          return (
            <li key={field.text_field}>
              <strong>{field.title}: </strong>
              {
                article[field.in_article] ?
                'Full details reported in article.' :
                <TruncatedText text={article[field.text_field]} maxLength={160} fontSize={'0.75rem'}/>
              }
            </li>
          )
        })
    )

    const [year, month, day] = article.disclosure_date.split('-')
    const months = {
      1: 'January',
      2: 'February',
      3: 'March',
      4: 'April',
      5: 'May',
      6: 'June',
      7: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'December'
    }
    const date = `${months[Number(month)]} ${day}, ${year}`

    return (
      <div>
        <ol style={{paddingLeft: 16}}>
          {text_rows}
        </ol>
        <p style={{color: 'red'}}>Date of retroactive disclosure: {date}</p>
      </div>
    )
  }

  basic_4_text() {
    return this._basic_4_7_text(4)
  }

  basic_7_text() {
    return this._basic_4_7_text(7)
  }

  basic_4_at_submission_text() {
    const { article } = this.props
    const fields = [
      'Excluded data (subjects/observations)',
      'Experimental conditions',
      'Outcome measures',
      'Sample size determination',
    ]
    return (
      <ol style={{paddingLeft: 16}}>
        {
          fields.map(field => {
            return (
              <li key={`basic_4_at_submission_${field}`}>
                <strong>{field}:</strong> Full details reported in article.
              </li>
            )
          })
        }
      </ol>
    )

  }

  rep_std_popover_content(reporting_standards_type) {
    const { article } = this.props

    let rep_std_type = find(C.REPORTING_STANDARDS_TYPES, {value: reporting_standards_type})

    if (article.is_basic_4_retroactive) {
      rep_std_type = rep_std_type['basic_4']
    } else if (article.is_basic_7_retroactive) {
      rep_std_type = rep_std_type['basic_7']
    }

    let rep_std_link
    if (rep_std_type) {
      const rep_std_label = rep_std_type.label
      rep_std_link = <a href={rep_std_type.url} target="_blank">{rep_std_label}</a>
    } else {
      rep_std_link = '?'
    }
    const rep_std_icon = (
      <img
        src={`/sitestatic/icons/repstd.svg`}
        width={25}
        height={25}
        style={{paddingLeft: 2, paddingRight: 2, marginBottom: -8}}
        type="image/svg+xml"
      />
    )
    const subtitle = (
      <Typography variant="body1" style={{color: 'gray'}}>
        Article complies with the&nbsp;
        {rep_std_link}
        {rep_std_icon}
        reporting standard:
      </Typography>
    )

    let details
    if (article.is_basic_4_retroactive) {
      details = this.basic_4_text()
    } else if (article.is_basic_7_retroactive) {
      details = this.basic_7_text()
    } else if (reporting_standards_type === 'BASIC_4_AT_SUBMISSION') {
      details = this.basic_4_at_submission_text()
    } else if (rep_std_type) {
      details = (
        <ul style={{paddingLeft: 16}}>
          <li>
            <a href={rep_std_type.url} target="_blank">{rep_std_type.description}</a>
          </li>
        </ul>
      )
    } else {
      details = '?'
    }

    const popover_content = <Typography variant="body2" component="div">{details}</Typography>
    return { subtitle, popover_content }
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
      if (reporting_standards_type === 'BASIC_4_7_RETROACTIVE') {
        enabled = article.is_basic_4_retroactive || article.is_basic_7_retroactive
      } else {
        enabled = reporting_standards_type != null
      }
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

    if (nontransparent_materials || nontransparent_data) {
      label = `${f.label} not available`
      const nontransparent_reason = get(article, `${f.url_prop.toLowerCase()}_nontransparency_reason`)
      if (nontransparent_reason) {
        const nontransparency_obj = find(C.NONTRANSPARENCY_REASONS, ['value', nontransparent_reason])
        if (nontransparency_obj) {
          label += `: ${nontransparency_obj.label}`
        }
      }
      icon += "_nontransparent"
    } else if (!enabled) {
      label = `${f.label_long} is not (yet) available`
      icon += "_dis"
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
      const popover_details = this.rep_std_popover_content(reporting_standards_type)
      subtitle = popover_details.subtitle
      popover_content = popover_details.popover_content
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
