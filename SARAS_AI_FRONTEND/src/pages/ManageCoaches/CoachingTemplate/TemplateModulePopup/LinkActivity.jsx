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
import { getActivityType } from '../../../../redux/features/ActivityType/activityTypeSlice';

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

const LinkActivityPopup = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const [activityType, setActivityType] = useState('');
    const [selectedSessionType, setSelectedSessionType] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [askCoach, setAskCoach] = useState(false);

    const onSubmit = (data) => {
        console.log(data); // Example: Log form data
        handleClose();
    };
    useEffect(() => {
        dispatch(getActivityType());
    }, [dispatch]);

    const { typeList } = useSelector((state) => state.activityType);

    const activityOptions =
        typeList?.map((type) => ({
            value: type.type_name,
            label:
                type.type_name.charAt(0).toUpperCase() +
                type.type_name.slice(1), // Capitalize the first letter of each type_name
        })) || [];

    const assessmentOptions = [
        { value: 'wheel_of_life', label: 'Wheel of Life' },
        { value: 'core_value', label: 'Core Value' },
        { value: 'belief', label: 'Belief' },
    ];

    const sessionTypes = [
        { value: 'one-on-one', label: 'One-on-one session' },
        { value: 'group', label: 'Group session' },
    ];

    const coachOptions = [
        { value: 'coach1', label: 'Coach A' },
        { value: 'coach2', label: 'Coach B' },
        { value: 'coach3', label: 'Coach C' },
    ];

    const timeSlots = [
        { value: 'slot1', label: '10:00 AM - 11:00 AM' },
        { value: 'slot2', label: '11:00 AM - 12:00 PM' },
        { value: 'slot3', label: '1:00 PM - 2:00 PM' },
        { value: 'slot4', label: '2:00 PM - 3:00 PM' },
        { value: 'slot5', label: '3:00 PM - 4:00 PM' },
    ];

    const timeZones = [
        { value: 'UTC', label: 'UTC' },
        { value: 'GMT', label: 'GMT' },
        { value: 'PST', label: 'Pacific Standard Time' },
        { value: 'EST', label: 'Eastern Standard Time' },
    ];

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
                            onChange={(e) => {
                                setActivityType(e.target.value);
                                field.onChange(e);
                            }}
                            errors={errors}
                            options={activityOptions}
                        />
                    )}
                />
            </Grid>

            {activityType === 'videos' && <VideoUploadComponent />}

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
                                name="link"
                                variant="outlined"
                                value={field.value}
                                onChange={(e) => {
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
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    style={{ margin: '5px 0px', width: '80%' }}
                >
                    <Controller
                        name="assessment"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <CustomFormControl
                                label="Assessment"
                                name="assessment"
                                value={field.value}
                                onChange={(e) => {
                                    field.onChange(e);
                                }}
                                errors={errors}
                                options={assessmentOptions}
                            />
                        )}
                    />
                </Grid>
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
                                    onChange={(e) => {
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
                                        onChange={(e) => {
                                            setSelectedSessionType(
                                                e.target.value,
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
                <Grid
                    item
                    xs={12}
                    style={{
                        margin: '2px 0px',
                        width: '80%',
                        paddingTop: '2px',
                    }}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={askCoach}
                                onChange={(e) => setAskCoach(e.target.checked)}
                                sx={{
                                    color: 'black',
                                    '&.Mui-checked': {
                                        color: 'black',
                                    },
                                }}
                            />
                        }
                        label="Ask respective coach to schedule the session with the student before due date"
                    />
                </Grid>
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
                                        onChange={(e) => {
                                            field.onChange(e);
                                            // handleCoachChange(e); // Uncomment if you have a handleCoachChange function
                                        }}
                                        errors={errors}
                                        options={coachOptions}
                                    />
                                )}
                            />
                        </Grid>
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
                                        value={selectedDate}
                                        onChange={(newValue) => {
                                            setSelectedDate(newValue);
                                            field.onChange(newValue);
                                        }}
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
                            <Typography variant="h6">
                                Available Slots
                            </Typography>
                            <Grid container spacing={1}>
                                {timeSlots.map((slot) => (
                                    <Grid item xs={6} sm={4} key={slot.value}>
                                        <FormControlLabel
                                            control={<Checkbox />}
                                            label={slot.label}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
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
                                        value={field.value}
                                        onChange={(e) => {
                                            field.onChange(e);
                                        }}
                                        errors={errors}
                                        options={timeZones.map((zone) => ({
                                            value: zone.value,
                                            label: zone.label,
                                        }))}
                                    />
                                )}
                            />
                        </Grid>
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
            >
                Submit
            </CustomButton>
        </>
    );

    return (
        <ReusableDialog
            open={open}
            handleClose={handleClose}
            title="Link Activity"
            content={contentComponent}
            actions={actions}
        />
    );
};

export default LinkActivityPopup;
