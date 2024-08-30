import React, { useEffect, useState } from 'react';
import {
    Grid,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormGroup,
    Checkbox,
    Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import CustomDateField from '../CustomFields/CustomDateField';
import CustomTimeField from '../CustomFields/CustomTimeField';
import ReusableDialog from '../CustomFields/ReusableDialog';
import { useDispatch, useSelector } from 'react-redux';
import CustomTimeZoneForm from '../CustomFields/CustomTimeZoneForm';
import { getTimezone } from '../../redux/features/utils/utilSlice';
import { useParams } from 'react-router-dom';
import { timezoneIdToName } from '../../utils/timezoneIdToName';
import {
    createSlots,
    closeCreateNewSlots,
    fetchTaSlots,
} from '../../redux/features/adminModule/ta/taAvialability';
import {
    createCoachSlots,
    fetchCoachSlots,
} from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import { toast } from 'react-toastify';
import CustomButton from '../CustomFields/CustomButton';
import CustomFutureDateField from '../CustomFields/CustomFutureDateField';

const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

const CreateNewSlot = ({ componentName, timezoneID }) => {
    const { timezones } = useSelector(state => state.util);
    const taId = useParams();
    const dispatch = useDispatch();

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [repeat, setRepeat] = useState('onetime');
    const [fromTime, setFromTime] = useState(null);
    const [toTime, setToTime] = useState(null);

    useEffect(() => {
        dispatch(getTimezone());
    }, [dispatch]);

    let sliceName, createSlotApi, getSlotsApi;
    const timezoneName = timezoneIdToName(timezoneID, timezones);
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

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            timezone_id: timezoneID,
        },
    });

    const handleDayChange = day => {
        setSelectedDays(prev => {
            if (prev.includes(day)) {
                return prev.filter(d => d !== day);
            } else {
                return [...prev, day];
            }
        });
    };

    function convertTo24Hour(time12h) {
        const [time, modifier] = time12h.split(' ');
    
        let [hours, minutes] = time.split(':');
    
        if (hours === '12') {
            hours = '00';
        }
    
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
    
        return [parseInt(hours, 10),minutes];
    }

    function isHourLessOrEqual(inputTime) {
        // Get the current date and time
        const currentTime = new Date();
    
        // Split the input time string into hour, minutes, and seconds
        const [inputHour, inputMinutes, inputSeconds] = inputTime.split(':').map(Number);
    
        // Create a date object for the input time with today's date
        const inputDate = new Date();
        inputDate.setHours(inputHour, inputMinutes, inputSeconds);
    
        // Compare the input time with the current time
        return inputDate <= currentTime;
    }

    const validate = () => {

        let currentDate = new Date();
        let inputDate = new Date(fromDate)
        

        let sameDate = false;

        if (currentDate.getFullYear() === inputDate.getFullYear() &&
        currentDate.getMonth() === inputDate.getMonth() &&
        currentDate.getDate() === inputDate.getDate()) {
                console.log("Both dates are the same.");
                sameDate = true;
            }

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


        
        // if(sameDate && isHourLessOrEqual(fromTime)){
        //     let today = new Date();
        //     today.setDate(today.getDate() - 1)
        //     let year = today.getFullYear();      // Gets the full year (e.g., 2024)
        //     let month = today.getMonth() + 1;    // Gets the month (0-11, so add 1 to get 1-12)
        //     let day = today.getDate();           // Gets the day of the month (1-31)

        //     const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;

        //     toast.error(`Please select date after ${formattedDate}`);
        //     return false;
        // }

        return true;
    };

    const onSubmit = async formData => {
        // console.log('form data', formData);

        if (!validate()) {
            console.log('NOT VALID DATA');
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
        formData.admin_user_id = taId.id;
        formData.timezone_id = `${timezoneID}`;
        dispatch(createSlotApi(formData))
        .unwrap() // Ensure to unwrap the promise for direct handling
        .then(() => {
            dispatch(closeCreateNewSlots());
            dispatch(getSlotsApi(taId.id));
            toast.success('Slot has been successfully created');
        })
        .catch(error => {
            console.error('Error creating slot:', error);
            toast.error(` ${error}`);
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
                            <CustomFutureDateField
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
                                defaultValue={timezoneID}
                                render={({ field }) => (
                                    <CustomTimeZoneForm
                                        label="Time Zone"
                                        name="timezone_id"
                                        value={timezoneID}
                                        onChange={field.onChange}
                                        // disabled={timezoneID != null}
                                        options={timezones}
                                        errors={errors}
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
                                sm={6}
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
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center', // Center the checkboxes
                                        gap: 2,
                                        flexWrap: 'wrap',
                                        maxWidth: '65%',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                    }}
                                >
                                    <Grid item xs={12}>
                                        <FormControl component="fieldset">
                                            <FormGroup
                                                row
                                                sx={{
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {weekDays.map(day => (
                                                    <FormControlLabel
                                                        key={day}
                                                        control={
                                                            <Checkbox
                                                                checked={selectedDays.includes(
                                                                    day
                                                                )}
                                                                onChange={() =>
                                                                    handleDayChange(
                                                                        day
                                                                    )
                                                                }
                                                                name={day}
                                                            />
                                                        }
                                                        label={day}
                                                    />
                                                ))}
                                            </FormGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    display="flex"
                                    sx={{ pt: 3 }}
                                    justifyContent="center"
                                >
                                    <CustomDateField
                                        label="To Date"
                                        value={toDate}
                                        onChange={date => setToDate(date)}
                                        name="end_date"
                                        register={register}
                                        validation={{
                                            required: 'To Date is required',
                                        }}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                            </>
                        )}
                    </Box>
                </form>
            </Grid>
        </Box>
    );

    const actions = (
        <>
            <CustomButton
                onClick={() => dispatch(closeCreateNewSlots())}
                backgroundColor="white"
                color="#F56D3B"
                borderColor="#F56D3B"
            >
                Back
            </CustomButton>
            <CustomButton
                type="submit"
                form="createForm"
                backgroundColor="#F56D3B"
                color="white"
                borderColor="#F56D3B"
                textTransform="none"
            >
                Submit
            </CustomButton>
        </>
    );

    return (
        <ReusableDialog
            open={createNewSlotOpen}
            handleClose={() => dispatch(closeCreateNewSlots())}
            title="Create New Slot"
            actions={actions}
            content={content}
        />
    );
};

export default CreateNewSlot;
