import {
    Box,
    Button,
    Checkbox,
    DialogContent,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    Radio,
    RadioGroup,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomTextField from '../CustomFields/CustomTextField';
import CustomTimeField from '../CustomFields/CustomTimeField';
import CustomDateField from '../CustomFields/CustomDateField';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomFormControl from '../CustomFields/CustomFromControl';
import CustomHostNameForm from '../CustomFields/CustomHostNameField';
import CustomMeetingTypeField from '../CustomFields/CustomMeetingTypeField';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { timezoneIdToName } from '../../utils/timezoneIdToName';
import { convertFromUTC } from '../../utils/dateAndtimeConversion';
import {
    closeScheduleSession,
    createTASchedule,
    getTaAvailableSlotsFromDate,
    openEditBatch,
    openEditStudent,
} from '../../redux/features/adminModule/ta/taScheduling';
import {
    closeCoachScheduleSession,
    createCoachSchedule,
    getCoachAvailableSlotsFromDate,
    openCoachEditBatch,
    openCoachEditStudent,
} from '../../redux/features/adminModule/coach/coachSchedule';
import CustomTimeZoneForm from '../CustomFields/CustomTimeZoneForm';
import { fetchTAScheduleById } from '../../redux/features/adminModule/ta/taAvialability';
import { toast } from 'react-toastify';
import { fetchCoachScheduleById } from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import CustomButton from '../CustomFields/CustomButton';
import CustomPlatformForm from '../CustomFields/CustomPlatformForm';

import editButtonBackground from '../../assets/editbuttonbackground.svg';
import editButtonIcon from '../../assets/editbutton.svg';
import CustomFutureDateField from '../CustomFields/CustomFutureDateField';
import { GLOBAL_CONSTANTS } from '../../constants/globalConstants';
import { useGetTimezonesQuery } from '../../redux/services/timezones/timezonesApi';
import { useGetPlatformsQuery } from '../../redux/services/platforms/platformsApi';
import { useGetHostsQuery } from '../../redux/services/hosts/hostsApi';

const headers = ['S. No.', 'Slot Date', 'From Time', 'To Time', 'Select'];

const actionButtons = [
    {
        type: 'button',
    },
];

const Schedule = ({ componentName, timezoneID }) => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [fromTime, setFromTime] = useState(null);
    const [toTime, setToTime] = useState(null);
    const [repeat, setRepeat] = useState('onetime');
    const [selectedDays, setSelectedDays] = useState([]);
    const [slotData, setSlotData] = useState([{}]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [availableSlotsOptions, setAvailableSlotsOptions] = useState([]);
    const [dateSelected, setDateSelected] = useState(false);
    const dispatch = useDispatch();

    const { data : timezones, error : timezoneError , isLoading : timezonesLoading } = useGetTimezonesQuery()
    const { data : platforms, error : platformError, isLoading : platformLoading } = useGetPlatformsQuery()
    const { data : hosts, error : hostsError, isLoading : hostsLoading} = useGetHostsQuery()


    let scheduleSessionOpenKey,
        schedulingStateKey,
        availableKey,
        idKey,
        nameKey,
        timezoneKey,
        studentKey,
        batchKey,
        getAvailableSlotsAction,
        closeScheduleSessionAction,
        getScheduledSessionApi,
        createScheduleAction;

    switch (componentName) {
        case 'TASCHEDULE':
            scheduleSessionOpenKey = 'scheduleSessionOpen';
            schedulingStateKey = 'taScheduling';
            availableKey = 'taAvailableSlots';
            idKey = 'taID';
            nameKey = 'taName';
            timezoneKey = 'taTimezone';
            studentKey = 'students';
            batchKey = 'batches';
            getAvailableSlotsAction = getTaAvailableSlotsFromDate;
            getScheduledSessionApi = fetchTAScheduleById;
            closeScheduleSessionAction = closeScheduleSession;
            createScheduleAction = createTASchedule;
            break;

        case 'COACHSCHEDULE':
            scheduleSessionOpenKey = 'scheduleCoachSessionOpen';
            schedulingStateKey = 'coachScheduling';
            availableKey = 'coachAvailableSlots';
            idKey = 'coachID';
            nameKey = 'coachName';
            timezoneKey = 'coachTimezone';
            studentKey = 'students';
            batchKey = 'batches';
            getAvailableSlotsAction = getCoachAvailableSlotsFromDate;
            getScheduledSessionApi = fetchCoachScheduleById;
            closeScheduleSessionAction = closeCoachScheduleSession;
            createScheduleAction = createCoachSchedule;
            break;

        default:
            scheduleSessionOpenKey = null;
            schedulingStateKey = null;
            availableKey = null;
            idKey = null;
            nameKey = null;
            timezoneKey = null;
            studentKey = null;
            batchKey = null;
            getAvailableSlotsAction = null;
            getScheduledSessionApi = null;
            closeScheduleSessionAction = null;
            createScheduleAction = null;
            break;
    }

    const schedulingState = useSelector(state =>
        schedulingStateKey ? state[schedulingStateKey] : {}
    );

    const {
        [scheduleSessionOpenKey]: scheduleSessionOpen,
        [idKey]: adminUserID,
        [nameKey]: adminUserName,
        [timezoneKey]: timezoneId,
        [availableKey]: availableSlots,
        [studentKey]: students,
        [batchKey]: batches,
    } = schedulingState;

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            timezone_id: timezoneId ? Number(timezoneId) : timezoneID,
        },
    });

    useEffect(() => {
        if (dateSelected && (fromDate || !availableSlots.length > 0)) {
            dispatch(
                getAvailableSlotsAction({
                    admin_user_id: adminUserID,
                    date: fromDate,
                    timezone_name: timezoneIdToName(
                        timezoneId ? Number(timezoneId) : timezoneID,
                        timezones
                    ),
                })
            ).then(() => {
                setSelectedSlot(null);
            });
        }
    }, [fromDate, dispatch, adminUserID, getAvailableSlotsAction]);

    const handleDateSubmit = () => {
        if (fromDate) {
            dispatch(
                getAvailableSlotsAction({
                    admin_user_id: adminUserID,
                    date: fromDate,
                    timezone_name: timezoneIdToName(
                        timezoneId ? Number(timezoneId) : timezoneID,
                        timezones
                    ),
                })
            ).then(() => {
                setSelectedSlot(null);
                setDateSelected(true);
            });
        } else {
            toast.error('Please Select From Date');
            return;
        }
    };

    const convertSessions = async () => {
        if (
            availableSlots &&
            availableSlots.length > 0 &&
            timezones &&
            timezoneId
                ? Number(timezoneId)
                : timezoneID
        ) {
            const timezonename = timezoneIdToName(
                timezoneId ? Number(timezoneId) : timezoneID,
                timezones
            );
            try {
                const processedSlots = await Promise.all(
                    availableSlots.map(async (slot, index) => {
                        const localTime = await convertFromUTC({
                            start_date: slot.slot_date,
                            start_time: slot.from_time,
                            end_time: slot.to_time,
                            end_date: slot.slot_date, // Assuming end_date is the same as slot_date
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
                            'Slot Date': localTime.start_date,
                            'From Time': localTime.start_time,
                            'To Time': localTime.end_time,
                            id: slot.id,
                            startDate: startDateTime,
                            endDate: endDateTime,
                        };
                    })
                );

                const formatTime = time => {
                    const [hours, minutes] = time.split(':');
                    const hour = parseInt(hours, 10);
                    const minute = parseInt(minutes, 10);
                    const ampm = hour >= 12 ? 'pm' : 'am';
                    const formattedHour = hour % 12 || 12;
                    return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${ampm}`;
                };

                const options = processedSlots.map((item, index) => ({
                    label: `${formatTime(item['From Time'])} - ${formatTime(item['To Time'])}`,
                    value: `${item.id}-${index}`, // Create a unique value by combining item.id and index
                }));

                setAvailableSlotsOptions(options);
                setSlotData(processedSlots);
            } catch (error) {
                console.error('Error converting sessions:', error);
                setAvailableSlotsOptions([]);
                setSlotData([{}]);
            }
        } else {
            setAvailableSlotsOptions([]);
            setSlotData([{}]);
        }
    };

    useEffect(() => {
        convertSessions();
    }, [
        availableSlots,
        timezones,
        timezoneId,
        timezoneId ? Number(timezoneId) : timezoneID,
    ]);

    const handleDayChange = day => {
        setSelectedDays(prev => {
            if (prev.includes(day)) {
                return prev.filter(d => d !== day);
            } else {
                return [...prev, day];
            }
        });
    };

    const handleSelectOption = e => {
        const selectedValue = e.target.value;
        const [selectedId, selectedIndex] = selectedValue.split('-'); // Extract the id and index

        const selectedSlots = slotData.filter(slot => slot.id == selectedId); // Find all slots by id

        // Get the specific slot by index
        const selectedSlot = selectedSlots[0];

        if (selectedSlot) {
            const slotStartTime = selectedSlot.startTime;
            const slotEndTime = selectedSlot.endTime;

            setSelectedSlot(selectedSlot); // Set the specific slot
        } else {
            console.error('Selected slot is not found.');
        }
    };

    const handleAssignStudents = () => {
        if (componentName === 'TASCHEDULE') {
            dispatch(openEditStudent());
        } else if (componentName === 'COACHSCHEDULE') {
            dispatch(openCoachEditStudent());
        }
    };

    const handleAssignBatches = () => {
        if (componentName === 'TASCHEDULE') {
            dispatch(openEditBatch());
        } else if (componentName === 'COACHSCHEDULE') {
            dispatch(openCoachEditBatch());
        }
    };

    const validate = formData => {
        // Ensure all required fields are filled in
        if (!fromDate) {
            toast.error('Please select from Date');
            return false;
        }

        if (!selectedSlot) {
            toast.error('Please select slot');
            return false;
        }

        if (!fromTime) {
            toast.error('Please select a From Time');
            return false;
        }

        if (repeat === 'recurring') {
            if (!toTime) {
                toast.error('Please select a To Time');
                return false;
            }
        }

        // Validate "To Time" is greater than "From Time"
        // const fromTimeInMinutes = convertTimeToMinutes(fromTime);
        // const toTimeInMinutes = convertTimeToMinutes(toTime);

        // if (toTimeInMinutes <= fromTimeInMinutes) {
        //     toast.error('To Time must be later than From Time');
        //     return false;
        // }

        // Validate that selected times are within the slot's time range
        // const slotStartTimeInMinutes = convertTimeToMinutes(selectedSlot['From Time']);
        // const slotEndTimeInMinutes = convertTimeToMinutes(selectedSlot['To Time']);

        // if (fromTimeInMinutes < slotStartTimeInMinutes || toTimeInMinutes > slotEndTimeInMinutes) {
        //     toast.error(`Time must be between ${formatTime(selectedSlot['From Time'])} and ${formatTime(selectedSlot['To Time'])}`);
        //     return false;
        // }

        if (formData.platform_id === 1) {
            if (!formData.host_email_id) {
                toast.error('Please provide a valid  Host Name.');
                return false;
            }

            if (!formData.meeting_type) {
                toast.error('Please select Meeting Type.');
                return false;
            }
        }

        // Check if 'timezone_id' is provided
        if (!formData.timezone_id) {
            toast.error('Please select a timezone');
            return false;
        }

        return true;
    };

    const formatTime = time => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${ampm}`;
    };

    const onSubmit = formData => {
        // Perform validation
        if (!validate(formData)) return;

        // Prepare data for submission
        const studentId = students.map(student => student.id);
        const batchId = batches.map(batch => batch.id);

        let weeksArray = Array(7).fill(0);
        if (repeat === 'recurring') {
            selectedDays.forEach(day => {
                const index = weekDays.indexOf(day);
                weeksArray[index] = 1;
            });
        } else if (repeat === 'onetime') {
            const index = new Date(fromDate).getDay();
            weeksArray[index] = 1;
        }

        // Add validated fields to formData
        formData.start_time = fromTime;
        formData.end_time = toTime;
        formData.schedule_date = fromDate;
        formData.end_date = repeat === 'recurring' ? toDate : fromDate;
        formData.admin_user_id = adminUserID;
        formData.slot_id = selectedSlot.id;
        formData.event_status = 'scheduled';
        formData.weeks = weeksArray;
        formData.studentId = studentId;
        formData.batchId = batchId;
        // formData.timezone_id = timezoneId ? Number(timezoneId) : timezoneID;

        // Submit data
        dispatch(createScheduleAction(formData))
            .then(() => {
                dispatch(closeScheduleSessionAction());
                return dispatch(getScheduledSessionApi(adminUserID));
            })
            .catch(error => {
                console.error('Error:', error);
            });
        reset();
    };

    // Helper function to convert time string to minutes since midnight
    const convertTimeToMinutes = time => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const platform_id = useWatch({
        control,
        name: 'platform_id',
        defaultValue: 0, // Provide a default value if necessary
    });

    const content = (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ height: '100%', width: '100%' }}
        >
            <Grid container spacing={3} justifyContent="center" mt={0}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Box display="flex" justifyContent="center" m={4}>
                        <Grid container spacing={3} justifyContent="center">
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                display="flex"
                                justifyContent="center"
                                mt={0}
                            >
                                {/* //TODO : NEED TO SHOW ERROR MESSAGE ERROR HERE WHEN FIELD IS NOT FILLED  */}
                                <CustomFutureDateField
                                    label="Date"
                                    name="schedule_date"
                                    placeholder="From Date"
                                    value={fromDate}
                                    onChange={setFromDate}
                                    register={register}
                                    validation={{
                                        required: 'From Date is required',
                                    }}
                                    errors={errors}
                                />
                            </Grid>
                            {fromDate && dateSelected && (
                                <>
                                    {availableSlotsOptions.length === 0 ? (
                                        <Grid
                                            item
                                            xs={12}
                                            display="flex"
                                            justifyContent="center"
                                        >
                                            <DialogContent
                                                sx={{
                                                    color: 'red',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                No Slot Available
                                            </DialogContent>
                                        </Grid>
                                    ) : (
                                        <>
                                            <Grid
                                                item
                                                xs={12}
                                                display="flex"
                                                justifyContent="center"
                                            >
                                                <CustomFormControl
                                                    name="slot_id"
                                                    control={control}
                                                    rules={{
                                                        required:
                                                            'Slot is required',
                                                    }}
                                                    options={
                                                        availableSlotsOptions
                                                    }
                                                    label="Available Slot"
                                                    onChange={
                                                        handleSelectOption
                                                    }
                                                    errors={errors}
                                                />
                                            </Grid>
                                            {selectedSlot && (
                                                <>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        display="flex"
                                                        justifyContent="center"
                                                    >
                                                        <CustomTextField
                                                            label="Meeting Name"
                                                            name="meeting_name"
                                                            placeholder="Enter Meeting Name"
                                                            register={register}
                                                            validation={{
                                                                required:
                                                                    'Meeting Name is required',
                                                            }}
                                                            errors={errors}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={6}
                                                        display="flex"
                                                        justifyContent="center"
                                                    >
                                                        <CustomTimeField
                                                            label="From Time"
                                                            name="start_time"
                                                            value={fromTime}
                                                            onChange={
                                                                setFromTime
                                                            }
                                                            validation={{
                                                                required:
                                                                    'From Time is required',
                                                            }}
                                                            errors={errors}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={6}
                                                        display="flex"
                                                        justifyContent="center"
                                                    >
                                                        <CustomTimeField
                                                            label="To Time"
                                                            name="To_time"
                                                            value={toTime}
                                                            onChange={setToTime}
                                                            validation={{
                                                                required:
                                                                    'To Time is required',
                                                            }}
                                                            errors={errors}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        display="flex"
                                                        justifyContent="center"
                                                    >
                                                        <Controller
                                                            name="timezone_id"
                                                            control={control}
                                                            // rules={{ required: "Time Zone is required" }}
                                                            defaultValue={
                                                                timezoneId
                                                                    ? Number(
                                                                          timezoneId
                                                                      )
                                                                    : timezoneID
                                                            }
                                                            //defaultValue={timezone_id ? Number(timezone_id) : timezoneID}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <CustomTimeZoneForm
                                                                    label="Time Zone"
                                                                    name="timezone_id"
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    onChange={
                                                                        field.onChange
                                                                    }
                                                                    disabled={
                                                                        timezoneId
                                                                            ? Number(
                                                                                  timezoneId
                                                                              )
                                                                            : timezoneID !=
                                                                              null
                                                                    }
                                                                    options={
                                                                        timezones
                                                                    }
                                                                    errors={
                                                                        errors
                                                                    }
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
                                                            name="platform_id"
                                                            control={control}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <CustomPlatformForm
                                                                    label="Platform"
                                                                    name="platform_id"
                                                                    value={
                                                                        field.value
                                                                    }
                                                                    onChange={
                                                                        field.onChange
                                                                    }
                                                                    errors={{
                                                                        errors,
                                                                    }}
                                                                    options={
                                                                        platforms
                                                                    }
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    {platform_id === 1 && (
                                                        <>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                display="flex"
                                                                justifyContent="center"
                                                            >
                                                                <Controller
                                                                    name="host_email_id"
                                                                    control={
                                                                        control
                                                                    }
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <CustomHostNameForm
                                                                            label="Host Name"
                                                                            name="host_email_id"
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
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                display="flex"
                                                                justifyContent="center"
                                                            >
                                                                <Controller
                                                                    name="meeting_type"
                                                                    control={
                                                                        control
                                                                    }
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <CustomMeetingTypeField
                                                                            label="Meeting Type"
                                                                            name="meeting_type"
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
                                                                                GLOBAL_CONSTANTS.MEETING_TYPES
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>
                                                        </>
                                                    )}

                                                    <Grid
                                                        item
                                                        xs={12}
                                                        display="flex"
                                                        justifyContent="center"
                                                    >
                                                        <Box
                                                            display="flex"
                                                            justifyContent="center"
                                                            gap={2}
                                                            sx={{ mb: 3 }}
                                                        >
                                                            <Button
                                                                variant="outlined"
                                                                onClick={
                                                                    handleAssignBatches
                                                                }
                                                                sx={{
                                                                    backgroundColor:
                                                                        '#FEEBE3',
                                                                    color: '#F56D3B',

                                                                    height: '60px',
                                                                    width: '201px',

                                                                    border: 'none',
                                                                    borderRadius:
                                                                        '50px',
                                                                    textTransform:
                                                                        'none',
                                                                    fontWeight:
                                                                        '400',
                                                                    fontSize:
                                                                        '16px',
                                                                    fontFamily:
                                                                        'Regular',
                                                                    padding:
                                                                        '18px 30px',
                                                                    pl: '50px',
                                                                    '&:hover': {
                                                                        backgroundColor:
                                                                            'unset', // Remove hover background color
                                                                    },
                                                                    '&::before':
                                                                        {
                                                                            content:
                                                                                '""',
                                                                            display:
                                                                                'block',
                                                                            backgroundImage: `url(${editButtonBackground})`,
                                                                            backgroundSize:
                                                                                '100% 100%',
                                                                            width: '15px',
                                                                            height: '15px',
                                                                            position:
                                                                                'absolute',
                                                                            left: '25px',
                                                                            top: '50%',
                                                                            transform:
                                                                                'translateY(-50%)',
                                                                        },
                                                                    '&::after':
                                                                        {
                                                                            content:
                                                                                '""',
                                                                            display:
                                                                                'block',
                                                                            backgroundImage: `url(${editButtonIcon})`,
                                                                            backgroundSize:
                                                                                '100% 100%',
                                                                            width: '15px',
                                                                            height: '12px',
                                                                            position:
                                                                                'absolute',
                                                                            left: '27px',
                                                                            top: '22px',
                                                                        },
                                                                }}
                                                            >
                                                                Edit Batches
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                onClick={
                                                                    handleAssignStudents
                                                                }
                                                                sx={{
                                                                    backgroundColor:
                                                                        'unset',
                                                                    color: '#F56D3B',
                                                                    height: '60px',
                                                                    width: '201px',
                                                                    borderRadius:
                                                                        '50px',
                                                                    textTransform:
                                                                        'none',
                                                                    padding:
                                                                        '18px 30px',

                                                                    fontWeight:
                                                                        '400',
                                                                    fontSize:
                                                                        '16px',
                                                                    fontFamily:
                                                                        'Regular',
                                                                    '&:hover': {
                                                                        backgroundColor:
                                                                            'unset', // Remove hover background color
                                                                    },
                                                                    pl: '50px',
                                                                    border: '2px solid #F56D3B',
                                                                    '&::before':
                                                                        {
                                                                            content:
                                                                                '""',
                                                                            display:
                                                                                'block',
                                                                            backgroundImage: `url(${editButtonBackground})`,
                                                                            backgroundSize:
                                                                                '100% 100%',
                                                                            width: '15px',
                                                                            height: '15px',
                                                                            position:
                                                                                'absolute',
                                                                            left: '25px',
                                                                            top: '50%',
                                                                            transform:
                                                                                'translateY(-50%)',
                                                                        },
                                                                    '&::after':
                                                                        {
                                                                            content:
                                                                                '""',
                                                                            display:
                                                                                'block',
                                                                            backgroundImage: `url(${editButtonIcon})`,
                                                                            backgroundSize:
                                                                                '100% 100%',
                                                                            width: '15px',
                                                                            height: '12px',
                                                                            position:
                                                                                'absolute',
                                                                            left: '27px',
                                                                            top: '20px',
                                                                        },
                                                                }}
                                                            >
                                                                Edit Students
                                                            </Button>
                                                        </Box>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        justifyContent="center"
                                                        sx={{ pt: 3 }}
                                                    >
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            display="flex"
                                                            justifyContent="center"
                                                        >
                                                            <FormControl component="fieldset">
                                                                <RadioGroup
                                                                    row
                                                                    value={
                                                                        repeat
                                                                    }
                                                                    onChange={e =>
                                                                        setRepeat(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    sx={{
                                                                        justifyContent:
                                                                            'center',
                                                                    }}
                                                                >
                                                                    <FormControlLabel
                                                                        value="onetime"
                                                                        control={
                                                                            <Radio
                                                                                sx={{
                                                                                    '&.Mui-checked':
                                                                                        {
                                                                                            color: '#F56D3B',
                                                                                        },
                                                                                }}
                                                                            />
                                                                        }
                                                                        label="One-Time"
                                                                    />
                                                                    <FormControlLabel
                                                                        value="recurring"
                                                                        control={
                                                                            <Radio
                                                                                sx={{
                                                                                    '&.Mui-checked':
                                                                                        {
                                                                                            color: '#F56D3B',
                                                                                        },
                                                                                }}
                                                                            />
                                                                        }
                                                                        label="Recurring"
                                                                    />
                                                                </RadioGroup>
                                                            </FormControl>
                                                        </Grid>
                                                    </Grid>
                                                    {repeat === 'recurring' && (
                                                        <>
                                                            <Grid
                                                                container
                                                                spacing={3}
                                                                justifyContent="center"
                                                                sx={{ pt: 3 }}
                                                            >
                                                                <Grid
                                                                    item
                                                                    xs={12}
                                                                >
                                                                    <FormControl component="fieldset">
                                                                        <FormGroup
                                                                            row
                                                                            sx={{
                                                                                display:
                                                                                    'flex',
                                                                                justifyContent:
                                                                                    'center', // Center the checkboxes
                                                                                gap: 2,
                                                                                flexWrap:
                                                                                    'wrap',
                                                                                maxWidth:
                                                                                    '65%',
                                                                                marginLeft:
                                                                                    'auto',
                                                                                marginRight:
                                                                                    'auto',
                                                                            }}
                                                                        >
                                                                            {weekDays.map(
                                                                                day => (
                                                                                    <FormControlLabel
                                                                                        key={
                                                                                            day
                                                                                        }
                                                                                        control={
                                                                                            <Checkbox
                                                                                                checked={selectedDays.includes(
                                                                                                    day
                                                                                                )}
                                                                                                onChange={() =>
                                                                                                    handleDayChange(
                                                                                                        day
                                                                                                    )
                                                                                                }
                                                                                                name={
                                                                                                    day
                                                                                                }
                                                                                            />
                                                                                        }
                                                                                        label={
                                                                                            day
                                                                                        }
                                                                                    />
                                                                                )
                                                                            )}
                                                                        </FormGroup>
                                                                    </FormControl>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={12}
                                                                sm={6}
                                                                display="flex"
                                                                justifyContent="center"
                                                            >
                                                                <CustomDateField
                                                                    label="To Date"
                                                                    value={
                                                                        toDate
                                                                    }
                                                                    onChange={
                                                                        setToDate
                                                                    }
                                                                    name="end_date"
                                                                    register={
                                                                        register
                                                                    }
                                                                    validation={{
                                                                        required:
                                                                            'To Date is required',
                                                                    }}
                                                                    sx={{
                                                                        width: '100%',
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </>
                                                    )}
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        display="flex"
                                                        justifyContent="center"
                                                    >
                                                        <Button
                                                            type="submit"
                                                            variant="contained"
                                                            style={{
                                                                borderRadius:
                                                                    '50px',
                                                                padding:
                                                                    '18px 30px',
                                                                marginTop: 30,
                                                                backgroundColor:
                                                                    '#F56D3B',
                                                                height: '60px',
                                                                width: '121px',
                                                                fontSize:
                                                                    '16px',
                                                                fontWeight:
                                                                    '700px',
                                                                text: '#FFFFFF',
                                                                textTransform:
                                                                    'none',
                                                            }}
                                                        >
                                                            Submit
                                                        </Button>
                                                    </Grid>
                                                </>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                            {!dateSelected && (
                                <>
                                    <Grid
                                        item
                                        xs={12}
                                        display="flex"
                                        justifyContent="center"
                                    >
                                        <CustomButton
                                            onClick={handleDateSubmit}
                                            backgroundColor="#F56D3B"
                                            borderColor="#F56D3B"
                                            color="#FFFFFF"
                                            textTransform="none"
                                        >
                                            Submit
                                        </CustomButton>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    </Box>
                </form>
            </Grid>
        </Box>
    );

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            backgroundColor="#F56D3B"
            borderColor="#F56D3B"
            color="#FFFFFF"
            textTransform="none"
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={createScheduleAction}
            handleClose={() => {
                dispatch(closeScheduleSessionAction());
            }}
            title={`Schedule New Session`}
            // Session for ${adminUserName}`}
            content={content}
        />
    );
};

export default Schedule;
