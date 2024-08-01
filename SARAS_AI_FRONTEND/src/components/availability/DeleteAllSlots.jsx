import React, { useEffect } from 'react';
import {
    Box,
    Button,
    DialogContent,
    DialogContentText,
    Grid,
    TextField,
} from '@mui/material';
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

const DeleteAllSlots = ({ componentName }) => {
    const dispatch = useDispatch();

    let sliceName,
        getSlotsApi,
        getSessionsApi,
        deleteFutureSlotsApi,
        userIdState,
        userNameState,
        openPopupState,
        closePopupAction;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taAvialability';
            getSlotsApi = fetchTaSlots;
            getSessionsApi = fetchTAScheduleById;
            deleteFutureSlotsApi = deleteTaFutureSlots;
            userIdState = 'taId';
            userNameState = 'taName';
            openPopupState = 'deletingCoachFutureSlots';
            closePopupAction = closeDeleteTaSlots;
            break;

        case 'COACHCALENDER':
            sliceName = 'coachAvailability';
            getSlotsApi = fetchCoachSlots;
            getSessionsApi = fetchCoachScheduleById;
            deleteFutureSlotsApi = deleteCoachFutureSlots;
            userIdState = 'coachId';
            userNameState = 'coachName';
            openPopupState = 'deletingCoachFutureSlots';
            closePopupAction = closeDeleteCoachSlots;
            break;

        default:
            sliceName = null;
            getSlotsApi = null;
            getSessionsApi = null;
            deleteFutureSlotsApi = null;
            userIdState = null;
            userNameState = null;
            openPopupState = null;
            closePopupAction = null;
            break;
    }

    const selectState = useSelector(state => state[sliceName]);

    const { [userIdState]: userId, [userNameState]: userName } = selectState;

    const handleSubmit = async () => {
        try {
            console.log('TA ID : ', userId);
            console.log('TA NAME : ', userName);
            //get today date in YYYY-MM-DD format
            // const today = new Date();
            // const dd = String(today.getDate()).padStart(2, '0');
            // const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            // const yyyy = today.getFullYear();

            // const todayDate = yyyy + '-' + mm + '-' + dd;

            // const data = {
            //     date: todayDate,
            // };

            // dispatch actions
            dispatch(deleteFutureSlotsApi(userId)).then(() => {
                console.log('FEtching data after deleting slots');
                dispatch(closePopupAction());
                dispatch(getSlotsApi(userId));
                dispatch(getSessionsApi(userId));
            });
        } catch (error) {
            console.log('Error : ', error);
        }
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
                    <CustomTextField
                        label="Delete All Future Slots"
                        fullWidth
                        placeholder="Reason for deletion"
                        variant="outlined"
                        multiline
                        rows={4}
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
                onClick={handleSubmit}
                backgroundColor="#F56D3B"
                borderColor="#F56D3B"
                color="#FFFFFF"
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
