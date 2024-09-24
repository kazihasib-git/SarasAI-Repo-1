import { Box, Button, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    createTaMenuSessions,
    getTaMenuAssignedBatches,
    getTaMenuAssignedStudents,
    getTaMenuSessions,
    getTaMenuSlots,
} from '../../../../redux/features/taModule/tamenuSlice';
import {
    createCoachMenuSession,
    getCoachMenuAssignedBatches,
    getCoachMenuAssignedStudents,
    getCoachMenuSessions,
    getCoachMenuSlots,
} from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import {
    closeScheduleNewSession,
    openScheduleNewSession,
} from '../../../../redux/features/commonCalender/commonCalender';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import CustomTextField from '../../../CustomFields/CustomTextField';
import CustomFormControl from '../../../CustomFields/CustomFromControl';
import CustomTimeField from '../../../CustomFields/CustomTimeField';
import CustomTimeZoneForm from '../../../CustomFields/CustomTimeZoneForm';
import CustomPlatformForm from '../../../CustomFields/CustomPlatformForm';
import CustomHostNameForm from '../../../CustomFields/CustomHostNameField';
import CustomMeetingTypeField from '../../../CustomFields/CustomMeetingTypeField';
import CustomButton from '../../../CustomFields/CustomButton';
import { toast } from 'react-toastify';
import CustomFutureDateField from '../../../CustomFields/CustomFutureDateField';
import { GLOBAL_CONSTANTS } from '../../../../constants/globalConstants';
import {
    clearState,
    openBatchPopup,
    openStudentsPopup,
} from '../../../../redux/features/commonCalender/batchesAndStudents';
import SelectBatches from '../../../batches/SelectBatches';
import SelectStudents from '../../../students/SelectStudents';
import { useGetHostsQuery } from '../../../../redux/services/hosts/hostsApi';
import { useGetPlatformsQuery } from '../../../../redux/services/platforms/platformsApi';
import { useGetTimezonesQuery } from '../../../../redux/services/timezones/timezonesApi';

const sessionConfig = {
    TAMENU: {
        sliceName: 'taMenu',
        createSessionApi: createTaMenuSessions,
        getSessionApi: getTaMenuSessions,
        getSlotApi: getTaMenuSlots,
        getStudentsApi: getTaMenuAssignedStudents,
        getStudentsState: 'assignedTaStudents',
        getBatchesApi: getTaMenuAssignedBatches,
        getBatchesState: 'assignedTaBatches',
    },
    COACHMENU: {
        sliceName: 'coachMenu',
        createSessionApi: createCoachMenuSession,
        getSessionApi: getCoachMenuSessions,
        getSlotApi: getCoachMenuSlots,
        getStudentsApi: getCoachMenuAssignedStudents,
        getStudentsState: 'assignedCoachStudents',
        getBatchesApi: getCoachMenuAssignedBatches,
        getBatchesState: 'assignedCoachBatches',
    },
};

