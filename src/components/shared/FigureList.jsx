import React from 'react';
import PropTypes from 'prop-types';

import Loader from './Loader.jsx';
import { withCookies, Cookies } from 'react-cookie';

import { times } from 'lodash'
import {TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput, InputBase, Tooltip} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

import { simple_api_req } from '../../util/util.jsx'
import { FancyBoxViewer } from 'util/fancybox'

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    thumbnail: {
        display: 'inline-block',
        width: 80,
        height: 80,
        marginRight: 10,
        border: '1px solid gray',
        backgroundSize: 'cover',
        backgroundPosition: '50% 50%',
        borderRadius: 3,
        textAlign: 'center'
    },
    add: {
        width: 80,
        height: 80,
        display: 'inline-block',
        paddingTop: 10,
        color: 'black'
    }
}


class FigureList extends React.Component {
	constructor(props) {
        super(props);
        this.state = {}
        this.delete_figure = this.delete_figure.bind(this)
        this.render_thumbnail = this.render_thumbnail.bind(this)
        this.handle_add = this.handle_add.bind(this)
    }

    componentDidMount() {
        // Initialise fancybox gallery
        this.viewer = FancyBoxViewer({
            initial_images: this.get_fancybox_images(),
            hash: `article-${this.props.article_id}-image`,
        })
    }

    get_fancybox_images() {
        // Convert figures to format expected by FancyBox
        return this.props.figures.map(figure => {
            return { thumb: figure.image, src: figure.image }
        })
    }

    delete_figure(idx) {
    	let {figures, cookies} = this.props
        let pk = figures[idx].id
        this.setState({loading: true}, () => {
            simple_api_req('DELETE', `/api/key_figures/${pk}/delete/`, null, cookies.get('csrftoken'), (res) => {
                figures.splice(idx, 1)
                this.setState({loading: false}, () => {
                    if (this.props.onChange != null) this.props.onChange(figures)
                })
            }, (err) => {
                this.setState({loading: false})
                console.error(err)
            })
        })
    }

    figure_click = (idx, event) => {
        event.preventDefault()
        let {figures, show_delete} = this.props
        if (show_delete) {
            this.delete_figure(idx)
        } else {
            const images = this.get_fancybox_images()
            this.viewer.show_image(images, idx)
        }
    }

    handle_add() {
        this.props.onAdd()
    }

    render_thumbnail(kf, i) {
        let {classes, show_delete} = this.props
        let kind = kf.is_table ? 'Table' : 'Figure'
        let img = (
            <img key={i}
                  className={classes.thumbnail}
                  style={{backgroundImage: `url(${kf.image})`}} />
        )
        let tooltip = show_delete ? "Delete figure" : "Enlarge figure"
        return <Tooltip title={tooltip} key={i}><a key={i} href="#" onClick={this.figure_click.bind(this, i)}>{ img }</a></Tooltip>
    }

	render() {
		let {classes, figures, showAdd, loading, number_images_loading} = this.props
        if (figures == null) figures = []

        let spinner
        if (loading) spinner = <Loader size="25" />

        let loading_images = []
        times(number_images_loading, (i) => {
            loading_images.push(
                <div className={classes.thumbnail} key={`uploading_image_${i}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Loader/>
                </div>
            )
        })

		return (
			<div className={classes.container}>
				{ figures.map(this.render_thumbnail) }
                { spinner }
                { loading_images }
            </div>
        )
	}
}

FigureList.propTypes = {
    onChange: PropTypes.func,
    show_delete: PropTypes.bool,
    showAdd: PropTypes.bool,
    loading: PropTypes.bool,
    number_images_loading: PropTypes.number,
}

FigureList.defaultProps = {
    article_id: null,
    figures: [],
    show_delete: false,
    showAdd: false,
    loading: false,
    number_images_loading: 0,
};

export default withCookies(withStyles(styles)(FigureList));
