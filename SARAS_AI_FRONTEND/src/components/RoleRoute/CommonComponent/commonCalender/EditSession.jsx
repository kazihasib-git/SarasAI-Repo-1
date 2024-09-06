import { Box, Button, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
    getTaMenuSessions,
    getTaScheduledCalls,
    updateTaScheduledCall,
} from '../../../../redux/features/taModule/tamenuSlice';
import {
    getCoachMenuSessions,
    getCoachScheduledCalls,
    updateCoachScheduledCall,
} from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import {
    closeEditSession,
    openSelectBatches,
    openSelectStudents,
} from '../../../../redux/features/commonCalender/commonCalender';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import CustomTextField from '../../../CustomFields/CustomTextField';
import CustomFormControl from '../../../CustomFields/CustomFromControl';
import CustomTimeZoneForm from '../../../CustomFields/CustomTimeZoneForm';
import {
    getAllHosts,
    getPlatforms,
    getTimezone,
} from '../../../../redux/features/utils/utilSlice';
import CustomPlatformForm from '../../../CustomFields/CustomPlatformForm';
import CustomFutureDateField from '../../../CustomFields/CustomFutureDateField';
import CustomMeetingTypeField from '../../../CustomFields/CustomMeetingTypeField';
import CustomHostNameForm from '../../../CustomFields/CustomHostNameField';
import CustomTimeDaysjsField from '../../../CustomFields/CustomTimeDaysjsField';
import CustomButton from '../../../CustomFields/CustomButton';
import { timezoneIdToName } from '../../../../utils/timezoneIdToName';
import { GLOBAL_CONSTANTS } from '../../../../constants/globalConstants';

const timezone = Number(localStorage.getItem('timezone_id'));

