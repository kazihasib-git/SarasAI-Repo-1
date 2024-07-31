import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    Radio,
    RadioGroup,
} from '@mui/material';
import { duration } from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    createTaMenuSessions,
    getTaMenuSessions,
} from '../../../../redux/features/teachingAssistant/tamenuSlice';
import {
    createCoachMenuSession,
    getCoachMenuSessions,
} from '../../../../redux/features/coach/coachmenuprofileSilce';
import {
    closeScheduleNewSession,
    openSelectBatches,
    openSelectStudents,
} from '../../../../redux/features/commonCalender/commonCalender';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import CustomTextField from '../../../CustomFields/CustomTextField';
import CustomFormControl from '../../../CustomFields/CustomFromControl';
import CustomDateField from '../../../CustomFields/CustomDateField';
import CustomTimeField from '../../../CustomFields/CustomTimeField';
import CustomTimeZoneForm from '../../../CustomFields/CustomTimeZoneForm';
import { getTimezone } from '../../../../redux/features/timezone/timezoneSlice';

const CustomButton = ({
    onClick,
    children,
    color = '#FFFFFF',
    backgroundColor = '#4E18A5',
    borderColor = '#FFFFFF',
    sx,
    ...props
}) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                backgroundColor: backgroundColor,
                color: color,
                fontWeight: '700',
                fontSize: '16px',
                borderRadius: '50px',
                padding: '10px 20px',
                border: `2px solid ${borderColor}`,
                '&:hover': {
                    backgroundColor: color,
                    color: backgroundColor,
                    borderColor: color,
                },
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

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

const platformOptions = [
    { label: 'Zoom', value: '1' },
    { label: 'Team', value: '2' },
    { label: 'BlueButton', value: '3' },
];

