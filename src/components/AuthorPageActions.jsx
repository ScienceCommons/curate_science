import React from 'react';
import { Button, 
    Icon,
    Tooltip,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';

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

export default function LongMenu() {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
                onClick={handleClick}
                style={{minWidth: 0, color: '#CCC' }}
            >
            <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                getContentAnchorEl = {null}
                keepMounted
                open={open}
                onClose={handleClose}
                className={classes.menu}
                MenuListProps={{ style: {padding: 0}}}
            >
                <MenuItem key='Add article' onClick={handleClose} className={classes.menuItem}>
                    <ActionButton iconLeft='add' iconRight={null} label='Add article' color='default'/>
                </MenuItem>

                <MenuItem key='Link existing article' onClick={handleClose} className={classes.menuItem}>
                    <ActionButton iconLeft='link' iconRight='info' label='Link existing article' color='default'/>
                </MenuItem>
            </Menu>
        </span>
    );
}
