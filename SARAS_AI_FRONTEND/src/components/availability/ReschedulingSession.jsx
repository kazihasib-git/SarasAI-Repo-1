import React, { useEffect, useMemo, useState } from 'react';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomDateField from '../CustomFields/CustomDateField';
import { Button, DialogContent, Grid } from '@mui/material';
import CustomTimeField from '../CustomFields/CustomTimeField';
import CustomHostNameForm from '../CustomFields/CustomHostNameField';
import CustomMeetingTypeForm from '../CustomFields/CustomMeetingTypeField';
import { useDispatch, useSelector } from 'react-redux';
import PopUpTable from '../CommonComponent/PopUpTable';
import { useParams } from 'react-router-dom';
import { rescheduleSession } from '../../redux/features/adminModule/ta/taScheduling';
import { rescheduleCoachSession } from '../../redux/features/adminModule/coach/coachSchedule';
import { Controller, useForm } from 'react-hook-form';
import {
    closeRescheduleSession,
    fetchAvailableSlots,
    fetchTAScheduleById,
    fetchTaSlots,
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
    fetchCoachSlots,
    fetchCoachScheduleById,
} from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import CustomButton from '../CustomFields/CustomButton';
import { timezoneIdToName } from '../../utils/timezoneIdToName';
import { convertFromUTC } from '../../utils/dateAndtimeConversion';
import { getTimezone , getAllHosts} from '../../redux/features/utils/utilSlice';
import { toast } from 'react-toastify';
import PopTableSlot from '../CommonComponent/PopTableSlot';
const headers = ['S. No.', 'Slots Available', 'Select'];