const CreateSession = ({ role, componentName }) => {
    const dispatch = useDispatch();

    const {
        sliceName,
        createSessionApi,
        getSessionApi,
        getSlotApi,
        getStudentsApi,
        getStudentsState,
        getBatchesApi,
        getBatchesState,
    } = sessionConfig[componentName];

    const { timezoneId, name } = useSelector(state => state.auth);

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
        timezone_id: Number(timezoneId),
    };

    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState({});

    const { data : timezones, error : timezoneError , isLoading : timezonesLoading } = useGetTimezonesQuery();
    const { data : platforms, error : platformError, isLoading : platformLoading } = useGetPlatformsQuery()
    const { data : hosts, error : hostsError, isLoading : hostsLoading} = useGetHostsQuery()

    const { scheduleNewSessionPopup } = useSelector(
        state => state.commonCalender
    );

    const stateSelector = useSelector(state => state[sliceName]);

    const {
        [getStudentsState]: assignedStudents,
        [getBatchesState]: assignedBatches,
    } = stateSelector;

    const { selectedStudents, selectedBatches, openBatches, openStudents } =
        useSelector(state => state.batchesAndStudents);

    useEffect(() => {
        dispatch(getStudentsApi());
        dispatch(getBatchesApi());
    }, [dispatch]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAssignStudents = () => {
        const data = {
            batches: assignedBatches,
            selectedBatches: selectedBatches?.length > 0 ? selectedBatches : [],
            students: assignedStudents,
            selectedStudents:
                selectedStudents?.length > 0 ? selectedStudents : [],
            timezoneId: timezoneId,
        };
        dispatch(openStudentsPopup(data));
    };

    const handleAssignBatches = () => {
        const data = {
            batches: assignedBatches,
            selectedBatches: selectedBatches?.length > 0 ? selectedBatches : [],
            students: assignedStudents,
            selectedStudents:
                selectedStudents?.length > 0 ? selectedStudents : [],
            timezoneId: timezoneId,
        };
        dispatch(openBatchPopup(data));
    };

    const validate = () => {
        if (!formData.sessionName) {
            toast.error('Please enter session name');
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
        let inputDate = new Date(formData.fromDate);

        if (!formData.fromDate || isNaN(inputDate.getTime())) {
            toast.error('Please Select from date');
            return false;
        }

        // Check if 'fromTime' is provided
        if (!formData.fromTime) {
            toast.error('Please add from time');
            return false;
        }

        // Chech message
        if (!formData.message || formData.message.trim() === '') {
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

        const studentId = selectedStudents.map(student => student);
        const batchId = selectedBatches.map(batch => batch);

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
            event_status: 'scheduled',
            studentId: studentId,
            batchId: batchId,
            host_email_id: formData.host_email_id,
            meeting_type: formData.meeting_type,
        };

        dispatch(createSessionApi(data))
            .unwrap()
            .then(() => {
                dispatch(clearState());
                dispatch(getSessionApi());
                dispatch(getSlotApi());
                // TODO NEED TO CALL GET SCHEDULE CALL API  HERE --->
                dispatch(closeScheduleNewSession());

                // Reset the form after submission
                setFormData(initialFormData);
            })
            .catch(error => {
                console.error('API Error:', error);
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
                                        validation={{
                                            required: 'About Me is required',
                                        }}
                                        onChange={e =>
                                            handleChange(
                                                'sessionName',
                                                e.target.value
                                            )
                                        }
                                        errors={!!error.sessionName}
                                        helperText={error.sessionName}
                                        sx={{
                                            width: '100%',
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#F56D3B',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                '&.Mui-focused': {
                                                    color: '#000000',
                                                },
                                            },
                                        }}
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
                                        options={
                                            GLOBAL_CONSTANTS.DURATIONOPTIONS
                                        }
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
                                                value={formData.value}
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
                                                value={formData.value}
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
                                    sx={{
                                        width: '100%',
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#F56D3B',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            '&.Mui-focused': {
                                                color: '#000000',
                                            },
                                        },
                                    }}
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
                                    label="Time Zone"
                                    name="timezone_id"
                                    value={formData.timezone_id}
                                    onChange={e =>
                                        handleChange(
                                            'timezone_id',
                                            e.target.value
                                        )
                                    }
                                    errors={!!error.timezone}
                                    helperText={error.timezone}
                                    sx={{ width: '100%' }}
                                    options={timezones}
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
                                            // fontWeight: '700',
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
                                            // fontWeight: '700',
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
                textTransform: 'none',
            }}
        >
            Submit
        </CustomButton>
    );

    return (
        <>
            <ReusableDialog
                open={scheduleNewSessionPopup}
                handleClose={() => {
                    dispatch(clearState());
                    dispatch(closeScheduleNewSession());
                    setFormData(initialFormData);
                }}
                title={`Create New Session`}
                content={content}
                actions={actions}
            />
            {openBatches &&
                (role == 'Coach' ? (
                    <SelectBatches
                        componentName={'COACHMENU'}
                        timezone={timezoneId}
                        onClose={data => {
                            dispatch(openScheduleNewSession(data));
                        }}
                    />
                ) : (
                    <SelectBatches
                        componentName={'TAMENU'}
                        timezone={timezoneId}
                        onClose={data => {
                            dispatch(openScheduleNewSession(data));
                        }}
                    />
                ))}

            {openStudents &&
                (role == 'Coach' ? (
                    <SelectStudents
                        componentName={'COACHMENU'}
                        timezone={timezoneId}
                        onClose={data => {
                            dispatch(openScheduleNewSession(data));
                        }}
                    />
                ) : (
                    <SelectStudents
                        componentName={'TAMENU'}
                        timezone={timezoneId}
                        onClose={data => {
                            dispatch(openScheduleNewSession(data));
                        }}
                    />
                ))}
        </>
    );
};

export default CreateSession;
