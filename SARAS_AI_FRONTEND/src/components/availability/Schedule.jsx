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
import { useForm, Controller } from 'react-hook-form';
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
import {
    getPlatforms,
    getTimezone,
} from '../../redux/features/utils/utilSlice';
import CustomTimeZoneForm from '../CustomFields/CustomTimeZoneForm';
import { fetchTAScheduleById } from '../../redux/features/adminModule/ta/taAvialability';
import { toast } from 'react-toastify';
import { fetchCoachScheduleById } from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import CustomButton from '../CustomFields/CustomButton';
import CustomPlatformForm from '../CustomFields/CustomPlatformForm';

const headers = ['S. No.', 'Slot Date', 'From Time', 'To Time', 'Select'];

const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

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
    const [timezone, setTimezone] = useState('');
    const [repeat, setRepeat] = useState('onetime');
    const [selectedDays, setSelectedDays] = useState([]);
    const [slotData, setSlotData] = useState([{}]);
    const [selectedSlot, setSelectedSlot] = useState([]);
    const [availableSlotsOptions, setAvailableSlotsOptions] = useState([]);
    const [dateSelected, setDateSelected] = useState(false);

    const dispatch = useDispatch();
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
        [timezoneKey]: adminUserTimezone,
        [availableKey]: availableSlots,
        [studentKey]: students,
        [batchKey]: batches,
    } = schedulingState;

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (dateSelected && (fromDate || !availableSlots.length > 0)) {
            dispatch(
                getAvailableSlotsAction({
                    admin_user_id: adminUserID,
                    date: fromDate,
                    timezone_name: timezoneIdToName(timezoneID, timezones),
                })
            ).then(() => {
                setSelectedSlot([]);
            });
        }
    }, [fromDate, dispatch, adminUserID, getAvailableSlotsAction]);

    const handleDateSubmit = () => {
        if (fromDate) {
            dispatch(
                getAvailableSlotsAction({
                    admin_user_id: adminUserID,
                    date: fromDate,
                    timezone_name: timezoneIdToName(timezoneID, timezones),
                })
            ).then(() => {
                setSelectedSlot([]);
                setDateSelected(true);
            });
        }
    };

    const { timezones, platforms } = useSelector(state => state.util);

    useEffect(() => {
        dispatch(getTimezone());
        dispatch(getPlatforms());
    }, [dispatch]);

    const convertSessions = async () => {
        if (
            availableSlots &&
            availableSlots.length > 0 &&
            timezones &&
            timezoneID
        ) {
            const timezonename = timezoneIdToName(timezoneID, timezones);
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

                const options = processedSlots.map(item => ({
                    label: `${formatTime(item['From Time'])} - ${formatTime(item['To Time'])}`,
                    value: item.id,
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
    }, [availableSlots, timezones, timezoneID]);

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
        const selectedOption = e.target.value;

        const selectedSlot = slotData.filter(
            slot => slot.id === selectedOption
        );

        setSelectedSlot(selectedSlot);
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

    const validate = () => {
        if (!fromTime) {
            toast.error('Please select from time');
            return;
        }

        if (!toTime) {
            toast.error('Please select to time');
            return;
        }

        if (students.length === 0) {
            toast.error('Please assign students');
            return;
        } else if (batches.length === 0) {
            toast.error('Please assign batches');
            return;
        }

        if (toTime) {
            if (toTime < fromTime) {
                toast.error('To time should be greater than from time!');
            }
        }

        if (!fromDate || !fromTime || !toTime) {
            toast.error('Please fill in all fields');
            return;
        }

        if (toDate < fromDate) {
            toast.error('To Date should be greater than From Date!');
            return;
        }

        if (toTime < fromTime) {
            toast.error('To Time should be greater than From Time!');
            return;
        }
    };

    const onSubmit = formData => {
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

        formData.start_time = fromTime;
        formData.end_time = toTime;
        formData.schedule_date = fromDate;
        formData.end_date = repeat === 'recurring' ? toDate : fromDate;
        formData.admin_user_id = adminUserID;
        formData.slot_id = selectedSlot[0].id; // Assuming single slot selection
        formData.event_status = 'scheduled';
        formData.weeks = weeksArray;
        formData.studentId = studentId;
        formData.batchId = batchId;
        formData.timezone_id = `${timezoneID}`;

        dispatch(createScheduleAction(formData))
            .then(() => {
                dispatch(closeScheduleSessionAction());
                return dispatch(getScheduledSessionApi(adminUserID));
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const content = (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ height: '100%', width: '100%' }}
        >
            <Grid container spacing={3} justifyContent="center">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Box display="flex" justifyContent="center" m={4}>
                        <Grid container spacing={3} justifyContent="center">
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                display="flex"
                                justifyContent="center"
                            >
                                <CustomDateField
                                    label="Date"
                                    value={fromDate}
                                    onChange={setFromDate}
                                    name="schedule_date"
                                    register={register}
                                    validation={{
                                        required: 'Date is required',
                                    }}
                                    sx={{ width: '100%' }}
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
                                            {selectedSlot.length > 0 && (
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
                                                                timezoneID
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <CustomTimeZoneForm
                                                                    label="Time Zone"
                                                                    name="timezone_id"
                                                                    value={
                                                                        timezoneID
                                                                    }
                                                                    onChange={
                                                                        field.onChange
                                                                    }
                                                                    disabled={
                                                                        timezoneID !=
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
                                                                    errors={
                                                                        errors
                                                                    }
                                                                    options={
                                                                        platforms
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
                                                        <Box
                                                            display="flex"
                                                            justifyContent="center"
                                                            gap={2}
                                                            sx={{ mb: 3 }}
                                                        >
                                                            <Button
                                                                variant="contained"
                                                                onClick={
                                                                    handleAssignStudents
                                                                }
                                                                sx={{
                                                                    backgroundColor:
                                                                        '#F56D3B',
                                                                    color: 'white',
                                                                    height: '60px',
                                                                    width: '201px',
                                                                    borderRadius:
                                                                        '50px',
                                                                    textTransform:
                                                                        'none',
                                                                    padding:
                                                                        '18px 30px',
                                                                    fontWeight:
                                                                        '700',
                                                                    fontSize:
                                                                        '16px',
                                                                    '&:hover': {
                                                                        backgroundColor:
                                                                            '#D4522A',
                                                                    },
                                                                }}
                                                            >
                                                                Edit Students
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                onClick={
                                                                    handleAssignBatches
                                                                }
                                                                sx={{
                                                                    backgroundColor:
                                                                        'white',
                                                                    color: '#F56D3B',
                                                                    height: '60px',
                                                                    width: '194px',
                                                                    border: '2px solid #F56D3B',
                                                                    borderRadius:
                                                                        '50px',
                                                                    textTransform:
                                                                        'none',
                                                                    fontWeight:
                                                                        '700',
                                                                    fontSize:
                                                                        '16px',
                                                                    padding:
                                                                        '18px 30px',
                                                                    '&:hover': {
                                                                        backgroundColor:
                                                                            '#F56D3B',
                                                                        color: 'white',
                                                                    },
                                                                }}
                                                            >
                                                                Edit Batches
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
                                                                            <Radio />
                                                                        }
                                                                        label="One-Time"
                                                                    />
                                                                    <FormControlLabel
                                                                        value="recurring"
                                                                        control={
                                                                            <Radio />
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
                                        <Button
                                            type="button"
                                            variant="contained"
                                            style={{
                                                borderRadius: '50px',
                                                padding: '18px 30px',
                                                marginTop: 30,
                                                backgroundColor: '#F56D3B',
                                                height: '60px',
                                                width: '121px',
                                                fontSize: '16px',
                                                fontWeight: '700px',
                                                text: '#FFFFFF',
                                                textTransform: 'none',
                                            }}
                                            onClick={handleDateSubmit}
                                        >
                                            Submit
                                        </Button>
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
