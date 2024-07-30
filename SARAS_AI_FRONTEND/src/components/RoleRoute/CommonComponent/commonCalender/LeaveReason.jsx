import React from 'react';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import { Grid } from '@mui/material';
import CustomTextField from '../../../CustomFields/CustomTextField';
import { useDispatch, useSelector } from 'react-redux';

const LeaveReason = ({ componentName }) => {
    const dispatch = useDispatch();

    let sliceName;
    switch (componentName) {
        case 'TAMENU':
            sliceName = 'taMenu';
            break;

        case 'COACHMENU':
            sliceName = 'coachMenu';
            break;

        default:
            sliceName = null;
            break;
    }

    const selectState = useSelector(state => state[sliceName]);

    const handleSubmit = () => {};

    const content = (
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 0 }}>
            <Grid item xs={120}>
                <CustomTextField
                    label="Reason for Leave"
                    fullWidth
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
            open={''}
            handleClose={() => dispatch()}
            title="Reason For Leave"
            content={content}
            actions={actions}
        />
    );
};

export default LeaveReason;
