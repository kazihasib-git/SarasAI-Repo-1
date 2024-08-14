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
import { getPlatforms, getTimezone } from '../../../../redux/features/utils/utilSlice';
import { timezoneIdToName } from '../../../../utils/timezoneIdToName';
import { convertFromUTC } from '../../../../utils/dateAndtimeConversion';
import CustomPlatformForm from '../../../../components/CustomFields/CustomPlatformForm';

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
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm();
    const { upload_pdf_url } = useSelector(state => state.linkActivity  );
    const [activityType, setActivityType] = useState('');
    const [selectedSessionType, setSelectedSessionType] = useState('');
    const [askCoach, setAskCoach] = useState(false);
    const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
    const [selectedActivityId, setSelectedActivityId] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    const [fromDate, setFromDate] = useState(null);
    const [selectedCoachId, setSelectedCoachId] = useState(null);
    const [coachTimeZone, setCoachTimeZone] = useState(null);
    const [coachSlots, setCoachSlots] = useState(null);
    const [selectedPlatform, setSelectedPlatform] = useState(null);

    const { timezones, platforms } = useSelector(state => state.util);
    const [selectedSlot, setSelectedSlot] = useState(''); 

    const onSubmit = async data => {
        console.log('////////////////////////',data);
        const payload = {
            activity_id: activityId, // Ensure this value is correctly set
            activity_type_id:
                activityType === 'test'
                    ? selectedAssessmentId
                    : selectedActivityId, // Ensure this value is correctly set
            link: videoUrl || upload_pdf_url || data.link || data.virtualMeetLink , // Add other fields if needed
        };
        try {
            if(activityType ==='virtual meet' && selectedSessionType=="group"){
                const dataToGenrateLink = {
                    "admin_user_id": selectedCoachId,
                    "meeting_name": data.meeting_name,
                    "schedule_date": fromDate,
                    "end_date": fromDate,
                    "start_time": data.fromTime,
                    "end_time": data.toTime,
                    "slot_id": Number(selectedSlot),
                    "timezone_id": coachTimeZone,
                    "platform_id" : selectedPlatform,
                    "event_status": "scheduled",
                    "session_type" : "Live",
                    "studentId": [],
                    "batchId": [],
                    "weeks": weeksArray
                }
                dispatch(createCoachSchedule(dataToGenrateLink))
                .then((response)=>{
                     console.log('..............................................',response);
                     if(response.payload){
                        payload.link = response.payload.data[0].meeting_id;
                        dispatch(linkActivity(payload))
                        .unwrap()
                        .then(() => {
                            // Refetch the data to update the table
                            dispatch(getCoachTemplateModuleId(templateId));
                        });
                     }
                });

            }else{ 
                dispatch(linkActivity(payload))
                .unwrap()
                .then(() => {
                    // Refetch the data to update the table
                    dispatch(getCoachTemplateModuleId(templateId));
                });
            }
           // handlePopUpClose();
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

    useEffect(() => {
        // Reset `askCoach` when `activityType` or `selectedSessionType` changes
        setAskCoach(false);
        setSelectedSessionType('');
    }, [activityType]);

    

    const handleSlotChange = (event) => {
        console.log(event.target.value);
        setSelectedSlot(event.target.value); 
    };

    let weeksArray = Array(7).fill(0);

    const index = new Date(fromDate).getDay();
    weeksArray[index] = 1;

    console.log('coaches', coaches);
    console.log('coachesslot', coachAvailableSlots);

    const formatTime = time => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${ampm}`;
    };

    const storedTimezoneId = Number(localStorage.getItem('timezone_id'));

    const tranformSlots = async (coachAvailableSlots) =>{
        const timezonename = timezoneIdToName(
            storedTimezoneId,
            timezones
        );
        const transformedSlots = await Promise.all(
            coachAvailableSlots.map(async slot => {
                console.log(slot);
                const localTime = await convertFromUTC({
                    start_date: slot.slot_date.split(' ')[0],
                    start_time: slot.from_time,
                    end_time: slot.to_time,
                    end_date: slot.slot_end_date.split(' ')[0],
                    timezonename,
                });
                console.log(
                    'Converted Local Schedule Time:',
                    localTime);
                const newSlot = {
                    from_time: localTime.start_time,
                    to_time: localTime.end_time,
                    id: slot.id
                }
                return newSlot; 
            }
        ))
        console.log('transformed slots',transformedSlots);
        setCoachSlots(transformedSlots);
    }

    useEffect(()=>{
        tranformSlots(coachAvailableSlots);
    },[coachAvailableSlots]);

    useEffect(()=>{
        dispatch(getTimezone());
        dispatch(getPlatforms());
    },[dispatch]);

    const coachOptions = coaches.map(coach => ({
        value: coach.name,
        label: coach.name,
        id: coach.id,
    }));
    const handleCoachChange = e => {
        const selected = coachOptions.find(
            option => option.value === e.target.value
        );

        if (selected) {
            setSelectedCoachId(selected.id);
            console.log('Selected Coach ID:', selected.id); // Log the selected coach ID
        }
    };

    useEffect(() => {
        const selectedCoachTimeZone = timezones.find(timezone => timezone.id===coachTimeZone);

        if(selectedCoachTimeZone){
        const data = {
            admin_user_id: selectedCoachId,
            date: fromDate,
            timezone_name: selectedCoachTimeZone.time_zone,
        };
        console.log('data', data);
        if (fromDate && selectedCoachId) {
            dispatch(getTaAvailableSlotsFromDate(data));
            dispatch(getCoachAvailableSlotsFromDate(data));
        }
        }
    }, [fromDate, dispatch]);

    useEffect(()=>{
       const selectedCoach = coaches.find(coach => coach.id===selectedCoachId);
       if(selectedCoach) setCoachTimeZone(selectedCoach.timezone_id);
    },[selectedCoachId]);

    const handlePlatformChange = event =>{
        console.log('platform...................',event.target.value);
        setSelectedPlatform(event.target.value);
    }


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
                activityType === 'virtual meet' && (
                    <>
            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ margin: '5px 0px', width: '80%' }}
            >
                <Controller
                    name="coach"
                    control={control}
                    defaultValue="coach"
                    render={({ field }) => (
                        <CustomFormControl
                            label="Select Coach"
                            name="coach"
                            value={field.value}
                            onChange={e => {
                                field.onChange(e);
                                handleCoachChange(e);
                            }}
                            errors={errors}
                            options={coachOptions}
                        />
                    )}
                />
            </Grid>

           {selectedCoachId && ( 
            <>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    style={{ margin: '5px 0px', width: '80%' }}
                >
                    <Controller
                        name="date"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                            <CustomDateField
                                label="Select Date"
                                name="date"
                                value={fromDate}
                                onChange={setFromDate}
                                fullWidth
                            />
                        )}
                    />
                </Grid>

                {fromDate && (
                    <>
                    <Grid item xs={12} style={{ margin: '5px 0px', width: '80%' }}>
                        <Typography variant="h6">Available Slots</Typography>
                        {coachSlots && coachSlots.length > 0 ? (
                            <RadioGroup value={selectedSlot} onChange={handleSlotChange}>
                                {coachSlots.map((slot, index) => (
                                    <FormControlLabel 
                                        key={index}
                                        control={<Radio />}
                                        label={`${formatTime(slot.from_time)} - ${formatTime(slot.to_time)}`}
                                        value={slot.id}
                                    />
                                ))}
                            </RadioGroup>
                        ) : (
                            <Typography>No slots available</Typography>
                        )}
                    
                        <Grid
                            item
                            xs={12}
                            display="flex"
                            justifyContent="center"
                            style={{ margin: '15px 0px' }}
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

                    <CustomPlatformForm
                        label="Platform"
                        name="platform"
                        placeholder="Select Platform"
                        value={
                            selectedPlatform
                        }
                        onChange={handlePlatformChange}
                        errors={''}
                        options={platforms}
                        sx={{ width: '100px' }} // Adjust the width as needed
                    />
                    </Grid>
                    
                    <Grid
                        container
                        spacing={1}
                        style={{ margin: '5px 0px', width: '80%' }}
                    >
                        <Grid item xs={6}>
                            <Controller
                                name="fromTime"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <CustomTimeField
                                        {...field}
                                        label="From Time"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="toTime"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <CustomTimeField
                                        {...field}
                                        label="To Time"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        style={{ margin: '5px 0px', width: '80%' }}
                    >
                        <Controller
                            name="timezone"
                            control={control}
                            defaultValue="IST"
                            render={({ field }) => (
                                <CustomFormControl
                                    label="Time Zone"
                                    name="timezone"
                                    value={coachTimeZone}
                                    disabled={true}
                                    errors={errors}
                                    options={timezones.map(zone => ({
                                        value: zone.id,
                                        label: zone.time_zone,
                                    }))}
                                />
                            )}
                        />
                    </Grid>
                    </>
                )}
            </>
            )}
        </>
                )}
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
