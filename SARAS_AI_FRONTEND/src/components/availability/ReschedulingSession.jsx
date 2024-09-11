import React, { useEffect, useMemo, useState } from 'react';
import ReusableDialog from '../CustomFields/ReusableDialog';
import { Button, DialogContent, Grid } from '@mui/material';
import CustomTimeField from '../CustomFields/CustomTimeField';
import CustomHostNameForm from '../CustomFields/CustomHostNameField';
import CustomMeetingTypeForm from '../CustomFields/CustomMeetingTypeField';
import { useDispatch, useSelector } from 'react-redux';
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
import { convertFromUTC } from '../../utils/dateAndtimeConversion';
import { toast } from 'react-toastify';
import PopTableSlot from '../CommonComponent/PopTableSlot';
import CustomFutureDateField from '../CustomFields/CustomFutureDateField';
import { GLOBAL_CONSTANTS } from '../../constants/globalConstants';
import { useGetHostsQuery } from '../../redux/services/hosts/hostsApi';
import { useGetPlatformsQuery } from '../../redux/services/platforms/platformsApi';
import { useGetTimezonesQuery } from '../../redux/services/timezones/timezonesApi';

const headers = ['S. No.', 'Slots Available', 'Select'];

const rescheduleConfig = {
    TACALENDER: {
        sliceName: 'taAvialability',
        rescheduleSessionOpenKey: 'resheduleSessionOpen',
        closeRescheduleSessionAction: closeRescheduleSession,
        fetchAvailableSlotsAction: fetchAvailableSlots,
        getScheduleSessionAction: getScheduleSession,
        openScheduledSessionAction: openScheduledSession,
        availableSlotsAction: 'availableSlotsData',
        sessionEventAction: 'sessionEventData',
        slotEventAction: 'slotEventData',
        reschduleSessionAction: rescheduleSession,
        fetchSlotsApi: fetchTaSlots,
        fetchSessionsApi: fetchTAScheduleById,
    },
    COACHCALENDER: {
        sliceName: 'coachAvailability',
        rescheduleSessionOpenKey: 'resheduleCoachSessionOpen',
        closeRescheduleSessionAction: closeCoachRescheduleSession,
        fetchAvailableSlotsAction: fetchCoachAvailableSlots,
        getScheduleSessionAction: getCoachScheduleSession,
        openScheduledSessionAction: openCoachScheduledSession,
        availableSlotsAction: 'availableCoachSlotsData',
        sessionEventAction: 'sessionCoachEventData',
        slotEventAction: 'slotCoachEventData',
        reschduleSessionAction: rescheduleCoachSession,
        fetchSlotsApi: fetchCoachSlots,
        fetchSessionsApi: fetchCoachScheduleById,
    },
};

