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
import {
    getCoachAvailableSlotsFromDate,
    createCoachSchedule,
} from '../../../../../redux/features/adminModule/coach/coachSchedule';
import { getTaAvailableSlotsFromDate } from '../../../../../redux/features/adminModule/ta/taScheduling';
import {
    getPlatforms,
    getTimezone,
} from '../../../../../redux/features/utils/utilSlice';
import { timezoneIdToName } from '../../../../../utils/timezoneIdToName';
import { convertFromUTC } from '../../../../../utils/dateAndtimeConversion';
import CustomPlatformForm from '../../../../../components/CustomFields/CustomPlatformForm';

const VirtualGroupSession = () => {
    const dispatch = useDispatch();
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const [fromDate, setFromDate] = useState(null);
    const [selectedCoachId, setSelectedCoachId] = useState(null);
    const [coachTimeZone, setCoachTimeZone] = useState(null);
    const [coachSlots, setCoachSlots] = useState(null);
    const [selectedPlatform, setSelectedPlatform] = useState(null);
    const { coaches } = useSelector(state => state.coachModule);
    const { timezones, platforms } = useSelector(state => state.util);
    const [selectedSlot, setSelectedSlot] = useState('');

    const handleSlotChange = event => {
        console.log(event.target.value);
        setSelectedSlot(event.target.value);
    };

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

    const storedTimezoneId = Number(localStorage.getItem('timezone_id'));

    const tranformSlots = async coachAvailableSlots => {
        const timezonename = timezoneIdToName(storedTimezoneId, timezones);
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
                console.log('Converted Local Schedule Time:', localTime);
                const newSlot = {
                    from_time: localTime.start_time,
                    to_time: localTime.end_time,
                    id: slot.id,
                };
                return newSlot;
            })
        );
        console.log('transformed slots', transformedSlots);
        setCoachSlots(transformedSlots);
    };

    useEffect(() => {
        tranformSlots(coachAvailableSlots);
    }, [coachAvailableSlots]);

    useEffect(() => {
        dispatch(getTimezone());
        dispatch(getPlatforms());
    }, [dispatch]);

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
        const selectedCoachTimeZone = timezones.find(
            timezone => timezone.id === coachTimeZone
        );

        if (selectedCoachTimeZone) {
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

    useEffect(() => {
        const selectedCoach = coaches.find(
            coach => coach.id === selectedCoachId
        );
        if (selectedCoach) setCoachTimeZone(selectedCoach.timezone_id);
    }, [selectedCoachId]);

    const handlePlatformChange = event => {
        setSelectedPlatform(event.target.value);
    };

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
                            <Grid
                                item
                                xs={12}
                                style={{ margin: '5px 0px', width: '80%' }}
                            >
                                <Typography variant="h6">
                                    Available Slots
                                </Typography>
                                {coachSlots && coachSlots.length > 0 ? (
                                    <RadioGroup
                                        value={selectedSlot}
                                        onChange={handleSlotChange}
                                    >
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

                                <CustomPlatformForm
                                    label="Platform"
                                    name="platform"
                                    placeholder="Select Platform"
                                    value={selectedPlatform}
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
    );
};

export default VirtualGroupSession;
