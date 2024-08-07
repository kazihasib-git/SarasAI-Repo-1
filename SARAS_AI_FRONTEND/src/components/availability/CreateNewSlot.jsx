import React, { useEffect, useState } from 'react';
import {
    Grid,
    Button,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormGroup,
    Checkbox,
    Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import CustomDateField from '../CustomFields/CustomDateField';
import CustomTimeField from '../CustomFields/CustomTimeField';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomTimeZoneForm from '../CustomFields/CustomTimeZoneForm';
import CustomButton from '../CustomFields/CustomButton';

import { getTimezone } from '../../redux/features/utils/utilSlice';
import {
    createSlots,
    closeCreateNewSlots,
    fetchTaSlots,
} from '../../redux/features/adminModule/ta/taAvialability';
import {
    createCoachSlots,
    fetchCoachSlots,
} from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';

import { convertToUTC } from '../../utils/dateAndtimeConversion';

const weekDays = [
    'Sunday',
    'Monday',   
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

const CreateNewSlot = ({ componentName }) => {
    const { id: taId } = useParams();
    const dispatch = useDispatch();

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [repeat, setRepeat] = useState('onetime');
    const [fromTime, setFromTime] = useState(null);
    const [toTime, setToTime] = useState(null);

    let sliceName, createSlotApi, getSlotsApi;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taAvialability';
            createSlotApi = createSlots;
            getSlotsApi = fetchTaSlots;
            break;
        case 'COACHCALENDER':
            sliceName = 'coachAvailability';
            createSlotApi = createCoachSlots;
            getSlotsApi = fetchCoachSlots;
            break;
        default:
            sliceName = null;
            createSlotApi = null;
            getSlotsApi = null;
            break;
    }

    const schedulingState = useSelector(state => state[sliceName]);
    const { createNewSlotOpen } = useSelector(state => state.taAvialability);
    const { timezones } = useSelector(state => state.util);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleDayChange = day => {
        setSelectedDays(prev => {
            if (prev.includes(day)) {
                return prev.filter(d => d !== day);
            } else {
                return [...prev, day];
            }
        });
    };

    useEffect(() => {
        dispatch(getTimezone());
    }, [dispatch]);

    const validate = () => {
        if (!fromDate) {
            toast.error('Please select From Date');
            return false;
        }
        if (!fromTime) {
            toast.error('Please select From Time');
            return false;
        }
        if (!toTime) {
            toast.error('Please select To Time');
            return false;
        }
        if (repeat === 'recurring' && !toDate) {
            toast.error('Please select To Date');
            return false;
        }
        if (repeat === 'recurring' && selectedDays.length === 0) {
            toast.error('Please select at least one day');
            return false;
        }
        return true;
    };

    const onSubmit = formData => {
        if (!validate()) {
            return;
        }

        let weeksArray = Array(7).fill(0);
        if (repeat === 'recurring') {
            selectedDays.forEach(day => {
                const index = weekDays.indexOf(day);
                weeksArray[index] = 1;
            });
        } else if (repeat === 'onetime') {
            const index = new Date(fromDate).getDay();
            weeksArray[index] = 1;
        }

        formData.slot_date = fromDate;
        formData.from_time = fromTime;
        formData.to_time = toTime;
        formData.end_date = repeat === 'recurring' ? toDate : fromDate;
        formData.weeks = weeksArray;
        formData.admin_user_id = taId;

        const { slot_date, from_time, to_time, end_date, timezone_id } = formData;
        const convertedTimes = convertToUTC({ date_slot: slot_date, start_time: from_time, time_end: to_time, slot_end_date: end_date, time_zone_id: timezone_id });

        console.log("Converted Times:", convertedTimes);

        dispatch(createSlotApi(formData)).then(() => {
            dispatch(closeCreateNewSlots());
            dispatch(getSlotsApi(taId));
        });
    };

    const content = (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ height: '100%', width: '100%' }}
        >
            <Grid container spacing={2} justifyContent="center">
                <form
                    id="createForm"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        m={4}
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
                                value={fromDate}
                                onChange={date => setFromDate(date)}
                                name="fromDate"
                                register={register}
                                validation={{
                                    required: 'From Date is required',
                                }}
                                sx={{ width: '100%' }}
                            />
                        </Grid>
                        <Grid
                            container
                            spacing={3}
                            sx={{ pt: 3, pb: 3 }}
                            justifyContent="center"
                        >
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
                                    value={fromTime}
                                    onChange={time => setFromTime(time)}
                                    register={register}
                                    validation={{
                                        required: 'From Time is required',
                                    }}
                                    errors={errors}
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
                                    label="To Time"
                                    name="toTime"
                                    value={toTime}
                                    onChange={time => setToTime(time)}
                                    register={register}
                                    validation={{
                                        required: 'To Time is required',
                                    }}
                                    errors={errors}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            spacing={3}
                            sx={{ pt: 3 }}
                            justifyContent="center"
                        >
                            <Controller
                                name="timezone_id"
                                control={control}
                                render={({ field }) => (
                                    <CustomTimeZoneForm
                                        label="Time Zone"
                                        name="timezone_id"
                                        value={field.value}
                                        onChange={field.onChange}
                                        errors={errors}
                                        options={timezones}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid
                            container
                            spacing={3}
                            justifyContent="center"
                            sx={{ pt: 3 }}
                        >
                            <Grid
                                item
                                xs={12}
                                display="flex"
                                justifyContent="center"
                            >
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        row
                                        value={repeat}
                                        onChange={e =>
                                            setRepeat(e.target.value)
                                        }
                                        sx={{ justifyContent: 'center' }}
                                    >
                                        <FormControlLabel
                                            value="onetime"
                                            control={<Radio />}
                                            label="One-Time"
                                        />
                                        <FormControlLabel
                                            value="recurring"
                                            control={<Radio />}
                                            label="Recurring"
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                        {repeat === 'recurring' && (
                            <>
                                <Grid
                                    container
                                    spacing={3}
                                    sx={{ pt: 3 }}
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
                                            label="To Date"
                                            value={toDate}
                                            onChange={date => setToDate(date)}
                                            name="toDate"
                                            register={register}
                                            validation={{
                                                required: 'To Date is required',
                                            }}
                                            errors={errors}
                                            sx={{ width: '100%' }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    spacing={3}
                                    sx={{ pt: 3 }}
                                    justifyContent="center"
                                >
                                    <Grid item xs={12} sm={6}>
                                        <FormGroup row>
                                            {weekDays.map(day => (
                                                <FormControlLabel
                                                    key={day}
                                                    control={
                                                        <Checkbox
                                                            checked={selectedDays.includes(day)}
                                                            onChange={() => handleDayChange(day)}
                                                        />
                                                    }
                                                    label={day}
                                                />
                                            ))}
                                        </FormGroup>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                        <Grid
                            container
                            spacing={3}
                            justifyContent="center"
                            sx={{ pt: 3 }}
                        >
                            <Grid item xs={12} display="flex" justifyContent="center">
                                <Button type="submit" variant="contained">
                                    Create Slot
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </Grid>
        </Box>
    );

    return (
        <ReusableDialog
            dialogContent={content}
            dialogTitle="Create New Slot"
            isOpen={createNewSlotOpen}
            handleClose={() => dispatch(closeCreateNewSlots())}
        />
    );
};

export default CreateNewSlot;
