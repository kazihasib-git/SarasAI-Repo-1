import React, { useEffect, useState } from 'react';
import ReusableDialog from '../../../../../components/CustomFields/ReusableDialog';
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
import CustomFormControl from '../../../../../components/CustomFields/CustomFromControl';
import CustomTextField from '../../../../../components/CustomFields/CustomTextField';
import CustomDateField from '../../../../../components/CustomFields/CustomDateField';
import CustomTimeField from '../../../../../components/CustomFields/CustomTimeField';
import { getActivityType } from '../../../../../redux/features/ActivityType/activityTypeSlice';
import { getCoach } from '../../../../../redux/features/CoachModule/coachSlice';
import { linkActivity } from '../../../../../redux/features/ActivityType/LinkActivitySlice';

import { getCoachAvailableSlotsFromDate } from '../../../../../redux/features/CoachModule/coachSchedule';
import { getTaAvailableSlotsFromDate } from '../../../../../redux/features/taModule/taScheduling';
import { createCoachSchedule } from '../../../../../redux/features/CoachModule/coachSchedule';

const LinkActivityComponent = () => {
    const dispatch = useDispatch();
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const [fromDate, setFromDate] = useState(null);
    const [selectedCoachId, setSelectedCoachId] = useState('');
    const { coaches } = useSelector(state => state.coachModule);
    let weeksArray = Array(7).fill(0);

    const index = new Date(fromDate).getDay();
    weeksArray[index] = 1;

    const { coachAvailableSlots } = useSelector(state => state.coachScheduling);
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
    const timeZones = [
        { value: 'UTC', label: 'UTC' },
        { value: 'GMT', label: 'GMT' },
        { value: 'PST', label: 'Pacific Standard Time' },
        { value: 'EST', label: 'Eastern Standard Time' },
    ];
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
        const data = {
            admin_user_id: selectedCoachId,
            date: fromDate,
        };
        console.log('data', data);
        if (fromDate && selectedCoachId) {
            dispatch(getTaAvailableSlotsFromDate(data));
            dispatch(getCoachAvailableSlotsFromDate(data));

            if (coachAvailableSlots.length > 0) {
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
                    studentId: [],
                    batchId: [],
                    weeks: weeksArray,
                };
                dispatch(createCoachSchedule(data1));
            }
        }
    }, [fromDate, dispatch]);
    return (
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
                            value={fromDate}
                            onChange={setFromDate}
                            fullWidth
                        />
                    )}
                />
            </Grid>

            <Grid item xs={12} style={{ margin: '5px 0px', width: '80%' }}>
                <Typography variant="h6">Available Slots</Typography>
                {coachAvailableSlots && coachAvailableSlots.length > 0 ? (
                    <RadioGroup>
                        {coachAvailableSlots.map((slot, index) => (
                            <FormControlLabel
                                key={index}
                                control={<Radio />}
                                label={`${formatTime(slot.from_time)} - ${formatTime(slot.to_time)}`}
                                value={slot.timeFrom}
                            />
                        ))}
                    </RadioGroup>
                ) : (
                    <Typography>No slots available</Typography>
                )}
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
                            onChange={e => {
                                field.onChange(e);
                            }}
                            errors={errors}
                            options={timeZones.map(zone => ({
                                value: zone.value,
                                label: zone.label,
                            }))}
                        />
                    )}
                />
            </Grid>
        </>
    );
};

export default LinkActivityComponent;
