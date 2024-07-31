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
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    //updateTaMenuSession,
    getTaMenuSessions,
} from '../../../../redux/features/teachingAssistant/tamenuSlice';
import {
    // updateCoachMenuSession,
    getCoachMenuSessions,
} from '../../../../redux/features/coach/coachmenuprofileSilce';
import {
    closeEditSession,
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

const EditSession = ({ componentName }) => {
    const dispatch = useDispatch();
    const { timezones } = useSelector(state => state.timezone);
    const { editSessionPopup, students, batches, sessionData } = useSelector(
        state => state.commonCalender
    );

    const [formData, setFormData] = useState({
        sessionName: sessionData.meeting_name || '',
        duration: sessionData.duration || null,
        message: sessionData.message || '',
        students: sessionData.studentId || [],
        batches: sessionData.batchId || [],
        platforms: sessionData.platforms || null,
        fromDate: sessionData.schedule_date || null,
        toDate: sessionData.to_date || null,
        fromTime: sessionData.start_time || null,
        toTime: sessionData.end_time || null,
        timezone: sessionData.timezone || 'Asia/Kolkata',
        repeat: sessionData.weeks ? 'recurring' : 'onetime',
        selectedDays: sessionData.weeks
            ? sessionData.weeks
                  .map((day, index) => (day === 1 ? weekDays[index] : null))
                  .filter(Boolean)
            : [],
    });

    let sliceName, updateSessionApi, getSessionApi;

    switch (componentName) {
        case 'TAMENU':
            sliceName = 'taMenu';
            // updateSessionApi = updateTaMenuSession;
            getSessionApi = getTaMenuSessions;
            break;

        case 'COACHMENU':
            sliceName = 'coachMenu';
            // updateSessionApi = updateCoachMenuSession;
            getSessionApi = getCoachMenuSessions;
            break;

        default:
            sliceName = null;
            updateSessionApi = null;
            getSessionApi = null;
            break;
    }

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
            formData.selectedDays.forEach(day => {
                const index = weekDays.indexOf(day);
                weeksArray[index] = 1;
            });
        } else if (formData.repeat === 'onetime') {
            const index = new Date(formData.fromDate).getDay();
            weeksArray[index] = 1;
        }

        const fromDateTimeString = `${formData.fromDate}T${formData.fromTime}`;
        const fromDateTime = new Date(fromDateTimeString);

        const [hours, minutes, seconds] = formData.duration
            .split(':')
            .map(Number);
        const durationInMs = (hours * 3600 + minutes * 60 + seconds) * 1000;

        const endDateTime = new Date(fromDateTime.getTime() + durationInMs);
        const endTime = endDateTime.toTimeString().split(' ')[0];

        const data = {
            id: sessionData.id,
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

        console.log(data);
        // dispatch(updateSessionApi(data)).then(() => {
        //     dispatch(getSessionApi());
        //     dispatch(closeEditSession());
        // });
        dispatch(closeEditSession());
    };

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
                                    <CustomTextField
                                        label="Message"
                                        name="message"
                                        value={formData.message}
                                        onChange={e =>
                                            handleChange(
                                                'message',
                                                e.target.value
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
                                    <CustomDateField
                                        label="From Date"
                                        name="fromDate"
                                        value={formData.fromDate}
                                        onChange={e =>
                                            handleChange(
                                                'fromDate',
                                                e.target.value
                                            )
                                        }
                                        errors={!!error.fromDate}
                                        helperText={error.fromDate}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <CustomTimeField
                                        label="From Time"
                                        name="fromTime"
                                        value={formData.fromTime}
                                        onChange={e =>
                                            handleChange(
                                                'fromTime',
                                                e.target.value
                                            )
                                        }
                                        errors={!!error.fromTime}
                                        helperText={error.fromTime}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <CustomTimeField
                                        label="To Time"
                                        name="toTime"
                                        value={formData.toTime}
                                        onChange={e =>
                                            handleChange(
                                                'toTime',
                                                e.target.value
                                            )
                                        }
                                        errors={!!error.toTime}
                                        helperText={error.toTime}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <FormControl
                                        component="fieldset"
                                        sx={{ width: '100%' }}
                                    >
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
                                                        />
                                                    }
                                                    label={day}
                                                />
                                            ))}
                                        </FormGroup>
                                    </FormControl>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <CustomFormControl
                                        label="Platform"
                                        name="platforms"
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
                                <Grid
                                    item
                                    xs={12}
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <CustomTimeZoneForm
                                        name="timezone"
                                        value={formData.timezone}
                                        onChange={e =>
                                            handleChange(
                                                'timezone',
                                                e.target.value
                                            )
                                        }
                                        errors={!!error.timezone}
                                        helperText={error.timezone}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                    <Grid
                        container
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Grid item xs={6} sm={6} md={4} lg={3} xl={2}>
                            <CustomButton type="submit">Submit</CustomButton>
                        </Grid>
                        <Grid item xs={6} sm={6} md={4} lg={3} xl={2}>
                            <CustomButton
                                color="#4E18A5"
                                backgroundColor="#FFFFFF"
                                borderColor="#4E18A5"
                                onClick={() => dispatch(closeEditSession())}
                            >
                                Cancel
                            </CustomButton>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Box>
    );

    return (
        <ReusableDialog
            title="Edit Session"
            content={content}
            open={editSessionPopup}
            handleClose={() => dispatch(closeEditSessionPopup())}
            actionButtons={actionButtons}
        />
    );
};

export default EditSession;
