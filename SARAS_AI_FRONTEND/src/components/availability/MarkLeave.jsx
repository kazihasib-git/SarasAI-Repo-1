import React, { useState } from 'react';
import { Grid } from '@mui/material';
import ReusableDialog from '../CustomFields/ReusableDialog';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
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
import CustomFutureDateField from '../CustomFields/CustomFutureDateField';

const markLeaveConfig = {
    TACALENDER: {
        sliceName: 'taAvialability',
        scheduleSessionOpenKey: 'markLeaveOpen',
        schedulingStateKey: 'taAvialability',
        openAvailableSlotsAction: openScheduledSlots,
        closeMarkLeaveAction: closeMarkLeave,
        getSlotsAction: getSlots,
    },
    COACHCALENDER: {
        sliceName: 'coachAvailability',
        scheduleSessionOpenKey: 'coachMarkLeaveOpen',
        schedulingStateKey: 'coachAvailability',
        openAvailableSlotsAction: openCoachScheduledSlots,
        closeMarkLeaveAction: closeCoachMarkLeave,
        getSlotsAction: getCoachSlots,
    },
};

const MarkLeave = ({ id, name, componentName, timezone }) => {
    const dispatch = useDispatch();
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const {
        scheduleSessionOpenKey,
        schedulingStateKey,
        openAvailableSlotsAction,
        closeMarkLeaveAction,
        getSlotsAction,
        sliceName,
    } = markLeaveConfig[componentName];

    const schedulingState = useSelector(state =>
        schedulingStateKey ? state[schedulingStateKey] : {}
    );
    const { [scheduleSessionOpenKey]: markLeaveOpen } = schedulingState;

    const validateDates = () => {

        let inputDate = new Date(fromDate);
        let inputToDate = new Date(toDate); 

        const today = moment().startOf('day');

        if (moment(inputDate).isBefore(today) || moment(inputToDate).isBefore(today)) {
            // toast.error('The date must be today or a future date.');
            return false;
        }

        if (!fromDate || !toDate || isNaN(inputDate.getTime()) || isNaN(inputToDate.getTime())) {
            toast.error('Please select dates');
            return false;
        } else if (fromDate > toDate) {
            toast.error('Please select To Date after the From Date');
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (validateDates()) {
            const formattedFromDate = moment(fromDate).format('YYYY-MM-DD');
            const formattedToDate = moment(toDate).format('YYYY-MM-DD');

            const leaveData = {
                admin_user_id: id,
                start_date: formattedFromDate,
                end_date:
                    formattedFromDate === formattedToDate
                        ? formattedFromDate
                        : formattedToDate,
                start_time: '00:00:00',
                end_time: '23:59:59',
                timezone_name: timezone.time_zone,
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
                <CustomFutureDateField
                    label="From Date"
                    value={fromDate}
                    onChange={setFromDate}
                />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ pl: 2 }}>
                <CustomFutureDateField
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
                backgroundColor: '#F56D3B',
                borderColor: '#F56D3B',
                color: '#FFFFFF',
                textTransform: 'none',
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
