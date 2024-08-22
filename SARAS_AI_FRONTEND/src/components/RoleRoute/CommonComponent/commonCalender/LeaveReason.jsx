import React, { useState } from 'react';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import { Grid } from '@mui/material';
import CustomTextField from '../../../CustomFields/CustomTextField';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../../CustomFields/CustomButton';
import { closeReasonForLeavePopup } from '../../../../redux/features/commonCalender/commonCalender';
import { toast } from 'react-toastify';
import { getCoachMenuSessions, getCoachMenuSlots, reasonForCoachMenuLeave } from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import { getTaMenuSessions, getTaMenuSlots, reasonForTaMenuLeave } from '../../../../redux/features/taModule/tamenuSlice';

const LeaveReason = ({ componentName }) => {

    const dispatch = useDispatch();
    const [reasonOfLeave,setReasonOfLeave] = useState('')
    const { slotsLeaveData, openLeaveReason } = useSelector((state) => state.commonCalender)

    let sliceName,
        reasonForLeaveApi,
        getSlotsApi,
        getSessionApi;

    switch (componentName) {

        case 'TAMENU':
            sliceName = 'taMenu';
            reasonForLeaveApi = reasonForTaMenuLeave;
            getSlotsApi = getTaMenuSlots;
            getSessionApi = getTaMenuSessions;
            break;

        case 'COACHMENU':
            sliceName = 'coachMenu';
            reasonForLeaveApi = reasonForCoachMenuLeave;
            getSlotsApi = getCoachMenuSlots
            getSessionApi = getCoachMenuSessions
            break;

        default:
            sliceName = null;
            reasonForLeaveApi = null;
            getSlotsApi = null;
            getSessionApi = null;
            break;
    }

    const selectState = useSelector(state => state[sliceName]);

    const handleSubmit = () => {
        if(!reasonOfLeave){
            toast.error('Enter Reason For Leave')
            return;
        }

        console.log("slotsLeaveData :", slotsLeaveData)

        if(slotsLeaveData && slotsLeaveData.data){
            const slots = slotsLeaveData.data;

            const reqBody = {
                approve_status : null,
                leave_type : null,
                reason : null,
                approve_status : null,
                leave_type : null,
                reason : reasonOfLeave,
                data : slots
            }

            dispatch(reasonForLeaveApi(reqBody))
            .then(() => {
                dispatch(getSlotsApi())
                dispatch(getSessionApi())
                dispatch(closeReasonForLeavePopup())
            })

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
