import React, { useEffect, useMemo, useState } from 'react';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomDateField from '../CustomFields/CustomDateField';
import { Button, DialogContent, Grid } from '@mui/material';
import CustomTimeField from '../CustomFields/CustomTimeField';
import { useDispatch, useSelector } from 'react-redux';
import PopUpTable from '../CommonComponent/PopUpTable';
import { useParams } from 'react-router-dom';
import { rescheduleSession } from '../../redux/features/adminModule/ta/taScheduling';
import { rescheduleCoachSession } from '../../redux/features/adminModule/coach/coachSchedule';

import {
    closeRescheduleSession,
    fetchAvailableSlots,
    getScheduleSession,
    openReasonForLeave,
    openScheduledSession,
} from '../../redux/features/adminModule/ta/taAvialability';

import {
    closeCoachRescheduleSession,
    getCoachScheduleSession,
    openCoachReasonForLeave,
    openCoachScheduledSession,
    fetchCoachAvailableSlots,
} from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import CustomButton from '../CustomFields/CustomButton';

const headers = ['S. No.', 'Slots Available', 'Select'];

const ReschedulingSession = ({ componentName }) => {
    console.log('componentName : ', componentName);
    const taId = useParams();
    const dispatch = useDispatch();
    const [selectDate, setSelectDate] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [fromTime, setFromTime] = useState(null);
    const [toTime, setToTime] = useState(null);
    const [transformedSlotsData, setTransformedSlotsData] = useState([]);

    let rescheduleSessionOpenKey,
        closeRescheduleSessionAction,
        fetchAvailableSlotsAction,
        getScheduleSessionAction,
        openScheduledSessionAction,
        availableSlotsAction,
        sessionEventAction,
        slotEventAction,
        sliceName,
        reschduleSessionAction;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taAvailability';
            rescheduleSessionOpenKey = 'resheduleSessionOpen';
            closeRescheduleSessionAction = closeRescheduleSession;
            fetchAvailableSlotsAction = fetchAvailableSlots;
            getScheduleSessionAction = getScheduleSession;
            openScheduledSessionAction = openScheduledSession;
            availableSlotsAction = 'availableSlotsData';
            sessionEventAction = 'sessionEventData';
            slotEventAction = 'slotEventData';
            reschduleSessionAction = rescheduleSession;
            break;
        case 'COACHCALENDER':
            sliceName = 'coachAvailability';
            rescheduleSessionOpenKey = 'resheduleCoachSessionOpen';
            closeRescheduleSessionAction = closeCoachRescheduleSession;
            fetchAvailableSlotsAction = fetchCoachAvailableSlots;
            getScheduleSessionAction = getCoachScheduleSession;
            openScheduledSessionAction = openCoachScheduledSession;
            availableSlotsAction = 'availableCoachSlotsData';
            sessionEventAction = 'sessionCoachEventData';
            slotEventAction = 'slotCoachEventData';
            reschduleSessionAction = rescheduleCoachSession;
            break;

        default:
            sliceName = null;
            rescheduleSessionOpenKey = null;
            closeRescheduleSessionAction = null;
            fetchAvailableSlotsAction = null;
            getScheduleSessionAction = null;
            openScheduledSessionAction = null;
            availableSlotsAction = null;
            sessionEventAction = null;
            slotEventAction = null;
            reschduleSessionAction;
            break;
    }

    const {
        [rescheduleSessionOpenKey]: rescheduleSessionOpen,
        [availableSlotsAction]: availableSlotsData,
        [sessionEventAction]: sessionEventData,
        [slotEventAction]: slotEventData,
    } = useSelector(state => state[sliceName]);

    useEffect(() => {
        if (selectDate) {
            console.log('Fetching slots for date:', selectDate);
            const data = {
                admin_user_id: taId.id,
                date: selectDate,
            };
            dispatch(fetchAvailableSlotsAction(data));
        }
    }, [selectDate, taId.id, dispatch, fetchAvailableSlotsAction]);

    useEffect(() => {
        console.log('Available Slots Data:', availableSlotsData);
        if (availableSlotsData && availableSlotsData.length > 0) {
            const transformedData = availableSlotsData.map((slot, index) => ({
                'S. No.': index + 1,
                'Slots Available': `${slot.from_time} - ${slot.to_time}`,
                id: slot.id,
            }));
            setTransformedSlotsData(transformedData);
        } else {
            setTransformedSlotsData([]);
        }
    }, [availableSlotsData]);

    const handleDateChange = date => {
        setSelectDate(date);
        setSelectedSlots([]); // Clear selected slots when date changes
    };

    const handleSelectSlot = id => {
        console.log('Selected Slot ID:', id);
        setSelectedSlots(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    console.log('slotEventData ::::::', slotEventData);

    const handleSubmit = () => {
        console.log('*** Submitting Reschedule Session....');
        dispatch(
            reschduleSessionAction({
                id: sessionEventData ? sessionEventData.id : '',
                data: {
                    admin_user_id: taId.id,
                    schedule_date: selectDate,
                    slot_id: selectedSlots[0], // Assuming only one slot can be selected
                    start_time: fromTime,
                    end_time: toTime,
                    timezone: 'IST',
                    event_status: 'rescheduled',
                },
            })
        )
            .unwrap()
            .then(() => {
                // console.log("SLOT EVENT DATA : ", slotEventData)
                dispatch(closeRescheduleSessionAction());
                dispatch(getScheduleSessionAction());
                dispatch(openScheduledSessionAction(slotEventData));
            })
            .catch(error => {
                console.error('Error rescheduling session:', error);
            });
    };

    const headers = ['S. No.', 'Slots Available', 'Select']; // Example headers for PopUpTable, adjust as per your actual implementation

    const content = (
        <>
            <Grid
                item
                xs={12}
                sm={6}
                mb={2}
                pt={'16px'}
                style={{ display: 'flex', justifyContent: 'center' }}
            >
                <CustomDateField
                    label="Select Date"
                    value={selectDate}
                    onChange={handleDateChange}
                    name="selectDate"
                    sx={{ width: '50%' }}
                />
            </Grid>

            {selectDate && transformedSlotsData.length === 0 ? (
                <DialogContent
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    No Slots Available
                </DialogContent>
            ) : (
                selectDate && (
                    <>
                        <PopUpTable
                            headers={headers}
                            initialData={transformedSlotsData}
                            onRowClick={handleSelectSlot}
                            selectedBox={selectedSlots}
                            itemsPerPage={4}
                        />
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
                                <CustomTimeField
                                    label="Start Time"
                                    value={fromTime}
                                    onChange={time => setFromTime(time)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CustomTimeField
                                    label="End Time"
                                    value={toTime}
                                    onChange={time => setToTime(time)}
                                />
                            </Grid>
                        </Grid>
                    </>
                )
            )}
        </>
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

    console.log('rescheduleSessionOpen', rescheduleSessionOpen);

    return (
        <ReusableDialog
            open={rescheduleSessionOpen}
            handleClose={() => {
                dispatch(closeRescheduleSessionAction());
                dispatch(openScheduledSessionAction());
            }}
            title="Reschedule Session"
            content={content}
            actions={selectDate ? actions : undefined}
        />
    );
};

export default ReschedulingSession;
