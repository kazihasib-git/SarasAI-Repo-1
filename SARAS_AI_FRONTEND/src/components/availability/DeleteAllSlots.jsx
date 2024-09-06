import React, { useEffect } from 'react';
import { DialogContentText, Grid } from '@mui/material';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomTextField from '../CustomFields/CustomTextField';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchTaSlots,
    fetchTAScheduleById,
    deleteTaFutureSlots,
    closeDeleteTaSlots,
} from '../../redux/features/adminModule/ta/taAvialability';
import {
    closeDeleteCoachSlots,
    deleteCoachFutureSlots,
    fetchCoachScheduleById,
    fetchCoachSlots,
} from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import CustomButton from '../CustomFields/CustomButton';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const deleteSlotConfig = {
    TACALENDER: {
        sliceName: 'taAvialability',
        getSlotsApi: fetchTaSlots,
        getSessionsApi: fetchTAScheduleById,
        deleteFutureSlotsApi: deleteTaFutureSlots,
        openPopupState: 'deletingCoachFutureSlots',
        closePopupAction: closeDeleteTaSlots,
    },
    COACHCALENDER: {
        sliceName: 'coachAvailability',
        getSlotsApi: fetchCoachSlots,
        getSessionsApi: fetchCoachScheduleById,
        deleteFutureSlotsApi: deleteCoachFutureSlots,
        openPopupState: 'deletingCoachFutureSlots',
        closePopupAction: closeDeleteCoachSlots,
    },
};

const DeleteAllSlots = ({ id, name, componentName, timezone }) => {
    const dispatch = useDispatch();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const {
        sliceName,
        getSlotsApi,
        getSessionsApi,
        deleteFutureSlotsApi,
        openPopupState,
        closePopupAction,
    } = deleteSlotConfig[componentName];

    const onSubmit = async () => {
        dispatch(deleteFutureSlotsApi(id))
            .unwrap()
            .then(() => {
                dispatch(closePopupAction());
                dispatch(getSlotsApi(id));
                dispatch(getSessionsApi(id));
                toast.success('Slot(s) have been successfully deleted.');
            })
            .catch(error => {
                toast.error(` ${error}`);
            });
    };

    useEffect(() => {
        if (!open) {
            setReason('');
        }
    }, [open]);

    const content = (
        <>
            <DialogContentText
                sx={{
                    color: '#1A1E3D',
                    textAlign: 'center',
                    p: 2,
                }}
            >
                Are you sure?
            </DialogContentText>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Controller
                        name="deleteFutureSlots"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Reason For Deletion is required' }}
                        render={({ field }) => (
                            <CustomTextField
                                label="Delete All Future Slots"
                                placeholder="Reason for deletion"
                                {...field}
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={4}
                                error={Boolean(errors.deleteFutureSlots)}
                                helperText={errors.deleteFutureSlots?.message}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </>
    );

    const actions = (
        <>
            <CustomButton
                onClick={() => dispatch(closePopupAction())}
                backgroundColor="#FFFFFF"
                borderColor="#F56D3B"
                color="#F56D3B"
            >
                Back
            </CustomButton>
            <CustomButton
                onClick={handleSubmit(onSubmit)}
                backgroundColor="#F56D3B"
                borderColor="#F56D3B"
                color="#FFFFFF"
                textTransform="none"
            >
                Submit
            </CustomButton>
        </>
    );

    return (
        <ReusableDialog
            open={openPopupState}
            handleClose={() => dispatch(closePopupAction())}
            title="Delete All Future Slots"
            content={content}
            actions={actions}
        />
    );
};

export default DeleteAllSlots;
