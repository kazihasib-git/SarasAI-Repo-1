import { Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTaMenuSlotsForLeave } from '../../../../redux/features/taModule/tamenuSlice';
import { getCoachMenuSlotsForLeave } from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import {
    closeMarkLeaveDate,
    openCreatedSlots,
} from '../../../../redux/features/commonCalender/commonCalender';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import CustomButton from '../../../CustomFields/CustomButton';
import CustomFutureDateField from '../../../CustomFields/CustomFutureDateField';

const markLeaveConfig = {
    TAMENU: {
        sliceName: 'taMenu',
        getSlotsByDateApi: getTaMenuSlotsForLeave,
    },
    COACHMENU: {
        sliceName: 'coachMenu',
        getSlotsByDateApi: getCoachMenuSlotsForLeave,
    },
};

const MarkLeaveDate = ({ componentName, timezone }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        fromDate: null,
        toDate: null,
    });
    const [errors, setErrors] = useState({}); // Error state

    const { sliceName, getSlotsByDateApi } = markLeaveConfig[componentName];

    const stateSelector = useSelector(state => state[sliceName]);
    const { markLeave } = useSelector(state => state.commonCalender);

    const validate = () => {
        const newErrors = {};

        let inputDate = new Date(formData.fromDate);
        let inputToDate = new Date(formData.toDate); 

        if (!formData.fromDate || isNaN(inputDate.getTime())) newErrors.fromDate = 'From Date is required';
        if (!formData.toDate || isNaN(inputToDate.getTime())) newErrors.toDate = 'To Date is required';
        if (
            formData.fromDate &&
            formData.toDate &&
            formData.fromDate > formData.toDate
        ) {
            newErrors.toDate = 'From Date should be earlier than To Date';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: null })); // Clear error on change
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (!validate()) return;

        const data = {
            start_date: formData.fromDate,
            end_date: formData.toDate,
            start_time: '00:00:00',
            end_time: '23:59:59',
            timezone_name: timezone.time_zone,
        };

        dispatch(getSlotsByDateApi(data))
            .unwrap()
            .then(() => {
                dispatch(closeMarkLeaveDate());
                dispatch(openCreatedSlots());
            })
            .catch(error => {
                console.error('API Error:', error);
            });
    };

    const content = (
        <Grid
            container
            sx={{
                pt: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <Grid
                container
                spacing={2} // Add spacing between grid items
                sx={{
                    pt: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <Grid item xs={12} sm={6}>
                    <CustomFutureDateField
                        label="From Date"
                        name="fromDate"
                        value={formData.fromDate}
                        onChange={date => handleChange('fromDate', date)}
                        error={!!errors.fromDate}
                        helperText={errors.fromDate}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CustomFutureDateField
                        label="To Date"
                        name="toDate"
                        value={formData.toDate}
                        onChange={date => handleChange('toDate', date)}
                        error={!!errors.toDate}
                        helperText={errors.toDate}
                    />
                </Grid>
            </Grid>
        </Grid>
    );

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            backgroundColor="#F56D3B"
            borderColor="#F56D3B"
            color="#FFFFFF"
            textTransform="none"
            fontFamily="Bold"
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={markLeave}
            handleClose={() => dispatch(closeMarkLeaveDate())}
            title="Mark Leave"
            content={content}
            actions={actions}
        />
    );
};

export default MarkLeaveDate;
