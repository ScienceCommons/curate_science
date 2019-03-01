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
    }

    handleChange(value) {
        if (this.props.onChange != null) this.props.onChange(value)
    }

    render() {
        let {classes, name} = this.props
        let {creatorShowing} = this.state
        let creator
        return (
            <div>
                <AutocompleteReactSelect
                     creatable
                     labelProp="text"
                     listUrl="/api/articles/autocomplete/"
                     placeholder="Search articles by title, DOI, etc *"
                     onChange={this.handleChange} />
            </div>
        )
    }
}

ArticleSelector.propTypes = {

}

ArticleSelector.defaultProps = {
};

export default withStyles(styles)(ArticleSelector);