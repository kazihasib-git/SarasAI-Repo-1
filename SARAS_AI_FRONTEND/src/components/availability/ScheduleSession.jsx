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
import { closeCoachSessionEvent } from '../../redux/features/CoachModule/CoachAvailabilitySlice';
import {
    openEditStudent,
    openEditBatch,
} from '../../redux/features/taModule/taScheduling';
import {
    openCoachEditBatch,
    openCoachEditStudent,
} from '../../redux/features/CoachModule/coachSchedule';

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

    let sliceName,
        sessionDataState,
        closePopup,
        openPopupState,
        openEditBatches,
        openEditStudents;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taAvailability';
            sessionDataState = 'sessionEventData';
            closePopup = closeSessionEvent;
            openPopupState = 'openEventData';
            openEditBatches = openEditBatch;
            openEditStudents = openEditStudent;
            break;

        case 'COACHCALENDER':
            sliceName = 'coachAvailability';
            sessionDataState = 'coachSessionEventData'; // Assuming this is correct
            closePopup = closeCoachSessionEvent; // Assuming this is correct
            openPopupState = 'coachOpenEventData'; // Assuming this is correct
            openEditBatches = openCoachEditBatch;
            openEditStudents = openCoachEditStudent;
            break;

        default:
            sliceName = null;
            sessionDataState = null;
            closePopup = null;
            openPopupState = null;
            openEditBatches = null;
            openEditStudents = null;
            break;
    }

    const selectState = useSelector(state =>
        sliceName ? state[sliceName] : {}
    );
    const {
        [sessionDataState]: sessionData = {},
        [openPopupState]: open = false,
    } = selectState;

    console.log('SESSION DATA :', sessionData);

    const handleEditStudents = () => {
        dispatch(openEditStudents());
    };

    const handleEditBatches = () => {
        dispatch(openEditBatches());
    };

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
        </Box>
    );

    const actions = (
        <Box>
            <Grid item xs={12} display="flex" justifyContent="center">
                <Box
                    display="flex"
                    justifyContent="center"
                    gap={2}
                    sx={{ mb: 3 }}
                >
                    <Button
                        variant="contained"
                        onClick={handleEditStudents}
                        sx={{
                            backgroundColor: '#F56D3B',
                            color: 'white',
                            height: '60px',
                            width: '201px',
                            borderRadius: '50px',
                            textTransform: 'none',
                            padding: '18px 30px',
                            fontWeight: '700',
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: '#D4522A',
                            },
                        }}
                    >
                        Edit Students
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleEditBatches}
                        sx={{
                            backgroundColor: 'white',
                            color: '#F56D3B',
                            height: '60px',
                            width: '194px',
                            border: '2px solid #F56D3B',
                            borderRadius: '50px',
                            textTransform: 'none',
                            fontWeight: '700',
                            fontSize: '16px',
                            padding: '18px 30px',
                            '&:hover': {
                                backgroundColor: '#F56D3B',
                                color: 'white',
                            },
                        }}
                    >
                        Edit Batches
                    </Button>
                </Box>
            </Grid>
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
