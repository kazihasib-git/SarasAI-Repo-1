import {
    Box,
    Button,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import CustomButton from '../../../CustomFields/CustomButton';
import {
    closeCancelSessionPopup,
    openCreatedSessions,
} from '../../../../redux/features/commonCalender/commonCalender';
import {
    cancelScheduledSessionForLeave,
    getCoachMenuSessionForLeave,
    getCoachMenuSessions,
    getCoachMenuSlots,
} from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import { cancelTaScheduledSessionForLeave, getTaMenuSessionForLeave, getTaMenuSessions, getTaMenuSlots } from '../../../../redux/features/taModule/tamenuSlice';

const CancelSession = ({ componentName }) => {
    const dispatch = useDispatch();

    let sliceName, 
        cancelSessionApi, 
        getSessionsApi,
        getAllSlotsAPi,
        getAllSessionsApi;

    switch (componentName) {
        case 'TAMENU':
            sliceName = 'taMenu';
            cancelSessionApi = cancelTaScheduledSessionForLeave;
            getSessionsApi = getTaMenuSessionForLeave;
            getAllSlotsAPi = getTaMenuSlots;
            getAllSessionsApi = getTaMenuSessions;
            break;

        case 'COACHMENU':
            sliceName = 'coachMenu';
            cancelSessionApi = cancelScheduledSessionForLeave;
            getSessionsApi = getCoachMenuSessionForLeave;
            getAllSlotsAPi = getCoachMenuSlots
            getAllSessionsApi = getCoachMenuSessions
            break;

        default:
            sliceName = null;
            cancelSessionApi = null;
            getSessionsApi = null;
            getAllSessionsApi = null;
            getAllSessionsApi = null;
            break;
    }

    const selectState = useSelector(state => state[sliceName]);

    const { openCancelSession, sessionCancelData, slotsLeaveData } =
        useSelector(state => state.commonCalender);


    const handleCancel = () => {
        const sessionId = sessionCancelData.id;
        dispatch(cancelSessionApi(sessionId)).then(() => {
            dispatch(getSessionsApi(slotsLeaveData))
            dispatch(openCreatedSessions(slotsLeaveData))
            dispatch(getAllSessionsApi());
            dispatch(getAllSlotsAPi());
        });

        dispatch(closeCancelSessionPopup());
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
                    dispatch(closeCancelSessionPopup())
                    dispatch(openCreatedSessions())
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
                {`'${sessionCancelData['Session Name']}'`}
            </DialogTitle>
            <DialogContent
                style={{ display: 'flex', justifyContent: 'center' }}
            >
                <Typography>
                    Scheduled for
                    {sessionCancelData.Date} from {sessionCancelData.Time}{' '}
                </Typography>
            </DialogContent>
        </>
    );

    return (
        <ReusableDialog
            open={openCancelSession}
            handleClose={() => {
                dispatch(closeCancelSessionPopup());
            }}
            title="Are you sure that you want to cancel the session"
            content={content}
            actions={actions}
        />
    );
};

export default CancelSession;
