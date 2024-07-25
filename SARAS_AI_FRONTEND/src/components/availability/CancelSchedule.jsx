import React from 'react';
import ReusableDialog from '../CustomFields/ReusableDialog';
import {
    Box,
    Button,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    closeCancelSession,
    closeReasonForLeave,
    getScheduleSession,
    openReasonForLeave,
    openScheduledSession,
} from '../../redux/features/taModule/taAvialability';

import {
    closeCoachCancelSession,
    getCoachScheduleSession,
    openCoachScheduledSession,
} from '../../redux/features/CoachModule/CoachAvailabilitySlice';

import { cancelScheduledSession } from '../../redux/features/taModule/taScheduling';

import { cancelCoachScheduledSession } from '../../redux/features/CoachModule/coachSchedule';
import {
    cancelScheduledSessionForLeave,
    closeCancelSessionForLeave,
    getSessionForLeave,
    openCancelSessionForLeave,
} from '../../redux/features/coach/coachmenuprofileSilce';

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

const CancelSchedule = ({ componentName }) => {
    const dispatch = useDispatch();

    let closeSessionAction,
        cancelSessionAction,
        getSessionAction,
        openSessionAction,
        cancelSessionState;

    switch (componentName) {
        case 'TACALENDER':
            closeSessionAction = closeCancelSession;
            cancelSessionAction = cancelScheduledSession;
            getSessionAction = getScheduleSession;
            openSessionAction = openScheduledSession;
            cancelSessionState = 'cancelSessionOpen';
            break;

        case 'COACHCALENDER':
            closeSessionAction = closeCoachCancelSession;
            cancelSessionAction = cancelCoachScheduledSession;
            getSessionAction = getCoachScheduleSession;
            openSessionAction = openCoachScheduledSession;
            cancelSessionState = 'cancelCoachSessionOpen';
            break;

        case 'COACHMENU_CALENDER':
            closeSessionAction = closeCancelSessionForLeave;
            cancelSessionAction = cancelScheduledSessionForLeave;
            getSessionAction = getSessionForLeave;
            openSessionAction = openCancelSessionForLeave;
            cancelSessionState = 'cancelSessionOnLeave';
            break;

        case 'COACHMENU_CALENDER':
            closeSessionAction = closeCancelSessionForLeave;
            cancelSessionAction = cancelScheduledSessionForLeave;
            getSessionAction = getSessionForLeave;
            openSessionAction = openCancelSessionForLeave;
            cancelSessionState = '';
            break;

        default:
            closeSessionAction = null;
            cancelSessionAction = null;
            getSessionAction = null;
            openSessionAction = null;
            break;
    }

    const schedulingState = useSelector(state =>
        componentName === 'TACALENDER'
            ? state.taAvialability
            : state.coachAvailability
    );

    const { cancelSessionOpen, schduldeCancelData, slotEventData } =
        schedulingState;

    // For coachAvailability specific data
    const {
        cancelCoachSessionOpen,
        schduldeCoachCancelData,
        slotCoachEventData,
    } = schedulingState;
    console.log('schduldeCancelData ', schduldeCancelData);
    const handleCancel = () => {
        // console.log("SLOT EVENT DATA : ", slotEventData)
        // console.log("SLOT COACH EVENT DATA : ", slotCoachEventData)
        dispatch(closeSessionAction());
        const sessionData =
            componentName === 'TACALENDER'
                ? schduldeCancelData
                : schduldeCoachCancelData;

        console.log('session Data : ', sessionData);
        const sessionNo = sessionData.id;
        dispatch(cancelSessionAction(sessionNo))
            .unwrap()
            .then(() => {
                dispatch(
                    getSessionAction(
                        componentName === 'TACALENDER'
                            ? slotEventData
                            : slotCoachEventData
                    )
                );
                dispatch(openSessionAction());
            })
            .catch(error => {
                console.error('Failed to cancel the session:', error);
            });
    };

    const actions = (
        <Box>
            <CustomButton
                onClick={handleCancel}
                backgroundColor="#FFFFFF"
                borderColor="#F56D38"
                color="#F56D38"
                sx={{ mr: 2 }}
            >
                Yes
            </CustomButton>
            <CustomButton
                onClick={() => {
                    dispatch(closeSessionAction());
                    dispatch(openSessionAction());
                }}
                backgroundColor="#F56D38"
                borderColor="#F56D38"
                color="#FFFFFF"
            >
                No
            </CustomButton>
        </Box>
    );

    const content = (
        <>
            <DialogTitle>
                {componentName === 'TACALENDER'
                    ? `'${schduldeCancelData['Session Name']}'`
                    : `'${schduldeCoachCancelData['Session Name']}'`}
            </DialogTitle>
            <DialogContent
                style={{ display: 'flex', justifyContent: 'center' }}
            >
                <Typography>
                    Scheduled for
                    {componentName === 'TACALENDER'
                        ? schduldeCancelData.date
                        : schduldeCoachCancelData.date}{' '}
                    ? from{' '}
                    {componentName === 'TACALENDER'
                        ? schduldeCancelData.Time
                        : schduldeCoachCancelData.Time}{' '}
                    ?
                </Typography>
            </DialogContent>
        </>
    );

    return (
        <ReusableDialog
            open={cancelSessionState}
            handleClose={() => {
                dispatch(closeSessionAction());
                dispatch(openSessionAction());
            }}
            title="Are you sure that you want to cancel the session"
            content={content}
            actions={actions}
        />
    );
};

export default CancelSchedule;
