import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';


const styles = theme => ({
  authorDetails: {
    '& p': { marginBottom: theme.spacing.unit, marginTop: 0 },
    color: theme.typography.body1.color
  },
  card: {
    minWidth: 275,
    marginBottom: '9px'
  },
  cardContent: {
    padding: 12
  },
  numberOfArticles: {
    color: '#999999'
  },
});

class AuthorCard extends React.PureComponent {
  constructor(props) {
    super(props);
  }

	render() {
    const { author, classes } = this.props;

    const CC_ST = {paddingBottom: 12} // Fix for .MuiCardContent-root-325:last-child adding 24px padding-bottom

		return (
			<div className="ArticleCard">
        <Link to={`/author/${author.slug}`}>
				<Card className={classes.card} raised>
					<CardContent className={classes.cardContent} style={CC_ST}>
            <Grid container>
              <Icon style={{fontSize: '3rem', marginRight: '1rem', color: '#999999'}}>person</Icon>

              <div className={classes.authorDetails}>
                <p style={{fontWeight: 'bold', letterSpacing: '0.025em'}}>{author.name}</p>
                <p><em>{author.affiliations}</em></p>
                <p className={classes.numberOfArticles}>
                    {author.number_of_articles} {author.number_of_articles === 1 ? 'article' : 'articles'}
                </p>
              </div>
            </Grid>
          </CardContent>
        </Card>
      </Link>
    </div>
    )
  }
}

AuthorCard.defaultProps = {
  author: {}
};

export default withStyles(styles)(AuthorCard);