const ReschedulingSession = ({ componentName, timezoneID }) => {
    const { timezones, platforms , hosts} = useSelector(state => state.util);

    const taId = useParams();
    const { id, name } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTimezone());
        dispatch(getAllHosts());
    }, [dispatch]);

    const [selectDate, setSelectDate] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [fromTime, setFromTime] = useState(null);
    const [toTime, setToTime] = useState(null);
    const [transformedSlotsData, setTransformedSlotsData] = useState([]);

    const {
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {

        },
    });

    const { dataToFindScheduleInSlot } = useSelector(
        state => state.commonCalender
    );

    let rescheduleSessionOpenKey,
        closeRescheduleSessionAction,
        fetchAvailableSlotsAction,
        getScheduleSessionAction,
        openScheduledSessionAction,
        availableSlotsAction,
        sessionEventAction,
        slotEventAction,
        sliceName,
        reschduleSessionAction,
        fetchSlotsApi,
        fetchSessionsApi;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taAvialability';
            rescheduleSessionOpenKey = 'resheduleSessionOpen';
            closeRescheduleSessionAction = closeRescheduleSession;
            fetchAvailableSlotsAction = fetchAvailableSlots;
            getScheduleSessionAction = getScheduleSession;
            openScheduledSessionAction = openScheduledSession;
            availableSlotsAction = 'availableSlotsData';
            sessionEventAction = 'sessionEventData';
            slotEventAction = 'slotEventData';
            reschduleSessionAction = rescheduleSession;
            fetchSlotsApi = fetchTaSlots;
            fetchSessionsApi = fetchTAScheduleById;
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
            fetchSlotsApi = fetchCoachSlots
            fetchSessionsApi = fetchCoachScheduleById;
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
            reschduleSessionAction = null;
            fetchSlotsApi = null;
            fetchSessionsApi = null;
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
            const data = {
                admin_user_id: taId.id,
                date: selectDate,
                timezone_name: timezoneIdToName(timezoneID, timezones),
            };
            dispatch(fetchAvailableSlotsAction(data));
        }
    }, [selectDate, taId.id, dispatch, fetchAvailableSlotsAction]);

    const formatTime = time => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${ampm}`;
    };

    const convertavailableSlotData = async () => {

        if (
            availableSlotsData &&
            availableSlotsData.length > 0 &&
            timezones &&
            timezoneID
        ) {
            const timezonename = timezoneIdToName(timezoneID, timezones);

            try {
                const transformedData = await Promise.all(
                    availableSlotsData.map(async (slot, index) => {
                        const localTime = await convertFromUTC({
                            start_date: slot.slot_date,
                            start_time: slot.from_time,
                            end_time: slot.to_time,
                            end_date: slot.slot_date,
                            timezonename,
                        });
                        const startDateTime = new Date(
                            `${localTime.start_date}T${localTime.start_time}`
                        );
                        const endDateTime = new Date(
                            `${localTime.end_date}T${localTime.end_time}`
                        );
                        return {
                            'S. No.': index + 1,
                            'Slots Available': `${formatTime(localTime.start_time)} - ${formatTime(localTime.end_time)}`,
                            id: slot.id,
                            Date: localTime.start_date,
                            startDate: startDateTime,
                            endDate: endDateTime,
                        };
                    })
                );
                setTransformedSlotsData(transformedData);
            } catch (error) {
                console.error('Error converting available slots:', error);
                setTransformedSlotsData([]);
            }
        } else {
            setTransformedSlotsData([]);
        }
    };

    useEffect(() => {
        convertavailableSlotData();
    }, [availableSlotsData, timezones, timezoneID]);

    const handleDateChange = date => {
        setSelectDate(date);
        setSelectedSlots([]); // Clear selected slots when date changes
    };

    const handleSelectSlot = id => {
        setSelectedSlots(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        const errors = [];

        if (!selectDate) {
            errors.push('Please Select The Date');
        }
        if (!selectedSlots[0]) {
            errors.push('Please Select the Slot');
        }
        if (!fromTime) {
            errors.push('Please Select the Start Time');
        }
        if (!toTime) {
            errors.push('Please Select the End Time');
        }

        if (errors.length) {
            errors.forEach(error => toast.error(error));
            return;
        }

        const sessionId = sessionEventData?.id || '';

        const rescheduleData = {
            id: sessionId,
            data: {
                admin_user_id: taId.id,
                schedule_date: selectDate,
                slot_id: selectedSlots[0],
                start_time: fromTime,
                end_time: toTime,
                timezone_id: timezoneID,
                event_status: 'rescheduled',
            },
        };

        dispatch(reschduleSessionAction(rescheduleData))
            .unwrap()
            .then(() => {
                dispatch(closeRescheduleSessionAction());
                dispatch(fetchSessionsApi(id));
                dispatch(fetchSlotsApi(id));
                dispatch(getScheduleSessionAction(dataToFindScheduleInSlot));
                dispatch(openScheduledSessionAction(slotEventData));
            })
            .catch(error => {
                console.error('Error rescheduling session:', error);
            });
    };


    const headers = ['S. No.', 'Slots Available', 'Select'];

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
                        <PopTableSlot
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
                            <Grid container spacing={4} mb={2}>
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
                            <Grid
                                item
                                xs={12}
                                display="flex"
                                justifyContent="center"
                            >
                                <Controller
                                    name="host_name"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomHostNameForm
                                            label="Host Name"
                                            name="Host_Name"
                                            value={
                                                field.value
                                            }
                                            onChange={
                                                field.onChange
                                            }
                                            errors={
                                                errors
                                            }
                                            options={
                                                hosts.users
                                            }
                                        />
                                    )}
                                />
                            </Grid>
                            {/* <Grid
                                item
                                xs={12}
                                display="flex"
                                justifyContent="center"
                            >
                                <Controller
                                    name="platform_id"
                                    control={control}
                                    render={({
                                        field,
                                    }) => (
                                        <CustomMeetingTypeForm
                                            label="Meeting Type"
                                            name="platform_id"
                                            value={
                                                field.value
                                            }
                                            onChange={
                                                field.onChange
                                            }
                                            errors={
                                                errors
                                            }
                                            options={
                                                platforms
                                            }
                                        />
                                    )}
                                />
                            </Grid> */}
                        </Grid>
                    </>
                )
            )}
        </>
    );

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            style={{
                backgroundColor: "#F56D3B",
                borderColor: "#F56D3B",
                color: "#FFFFFF",
                textTrasnform: 'none',
            }}

        >
            Submit
        </CustomButton>
    );

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
