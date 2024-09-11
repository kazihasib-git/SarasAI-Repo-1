import { Button, DialogContent, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import CustomTimeField from '../../../CustomFields/CustomTimeField';
import {
    closeReschedulePopup,
    openCreatedSessions,
} from '../../../../redux/features/commonCalender/commonCalender';
import {
    getCoachMenuSessionForLeave,
    getCoachMenuSessions,
    getCoachMenuSlots,
    getCoachMenuSlotsByData,
    rescheduleSessionForCoachLeave,
} from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import {
    getTaMenuSessionForLeave,
    getTaMenuSessions,
    getTaMenuSlots,
    getTaMenuSlotsByDate,
    rescheduleSessionForTaLeave,
} from '../../../../redux/features/taModule/tamenuSlice';
import { convertFromUTC } from '../../../../utils/dateAndtimeConversion';
import { toast } from 'react-toastify';
import PopTableSlot from '../../../CommonComponent/PopTableSlot';
import CustomFutureDateField from '../../../CustomFields/CustomFutureDateField';
import { Controller, useForm } from 'react-hook-form';
import CustomHostNameForm from '../../../CustomFields/CustomHostNameField';
import CustomMeetingTypeForm from '../../../CustomFields/CustomMeetingTypeField';
import { GLOBAL_CONSTANTS } from '../../../../constants/globalConstants';
import CustomButton from '../../../CustomFields/CustomButton';
import { useGetHostsQuery } from '../../../../redux/services/hosts/hostsApi';
import { useGetPlatformsQuery } from '../../../../redux/services/platforms/platformsApi';
import { useGetTimezonesQuery } from '../../../../redux/services/timezones/timezonesApi';

const headers = ['S. No.', 'Slots Available', 'Select'];

const rescheduleConfig = {
    TAMENU: {
        sliceName: 'taMenu',
        rescheduleApi: rescheduleSessionForTaLeave,
        getAllSlotsApi: getTaMenuSlots,
        getAllSessionsApi: getTaMenuSessions,
        fetchAvailableSlotsApi: getTaMenuSlotsByDate,
        availableSlotState: 'taSlotsByDate',
        getSessionsBySlotsApi: getTaMenuSessionForLeave,
    },
    COACHMENU: {
        sliceName: 'coachMenu',
        rescheduleApi: rescheduleSessionForCoachLeave,
        getAllSlotsApi: getCoachMenuSlots,
        getAllSessionsApi: getCoachMenuSessions,
        fetchAvailableSlotsApi: getCoachMenuSlotsByData,
        availableSlotState: 'coachSlotsByDate',
        getSessionsBySlotsApi: getCoachMenuSessionForLeave,
    },
};

const RescheduleCreatedSession = ({ componentName, timezone }) => {
    const dispatch = useDispatch();
    const {
        RescheduleSession,
        slotsLeaveData,
        sessionDataForReschdeule,
        dataToFindScheduleInSlot,
    } = useSelector(state => state.commonCalender);

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
        sliceName,
        rescheduleApi,
        getAllSlotsApi,
        getAllSessionsApi,
        fetchAvailableSlotsApi,
        availableSlotState,
        getSessionsBySlotsApi,
    } = rescheduleConfig[componentName];

    const selectorState = useSelector(state => state[sliceName]);

    const { [availableSlotState]: availableSlotsData } = selectorState;

    useEffect(() => {
        if (selectDate) {
            const data = {
                date: selectDate,
                timezone_name: timezone?.time_zone,
            };
            dispatch(fetchAvailableSlotsApi(data));
        }
    }, [selectDate, dispatch]);

    useEffect(() => {
        if (sessionDataForReschdeule) {
            // setFromTime(sessionEventData.startTime || '');
            // setToTime(sessionEventData.endTime || '');
            setEmail(sessionDataForReschdeule.hostEmailId || '');
            setMeetingType(sessionDataForReschdeule.meetingType || '');
        }
    }, [sessionDataForReschdeule]);

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
    }, [availableSlotsData, timezone?.id]);

    const handleDateChange = date => {
        setSelectDate(date);
        setSelectedSlots([]);
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
        if (fromTime >= toTime) {
            toast.error('End Time should be greater than Start Time');
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

        const sessionId = sessionDataForReschdeule?.id || '';

        const rescheduleData = {
            id: sessionId,
            data: {
                schedule_date: selectDate,
                slot_id: selectedSlots[0],
                start_time: fromTime,
                end_time: toTime,
                timezone_id: timezone?.id,
                event_status: 'rescheduled',
                host_email_id: email, // Use the email state
                meeting_type: meetingType, // Use the meetingType state
            },
        };

        dispatch(rescheduleApi(rescheduleData))
            .unwrap()
            .then(() => {
                dispatch(closeReschedulePopup());
                dispatch(getAllSlotsApi());
                dispatch(getAllSessionsApi());
                dispatch(getSessionsBySlotsApi(slotsLeaveData));
                dispatch(openCreatedSessions(slotsLeaveData));
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
                            {sessionDataForReschdeule.platformId === 1 && (
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
                textTransform: 'none',
            }}
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={RescheduleSession}
            handleClose={() => {
                dispatch(closeReschedulePopup());
                dispatch(openCreatedSessions(slotsLeaveData));
            }}
            title="Reschedule Session"
            content={content}
            actions={selectDate ? actions : undefined}
        />
    );
};

export default RescheduleCreatedSession;
