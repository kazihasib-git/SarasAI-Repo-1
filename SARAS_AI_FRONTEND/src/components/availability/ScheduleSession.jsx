import React, { useState } from 'react';
import {
    IconButton,
    Typography,
    Grid,
    Avatar,
    Box,
    Button,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReusableDialog from '../CustomFields/ReusableDialog';
import { useDispatch, useSelector } from 'react-redux';
import { closeSessionEvent } from '../../redux/features/taModule/taAvialability';
import { formatDateTime } from '../../utils/dateFormatter';

const CustomButton = ({
    onClick,
    children,
    color = '#FFFFFF',
    backgroundColor = '#4E18A5',
    borderColor = '#FFFFFF',
    sx,
    ...props
}) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                backgroundColor: backgroundColor,
                color: color,
                fontWeight: '700',
                fontSize: '16px',
                borderRadius: '50px',
                padding: '10px 20px',
                border: `2px solid ${borderColor}`,
                '&:hover': {
                    backgroundColor: color,
                    color: backgroundColor,
                    borderColor: color,
                },
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

const ScheduleSession = ({ componentName }) => {
    const dispatch = useDispatch();

    let sliceName, sessionDataState, closePopup, openPopupState;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taAvailability';
            sessionDataState = 'sessionEventData';
            closePopup = closeSessionEvent;
            openPopupState = 'openEventData';
            break;

        case 'COACHCALENDER':
            sliceName = 'coachAvailability';
            sessionDataState = 'sessionEventData'; // Assuming this is correct
            closePopup = closeSessionEvent; // Assuming this is correct
            openPopupState = 'openEventData'; // Assuming this is correct
            break;

        default:
            sliceName = null;
            sessionDataState = null;
            closePopup = null;
            openPopupState = null;
            break;
    }

    const selectState = useSelector(state =>
        sliceName ? state[sliceName] : {}
    );
    const {
        [sessionDataState]: sessionData = {},
        [openPopupState]: open = false,
    } = selectState;

    const content = (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
                {formatDateTime(sessionData)}
            </Typography>
            <CustomButton
                onClick={() => {}}
                backgroundColor="#FFFFFF"
                borderColor="#F56D38"
                color="#F56D38"
                sx={{ mb: 2, mr: 2 }}
            >
                Join with Zoom
            </CustomButton>
            <CustomButton
                onClick={() => {}}
                variant="text"
                backgroundColor="#FFFFFF"
                borderColor="transparent"
                color="#F56D38"
                sx={{ mb: 2 }}
            >
                Change Meeting Mode
            </CustomButton>
            <Typography variant="body2" sx={{ mb: 2 }}>
                {sessionData.meetingLink}
                <IconButton
                    size="small"
                    sx={{
                        borderRadius: '50%',
                        backgroundColor: '#F56D38',
                        border: '2px solid #F56D38',
                        '&:hover': {
                            borderColor: '#F56D38',
                            color: '#F56D38',
                        },
                        color: 'white',
                        ml: 1,
                    }}
                >
                    <ContentCopyIcon />
                </IconButton>
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
                <Box component="span" sx={{ fontWeight: 'bold' }}>
                    Join By Phone:
                </Box>{' '}
                (123) 456-7890, 79769199687
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
                <Box component="span" sx={{ fontWeight: 'bold' }}>
                    8 Guests:
                </Box>{' '}
                3 yes, 5 awaiting
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {sessionData.guests &&
                    sessionData.guests.map((guest, index) => (
                        <Grid item key={index}>
                            <Box display="flex" alignItems="center">
                                <Avatar sx={{ bgcolor: '#F56D38', mr: 1 }}>
                                    {guest.initials}
                                </Avatar>
                                <Box>
                                    <Typography variant="body2">
                                        {guest.name}
                                    </Typography>
                                    <Typography variant="caption">
                                        {guest.role}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );

    const actions = (
        <Box>
            <CustomButton
                onClick={() => {}}
                backgroundColor="#FFFFFF"
                borderColor="#F56D38"
                color="#F56D38"
                sx={{ mr: 2 }}
            >
                Yes
            </CustomButton>
            <CustomButton
                onClick={() => {}}
                backgroundColor="#F56D38"
                borderColor="#F56D38"
                color="#FFFFFF"
            >
                No
            </CustomButton>
        </Box>
    );

    return (
        <ReusableDialog
            open={open}
            handleClose={() => dispatch(closePopup())}
            title={`${sessionData.title || 'No Title'} - Daily Scrum`}
            content={content}
            actions={actions}
        />
    );
};

export default ScheduleSession;