const ReschedulingSession = ({ id, name, componentName, timezone }) => {
    const dispatch = useDispatch();

    const [selectDate, setSelectDate] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [fromTime, setFromTime] = useState(null);
    const [email, setEmail] = useState('');
    const [meetingType, setMeetingType] = useState('');
    const [toTime, setToTime] = useState(null);
    const [transformedSlotsData, setTransformedSlotsData] = useState([]);

    const {
        control,
        formState: { errors },
    } = useForm({
        defaultValues: {},
    });

    const {
        rescheduleSessionOpenKey,
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
        fetchSessionsApi,
    } = rescheduleConfig[componentName];

    const { dataToFindScheduleInSlot } = useSelector(
        state => state.commonCalender
    );

    const {
        data: timezones,
        error: timezoneError,
        isLoading: timezonesLoading,
    } = useGetTimezonesQuery();
    const {
        data: platforms,
        error: platformError,
        isLoading: platformLoading,
    } = useGetPlatformsQuery();
    const {
        data: hosts,
        error: hostsError,
        isLoading: hostsLoading,
    } = useGetHostsQuery();

    const {
        [rescheduleSessionOpenKey]: rescheduleSessionOpen,
        [availableSlotsAction]: availableSlotsData,
        [sessionEventAction]: sessionEventData,
        [slotEventAction]: slotEventData,
    } = useSelector(state => state[sliceName]);

    useEffect(() => {
        if (selectDate) {
            const data = {
                admin_user_id: id,
                date: selectDate,
                timezone_name: timezone.time_zone,
            };
            dispatch(fetchAvailableSlotsAction(data));
        }
    }, [selectDate, id, dispatch]);

    useEffect(() => {
        // Set default values when sessionEventData is available
        if (sessionEventData) {
            // setFromTime(sessionEventData.startTime || '');
            // setToTime(sessionEventData.endTime || '');
            setEmail(sessionEventData.hostEmailId || '');
            setMeetingType(sessionEventData.meetingType || '');
        }
    }, [sessionEventData]);

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
            timezone.time_zone
        ) {
            try {
                const transformedData = await Promise.all(
                    availableSlotsData.map(async (slot, index) => {
                        const localTime = await convertFromUTC({
                            start_date: slot.slot_date,
                            start_time: slot.from_time,
                            end_time: slot.to_time,
                            end_date: slot.slot_date,
                            timezonename: timezone.time_zone,
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
    }, [availableSlotsData, timezone.time_zone]);

    const handleDateChange = date => {
        setSelectDate(date);
        setSelectedSlots([]); // Clear selected slots when date changes
    };

    const handleSelectSlot = id => {
        setSelectedSlots(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const validate = () => {
        if (!selectDate) {
            toast.error('Please Select The Date');
            return false;
        }

        if (!selectedSlots[0]) {
            toast.error('Please Select the Slot');
            return false;
        }

        if (!fromTime) {
            toast.error('Please Select the Start Time');
            return false;
        }
        if (!toTime) {
            toast.error('Please Select the End Time');
            return false;
        }
        if (!email) {
            toast.error('Please provide a valid Host Name');
            return false;
        }
        if (!meetingType) {
            toast.error('Please select the Meeting Type');
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const sessionId = sessionEventData?.id || '';

        const rescheduleData = {
            id: sessionId,
            data: {
                admin_user_id: id,
                schedule_date: selectDate,
                slot_id: selectedSlots[0],
                start_time: fromTime,
                end_time: toTime,
                timezone_id: timezone.id,
                event_status: 'rescheduled',
                host_email_id: email, // Use the email state
                meeting_type: meetingType, // Use the meetingType state
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
                <CustomFutureDateField
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
                            {sessionEventData.platformId === 1 && (
                                <>
                                    <Grid
                                        item
                                        xs={12}
                                        display="flex"
                                        justifyContent="center"
                                        mb={2}
                                    >
                                        <Controller
                                            name="host_email_id"
                                            control={control}
                                            render={({ field }) => (
                                                <CustomHostNameForm
                                                    label="Host Name"
                                                    name="host_email_id"
                                                    value={email}
                                                    onChange={event =>
                                                        setEmail(
                                                            event.target.value
                                                        )
                                                    }
                                                    errors={errors}
                                                    options={hosts.users}
                                                    disabled
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        display="flex"
                                        justifyContent="center"
                                    >
                                        <Controller
                                            name="meeting_type"
                                            control={control}
                                            render={({ field }) => (
                                                <CustomMeetingTypeForm
                                                    label="Meeting Type"
                                                    name="meeting_type"
                                                    value={meetingType}
                                                    onChange={event =>
                                                        setMeetingType(
                                                            event.target.value
                                                        )
                                                    }
                                                    errors={errors}
                                                    options={
                                                        GLOBAL_CONSTANTS.MEETING_TYPES
                                                    }
                                                    disabled
                                                />
                                            )}
                                        />
                                    </Grid>
                                </>
                            )}
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
                backgroundColor: '#F56D3B',
                borderColor: '#F56D3B',
                color: '#FFFFFF',
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
