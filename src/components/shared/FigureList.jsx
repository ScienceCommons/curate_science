import React from 'react';
import PropTypes from 'prop-types';

import {TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput, InputBase, Tooltip} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = {
    container: {
       display: 'flex',
       flexDirection: 'row'
    },
    thumbnail: {
        display: 'inline-block',
        width: 110,
        height: 110,
        marginRight: 10,
        marginTop: 10,
        border: '1px solid gray',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        borderRadius: 3,
        cursor: 'pointer'
    }
}

class FigureList extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        };
        this.deleteFigure = this.deleteFigure.bind(this)
        this.render_thumbnail = this.render_thumbnail.bind(this)
    }

    deleteFigure = idx => event => {
        if (this.props.onDelete != null) this.props.onDelete(idx)
    }

    handleChange(event) {

    }

    render_thumbnail(kf, i) {
        let {classes, showDelete, renderHiddenInputs} = this.props
        let tt = `Figure ${kf.figure_number}`
        if (showDelete) tt = tt + ' (click to delete)'
        let hiddenInput
        if (renderHiddenInputs) hiddenInput = <input type="hidden" name={`keyfigure-${i}-image_url`} value={kf.image_url} />
    	return (
            <Tooltip title={tt} key={i}>
                <div>
                    <span className={classes.thumbnail} style={{backgroundImage: `url(${kf.image_url})`}} onClick={this.deleteFigure(i)} />
                    { hiddenInput }
                </div>
            </Tooltip>
        )
    }

	render() {
		let {classes, figures} = this.props
		return (
			<div className={classes.container}>
				{ figures.map(this.render_thumbnail) }
            </div>
        )
	}
}

FigureList.propTypes = {
    onDelete: PropTypes.func,
    showDelete: PropTypes.bool
}

FigureList.defaultProps = {
	figures: [],
    showDelete: false,
    renderHiddenInputs: false
};

export default withStyles(styles)(FigureList);