const EditSession = ({ componentName }) => {
    const dispatch = useDispatch();

    const initialFormData = {
        sessionName: '',
        duration: null,
        message: '',
        students: [],
        batches: [],
        platform_id: null,
        host_email_id: null,
        meeting_type: null,
        fromDate: null,
        toDate: null,
        fromTime: null,
        toTime: null,
        timezone_id: timezone ? timezone : null,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isEdited, setIsEdited] = useState(false);
    const [error, setError] = useState({});

    const { timezones, platforms, hosts } = useSelector(state => state.util);
    const { editSession, students, batches, sessionData } = useSelector(
        state => state.commonCalender
    );

    let sliceName, updateSessionApi, getSessionApi;

    switch (componentName) {
        case 'TAMENU':
            sliceName = 'taMenu';
            updateSessionApi = updateTaScheduledCall;
            getSessionApi = getTaScheduledCalls;
            break;

        case 'COACHMENU':
            sliceName = 'coachMenu';
            updateSessionApi = updateCoachScheduledCall;
            getSessionApi = getCoachScheduledCalls;
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
        dispatch(getAllHosts());
    }, [dispatch]);

    useEffect(() => {
        if (sessionData && !isEdited) {
            const startTime = moment(sessionData.start_time, 'HH:mm:ss');
            const endTime = moment(sessionData.end_time, 'HH:mm:ss');

            const timeDifference = moment.duration(endTime.diff(startTime));

            const formattedDifference = [
                String(Math.floor(timeDifference.asHours())).padStart(2, '0'),
                String(timeDifference.minutes()).padStart(2, '0'),
                String(timeDifference.seconds()).padStart(2, '0'),
            ].join(':');

            setFormData({
                sessionName: sessionData.meeting_name || '',
                duration: formattedDifference,
                message: sessionData.message || '',
                students: sessionData.students || [], // sessionData.students || [];
                batches: sessionData.batch || [],
                platform_id: sessionData.platform_id || null,
                fromDate: sessionData.date || '',
                toDate: sessionData.to_date || '',
                fromTime: sessionData.start_time,
                meeting_type: sessionData.platform_meeting_details.meeting_type,
                host_email_id:
                    sessionData.platform_meeting_details.host_email_id,
                timezone_id: sessionData.timezone_id || null,
            });
        }
    }, []);

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
        setIsEdited(true);
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAssignStudents = () => {
        dispatch(openSelectStudents({ sessionData }));
    };

    const handleAssignBatches = () => {
        dispatch(openSelectBatches({ sessionData }));
    };

    const validate = () => {
        if (!formData.sessionName) {
            toast.error('Please enter meeting name');
            return false;
        }

        // Check if 'duration' is provided and in the correct format
        if (!formData.duration) {
            toast.error('Please select duration');
            return false;
        }

        if (!formData.platform_id) {
            toast.error('Please select meeting platform');
            return false;
        }

        if (formData.platform_id === 1) {
            // Check if 'host_email_id' is provided
            if (!formData.host_email_id) {
                toast.error('Please Select Host Name');
                return false;
            }

            // Check if 'meeting_type' is provided
            if (!formData.meeting_type) {
                toast.error('Please Select Meeting Type');
                return false;
            }
        }

        // Check if 'fromDate' is provided
        if (!formData.fromDate) {
            toast.error('Please select  from date');
            return false;
        }

        // Check if 'fromTime' is provided
        if (!formData.fromTime) {
            toast.error('Please add from time');
            return false;
        }

        // Chech message
        if (!formData.message) {
            toast.error('Please enter message');
            return false;
        }

        // Check if 'timezone_id' is provided
        if (!formData.timezone_id) {
            toast.error('Please select a timezone');
            return false;
        }
        return true;
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (!validate()) return;

        const studentId = sessionData.students.map(student => student.id);
        const batchId = sessionData.batch.map(batch => batch.id);

        const fromDateTimeString = `${formData.fromDate}T${formData.fromTime}`;
        const fromDateTime = new Date(fromDateTimeString);

        // Assuming formData.duration is in the format "HH:MM:SS"
        const [hours, minutes, seconds] = formData?.duration
            .split(':')
            .map(Number);
        const durationInMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
        const endDateTime = new Date(fromDateTime.getTime() + durationInMs);
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
            event_status: 'rescheduled',
            studentId: studentId,
            batchId: batchId,
            host_email_id: formData.host_email_id,
            meeting_type: formData.meeting_type,
        };

        dispatch(updateSessionApi({ id: sessionData.id, data }))
            .then(() => {
                const data = {
                    date: sessionData.date, //formatDate(sessionData.date),
                    timezone_name: timezoneIdToName(timezone, timezones),
                };
                dispatch(getSessionApi(data));
                dispatch(closeEditSession());
            })
            .catch(error => {
                console.error('Error updating TA scheduled call:', error);
                // Handle error (e.g., show error message to user)
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
                                        value={formData.platform_id}
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
                                {formData.platform_id === 1 && (
                                    <>
                                        <Grid
                                            item
                                            xs={12}
                                            display="flex"
                                            justifyContent="center"
                                        >
                                            <CustomHostNameForm
                                                label="Host Name"
                                                name="host_email_id"
                                                value={formData.host_email_id}
                                                onChange={e =>
                                                    handleChange(
                                                        'host_email_id',
                                                        e.target.value
                                                    )
                                                }
                                                options={hosts.users}
                                                errors={!!error.host_email_id}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            display="flex"
                                            justifyContent="center"
                                        >
                                            <CustomMeetingTypeField
                                                label="Meeting Type"
                                                name="meeting_type"
                                                value={formData.meeting_type}
                                                onChange={e =>
                                                    handleChange(
                                                        'meeting_type',
                                                        e.target.value
                                                    )
                                                }
                                                options={
                                                    GLOBAL_CONSTANTS.MEETING_TYPES
                                                }
                                                errors={!!error.meeting_name}
                                            />
                                        </Grid>
                                    </>
                                )}
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
                                    <CustomFutureDateField
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
                                    <CustomTimeDaysjsField
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
                backgroundColor: '#F56D3B',
                borderColor: '#F56D3B',
                color: '#FFFFFF',
                textTransform: 'none',
                fontFamily: 'Bold',
            }}
        >
            Update
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={editSession}
            handleClose={() => dispatch(closeEditSession())}
            title={`Edit ${componentName === 'COACHMENU' ? 'Coach' : 'TA'} Session`}
            content={content}
            actions={actions}
        />
    );
};

export default EditSession;
