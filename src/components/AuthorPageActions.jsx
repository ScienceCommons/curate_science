//import React from 'react';
import React, { useState, useEffect  } from 'react';
import { Button, 
    Icon,
    Tooltip,
    Popover,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';
import { json_api_req, randomId, send_height_to_parent } from '../util/util.jsx'
import C from '../constants/constants';
//import { get, includes, isEmpty } from 'lodash'
import ArticleSelector from './curateform/ArticleSelector.jsx';

const useStyles = makeStyles(theme => ({
    menuIcon: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        float: 'right'
    },
    menu: {
        marginLeft: '10px',  
        marginTop: '5px'
    },
    menuItem: {
        margin: 0,
        padding: 0,
        border: 'solid',
        borderColor: '#999',
        borderWidth: '1.5px',
    }          
}));

export default function LongMenu({articlesIds, addArticle, linkArticle}) {
    const classes = useStyles()
    const [anchorElMenu, setAnchorElMenu] = React.useState(null);
    const [anchorElPopper, setAnchorElPopper] = React.useState(null);

    const openMenu = Boolean(anchorElMenu);
    const openPopper = Boolean(anchorElPopper);

    const handleClickMenu = (event) => {
        setAnchorElMenu(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorElMenu(null);
    };

    const handleClickPopper = (event) => {
        setAnchorElPopper(event.currentTarget);
    };

    const handleClosePopper = () => {
        setAnchorElPopper(null);
    };
    const ActionButton = ({ iconLeft, iconRight, label, color }) => {
        color = color || 'primary'
        return (
            <Button
            variant="outlined"
            size="medium"
            color={color}
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                padding: '0.5rem 0.5rem',
                border: 'none',
                color: '#999',
            }}
            >
                <Icon>{iconLeft}</Icon>
                <span style={{ marginLeft: '0.5rem' }}>
                    {label}
                </span>
                    { iconRight === null ? null :
                        <Tooltip title="Link an article to your author page that is already in our database (for example, an article that has already been added by one of your co-authors)."> 
                            <Icon style={{marginLeft:'0.6rem'}}>{iconRight}</Icon>
                        </Tooltip>
                    }
            </Button>
        )
    }

    return (
        <span>
            <IconButton
                className={classes.menuIcon}
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClickMenu}
                style={{minWidth: 0, color: '#CCC' }}
            >
            <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorElMenu}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                getContentAnchorEl = {null}
                keepMounted
                open={openMenu}
                onClose={handleCloseMenu}
                className={classes.menu}
                MenuListProps={{ style: {padding: 0}}}
            >
                <MenuItem key='Add article' onClick={() => {handleCloseMenu(); addArticle()}} className={classes.menuItem}>
                    <ActionButton iconLeft='add' iconRight={null} label='Add article' color='default'/>
                </MenuItem>

                <MenuItem key='Link existing article' onClick={handleClickPopper} className={classes.menuItem}>
                    <ActionButton iconLeft='link' iconRight='info' label='Link existing article' color='default'/>
                </MenuItem>
            </Menu>
            <Popover
        id="add_preexisting_popper"
        open={openPopper}
        anchorEl={anchorElPopper}
        onClose={handleClosePopper}
        anchorOrigin={{
            vertical: 'bottom',
                horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
                horizontal: 'left',
        }}
        >
            <div style={{width: "400px", height: "250px", padding: 14 }}>
                <ArticleSelector onChange={linkArticle} author_articles={articlesIds} />
            </div>
        </Popover>
        </span>
    );
}
