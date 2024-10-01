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
import {
    cancelTaScheduledSessionForLeave,
    getTaMenuSessionForLeave,
    getTaMenuSessions,
    getTaMenuSlots,
} from '../../../../redux/features/taModule/tamenuSlice';

const cancelSessionConfig = {
    TAMENU: {
        sliceName: 'taMenu',
        cancelSessionApi: cancelTaScheduledSessionForLeave,
        getSessionsApi: getTaMenuSessionForLeave,
        getAllSlotsAPi: getTaMenuSlots,
        getAllSessionsApi: getTaMenuSessions,
        loadingState: 'loading',
    },
    COACHMENU: {
        sliceName: 'coachMenu',
        cancelSessionApi: cancelScheduledSessionForLeave,
        getSessionsApi: getCoachMenuSessionForLeave,
        getAllSlotsAPi: getCoachMenuSlots,
        getAllSessionsApi: getCoachMenuSessions,
        loadingState: 'loading',
    },
};

const CancelSession = ({ componentName, timezone }) => {
    const dispatch = useDispatch();

    const {
        sliceName,
        cancelSessionApi,
        getSessionsApi,
        getAllSlotsAPi,
        getAllSessionsApi,
        loadingState,
    } = cancelSessionConfig[componentName];

    const selectState = useSelector(state => state[sliceName]);

    const { [loadingState]: isApiLoading } = selectState;

    const { openCancelSession, sessionCancelData, slotsLeaveData } =
        useSelector(state => state.commonCalender);

    const handleCancel = () => {
        const sessionId = sessionCancelData.id;
        dispatch(cancelSessionApi(sessionId)).then(() => {
            dispatch(getSessionsApi(slotsLeaveData));
            dispatch(openCreatedSessions(slotsLeaveData));
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
                disabled={isApiLoading}
            >
                Yes
            </CustomButton>
            <CustomButton
                onClick={() => {
                    dispatch(closeCancelSessionPopup());
                    dispatch(openCreatedSessions());
                }}
                backgroundColor="#F56D38"
                borderColor="#F56D38"
                color="#FFFFFF"
                disabled={isApiLoading}
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
