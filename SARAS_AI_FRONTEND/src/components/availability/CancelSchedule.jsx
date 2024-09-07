import React from 'react';
import ReusableDialog from '../CustomFields/ReusableDialog';
import { Box, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    closeCancelSession,
    fetchTAScheduleById,
    fetchTaSlots,
    getScheduleSession,
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

const cancelScheduleConfig = {
    TACALENDER: {
        sliceName: 'taAvialability',
        closeSessionAction: closeCancelSession,
        cancelSessionAction: cancelScheduledSession,
        getSessionAction: getScheduleSession,
        eventSlotData: 'slotEventData',
        cancelScheduledData: 'schduldeCancelData',
        openSessionAction: openScheduledSession,
        cancelSessionState: 'cancelSessionOpen',
        fetchSlotsApi: fetchTaSlots,
        fetchSessionsApi: fetchTAScheduleById,
    },
    COACHCALENDER: {
        sliceName: 'coachAvailability',
        closeSessionAction: closeCoachCancelSession,
        cancelSessionAction: cancelCoachScheduledSession,
        getSessionAction: getCoachScheduleSession,
        eventSlotData: 'slotCoachEventData',
        cancelScheduledData: 'schduldeCoachCancelData',
        openSessionAction: openCoachScheduledSession,
        cancelSessionState: 'cancelCoachSessionOpen',
        fetchSlotsApi: fetchCoachSlots,
        fetchSessionsApi: fetchCoachScheduleById,
    },
};

const CancelSchedule = ({ id, name, componentName, timezone }) => {
    const dispatch = useDispatch();

    const {
        closeSessionAction,
        cancelSessionAction,
        getSessionAction,
        openSessionAction,
        sliceName,
        eventSlotData,
        cancelScheduledData,
        cancelSessionState,
        fetchSlotsApi,
        fetchSessionsApi,
    } = cancelScheduleConfig[componentName];

    const schedulingState = useSelector(state => state[sliceName]);

    const {
        [cancelScheduledData]: schduldeCancelData,
        [eventSlotData]: slotEventData,
    } = schedulingState;

    const handleCancel = () => {
        dispatch(closeSessionAction());
        const sessionData = schduldeCancelData;

        const sessionNo = sessionData.id;

        dispatch(cancelSessionAction(sessionNo))
            .unwrap()
            .then(() => {
                dispatch(fetchSlotsApi(id));
                dispatch(fetchSessionsApi(id));
                dispatch(getSessionAction(slotEventData));
                dispatch(openSessionAction(slotEventData));
            })
            .catch(error => {
                console.error('Failed to cancel the session:', error);
            });
    };

    const actions = (
        <Box style={{ marginBottom: '30px' }}>
            <CustomButton
                onClick={handleCancel}
                backgroundColor="#F56D38"
                borderColor="#F56D38"
                color="#FFFFFF"
                sx={{ mr: 2 }}
            >
                Yes
            </CustomButton>
            <CustomButton
                onClick={() => {
                    dispatch(closeSessionAction());
                    dispatch(openSessionAction());
                }}
                backgroundColor="#FFFFFF"
                borderColor="#F56D38"
                color="#F56D38"
            >
                No
            </CustomButton>
        </Box>
    );

    const content = (
        <div style={{ overflowY: 'hidden' }}>
            <DialogTitle
                sx={{
                    fontWeight: '600',
                    fontSize: '25px',
                    color: '#1A1E3D',
                    overflowY: 'hidden',
                }}
            >
                {`'${schduldeCancelData['Session Name']}'`}
            </DialogTitle>
            <DialogContent
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '-25px',
                }}
            >
                <Typography>
                    Scheduled for &nbsp;
                    {schduldeCancelData.Date} from {schduldeCancelData.Time} ?
                </Typography>
            </DialogContent>
        </div>
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
