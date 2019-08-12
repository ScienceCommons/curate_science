import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { pick } from 'lodash'

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

import ArticleFullTextLinks from './ArticleFullTextLinks.jsx';
import ArticleKeywords from './ArticleKeywords.jsx';
import ArticleType from './ArticleType.jsx';
import AuthorList from './AuthorList.jsx';
import FigureList from './shared/FigureList.jsx';
import JournalDOIBadge from './JournalDOIBadge.jsx';
import TransparencyBadge from './TransparencyBadge.jsx';
import TruncatedText from './shared/TruncatedText.jsx';

import { json_api_req } from '../util/util.jsx'

const styles = {
  createdDate: {
    fontStyle: 'italic',
    textAlign: 'right',
  },
  title: {
    fontSize: 18,
    lineHeight: '20px',
    fontWeight: 400,
    paddingTop: 0,
    marginTop: 0,
    marginBottom: 3
  },
  titleLink: {
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  authors: {
    color: "#009933",
    marginTop: 3,
    marginBottom: 3,
    lineHeight: 1.24
  },
  abstract: {
    lineHeight: 1.2,
    marginBottom: 10
  },
  journal: {
    fontStyle: 'italic'
  },
  grayedTitle: {
    color: '#BBB',
    fontWeight: 'bold',
    marginRight: 5
  },
  grayedDetails: {
    color: '#BBB'
  },
  reviewers: {
    color: "#009933",
    marginRight: 4
  },
  moreIconHolder: {
    position: 'relative',
    height: 36,
    marginTop: '-15px',
    marginBottom: '5px',
    pointerEvents: 'none' // Prevent interference with transparency popups
  },
  moreIconButton: {
    display: 'block',
    position: 'absolute',
    left: '50%',
    marginLeft: '-24px', // Icon width 36/2 + 6px padding = 24
    padding: 6,
    pointerEvents: 'auto'
  },
  moreIcon: {
    fontSizeLarge: 32
  }
};

class ArticleContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      show_more: false,
      loading: false,
    };

    this.toggle_show_more = this.toggle_show_more.bind(this)
    this.handle_figure_click = this.handle_figure_click.bind(this)
  }

  toggle_show_more() {
    let {show_more} = this.state
    let {article} = this.props
    let details_fetched = article.key_figures != null
    this.setState({show_more: !show_more}, () => {
      if (!details_fetched) {
        this.fetch_article_details()
      }
    })
  }

  fetch_article_details() {
    let {article} = this.props
    let {figures, commentaries} = this.state
    console.log("Fetching article details...")
    this.setState({loading: true}, () => {
      json_api_req('GET', `/api/articles/${article.id}/`, {}, null, (res) => {
        if (res.key_figures != null) figures = res.key_figures
        if (res.commentaries != null) commentaries = res.commentaries
        console.log(res)
        this.props.onFetchedArticleDetails(article.id, figures, commentaries)
        this.setState({loading: false})
      }, (err) => {
        this.setState({loading: false})
      })
    })
  }

  handle_figure_click(figures, idx) {
    this.props.onFigureClick(figures, idx)
  }

  empty(text) {
    return text == null || text.length == 0
  }

  created_at() {
    const created = this.props.article.created

    if (!created) {
      return '-'
    }

    const date = new Date(created)
    const months = {
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December'
    }

    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `Added ${month} ${day}, ${year}`
  }

	render() {
		const { loading, show_more } = this.state
    const { article, classes, is_article_page, show_date } = this.props;
    const is_expanded = show_more || is_article_page

    const content_links = pick(article, [
      'pdf_url',
      'pdf_downloads',
      'pdf_citations',
      'pdf_views',
      'html_url',
      'html_views',
      'preprint_url',
      'preprint_views',
      'preprint_downloads',
      'updated'
    ])

    const transparency_data = pick(article, [
      'article_type',
      'prereg_protocol_type',
      'reporting_standards_type',
      'commentaries',
      'transparency_urls',
    ])

    const show_figures = article.key_figures || []

    const rd = pick(article, [
      'number_of_reps',
      'original_study',
      'target_effects',
      'original_article_url'
    ])

    const created_at = this.created_at()
    const title = (
          <Typography className={classes.title} variant="h2" color="textPrimary">
              {article.title}
          </Typography>
    )

		return (
			<div>
        <ArticleFullTextLinks {...content_links} />

        {
          is_article_page ?
          <span>{title}</span>
          :
          <Link to={`/article/${article.id}`} className={classes.titleLink}>
            {title}
          </Link>
        }

        <Typography className={classes.authors} color="textSecondary" gutterBottom>
          <AuthorList author_list={article.author_list} year={article.year} in_press={article.in_press} />
        </Typography>

        <Typography className={classes.journal} color="textSecondary" gutterBottom>
          <JournalDOIBadge journal={article.journal} doi={article.doi} />
        </Typography>

        <ArticleType type={article.article_type} replication_data={rd} registered_report={article.prereg_protocol_type == 'REGISTERED_REPORT'} />

        <TransparencyBadge {...transparency_data} />

        <div className={classes.moreIconHolder} hidden={is_article_page}>
          <IconButton onClick={this.toggle_show_more} className={classes.moreIconButton}>
            <Icon className={classes.moreIcon} fontSize="large">{show_more ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</Icon>
          </IconButton>
        </div>

        <div id="details" hidden={!is_expanded}>
          <Typography className={classes.abstract}>
            { is_article_page ?
              <span>{article.abstract}</span>
              :
              <TruncatedText text={article.abstract} maxLength={540} fontSize={12} />
            }
          </Typography>
          <ArticleKeywords keywords={article.keywords} />
          <FigureList figures={show_figures} loading={loading} onFigureClick={this.handle_figure_click} />
          <div hidden={this.empty(article.author_contributions)}>
            <Typography component="span">
              <span className={classes.grayedTitle}>Author contributions:</span>
              <span className={classes.grayedDetails}><TruncatedText text={ article.author_contributions } maxLength={85} /></span>
            </Typography>
          </div>
          <div hidden={this.empty(article.competing_interests)}>
            <Typography component="span">
              <span className={classes.grayedTitle}>Competing interests:</span>
              <span className={classes.grayedDetails}><TruncatedText text={ article.competing_interests } maxLength={85} /></span>
            </Typography>
          </div>
          <div hidden={this.empty(article.funding_sources)}>
            <Typography component="span">
              <span className={classes.grayedTitle}>Funding sources:</span>
              <span className={classes.grayedDetails}><TruncatedText text={ article.funding_sources } maxLength={85} /></span>
            </Typography>
          </div>
          <Typography component="span" inline>
            <span hidden={this.empty(article.peer_review_editor)}>
              <span className={classes.grayedTitle}>Editor:</span>
              <span className={classes.reviewers}>{ article.peer_review_editor || '--' }</span>
            </span>
            <span hidden={this.empty(article.peer_reviewers)}>
              <span className={classes.grayedTitle}>Reviewers:</span>
              <span className={classes.reviewers}>{ article.peer_reviewers || '--' }</span>
            </span>
            <span hidden={article.peer_review_url == null || article.peer_review_url.length == 0}>
              <a href={article.peer_review_url} target="_blank"><Icon fontSize="inherit">link</Icon> Open peer review <Icon fontSize="inherit">open_in_new</Icon></a>
            </span>
          </Typography>
        </div>

        <div hidden={!show_date}>
          <Typography className={classes.createdDate} component='div' color="textSecondary">
            {created_at}
          </Typography>
        </div>

			</div>
		)
	}
}

ArticleContent.defaultProps = {
	article: {}
};

ArticleContent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ArticleContent);
