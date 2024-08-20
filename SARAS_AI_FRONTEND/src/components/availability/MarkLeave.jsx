import React, { useState } from 'react';
import { Grid, Button } from '@mui/material';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomDateField from '../CustomFields/CustomDateField';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import {
    openScheduledSlots,
    closeMarkLeave,
    getSlots,
} from '../../redux/features/adminModule/ta/taAvialability';
import {
    openCoachScheduledSlots,
    closeCoachMarkLeave,
    getCoachSlots,
} from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import CustomButton from '../CustomFields/CustomButton';
import { timezoneIdToName } from '../../utils/timezoneIdToName';

const MarkLeave = ({ componentName, timezoneID }) => {
    const { id: taId } = useParams(); // Ensure taId is correctly extracted
    const dispatch = useDispatch();
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const { timezones } = useSelector((state) => state.util)

    let scheduleSessionOpenKey,
        schedulingStateKey,
        openAvailableSlotsAction,
        closeMarkLeaveAction,
        getSlotsAction,
        sliceName;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taAvialability';
            scheduleSessionOpenKey = 'markLeaveOpen';
            schedulingStateKey = 'taAvialability';
            openAvailableSlotsAction = openScheduledSlots;
            closeMarkLeaveAction = closeMarkLeave;
            getSlotsAction = getSlots;
            break;

        case 'COACHCALENDER':
            sliceName = 'coachAvailability';
            scheduleSessionOpenKey = 'coachMarkLeaveOpen';
            schedulingStateKey = 'coachAvailability';
            openAvailableSlotsAction = openCoachScheduledSlots;
            closeMarkLeaveAction = closeCoachMarkLeave;
            getSlotsAction = getCoachSlots;
            break;

        default:
            sliceName = null;
            scheduleSessionOpenKey = null;
            schedulingStateKey = null;
            openAvailableSlotsAction = null;
            closeMarkLeaveAction = null;
            getSlotsAction = null;
            break;
    }

    const schedulingState = useSelector(state =>
        schedulingStateKey ? state[schedulingStateKey] : {}
    );
    const { [scheduleSessionOpenKey]: markLeaveOpen } = schedulingState;

    const validateDates = () => {
        if (!fromDate || !toDate) {
            toast.error('Please select dates');
            return false;
        }else if(fromDate > toDate){
            toast.error('Please select To Date after the From Date')
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (validateDates()) {
            const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
            const formattedToDate = moment(toDate).format('YYYY-MM-DD');

            const leaveData = {
                admin_user_id: taId,
                start_date: formattedFromDate,
                end_date:
                    formattedFromDate === formattedToDate
                        ? formattedFromDate
                        : formattedToDate,
                start_time: '00:00:00',
                end_time: '23:59:59',
                timezone_name: timezoneIdToName(timezoneID, timezones),
            };

            dispatch(getSlotsAction(leaveData))
                .unwrap()
                .then(() => {
                    dispatch(openAvailableSlotsAction(leaveData));
                    dispatch(closeMarkLeaveAction());
                })
                .catch(error => {
                    console.error('Failed to fetch scheduled slots:', error);
                    dispatch(openAvailableSlotsAction(leaveData));
                    dispatch(closeMarkLeaveAction());
                });
        }
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
            <Grid item xs={12} sm={6} sx={{ pr: 2 }}>
                <CustomDateField
                    label="From Date"
                    value={fromDate}
                    onChange={setFromDate}
                />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pl: 2 }}>
                <CustomDateField
                    label="To Date"
                    value={toDate}
                    onChange={setToDate}
                />
            </Grid>
        </Grid>
    );

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            style={{
                backgroundColor : "#F56D3B",
                borderColor : "#F56D3B",
                color : "#FFFFFF",
                textTransform : 'none'
            }}
            
        >
            Submit
        </CustomButton>
    );

    return (
        <>
            <ReusableDialog
                open={markLeaveOpen}
                handleClose={() => dispatch(closeMarkLeaveAction())}
                title="Mark Leave"
                content={content}
                actions={actions}
            />
        </>
    );
};

export default MarkLeave;
