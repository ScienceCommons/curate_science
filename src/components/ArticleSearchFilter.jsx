import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import {Typography, Icon, Button, Radio, RadioGroup} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';

import C from '../constants/constants';

import qs from 'query-string';

const styles = {
    root: {
        padding: 13
    },
    category: {
        marginTop: 10,
    },
    categoryLabel: {
        marginBottom: 5
    },
    checkboxLabel: {
        margin: 0,
        padding: 0
    },
    checkbox: {
        margin: 0,
        padding: 5
    },
    radioGroup: {
        margin: 0,
        padding: 5
    },
    radio: {
        margin: 0,
        padding: 5
    },
    group: {
        margin: 0
    }
};

class ArticleSearchFilter extends React.Component {
	constructor(props) {
        super(props);


        this.state = {
        	selected_filters: this.filters(),
        	filter_changes: false
        };

        this.render_category = this.render_category.bind(this)
        this.render_item = this.render_item.bind(this)
        this.item_selected = this.item_selected.bind(this)
        this.refreshSearch = this.refreshSearch.bind(this)
    }

    componentDidMount() {
    }

    location_params() {
    	// Query params
		return qs.parse(this.props.location.search, { ignoreQueryPrefix: true })
    }

    filters() {
    	let lp = this.location_params()
    	if (lp.f != null) return lp.f.split(',')
    	else return []
    }

    query() {
    	let lp = this.location_params()
    	return lp.q
    }

    refreshSearch() {
    	let {selected_filters} = this.state
    	let {query} = this.props
    	let filters = selected_filters.join(',')
    	// Redirect to home (articles) page
        query = encodeURIComponent(this.query() || '')
        this.props.history.replace(`/articles/search?q=${query}&f=${filters}`)
    }

    item_selected(item) {
    	let { selected_filters } = this.state;
    	return selected_filters.indexOf(item.id) > -1
    }

	handleFilterItemCheck = item => event => {
		let { selected_filters } = this.state;
		if (this.item_selected(item)) {
			// Remove from list
			let idx = selected_filters.indexOf(item.id)
			delete selected_filters[idx]
		} else {
			selected_filters.push(item.id)
		}
		this.setState({selected_filters: selected_filters, filter_changes: true})
	}

    render_category(cat) {
        let {classes} = this.props
        let group
        let controls = cat.items.map((item) => {
            return this.render_item(item, cat.type)
        })
        if (cat.type == 'radio') group = (<RadioGroup
                aria-label={cat.id}
                name={cat.id}
                className={classes.radioGroup}
              >{ controls }</RadioGroup>)
        else group = (
            <FormGroup className={classes.group}>
                { controls }
            </FormGroup>
        )
    	return (
			<FormControl component="fieldset" key={cat.category} className={classes.category}>
    		    <FormLabel component="legend" className={classes.categoryLabel}>{ cat.label }</FormLabel>
                { group }
			</FormControl>
		)
    }

    render_item(item, type) {
        let {classes} = this.props
        if (type == 'radio') return (
            <FormControlLabel
                value="format"
                key={item.id}
                control={
                    <Radio
                        checked={this.item_selected(item)}
                        className={classes.radio}
                        onChange={this.handleFilterItemCheck(item)}
                        value={item.id}
                        color="primary" />
                }
                label={item.label} />
        )
        else return (
    		<FormControlLabel
       			key={item.id}
                className={classes.checkboxLabel}
	            control={
    	            <Checkbox
    	              checked={this.item_selected(item)}
                      className={classes.checkbox}
    	              onChange={this.handleFilterItemCheck(item)}
    	              value={item.id}
    	              color="primary"
    	            />
    	          }
                label={item.label}
	        />
		)
	}

	render() {
        let {classes} = this.props
 	    let { filter_changes } = this.state;
		return (
			<div className={classes.root}>
				<Typography variant="h5">Filter Articles</Typography>

				<div>
				{ C.FILTERS.map(this.render_category) }
				</div>

				<Button disabled={!filter_changes} onClick={this.refreshSearch} variant="outlined">
                    <Icon>refresh</Icon>
                    Refresh Results
                </Button>
			</div>
		)
	}
}

ArticleSearchFilter.defaultProps = {
};

ArticleSearchFilter.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(ArticleSearchFilter));
