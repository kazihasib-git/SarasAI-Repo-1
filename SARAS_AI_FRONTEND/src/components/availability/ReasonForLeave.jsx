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
import { Controller, useForm } from 'react-hook-form';

const reasonForLeaveConfig = {
    TACALENDER: {
        sliceName: 'taAvialability',
        reasonForLeaveOpenKey: 'reasonForLeaveOpen',
        closeReasonForLeaveAction: closeReasonForLeave,
        markLeaveKey: 'markLeaveData',
        slotEventKey: 'slotEventData',
        reasonForLeaveAction: reasonForLeave,
        getSlotsApi: fetchTaSlots,
        getSessionApi: fetchTAScheduleById,
    },
    COACHCALENDER: {
        sliceName: 'coachAvailability',
        reasonForLeaveOpenKey: 'reasonForCoachLeaveOpen',
        closeReasonForLeaveAction: closeCoachReasonForLeave,
        markLeaveKey: 'coachMarkLeaveData',
        slotEventKey: 'slotCoachEventData',
        reasonForLeaveAction: reasonForCoachLeave,
        getSlotsApi: fetchCoachSlots,
        getSessionApi: fetchCoachScheduleById,
    },
};

const ReasonForLeave = ({ id, name, componentName, timezone }) => {
    const dispatch = useDispatch();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const {
        reasonForLeaveOpenKey,
        closeReasonForLeaveAction,
        markLeaveKey,
        slotEventKey,
        reasonForLeaveAction,
        sliceName,
        getSlotsApi,
        getSessionApi,
    } = reasonForLeaveConfig[componentName];

    const {
        [reasonForLeaveOpenKey]: reasonForLeaveOpen,
        [markLeaveKey]: markLeaveData,
        [slotEventKey]: slotEventDetails,
    } = useSelector(state => state[sliceName] || {});

    const onSumbit = data => {
        if (!data.reason) {
            toast.error('Enter Reason For Leave');
            return;
        }

        if (markLeaveData && markLeaveData.data) {
            const slots = markLeaveData.data;

            const requestBody = {
                admin_user_id: id,
                approve_status: null,
                leave_type: null,
                approve_status: null,
                leave_type: null,
                reason: data.reason,
                data: slots,
            };

            dispatch(reasonForLeaveAction(requestBody))
                .unwrap()
                .then(() => {
                    dispatch(getSlotsApi(id));
                    dispatch(getSessionApi(id));
                    dispatch(closeReasonForLeaveAction());
                    toast.success('Leave has been successfully created.');
                })
                .catch(error => {
                    toast.error(` ${error}`);
                });
        }
    };

    const content = (
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 0 }}>
            <Grid item xs={12}>
                <Controller
                    name="reason"
                    control={control}
                    defaultValue=""
                    rules={{ required: 'Reason For Leave is required' }}
                    render={({ field }) => (
                        <CustomTextField
                            label="Reason for Leave"
                            placeholder="Enter reason for leave"
                            {...field}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                            error={Boolean(errors.reason)}
                            helperText={errors.reason?.message}
                        />
                    )}
                />
            </Grid>
        </Grid>
    );

    const actions = (
        <CustomButton
            onClick={handleSubmit(onSumbit)}
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
