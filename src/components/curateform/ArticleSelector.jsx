import React from 'react';
import PropTypes from 'prop-types';

import AutocompleteReactSelect from '../AutocompleteReactSelect.jsx';
import QuickArticleCreator from '../../components/shared/QuickArticleCreator.jsx';

import { withStyles } from '@material-ui/core/styles';

const styles = {}

class ArticleSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            creatorShowing: false
        };
        this.handleChange = this.handleChange.bind(this)
        this.articleCreated = this.articleCreated.bind(this)
        this.showCreator = this.showCreator.bind(this)
    }

    handleChange(value) {
        if (this.props.onChange != null) this.props.onChange(value)
    }

    showCreator(input) {
        this.setState({creatorShowing: true})
    }

    articleCreated(a) {

    }

    render() {
        let {classes, name, withCreator} = this.props
        let {creatorShowing} = this.state
        let creator
        if (withCreator && creatorShowing) creator = <QuickArticleCreator onCreate={this.articleCreated} />
        return (
            <div>
                <AutocompleteReactSelect
                     creatable
                     labelProp="text"
                     listUrl="/api/articles/autocomplete/"
                     placeholder="Search articles by title, DOI, etc *"
                     onCreate={this.showCreator}
                     onChange={this.handleChange} />
                { creator }
            </div>
        )
    }
}

ArticleSelector.propTypes = {
    withCreator: PropTypes.bool
}

ArticleSelector.defaultProps = {
    withCreator: false
};

export default withStyles(styles)(ArticleSelector);