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
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
    //updateTaMenuSession,
    getTaMenuSessions,
} from '../../../../redux/features/taModule/tamenuSlice';
import {
    // updateCoachMenuSession,
    getCoachMenuSessions,
} from '../../../../redux/features/coachModule/coachmenuprofileSilce';
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
import { getPlatforms, getTimezone } from '../../../../redux/features/utils/utilSlice';
import CustomPlatformForm from '../../../CustomFields/CustomPlatformForm';

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

const EditSession = ({ componentName }) => {
    const dispatch = useDispatch();
    const { timezones, platforms } = useSelector(state => state.util);

    const { editSession, students, batches, sessionData } = useSelector(
        state => state.commonCalender
    );

    console.log("session data", sessionData);
    const startTime = moment(sessionData.start_time, "HH:mm:ss");
    const endTime = moment(sessionData.end_time, "HH:mm:ss");
    const timeDifference = moment.duration(endTime.diff(startTime));
    const formattedDifference = [
        String(Math.floor(timeDifference.asHours())).padStart(2, '0'),
        String(timeDifference.minutes()).padStart(2, '0'),
        String(timeDifference.seconds()).padStart(2, '0')
    ].join(':');

    const studentData = sessionData.students || [];
    const studentIdArray = [];
    if (studentData && studentData.length > 0) {
        students.forEach(student => {
            if (student && student.id) {
                studentIdArray.push(student.id);
            }
        });
    }

    const [formData, setFormData] = useState({
        sessionName: sessionData.meeting_name || '',
        duration: formattedDifference,
        message: sessionData.message || '',
        students: studentIdArray,
        batches: sessionData.batchId || [],
        platforms: sessionData.platform_id,
        fromDate: sessionData.date || '',
        toDate: sessionData.to_date || '',
        fromTime: moment(sessionData.start_time, "HH:mm:ss"),
        toTime: moment(sessionData.end_time, "HH:mm:ss"),
        timezone_id: sessionData.timezone_id,
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
        dispatch(getPlatforms());
    }, [dispatch]);

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
        dispatch(openSelectStudents(sessionData.students));
    };

    const handleAssignBatches = () => {
        dispatch(openSelectBatches());
    };

    const validate = () => {};

    const handleSubmit = e => {
        e.preventDefault();

        const studentId = students.map(student => student.id);
        const batchId = batches.map(batch => batch.id);

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
            platform_id : formData.platform_id,
            timezone_id : formData.timezone_id,
            event_status: 'scheduled',
            studentId: studentId,
            batchId: batchId,
            //weeks: weeksArray,
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
                                    <CustomPlatformForm
                                        label="Platform"
                                        name="platform_id"
                                        value={formData.platforms}
                                        onChange={e =>
                                            handleChange(
                                                'platform_id',
                                                e.target.value
                                            )
                                        }
                                        options={platforms}
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
                                    value={formData.timezone_id}
                                    onChange={e =>
                                        handleChange('timezone_id', e.target.value)
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

                        </Grid>
                    </Box>
                </form>
            </Grid>
        </Box>
    );

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            style={{
                backgroundColor : "#F56D3B",
                borderColor : "#F56D3B",
                color : "#FFFFFF",
                textTransform: 'none',
                fontFamily: 'Bold',
            }}
        >
            Update
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={EditSession}
            handleClose={() => dispatch(closeEditSession())}
            title={`Edit Session`}
            content={content}
            actions={actions}
        />
    );
};

export default EditSession;
