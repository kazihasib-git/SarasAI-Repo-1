import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    createCoachMenuSlot,
    getCoachMenuSlots,
} from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import {
    createTaMenuSlots,
    getTaMenuSlots,
} from '../../../../redux/features/taModule/tamenuSlice';
import { closeCreateNewSlot } from '../../../../redux/features/commonCalender/commonCalender';
import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    Radio,
    RadioGroup,
} from '@mui/material';
import CustomDateField from '../../../CustomFields/CustomDateField';
import CustomTimeField from '../../../CustomFields/CustomTimeField';
import CustomTimeZoneForm from '../../../CustomFields/CustomTimeZoneForm';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import CustomButton from '../../../CustomFields/CustomButton';
import { toast } from 'react-toastify';
import CustomFutureDateField from '../../../CustomFields/CustomFutureDateField';
import { GLOBAL_CONSTANTS } from '../../../../constants/globalConstants';
import { useGetTimezonesQuery } from '../../../../redux/services/timezones/timezonesApi';

const slotConfig = {
    TAMENU: {
        createSlotApi: createTaMenuSlots,
        getSlotsApi: getTaMenuSlots,
    },
    COACHMENU: {
        createSlotApi: createCoachMenuSlot,
        getSlotsApi: getCoachMenuSlots,
    },
};

const CreateSlot = ({ componentName, timezone }) => {
    const { createSlotApi, getSlotsApi } = slotConfig[componentName];

    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const initialFormData = {
        fromDate: null,
        toDate: null,
        selectedDays: [],
        repeat: 'onetime',
        fromTime: null,
        toTime: null,
        timezone_id: timezone?.id,
    };
    const [formData, setFormData] = useState(initialFormData);

    const { data : timezones, error, isLoading } = useGetTimezonesQuery();
    const { createNewSlotPopup } = useSelector(state => state.commonCalender);

    const handleChange = (field, value) => {
        if (field === 'timezone_id') {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDayChange = day => {
        setFormData(prev => {
            const newSelectedDays = prev.selectedDays.includes(day)
                ? prev.selectedDays.filter(d => d !== day)
                : [...prev.selectedDays, day];
            return { ...prev, selectedDays: newSelectedDays };
        });
    };

    const validate = formData => {
        let validationErrors = {};

        if (!formData.fromDate) {
            validationErrors.fromDate = '';
            toast.error('Please select From Date');
            return;
        }
        if (!formData.fromTime) {
            validationErrors.fromTime = 'Please select From Time';
            toast.error('Please select From Time');
            return;
        }
        if (!formData.toTime) {
            validationErrors.toTime = 'Please select To Time';
            toast.error('Please select To Time');
            return;
        }
        if (formData.repeat === 'recurring' && !formData.toDate) {
            validationErrors.toDate = 'Please select To Date';
            toast.error('Please select To Date');
            return;
        }
        if (
            formData.repeat === 'recurring' &&
            formData.selectedDays.length === 0
        ) {
            validationErrors.selectedDays = 'Please select at least one day';
            toast.error('Please select at least one day');
            return;
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (!validate(formData)) return;

        let weeksArray = Array(7).fill(0);
        if (formData.repeat === 'recurring') {
            formData.selectedDays.forEach(day => {
                const index = GLOBAL_CONSTANTS.WEEKDAYS.indexOf(day);
                weeksArray[index] = 1;
            });
        } else if (formData.repeat === 'onetime') {
            const index = new Date(formData.fromDate).getDay();
            weeksArray[index] = 1;
        }

        const data = {
            slot_date: formData.fromDate,
            from_time: formData.fromTime,
            to_time: formData.toTime,
            timezone_id: formData.timezone_id,
            end_date:
                formData.repeat === 'recurring'
                    ? formData.toDate
                    : formData.fromDate,
            weeks: weeksArray,
        };

        dispatch(createSlotApi(data))
            .unwrap()
            .then(() => {
                dispatch(getSlotsApi());
                dispatch(closeCreateNewSlot());
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
            <Grid container spacing={2} justifyContent="center">
                <form id="createForm" noValidate>
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
                                value={formData.fromDate}
                                onChange={date =>
                                    handleChange('fromDate', date)
                                }
                                errors={!!errors.fromDate}
                                helperText={errors.fromDate}
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
                                    value={formData.fromTime}
                                    onChange={time =>
                                        handleChange('fromTime', time)
                                    }
                                    errors={!!errors.fromTime}
                                    helperText={errors.fromTime}
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
                                    value={formData.toTime}
                                    onChange={time =>
                                        handleChange('toTime', time)
                                    }
                                    errors={!!errors.toTime}
                                    helperText={errors.toTime}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            spacing={3}
                            sx={{ pt: 3 }}
                            justifyContent="center"
                        >
                            <CustomTimeZoneForm
                                label="Time Zone"
                                name="timezone_id"
                                value={formData.timezone_id}
                                onChange={e =>
                                    handleChange('timezone_id', e.target.value)
                                }
                                options={timezones}
                                errors={errors}
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
                                        value={formData.repeat}
                                        onChange={e =>
                                            handleChange(
                                                'repeat',
                                                e.target.value
                                            )
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
                        {formData.repeat === 'recurring' && (
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
                                                {GLOBAL_CONSTANTS.WEEKDAYS.map(
                                                    day => (
                                                        <FormControlLabel
                                                            key={day}
                                                            control={
                                                                <Checkbox
                                                                    checked={formData.selectedDays.includes(
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
                                                    )
                                                )}
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
                                        value={formData.toDate}
                                        onChange={date =>
                                            handleChange('toDate', date)
                                        }
                                        errors={!!errors.toDate}
                                        helperText={errors.toDate}
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
                onClick={() => {
                    dispatch(closeCreateNewSlot());
                    setFormData(initialFormData);
                }}
                style={{
                    backgroundColor: 'white',
                    color: '#F56D3B',
                    borderColor: '#F56D3B',
                    textTransform: 'none',
                    fontFamily: 'Bold',
                }}
            >
                Back
            </CustomButton>
            <CustomButton
                type="submit"
                onClick={handleSubmit}
                style={{
                    backgroundColor: '#F56D3B',
                    color: 'white',
                    borderColor: '#F56D3B',
                    textTransform: 'none',
                    fontFamily: 'Bold',
                }}
            >
                Submit
            </CustomButton>
        </>
    );

    return (
        <ReusableDialog
            open={createNewSlotPopup}
            handleClose={() => {
                dispatch(closeCreateNewSlot());
                setFormData(initialFormData);
            }}
            title="Create New Slot"
            actions={actions}
            content={content}
        />
    );
};

export default CreateSlot;
