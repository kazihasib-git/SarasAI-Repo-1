import { Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    closeReasonForLeave,
    fetchTAScheduleById,
    fetchTaSlots,
    reasonForLeave,
} from '../../redux/features/adminModule/ta/taAvialability';
import {
    closeCoachReasonForLeave,
    fetchCoachScheduleById,
    fetchCoachSlots,
    reasonForCoachLeave,
} from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import CustomTextField from '../CustomFields/CustomTextField';
import ReusableDialog from '../CustomFields/ReusableDialog';
import { useParams } from 'react-router-dom';
import CustomButton from '../CustomFields/CustomButton';
import { toast } from 'react-toastify';

const ReasonForLeave = ({ componentName }) => {
    const dispatch = useDispatch();
    const { id, name } = useParams();
    const [leaveReason, setleaveReason] = useState('');

    let reasonForLeaveOpenKey,
        closeReasonForLeaveAction,
        markLeaveKey,
        slotEventKey,
        reasonForLeaveAction,
        sliceName,
        getSlotsApi,
        getSessionApi;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taAvialability';
            reasonForLeaveOpenKey = 'reasonForLeaveOpen';
            closeReasonForLeaveAction = closeReasonForLeave;
            markLeaveKey = 'markLeaveData';
            slotEventKey = 'slotEventData';
            reasonForLeaveAction = reasonForLeave;
            getSlotsApi = fetchTaSlots;
            getSessionApi = fetchTAScheduleById;
            break;

        case 'COACHCALENDER':
            sliceName = 'coachAvailability';
            reasonForLeaveOpenKey = 'reasonForCoachLeaveOpen';
            closeReasonForLeaveAction = closeCoachReasonForLeave;
            markLeaveKey = 'coachMarkLeaveData';
            slotEventKey = 'slotCoachEventData';
            reasonForLeaveAction = reasonForCoachLeave;
            getSlotsApi = fetchCoachSlots;
            getSessionApi = fetchCoachScheduleById;
            break;

        default:
            sliceName = null;
            reasonForLeaveOpenKey = null;
            closeReasonForLeaveAction = null;
            markLeaveKey = null;
            slotEventKey = null;
            reasonForLeaveAction = null;
            getSlotsApi = null;
            getSessionApi = null;
            break;
    }

    const {
        [reasonForLeaveOpenKey]: reasonForLeaveOpen,
        [markLeaveKey]: markLeaveData,
        [slotEventKey]: slotEventDetails,
    } = useSelector(state => state[sliceName] || {});

    const handleSubmit = () => {
        if (!leaveReason) {
            toast.error('Enter Reason For Leave');
            return;
        }
        if (markLeaveData && markLeaveData.data) {
            const slots = markLeaveData.data;

            const requestBody = {
                admin_user_id: id,
                approve_status: null,
                leave_type: null,
                reason: null,
                approve_status: null,
                leave_type: null,
                reason: leaveReason,

                data: slots,
            };

            dispatch(reasonForLeaveAction(requestBody)).then(() => {
                dispatch(getSlotsApi(id));
                dispatch(getSessionApi(id));
                dispatch(closeReasonForLeaveAction());
            });
        }
    };

    const content = (
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 0 }}>
            <Grid item xs={120}>
                <CustomTextField
                    label="Reason for Leave"
                    fullWidth
                    value={leaveReason}
                    onChange={e => setleaveReason(e.target.value)}
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
            style={{
                backgroundColor: '#F56D3B',
                borderColor: '#F56D3B',
                color: '#FFFFFF',
                textTrasform: 'none',
            }}
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={reasonForLeaveOpen}
            handleClose={() => dispatch(closeReasonForLeaveAction())}
            title="Reason For Leave"
            content={content}
            actions={actions}
        />
    );
};

export default ReasonForLeave;
