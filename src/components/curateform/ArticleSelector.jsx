import React from 'react';
import PropTypes from 'prop-types';

import AutocompleteReactSelect from '../shared/AutocompleteReactSelect.jsx';

import { withStyles } from '@material-ui/core/styles';

const styles = {}

class ArticleSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleChange = this.handleChange.bind(this)
        this.filter_already_linked = this.filter_already_linked.bind(this)
    }

    handleChange(value) {
        if (this.props.onChange != null) this.props.onChange(value)
    }

    filter_already_linked(a) {
        let {author_articles} = this.props
        return author_articles.indexOf(parseInt(a.id)) == -1
    }

    render() {
        let {classes, name} = this.props
        let {creatorShowing} = this.state
        let creator
        return (
            <div>
                <AutocompleteReactSelect
                     labelProp="text"
                     listUrl="/api/articles/autocomplete/"
                     filterFn={this.filter_already_linked}
                     placeholder="Search articles by title or author last name"
                     autoFocus={true}
                     onChange={this.handleChange} />
            </div>
        )
    }
}

ArticleSelector.propTypes = {
    author_articles: PropTypes.array
}

ArticleSelector.defaultProps = {
    author_articles: []
};

export default withStyles(styles)(ArticleSelector);