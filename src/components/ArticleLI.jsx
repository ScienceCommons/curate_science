import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import ArticleContent from './ArticleContent.jsx';

const styles = {
  card: {
    minWidth: 275,
    marginBottom: '9px'
  },
  cardContent: {
    padding: 12,
    paddingTop: 0,
  },
};

class ArticleLI extends React.Component {
  constructor(props) {
    super(props);
  }

	render() {
    let { article, classes, show_date } = this.props;

    const CC_ST = {paddingBottom: 12} // Fix for .MuiCardContent-root-325:last-child adding 24px padding-bottom

		return (
			<div className="ArticleCard">
				<Card className={classes.card} raised>
					<CardContent className={classes.cardContent} style={CC_ST}>
            <ArticleContent
              article={article}
              onFetchedArticleDetails={this.props.onFetchedArticleDetails}
              onFigureClick={this.props.onFigureClick}
              show_date={show_date}
            />
	  			</CardContent>
				</Card>
			</div>
		)
	}
}

ArticleLI.defaultProps = {
	article: {}
};

ArticleLI.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ArticleLI);
