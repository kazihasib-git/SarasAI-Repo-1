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
    getAllHosts,
    getPlatforms,
    getTimezone,
} from '../../../../redux/features/utils/utilSlice';
import CustomPlatformForm from '../../../CustomFields/CustomPlatformForm';
import { Controller } from 'react-hook-form';
import CustomHostNameForm from '../../../CustomFields/CustomHostNameField';
import CustomMeetingTypeField from '../../../CustomFields/CustomMeetingTypeField';
import CustomButton from '../../../CustomFields/CustomButton';
import { toast } from 'react-toastify';

const headers = ['S. No.', 'Slot Date', 'From Time', 'To Time', 'Select'];

const timezone = Number(localStorage.getItem('timezone_id'));

const actionButtons = [
    {
        type: 'button',
    },
];

const CreateSession = ({ componentName, timezoneID }) => {
    const dispatch = useDispatch();

    const initialFormData = {
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
    };

    const [formData, setFormData] = useState(initialFormData);

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

    const { timezones, platforms, hosts } = useSelector(state => state.util);
    const { scheduleNewSessionPopup, students, batches } = useSelector(
        state => state.commonCalender
    );

    useEffect(() => {
        dispatch(getTimezone());
        dispatch(getPlatforms());
        dispatch(getAllHosts());
    }, [dispatch]);

    const [error, setError] = useState({});
    const meetingTypes = ['webinars', 'meetings'];

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

    const validate = () => {

        if(!formData.sessionName){
            toast.error('Please enter meeting name')
            return false;
        }
        
        // Check if 'duration' is provided and in the correct format
        if (!formData.duration) {
            toast.error('Please select duration');
            return false;
        }

        if(!formData.platform_id){
            toast.error('Please select meeting platform')
            return false;
        }

        if(formData.platform_id === 1 ){
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
        if(!formData.message){
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

        if(!validate()) return;

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
            host_email_id: formData.host_email_id,
            meeting_type: formData.meeting_type,
        };

        dispatch(createSessionApi(data))
            .unwrap()
            .then(() => {
                dispatch(getSessionApi());
                dispatch(getSlotApi());
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
                                                options={meetingTypes}
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
                                    label="Timezone"
                                    name="timezone"
                                    errors={!!error.timezone}
                                    helperText={error.timezone}
                                    sx={{ width: '100%' }}
                                    value={timezoneID}
                                    // onChange={field.onChange}
                                    // disabled={timezoneID != null}
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
        <ReusableDialog
            open={scheduleNewSessionPopup}
            handleClose={() => {
                dispatch(closeScheduleNewSession());
                setFormData(initialFormData);
            }}
            title={`Create New Session`}
            content={content}
            actions={actions}
        />
    );
};

export default CreateSession;
