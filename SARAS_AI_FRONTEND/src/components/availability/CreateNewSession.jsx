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
import moment from 'moment';
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
} from '../../redux/features/adminModule/ta/taScheduling';
import {
    closeCoachScheduleSession,
    createCoachSchedule,
    getCoachAvailableSlotsFromDate,
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
import {
    getAssignBatches,
    getAssignStudents,
} from '../../redux/features/adminModule/ta/taSlice';
import {
    getCoachAssignBatches,
    getCoachAssignStudents,
} from '../../redux/features/adminModule/coach/coachSlice';
import {
    clearState,
    openBatchPopup,
    openStudentsPopup,
} from '../../redux/features/commonCalender/batchesAndStudents';
import { GLOBAL_CONSTANTS } from '../../constants/globalConstants';
import { useGetTimezonesQuery } from '../../redux/services/timezones/timezonesApi';
import { useGetPlatformsQuery } from '../../redux/services/platforms/platformsApi';
import { useGetHostsQuery } from '../../redux/services/hosts/hostsApi';

const scheduleConfig = {
    TASCHEDULE: {
        sliceName: 'taModule',
        assignedStudentsApi: getAssignStudents,
        assignedStudentsState: 'assignedStudents',
        assignedBatchesApi: getAssignBatches,
        assignedBatchesState: 'assignedBatches',
        scheduleSessionOpenKey: 'scheduleSessionOpen',
        schedulingStateKey: 'taScheduling',
        availableKey: 'taAvailableSlots',
        idKey: 'taID',
        nameKey: 'taName',
        timezoneKey: 'taTimezone',
        studentKey: 'students',
        batchKey: 'batches',
        getAvailableSlotsAction: getTaAvailableSlotsFromDate,
        getScheduledSessionApi: fetchTAScheduleById,
        closeScheduleSessionAction: closeScheduleSession,
        createScheduleAction: createTASchedule,
    },
    COACHSCHEDULE: {
        sliceName: 'coachModule',
        assignedStudentsApi: getCoachAssignStudents,
        assignedStudentsState: 'assignedStudents',
        assignedBatchesApi: getCoachAssignBatches,
        assignedBatchesState: 'assignedBatches',
        scheduleSessionOpenKey: 'scheduleCoachSessionOpen',
        schedulingStateKey: 'coachScheduling',
        availableKey: 'coachAvailableSlots',
        idKey: 'coachID',
        nameKey: 'coachName',
        timezoneKey: 'coachTimezone',
        studentKey: 'students',
        batchKey: 'batches',
        getAvailableSlotsAction: getCoachAvailableSlotsFromDate,
        getScheduledSessionApi: fetchCoachScheduleById,
        closeScheduleSessionAction: closeCoachScheduleSession,
        createScheduleAction: createCoachSchedule,
    },
};

const CreateNewSession = ({ id, name, componentName, timezone }) => {
    const dispatch = useDispatch();
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
    const [meetingname, setMeetingName] = useState('');

    const { data : timezones, error : timezoneError , isLoading : timezonesLoading } = useGetTimezonesQuery();
    const { data : platforms, error : platformError, isLoading : platformLoading } = useGetPlatformsQuery();
    const { data : hosts, error : hostsError, isLoading : hostsLoading} = useGetHostsQuery();

    const {
        assignedStudentsApi,
        assignedBatchesApi,
        schedulingStateKey,
        availableKey,
        idKey,
        nameKey,
        timezoneKey,
        getAvailableSlotsAction,
        closeScheduleSessionAction,
        getScheduledSessionApi,
        createScheduleAction,
        sliceName,
        assignedStudentsState,
        assignedBatchesState,
    } = scheduleConfig[componentName];

    const stateSelector = useSelector(state => state[sliceName]);

    const {
        [assignedStudentsState]: assignedStudents,
        [assignedBatchesState]: assignedBatches,
    } = stateSelector;

    const schedulingState = useSelector(state =>
        schedulingStateKey ? state[schedulingStateKey] : {}
    );

    const {
        [idKey]: adminUserID,
        [nameKey]: adminUserName,
        [timezoneKey]: timezoneId,
        [availableKey]: availableSlots,
    } = schedulingState;

    useEffect(() => {
        dispatch(assignedStudentsApi(adminUserID));
        dispatch(assignedBatchesApi(adminUserID));
    }, [dispatch]);

    const timezoneName = timezone?.time_zone
        ? timezone.time_zone
        : timezoneIdToName(timezoneId, timezones);

    const { selectedStudents, selectedBatches } = useSelector(
        state => state.batchesAndStudents
    );

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            timezone_id: timezone?.id ? Number(timezone.id) : timezoneId,
        },
    });

    useEffect(() => {
        if (dateSelected && (fromDate || !availableSlots.length > 0)) {
            dispatch(
                getAvailableSlotsAction({
                    admin_user_id: adminUserID,
                    date: fromDate,
                    timezone_name: timezoneName,
                })
            ).then(() => {
                setSelectedSlot(null);
            });
        }
    }, [fromDate, dispatch, timezoneName]);

    const handleDateSubmit = () => {
        if (fromDate) {
            const today = moment().startOf('day');
            let inputDate = new Date(fromDate);

            if (moment(inputDate).isBefore(today)) {
                // toast.error('The date must be today or a future date.');
                setDateSelected(false);
                return;
            }else{
                dispatch(
                    getAvailableSlotsAction({
                        admin_user_id: adminUserID,
                        date: fromDate,
                        timezone_name: timezoneName,
                    })
                ).then(() => {
                    setSelectedSlot(null);
                    setDateSelected(true);
                });
            }
        } else {
            toast.error('Please Select From Date');
            return;
        }
    };

    const convertSessions = async () => {
        if (availableSlots && availableSlots.length > 0 && timezoneName) {
            try {
                const processedSlots = await Promise.all(
                    availableSlots.map(async (slot, index) => {
                        const localTime = await convertFromUTC({
                            start_date: slot.slot_date,
                            start_time: slot.from_time,
                            end_time: slot.to_time,
                            end_date: slot.slot_date, // Assuming end_date is the same as slot_date
                            timezonename: timezoneName,
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
    }, [availableSlots]);

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
            setSelectedSlot(selectedSlot); // Set the specific slot
        } else {
            console.error('Selected slot is not found.');
        }
    };

    const handleAssignStudents = () => {
        const data = {
            name: adminUserName,
            id: adminUserID,
            batches: assignedBatches,
            selectedBatches: selectedBatches?.length > 0 ? selectedBatches : [],
            students: assignedStudents,
            selectedStudents:
                selectedStudents?.length > 0 ? selectedStudents : [],
            timezoneId: timezoneId ? timezoneId : timezone.id,
        };

        dispatch(openStudentsPopup(data));
    };

    const handleAssignBatches = () => {
        const data = {
            name: adminUserName,
            id: adminUserID,
            batches: assignedBatches,
            selectedBatches: selectedBatches?.length > 0 ? selectedBatches : [],
            students: assignedStudents,
            selectedStudents:
                selectedStudents?.length > 0 ? selectedStudents : [],
            timezoneId: timezoneId ? timezoneId : timezone.id,
        };
        dispatch(openBatchPopup(data));
    };

    // Helper function to convert time string to minutes since midnight

    const validate = formData => {
        // Ensure all required fields are filled in
        let inputDate = new Date(fromDate);
        let inputToDate = new Date(toDate); 
        
        if (!fromDate || isNaN(inputDate.getTime())) {
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
            if (!toDate || isNaN(inputToDate.getTime())) {
                toast.error('Please select To Date');
                return false;
            }
            if (moment(inputToDate).isBefore(inputDate)) {
                toast.error('To Date should be greater than From Date');
                return false;
            }
            if (!toTime) {
                toast.error('Please select a To Time');
                return false;
            }
        }

        if (!formData.platform_id) {
            toast.error('Please select Platform');
            return false;
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

    const onSubmit = formData => {
        // Perform validation
        if (!validate(formData)) return;

        const studentId = selectedStudents.map(student => student);
        const batchId = selectedBatches.map(batch => batch);

        let weeksArray = Array(7).fill(0);
        if (repeat === 'recurring') {
            selectedDays.forEach(day => {
                const index = GLOBAL_CONSTANTS.WEEKDAYS.indexOf(day);
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

        // Submit data
        dispatch(createScheduleAction(formData))
            .then(() => {
                dispatch(clearState());
                dispatch(closeScheduleSessionAction());
                return dispatch(getScheduledSessionApi(adminUserID));
            })
            .catch(error => {
                console.error('Error:', error);
            });
        reset();
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
                                                            value={meetingname}
                                                            validation={{
                                                                required:
                                                                    'Meeting Name is required',
                                                            }}
                                                            onChange={e => setMeetingName(e.target.value)}
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
                                                                    : timezone.id
                                                            }
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
                                                                            : timezone.id !=
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
                                                                            {GLOBAL_CONSTANTS.WEEKDAYS.map(
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
                                                                <CustomFutureDateField
                                                                    label="To Date"
                                                                     name="end_date"
                                                                    value={toDate}
                                
                                                                    onChange={setToDate}
        
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
                                                                    errors={errors}
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

    return (
        <ReusableDialog
            open={createScheduleAction}
            handleClose={() => {
                dispatch(clearState());
                dispatch(closeScheduleSessionAction());
            }}
            title={`Schedule New Session`}
            // Session for ${adminUserName}`}
            content={content}
        />
    );
};

export default CreateNewSession;
