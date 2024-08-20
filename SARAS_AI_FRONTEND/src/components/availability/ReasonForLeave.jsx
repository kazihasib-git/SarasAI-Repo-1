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

const ReasonForLeave = ({ componentName }) => {
    const dispatch = useDispatch();
    const { id, name } = useParams();
    const [reasonForLeave, setReasonForLeave] = useState('');

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
            reasonForLeaveOpenKey = 'reasonForCoachLeaveOpen'; // Adjust based on your actual key
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
    } = useSelector(
        state => state[sliceName] || {} 
    );

    const handleSubmit = () => {
        if (slotEventDetails && slotEventDetails.length > 0) {
            const slots = slotEventDetails.data.map(slotId => {
                const slot = slotId?.data?.find(s => s.id === slotId);
                return {
                    slot_id: slot.id,
                    date: slot.slot_date,
                    start_time: slot.from_time,
                    end_time: slot.to_time,
                };
            });

            // Get the first and last slots
            const firstSlot = slots[0];
            const lastSlot = slots[slots.length - 1];

            const slotEventDetails = {
                admin_user_id: id,
                start_date: firstSlot.date,
                end_date: lastSlot.date,
                start_time: firstSlot.start_time,
                end_time: lastSlot.end_time,
                approve_status: 1,
                leave_type: 'full',
                reason: '',
                slot_id: slots.map(slot => slot.slot_id), // Collect all slot IDs into an array
            };

            const requestBody = {
                admin_user_id: id,
                approve_status: null,
                leave_type: null,
                reason: null,
                approve_status: null,
                leave_type: null,
                reason: reasonForLeavslotEventDetailse,

                data: slots.map(slot => slot),
            };

            dispatch(reasonForLeaveAction(requestBody)).then(() => {
                dispatch(getSlotsApi(id));
                dispatch(getSessionApi(id));
            });
            dispatch(closeReasonForLeaveAction());
        } else {
            console.log('No slots selected, opening reason for leave');
            console.log('mark leave data', markLeaveData);

            dispatch(reasonForLeaveAction(markLeaveData)).then(() => {
                dispatch(getSlotsApi(id));
                dispatch(getSessionApi(id));
            });
            dispatch(closeReasonForLeaveAction());
        }
    };

    const content = (
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 0 }}>
            <Grid item xs={120}>
                <CustomTextField
                    label="Reason for Leave"
                    fullWidth
                    value={reasonForLeave}
                    onChange={e => setReasonForLeave(e.target.value)}
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
