import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';

const CustomIconButton = styled(IconButton)(({ theme }) => ({
    marginRight: theme.spacing(2.5),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    '& .MuiSvgIcon-root': {
        fontSize: 30,
    },
}));

const NavSetting = () => {
    const handleClick = () => {
        // You can add functionality here for when the button is clicked
        console.log('Settings button clicked!');
    };

    return (
        <div>
            <Tooltip title="Settings">
                <CustomIconButton
                    color="default" // Sets the icon color to default, which will be the border color
                    onClick={handleClick}
                    aria-label="settings"
                >
                    <SettingsIcon />
                </CustomIconButton>
            </Tooltip>
        </div>
    );
};

export default NavSetting;