const CreateSession = ({ componentName }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        sessionName: '',
        duration: null,
        message: '',
        students: [],
        batches: [],
        platforms: null,
        fromDate: null,
        toDate: null,
        fromTime: null,
        toTime: null,
        timezone: '1',
        repeat: 'onetime',
        selectedDays: [],
    });

    let sliceName, createSessionApi, getSessionApi;

    switch (componentName) {
        case 'TAMENU':
            sliceName = 'taMenu';
            createSessionApi = createTaMenuSessions;
            getSessionApi = getTaMenuSessions;
            break;

        case 'COACHMENU':
            sliceName = 'coachMenu';
            createSessionApi = createCoachMenuSession;
            getSessionApi = getCoachMenuSessions;
            break;

        default:
            sliceName = null;
            createSessionApi = null;
            getSessionApi = null;
            break;
    }

    const { timezones } = useSelector(state => state.timezone);
    const { scheduleNewSessionPopup, students, batches } = useSelector(
        state => state.commonCalender
    );

    useEffect(() => {
        dispatch(getTimezone());
    }, [dispatch]);

    const [selectedSlot, setSelectedSlot] = useState();
    const [availableSlotsOptions, setAvailableSlotsOptions] = useState([]);
    const [error, setError] = useState({});

    const durationOptions = [
        { label: '15 minutes', value: '00:15:00' },
        { label: '30 minutes', value: '00:30:00' },
        { label: '45 minutes', value: '00:45:00' },
        { label: '1 Hour', value: '01:00:00' },
        { label: '1 Hour 15 minutes', value: '01:15:00' },
        { label: '1 Hour 30 minutes', value: '01:30:00' },
        { label: '1 Hour 45 minutes', value: '01:45:00' },
        { label: '2 Hours', value: '02:00:00' },
    ];

    const handleChange = (field, value) => {
        console.log('field', field, ':', value);
        if (field === 'timezone') {
            setFormData(prev => ({ ...prev, [field]: value.time_zone }));
        }
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDayChange = day => {
        setFormData(prev => {
            const newSelectedDays = prev.selectedDays.includes(day)
                ? prev.selectedDays.filter(d => d !== day)
                : [...prev.selectedDays, day];
            return { ...prev, selectedDays: newSelectedDays };
        });
    };

    const handleAssignStudents = () => {
        dispatch(openSelectStudents());
    };

    const handleAssignBatches = () => {
        dispatch(openSelectBatches());
    };

    const validate = () => {};

    const handleSubmit = e => {
        e.preventDefault();

        const studentId = students.map(student => student.id);
        const batchId = batches.map(batch => batch.id);

        let weeksArray = Array(7).fill(0);
        if (formData.repeat === 'recurring') {
            selectedDays.forEach(day => {
                const index = weekDays.indexOf(day);
                weeksArray[index] = 1;
            });
        } else if (formData.repeat === 'onetime') {
            const index = new Date(formData.fromDate).getDay();
            weeksArray[index] = 1;
        }

        const fromDateTimeString = `${formData.fromDate}T${formData.fromTime}`;
        console.log('fromDateTimeString:', fromDateTimeString);

        const fromDateTime = new Date(fromDateTimeString);
        console.log('fromDateTime:', fromDateTime);

        // Assuming formData.duration is in the format "HH:MM:SS"
        const [hours, minutes, seconds] = formData.duration
            .split(':')
            .map(Number);
        const durationInMs = (hours * 3600 + minutes * 60 + seconds) * 1000;

        // Calculate endDateTime by adding duration to fromDateTime
        const endDateTime = new Date(fromDateTime.getTime() + durationInMs);
        console.log('endDateTime:', endDateTime);

        // Extracting time from endDateTime in HH:MM:SS format
        const endTime = endDateTime.toTimeString().split(' ')[0];

        const data = {
            meeting_name: formData.sessionName,
            duration: formData.duration,
            schedule_date: formData.fromDate,
            start_time: formData.fromTime,
            end_time: endTime,
            message: formData.message,
            platforms: formData.platforms,
            meeting_url: 'http://example.com/meeting',
            timezone: formData.timezone,
            event_status: 'scheduled',
            studentId: studentId,
            batchId: batchId,
            weeks: weeksArray,
        };
        console.log('Form Data : ', formData);
        console.log('DATA :', data);

        dispatch(createSessionApi(data)).then(() => {
            dispatch(getSessionApi());
            dispatch(closeScheduleNewSession());
        });
    };

    console.log('FormData :', formData);

    const content = (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ height: '100%', width: '100%' }}
        >
            <Grid container spacing={3} justifyContent="center">
                <form onSubmit={handleSubmit} noValidate>
                    <Box display="flex" justifyContent="center" m={4}>
                        <Grid container spacing={3} justifyContent="center">
                            <Grid
                                container
                                item
                                spacing={3}
                                justifyContent="center"
                            >
                                <Grid
                                    item
                                    xs={12}
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <CustomTextField
                                        label="Session Name"
                                        name="sessionName"
                                        value={formData.sessionName}
                                        onChange={e =>
                                            handleChange(
                                                'sessionName',
                                                e.target.value
                                            )
                                        }
                                        errors={!!error.sessionName}
                                        helperText={error.sessionName}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <CustomFormControl
                                        label="Duration"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={e =>
                                            handleChange(
                                                'duration',
                                                e.target.value
                                            )
                                        }
                                        options={durationOptions}
                                        errors={!!error.duration}
                                        helperText={error.duration}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <CustomFormControl
                                        label="Platform"
                                        name="platform"
                                        value={formData.platforms}
                                        onChange={e =>
                                            handleChange(
                                                'platforms',
                                                e.target.value
                                            )
                                        }
                                        options={platformOptions}
                                        errors={!!error.platforms}
                                        helperText={error.platforms}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid
                                container
                                item
                                spacing={3}
                                justifyContent="center"
                            >
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <CustomDateField
                                        label="From Date"
                                        name="fromDate"
                                        value={formData.fromDate}
                                        onChange={date =>
                                            handleChange('fromDate', date)
                                        }
                                        errors={!!error.fromDate}
                                        helperText={error.fromDate}
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
                                        name="fromTime"
                                        value={formData.fromTime}
                                        onChange={time =>
                                            handleChange('fromTime', time)
                                        }
                                        errors={!!error.fromTime}
                                        helperText={error.fromTime}
                                    />
                                </Grid>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                display="flex"
                                justifyContent="center"
                            >
                                <CustomTextField
                                    label="Message"
                                    name="message"
                                    value={formData.message}
                                    onChange={text =>
                                        handleChange(
                                            'message',
                                            text.target.value
                                        )
                                    }
                                    errors={!!error.message}
                                    helperText={error.message}
                                    sx={{ width: '100%' }}
                                />
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                display="flex"
                                justifyContent="center"
                            >
                                <CustomTimeZoneForm
                                    label="Timezone"
                                    name="timezone"
                                    value={formData.timezone}
                                    onChange={timezone =>
                                        handleChange('timezone', timezone)
                                    }
                                    options={timezones}
                                    errors={!!error.timezone}
                                    helperText={error.timezone}
                                    sx={{ width: '100%' }}
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
                                        onClick={handleAssignStudents}
                                        sx={{
                                            backgroundColor: '#F56D3B',
                                            color: 'white',
                                            height: '60px',
                                            width: '201px',
                                            borderRadius: '50px',
                                            textTransform: 'none',
                                            padding: '18px 30px',
                                            fontWeight: '700',
                                            fontSize: '16px',
                                            '&:hover': {
                                                backgroundColor: '#D4522A',
                                            },
                                        }}
                                    >
                                        Edit Students
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={handleAssignBatches}
                                        sx={{
                                            backgroundColor: 'white',
                                            color: '#F56D3B',
                                            height: '60px',
                                            width: '194px',
                                            border: '2px solid #F56D3B',
                                            borderRadius: '50px',
                                            textTransform: 'none',
                                            fontWeight: '700',
                                            fontSize: '16px',
                                            padding: '18px 30px',
                                            '&:hover': {
                                                backgroundColor: '#F56D3B',
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
                                            value={formData.repeat}
                                            onChange={e =>
                                                handleChange(
                                                    'repeat',
                                                    e.target.value
                                                )
                                            }
                                            sx={{ justifyContent: 'center' }}
                                        >
                                            <FormControlLabel
                                                value="onetime"
                                                control={<Radio />}
                                                label="One-Time"
                                            />
                                            <FormControlLabel
                                                value="recurring"
                                                control={<Radio />}
                                                label="Recurring"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            {formData.repeat === 'recurring' && (
                                <>
                                    <Grid
                                        container
                                        spacing={3}
                                        justifyContent="center"
                                        sx={{ pt: 3 }}
                                    >
                                        <Grid item xs={12}>
                                            <FormControl component="fieldset">
                                                <FormGroup row>
                                                    {weekDays.map(day => (
                                                        <FormControlLabel
                                                            key={day}
                                                            control={
                                                                <Checkbox
                                                                    checked={formData.selectedDays.includes(
                                                                        day
                                                                    )}
                                                                    onChange={() =>
                                                                        handleDayChange(
                                                                            day
                                                                        )
                                                                    }
                                                                    name={day}
                                                                />
                                                            }
                                                            label={day}
                                                        />
                                                    ))}
                                                </FormGroup>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        display="flex"
                                        sx={{ pt: 3 }}
                                        justifyContent="center"
                                    >
                                        <CustomDateField
                                            label="To Date"
                                            value={formData.toDate}
                                            onChange={date =>
                                                handleChange('toDate', date)
                                            }
                                            errors={!!error.toDate}
                                            helperText={error.toDate}
                                            sx={{ width: '100%' }}
                                        />
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
            open={scheduleNewSessionPopup}
            handleClose={() => dispatch(closeScheduleNewSession())}
            title={`Create New Session`}
            content={content}
            actions={actions}
        />
    );
};

export default CreateSession;
