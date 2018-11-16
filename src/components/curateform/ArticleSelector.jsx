import React from 'react';

import AutocompleteReactSelect from '../AutocompleteReactSelect.jsx';

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
        return (
            <AutocompleteReactSelect
                                     creatable
                                     labelProp="text"
                                     listUrl="/api/articles/autocomplete/"
                                     createUrl="/api/articles/create/"
                                     placeholder="Search articles by title, DOI, etc *"
                                     onChange={this.handleChange} />
        )
    }
}

ArticleSelector.defaultProps = {

};

export default withStyles(styles)(ArticleSelector);