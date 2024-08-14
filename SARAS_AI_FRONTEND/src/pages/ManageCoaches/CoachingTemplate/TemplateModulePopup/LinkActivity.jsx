import React, { useEffect, useState } from 'react';
import ReusableDialog from '../../../../components/CustomFields/ReusableDialog';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import {
    Button,
    Grid,
    Typography,
    Box,
    Checkbox,
    FormControlLabel,
    FormControl,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import VideoUploadComponent from './videoUpload/VideoUploadComponent';
import CustomFormControl from '../../../../components/CustomFields/CustomFromControl';
import CustomTextField from '../../../../components/CustomFields/CustomTextField';
import CustomDateField from '../../../../components/CustomFields/CustomDateField';
import CustomTimeField from '../../../../components/CustomFields/CustomTimeField';
import { getActivityType } from '../../../../redux/features/adminModule/coach/activityTypeSlice';
import { getCoach } from '../../../../redux/features/adminModule/coach/coachSlice';
import {
    linkActivity,
    uploadpdf,
} from '../../../../redux/features/adminModule/coach/LinkActivitySlice';
import VirtualGroupSession from './LinkActivityPopup/VirtualGroupSession';

import {
    getCoachAvailableSlotsFromDate,
    createCoachSchedule,
} from '../../../../redux/features/adminModule/coach/coachSchedule';
import { getTaAvailableSlotsFromDate } from '../../../../redux/features/adminModule/ta/taScheduling';
import TestActivityComponent from './Components/TestActivityComponent';
import OneOnOneSessionComponent from './Components/OneonOneSessionComponent';
import PDFUploadComponent from './Components/PDFUploadComponent';
import { getCoachTemplateModuleId } from '../../../../redux/features/adminModule/coach/coachTemplateSlice';
// import { uploadpdf } from '../../../../redux/features/adminModule/coach/LinkActivitySlice';
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
                fontSize: '14px', // Reduced font size
                borderRadius: '50px',
                padding: '8px 16px', // Reduced padding
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

const LinkActivityPopup = ({ open, handleClose, activityId, templateId, LinkActivitytype }) => {
    const dispatch = useDispatch();
    console.log('template id', templateId);
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm();
    const { upload_pdf_url } = useSelector(state => state.linkActivity  );
    const [fromDate, setFromDate] = useState(null);
    const [activityType, setActivityType] = useState('');
    const [selectedSessionType, setSelectedSessionType] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [askCoach, setAskCoach] = useState(false);
    const [selectedCoachId, setSelectedCoachId] = useState('');
    const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
    const [selectedActivityId, setSelectedActivityId] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const onSubmit = async data => {
        const payload = {
            activity_id: activityId, // Ensure this value is correctly set
            activity_type_id:
                activityType === 'test'
                    ? selectedAssessmentId
                    : selectedActivityId, // Ensure this value is correctly set
            link: videoUrl || upload_pdf_url || data.link || data.virtualMeetLink , // Add other fields if needed
        };
        try {
            if(payload.link){
            await dispatch(linkActivity(payload))
                .unwrap()
                .then(() => {
                    // Refetch the data to update the table
                    dispatch(getCoachTemplateModuleId(templateId));
                });
            handlePopUpClose();
            }
        } catch (error) {
            console.error('Failed to link activity:', error);
        }
    };

    const handlePopUpClose = () =>{
        setActivityType('');
        setSelectedActivityId('');
        reset();
        setVideoUrl(null);
        handleClose();
    }

    useEffect(() => {
        dispatch(getActivityType());
        dispatch(getCoach());
        // dispatch(getSlotsCoachTemplateModule());
    }, [dispatch]);

    const handleVideoUploadComplete = url => {
        setVideoUrl(url);
        // You can handle the video URL here, such as updating state or making an API call
    };

    const { typeList } = useSelector(state => state.activityType);
    const { coaches } = useSelector(state => state.coachModule);
    const { coachAvailableSlots } = useSelector(state => state.coachScheduling);
    console.log('coaches', coaches);
    console.log('coachesslot', coachAvailableSlots);

    const activityOptions = typeList
        .filter((_, index) => index < 5)
        .map(type => ({
            value: type.type_name,
            label:
                type.type_name.charAt(0).toUpperCase() +
                type.type_name.slice(1), // Capitalize the first letter of each type_name
            id: type.id,
        }));

    const assessmentOptions = typeList
        .filter((_, index) => index >= 5)
        .map(type => ({
            value: type.type_name,
            label:
                type.type_name.charAt(0).toUpperCase() +
                type.type_name.slice(1), // Capitalize the first letter of each type_name
            id: type.id,
    }));

    const sessionTypes = [
        { value: 'one-on-one', label: 'One-on-one session' },
        { value: 'group', label: 'Group session' },
    ];

    const coachOptions = coaches.map(coach => ({
        value: coach.name,
        label: coach.name,
        id: coach.id,
    }));

    const timeSlots = [
        { value: 'slot1', label: '10:00 AM - 11:00 AM' },
        { value: 'slot2', label: '11:00 AM - 12:00 PM' },
        { value: 'slot3', label: '1:00 PM - 2:00 PM' },
        { value: 'slot4', label: '2:00 PM - 3:00 PM' },
        { value: 'slot5', label: '3:00 PM - 4:00 PM' },
    ];

    const formatTime = time => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${ampm}`;
    };

    const timeZones = [
        { value: 'UTC', label: 'UTC' },
        { value: 'GMT', label: 'GMT' },
        { value: 'PST', label: 'Pacific Standard Time' },
        { value: 'EST', label: 'Eastern Standard Time' },
    ];
    const handleCoachChange = e => {
        const selected = coachOptions.find(
            option => option.value === e.target.value
        );

        if (selected) {
            setSelectedCoachId(selected.id);
            console.log('Selected Coach ID:', selected.id); // Log the selected coach ID
        }
    };

    console.log('hello coach id is', selectedCoachId);
    useEffect(() => {
        const data = {
            admin_user_id: selectedCoachId,
            date: fromDate,
        };
        console.log('data', data);
        if (fromDate && selectedCoachId) {
            dispatch(getTaAvailableSlotsFromDate(data));
            dispatch(getCoachAvailableSlotsFromDate(data));

            if (coachAvailableSlots) {
                const data1 = {
                    admin_user_id: selectedCoachId,
                    meeting_name: 'Team Meeting',
                    meeting_url: 'http://example.com/meeting',
                    schedule_date: fromDate,
                    slot_id: coachAvailableSlots[0].id,
                    start_time: coachAvailableSlots[0].from_time,
                    end_time: coachAvailableSlots[0].to_time,
                    timezone: 'IST',
                    event_status: 'scheduled',
                    end_date: fromDate,
                    studentId: [1],
                    batchId: [2],
                    weeks: [0, 0, 0, 0, 0, 0, 0],
                };
                dispatch(createCoachSchedule(data1));
            }
        }
    }, [fromDate, dispatch]);

    useEffect(() => {
        // Reset `askCoach` when `activityType` or `selectedSessionType` changes
        setAskCoach(false);
        setSelectedSessionType('');
    }, [activityType]);
    const contentComponent = (
        <Grid
            container
            spacing={1} // Reduced spacing between items
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%',
            }}
        >
            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ margin: '10px 0px', width: '80%' }}
            >
                <Controller
                    name="activityName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <CustomFormControl
                            label="Activity Type"
                            name="activityType"
                            value={field.value}
                            onChange={e => {
                                const selectedOption = activityOptions.find(
                                    option => option.value === e.target.value
                                );
                                setActivityType(e.target.value);
                                setSelectedActivityId(
                                    selectedOption ? selectedOption.id : ''
                                );
                                field.onChange(e);
                            }}
                            errors={errors}
                            options={activityOptions}
                        />
                    )}
                />
            </Grid>

            {activityType === 'videos' && (
                <VideoUploadComponent
                    onUploadComplete={handleVideoUploadComplete}
                />
            )}

            {activityType === 'pdf' && <PDFUploadComponent />}

            {activityType === 'link' && (
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    style={{ margin: '5px 0px', width: '80%' }}
                >
                    <Controller
                        name="link"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <CustomTextField
                                label="Link"
                                name="virtualMeetLink"
                                variant="outlined"
                                value={field.value}
                                onChange={e => {
                                    field.onChange(e);
                                }}
                                placeholder="Enter Link"
                                fullWidth
                            />
                        )}
                    />
                </Grid>
            )}

            {activityType === 'test' && (
                <TestActivityComponent
                    control={control}
                    errors={errors}
                    assessmentOptions={assessmentOptions}
                    setSelectedAssessmentId={setSelectedAssessmentId}
                />
            )}

            {activityType === 'virtual meet' && (
                <>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        style={{ margin: '5px 0px', width: '80%' }}
                    >
                        <Controller
                            name="virtualMeetLink"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <CustomTextField
                                    label="Link"
                                    name="virtualMeetLink"
                                    variant="outlined"
                                    value={field.value}
                                    onChange={e => {
                                        field.onChange(e);
                                    }}
                                    placeholder="Enter Link"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        style={{ margin: '5px 0px', width: '80%' }}
                    >
                        <FormControl
                            component="fieldset"
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                        >
                            <Controller
                                name="sessionType"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <RadioGroup
                                        row
                                        value={field.value}
                                        onChange={e => {
                                            setSelectedSessionType(
                                                e.target.value
                                            );
                                            field.onChange(e.target.value);
                                        }}
                                    >
                                        <FormControlLabel
                                            control={<Radio />}
                                            label="One-on-one session"
                                            value="one-on-one"
                                        />
                                        <FormControlLabel
                                            control={<Radio />}
                                            label="Group session"
                                            value="group"
                                        />
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>
                    </Grid>
                </>
            )}

            {selectedSessionType === 'one-on-one' && (
                <OneOnOneSessionComponent
                    askCoach={askCoach}
                    setAskCoach={setAskCoach}
                />
            )}

            {selectedSessionType === 'group' &&
                activityType === 'virtual meet' && <VirtualGroupSession />}
        </Grid>
    );

    const actions = (
        <>
            <CustomButton
                onClick={handleSubmit(onSubmit)}
                backgroundColor="#F56D3B"
                borderColor="#F56D3B"
                color="#FFFFFF"
                style={{ textTransform: 'none' }} // Inline style to transform text to lowercase
            >
                Submit
            </CustomButton>
        </>
    );

    return (
        <ReusableDialog
            open={open}
            handleClose={handlePopUpClose}
            title="Link Activity"
            content={contentComponent}
            actions={actions}
        />
    );
};

export default LinkActivityPopup;
