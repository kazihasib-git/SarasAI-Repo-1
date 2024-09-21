import React, { useState } from 'react';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import { Grid } from '@mui/material';
import CustomTextField from '../../../CustomFields/CustomTextField';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../../CustomFields/CustomButton';
import { closeReasonForLeavePopup,
    setTotalSessionsForMarkLeave,
 } from '../../../../redux/features/commonCalender/commonCalender';
import { toast } from 'react-toastify';
import {
    getCoachMenuSessions,
    getCoachMenuSlots,
    reasonForCoachMenuLeave,
} from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import {
    getTaMenuSessions,
    getTaMenuSlots,
    reasonForTaMenuLeave,
} from '../../../../redux/features/taModule/tamenuSlice';

const leaveConfig = {
    TAMENU: {
        sliceName: 'taMenu',
        reasonForLeaveApi: reasonForTaMenuLeave,
        getSlotsApi: getTaMenuSlots,
        getSessionApi: getTaMenuSessions,
    },
    COACHMENU: {
        sliceName: 'coachMenu',
        reasonForLeaveApi: reasonForCoachMenuLeave,
        getSlotsApi: getCoachMenuSlots,
        getSessionApi: getCoachMenuSessions,
    },
};

const LeaveReason = ({ componentName, timezone }) => {
    const dispatch = useDispatch();
    const [reasonOfLeave, setReasonOfLeave] = useState('');
    const { slotsLeaveData, openLeaveReason } = useSelector(
        state => state.commonCalender
    );

    const { sliceName, reasonForLeaveApi, getSlotsApi, getSessionApi } =
        leaveConfig[componentName];

    const selectState = useSelector(state => state[sliceName]);
    const { totalSessionsForMarkLeave } = useSelector(state => state.commonCalender);

    const handleSubmit = () => {
        if (!reasonOfLeave) {
            toast.error('Enter Reason For Leave');
            return;
        }

        if (slotsLeaveData && slotsLeaveData.data) {
            const slots = slotsLeaveData.data;

            const reqBody = {
                approve_status: null,
                leave_type: null,
                reason: null,
                approve_status: null,
                leave_type: null,
                reason: reasonOfLeave,
                total_sessions: totalSessionsForMarkLeave,
                data: slots,
            };

            dispatch(reasonForLeaveApi(reqBody)).then(() => {
                dispatch(getSlotsApi());
                dispatch(getSessionApi());
                dispatch(closeReasonForLeavePopup());
            });
        }
    };

    const content = (
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 0 }}>
            <Grid item xs={120}>
                <CustomTextField
                    label="Reason for Leave"
                    fullWidth
                    value={reasonOfLeave}
                    onChange={e => setReasonOfLeave(e.target.value)}
                    placeholder="Enter reason for leave"
                    variant="outlined"
                    multiline
                    rows={4}
                />
            </Grid>
        </Grid>
    );

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            backgroundColor="#F56D3B"
            borderColor="#F56D3B"
            color="#FFFFFF"
            style={{ textTransform: 'none' }}
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={openLeaveReason}
            handleClose={() => dispatch(closeReasonForLeavePopup())}
            title="Reason For Leave"
            content={content}
            actions={actions}
        />
    );
};

export default LeaveReason;
