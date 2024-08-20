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
    fetchTAScheduleById,
    fetchTaSlots,
    getScheduleSession,
    openReasonForLeave,
    openScheduledSession,
} from '../../redux/features/adminModule/ta/taAvialability';
import {
    closeCoachCancelSession,
    fetchCoachScheduleById,
    fetchCoachSlots,
    getCoachScheduleSession,
    openCoachScheduledSession,
} from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import { cancelScheduledSession } from '../../redux/features/adminModule/ta/taScheduling';
import { cancelCoachScheduledSession } from '../../redux/features/adminModule/coach/coachSchedule';
import CustomButton from '../CustomFields/CustomButton';
import { useParams } from 'react-router-dom';

const CancelSchedule = ({ componentName }) => {
    const dispatch = useDispatch();
    const {id , name } = useParams()

    let closeSessionAction,
        cancelSessionAction,
        getSessionAction,
        openSessionAction,
        sliceName,
        eventSlotData,
        cancelScheduledData,
        cancelSessionState,
        fetchSlotsApi,
        fetchSessionsApi;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taAvialability',
            closeSessionAction = closeCancelSession;
            cancelSessionAction = cancelScheduledSession;
            getSessionAction = getScheduleSession;
            eventSlotData = 'slotEventData';
            cancelScheduledData = 'schduldeCancelData';
            openSessionAction = openScheduledSession;
            cancelSessionState = 'cancelSessionOpen';
            fetchSlotsApi = fetchTaSlots
            fetchSessionsApi = fetchTAScheduleById;
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
            fetchSlotsApi = fetchCoachSlots;
            fetchSessionsApi = fetchCoachScheduleById;
            break;

        default:
            closeSessionAction = null;
            cancelSessionAction = null;
            getSessionAction = null;
            openSessionAction = null;
            eventSlotData = null;
            cancelScheduledData = null;
            fetchSessionsApi = null;
            fetchSlotsApi = null;
            break;
    }

    const schedulingState = useSelector(state => state[sliceName]);

    const {
        cancelSessionOpen,
        [cancelScheduledData]: schduldeCancelData,
        [eventSlotData]: slotEventData,
    } = schedulingState;

    const {
        cancelCoachSessionOpen,
        schduldeCoachCancelData,
        slotCoachEventData,
    } = schedulingState;

    const handleCancel = () => {
        dispatch(closeSessionAction());
        const sessionData = schduldeCancelData;

        const sessionNo = sessionData.id;

        dispatch(cancelSessionAction(sessionNo))
            .unwrap()
            .then(() => {
                dispatch(fetchSlotsApi(id))
                dispatch(fetchSessionsApi(id))
                dispatch(getSessionAction(slotEventData));
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
            }}
            title="Are you sure that you want to cancel the session"
            content={content}
            actions={actions}
        />
    );
};

export default CancelSchedule;
