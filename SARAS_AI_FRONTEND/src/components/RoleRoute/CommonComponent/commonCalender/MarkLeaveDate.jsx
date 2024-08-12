import { Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getTaMenuSlotsForLeave,
    getTaSlotsForLeave,
} from '../../../../redux/features/taModule/tamenuSlice';
import {
    getCoachMenuSlotsForLeave,
    getSlotsForLeave,
} from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import { toast } from 'react-toastify';
import {
    closeMarkLeaveDate,
    openCreatedSlots,
} from '../../../../redux/features/commonCalender/commonCalender';
import CustomDateField from '../../../CustomFields/CustomDateField';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import CustomButton from '../../../CustomFields/CustomButton';

const MarkLeaveDate = ({ componentName }) => {
    console.log('Comp Name :', componentName);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        fromDate: null,
        toDate: null,
    });

    let sliceName, getSlotsByDateApi;

    switch (componentName) {
        case 'TAMENU':
            sliceName = 'taMenu';
            getSlotsByDateApi = getTaMenuSlotsForLeave;
            break;

        case 'COACHMENU':
            sliceName = 'coachMenu';
            getSlotsByDateApi = getCoachMenuSlotsForLeave;
            break;

        default:
            sliceName = null;
            getSlotsByDateApi = null;
            break;
    }

    const stateSelector = useSelector(state => state[sliceName]);
    const { markLeave } = useSelector(state => state.commonCalender);

    const validate = () => {
        if (!formData.fromDate || !formData.toDate) {
            return false;
        }
        if (formData.fromDate > fromDate.toDate) {
            toast.error('fromDate should be smaller than to Date');
            return false;
        }
        return true;
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = e => {
        e.preventDefault();

        const data = {
            start_date: formData.fromDate,
            end_date: formData.toDate,
            start_time: '00:00:00',
            end_time: '23:59:59',
        };

        dispatch(getSlotsByDateApi(data)).then(() => {
            dispatch(closeMarkLeaveDate());
            dispatch(openCreatedSlots());
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
            <Grid item xs={12} sm={6}>
                <CustomDateField
                    label="From Date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={date => handleChange('fromDate', date)}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomDateField
                    label="To Date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={date => handleChange('toDate', date)}
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
