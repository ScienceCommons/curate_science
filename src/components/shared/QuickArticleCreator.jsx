import React from 'react';
import PropTypes from 'prop-types';

import {TextField, Button, Icon, Typography, Menu, Grid, InputLabel,
	FormControl, Select, OutlinedInput, Paper} from '@material-ui/core';

import JournalSelector from '../../components/curateform/JournalSelector.jsx';
import AuthorSelector from '../../components/curateform/AuthorSelector.jsx';
import {json_api_req} from '../../util/util.jsx'

import { withStyles } from '@material-ui/core/styles';

const styles = {
    root: {
        padding: 10,
        backgroundColor: '#EFEFEF',
        marginBottom: 10
    },
    title: {
        textTransform: 'uppercase',
        color: 'gray',
        fontSize: 12,
    }
}

class QuickArticleCreator extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            formdata: {}
        };
        this.save = this.save.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
    }

    handleChange = prop => event => {
        let {formdata} = this.state
        formdata[prop] = event.target.value
        this.setState({formdata});
    }

    handleValueChange = prop => value => {
        let {formdata} = this.state
        formdata[prop] = value
        this.setState({formdata});
    }

    save() {
        let {formdata} = this.state
        let {csrftoken} = this.props
        json_api_req('POST', "/api/articles/create/", formdata, csrftoken, (res) => {
                let text = res.title
                this.props.onCreate({id: res.id, text: text})
            }, (res) => {
                // Error
                console.log(res)
            }
        )
    }

	render() {
		let {classes} = this.props
        let {formdata} = this.state
		return (
			<Paper className={classes.root}>
                <Typography variant="h3" className={classes.title}>Create New Article</Typography>
				<Grid container className={classes.root} spacing={24}>
                    <Grid xs={12} item>

                        <TextField
                          id="title"
                          label="Article title"
                          className={classes.textField}
                          value={formdata.title || ''}
                          onChange={this.handleChange('title')}
                          margin="normal"
                          name="title"
                          fullWidth
                          required
                          variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={6}>

                        <AuthorSelector
                            onChange={this.handleValueChange('authors')}
                            value={formdata.authors || []} />

                    </Grid>
                    <Grid item xs={6}>
                        <JournalSelector
                            onChange={this.handleValueChange('journal')}
                            value={formdata.journal || {}} />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                          id="abstract"
                          name="abstract"
                          label="Abstract"
                          className={classes.textField}
                          value={formdata.abstract || ''}
                          onChange={this.handleChange('abstract')}
                          margin="normal"
                          fullWidth
                          multiline
                          variant="outlined"
                        />
                    </Grid>
                </Grid>
                <Button variant="contained" color="primary" onClick={this.save}>Create Article</Button>
            </Paper>
        )
	}
}

QuickArticleCreator.propTypes = {
    onCreate: PropTypes.func,
    csrftoken: PropTypes.string
}

QuickArticleCreator.defaultProps = {
    csrftoken: null
};

export default withStyles(styles)(QuickArticleCreator);