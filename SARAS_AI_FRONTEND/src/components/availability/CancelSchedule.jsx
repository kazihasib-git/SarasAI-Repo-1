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
} from '../../redux/features/adminModule/ta/taAvialability';

import {
    closeCoachCancelSession,
    getCoachScheduleSession,
    openCoachScheduledSession,
} from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import { cancelScheduledSession } from '../../redux/features/adminModule/ta/taScheduling';
import { cancelCoachScheduledSession } from '../../redux/features/adminModule/coach/coachSchedule';
import CustomButton from '../CustomFields/CustomButton';

const CancelSchedule = ({ componentName }) => {
    const dispatch = useDispatch();

    let closeSessionAction,
        cancelSessionAction,
        getSessionAction,
        openSessionAction,
        sliceName,
        eventSlotData,
        cancelScheduledData,
        cancelSessionState;

    switch (componentName) {
        case 'TACALENDER':
            (sliceName = 'taAvialability'),
                (closeSessionAction = closeCancelSession);
            cancelSessionAction = cancelScheduledSession;
            getSessionAction = getScheduleSession;
            eventSlotData = 'slotEventData';
            cancelScheduledData = 'schduldeCancelData';
            openSessionAction = openScheduledSession;
            cancelSessionState = 'cancelSessionOpen';
            break;

        case 'COACHCALENDER':
            sliceName = 'coachAvailability';
            closeSessionAction = closeCoachCancelSession;
            cancelSessionAction = cancelCoachScheduledSession;
            getSessionAction = getCoachScheduleSession;
            eventSlotData = 'slotCoachEventData';
            cancelScheduledData = 'schduldeCoachCancelData';
            openSessionAction = openCoachScheduledSession;
            cancelSessionState = 'cancelCoachSessionOpen';
            break;

        default:
            closeSessionAction = null;
            cancelSessionAction = null;
            getSessionAction = null;
            openSessionAction = null;
            eventSlotData = null;
            cancelScheduledData = null;
            break;
    }

    const schedulingState = useSelector(state => state[sliceName]);

    const {
        cancelSessionOpen,
        [cancelScheduledData]: schduldeCancelData,
        [eventSlotData]: slotEventData,
    } = schedulingState;

    // For coachAvailability specific data
    const {
        cancelCoachSessionOpen,
        schduldeCoachCancelData,
        slotCoachEventData,
    } = schedulingState;

    console.log('schduldeCancelData ', schduldeCancelData, slotEventData);

    const handleCancel = () => {
        dispatch(closeSessionAction());
        const sessionData = schduldeCancelData;

        console.log('session Data : ', sessionData, slotEventData);

        const sessionNo = sessionData.id;
        console.log('sessionNO :', sessionNo);
        dispatch(cancelSessionAction(sessionNo))
            .unwrap()
            .then(() => {
                dispatch(getSessionAction());
                dispatch(openSessionAction(slotEventData));
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
                {`'${schduldeCancelData['Session Name']}'`}
            </DialogTitle>
            <DialogContent
                style={{ display: 'flex', justifyContent: 'center' }}
            >
                <Typography>
                    Scheduled for &nbsp;
                    {schduldeCancelData.Date} from {schduldeCancelData.Time}{' '}
                </Typography>
            </DialogContent>
        </>
    );

    return (
        <ReusableDialog
            open={cancelSessionState}
            handleClose={() => {
                dispatch(closeSessionAction());
                //dispatch(openSessionAction());
            }}
            title="Are you sure that you want to cancel the session"
            content={content}
            actions={actions}
        />
    );
};

export default CancelSchedule;
