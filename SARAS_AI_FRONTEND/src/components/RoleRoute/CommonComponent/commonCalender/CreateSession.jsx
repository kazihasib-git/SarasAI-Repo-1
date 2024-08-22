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
    getTaMenuSlots,
} from '../../../../redux/features/taModule/tamenuSlice';
import {
    createCoachMenuSession,
    getCoachMenuSessions,
    getCoachMenuSlots,
} from '../../../../redux/features/coachModule/coachmenuprofileSilce';
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
import {
    getPlatforms,
    getTimezone,
} from '../../../../redux/features/utils/utilSlice';
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

const timezone = Number(localStorage.getItem('timezone_id'));

const actionButtons = [
    {
        type: 'button',
    },
];

const CreateSession = ({ componentName, timezoneID }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        sessionName: '',
        duration: null,
        message: '',
        students: [],
        batches: [],
        platform_id: null,
        fromDate: null,
        toDate: null,
        fromTime: null,
        toTime: null,
        timezone_id: timezone ? timezone : null,
    });

    let sliceName, createSessionApi, getSessionApi, getSlotApi;

    switch (componentName) {
        case 'TAMENU':
            sliceName = 'taMenu';
            createSessionApi = createTaMenuSessions;
            getSessionApi = getTaMenuSessions;
            getSlotApi = getTaMenuSlots;
            break;

        case 'COACHMENU':
            sliceName = 'coachMenu';
            createSessionApi = createCoachMenuSession;
            getSessionApi = getCoachMenuSessions;
            getSlotApi = getCoachMenuSlots;
            break;

        default:
            sliceName = null;
            createSessionApi = null;
            getSessionApi = null;
            getSlotApi = null;
            break;
    }

    const { timezones, platforms } = useSelector(state => state.util);
    const { scheduleNewSessionPopup, students, batches } = useSelector(
        state => state.commonCalender
    );

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
        console.log('field', field, ':', value);
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAssignStudents = () => {
        dispatch(openSelectStudents());
    };

    const handleAssignBatches = () => {
        dispatch(openSelectBatches());
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log(formData.fromTime);

        const studentId = students.map(student => student.id);
        const batchId = batches.map(batch => batch.id);

        const fromDateTimeString = `${formData.fromDate}T${formData.fromTime}`;
        console.log('fromDateTimeString:', fromDateTimeString);

        const fromDateTime = new Date(fromDateTimeString);
        console.log('fromDateTime:', fromDateTime);

        // Assuming formData.duration is in the format "HH:MM:SS"
        const [hours, minutes, seconds] = formData?.duration
            .split(':')
            .map(Number);
        const durationInMs = (hours * 3600 + minutes * 60 + seconds) * 1000;

        // Calculate endDateTime by adding duration to fromDateTime
        const endDateTime = new Date(fromDateTime.getTime() + durationInMs);
        // console.log('endDateTime:', endDateTime);

        // Extracting time from endDateTime in HH:MM:SS format
        const endTime = endDateTime.toTimeString().split(' ')[0];

        const data = {
            meeting_name: formData.sessionName,
            duration: formData.duration,
            schedule_date: formData.fromDate,
            start_time: formData.fromTime,
            end_time: endTime,
            message: formData.message,
            platform_id: formData.platform_id,
            timezone_id: formData.timezone_id,
            event_status: 'scheduled',
            studentId: studentId,
            batchId: batchId,
        };
        console.log('Form Data : ', formData);
        console.log('DATA :', data);

        dispatch(createSessionApi(data)).then(() => {
            dispatch(getSessionApi());
            dispatch(getSlotApi());
            dispatch(closeScheduleNewSession());
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
                                    placeholder="Enter your message"
                                    onChange={text =>
                                        handleChange(
                                            'message',
                                            text.target.value
                                        )
                                    }
                                    errors={!!error.message}
                                    helperText={error.message}
                                    sx={{ width: '100%' }}
                                    multiline
                                    rows={4}
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
                                        handleChange(
                                            'timezone_id',
                                            e.target.value
                                        )
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
                                            backgroundColor: '#FEEBE3',
                                            color: '#F56D38',
                                            height: '34px',
                                            borderRadius: '50px',
                                            textTransform: 'none',
                                            padding: '18px 30px',
                                            fontWeight: '700',
                                            fontFamily: 'Regular',
                                            fontSize: '16px',
                                            '&:hover': {
                                                backgroundColor: '#FEEBE3',
                                            },
                                        }}
                                    >
                                        Select Students
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={handleAssignBatches}
                                        sx={{
                                            backgroundColor: 'white',
                                            color: '#F56D3B',
                                            height: '34px',
                                            width: '194px',
                                            border: '2px solid #F56D3B',
                                            borderRadius: '50px',
                                            textTransform: 'none',
                                            fontWeight: '700',
                                            fontSize: '16px',
                                            fontFamily: 'Regular',
                                            padding: '18px 30px',
                                            '&:hover': {
                                                backgroundColor: 'white',
                                                border: '2px solid #F56D3B',
                                            },
                                        }}
                                    >
                                        Select Batches
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
                backgroundColor: '#F56D3B',
                borderColor: '#F56D3B',
                color: '#FFFFFF',
                textTransform: 'none',
                fontFamily: 'Bold',
            }}
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
