import React from 'react';
import { Grid, Button, FormControl, RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import CustomDateField from '../CustomFields/CustomDateField';
import CustomTimeField from '../CustomFields/CustomTimeField'; // Assuming you have a CustomTimeField component
import ReusableDialog from '../CustomFields/ReusableDialog';
import { format, addDays, parseISO } from 'date-fns';
import CustomTextField from '../CustomFields/CustomTextField';

const CustomButton = ({ onClick, children, color = '#FFFFFF', backgroundColor = '#4E18A5', borderColor = '#FFFFFF', sx, ...props }) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                backgroundColor: backgroundColor,
                color: color,
                fontWeight: '700',
                fontSize: '16px',
                borderRadius: '50px',
                padding: "10px 20px",
                border: `2px solid ${borderColor}`,
                '&:hover': {
                    backgroundColor: color,
                    color: backgroundColor,
                    borderColor: color,
                },
                ...sx
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

const CreateNewSlot = ({ open, handleClose, addEvent }) => {
    const { control, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        // Format the date and time inputs
        const formattedData = {
            ...data,
            fromDate: format(new Date(`${data.date} ${data.fromTime}`), "yyyy-MM-dd HH:mm"),
            toDate: format(new Date(`${data.date} ${data.toTime}`), "yyyy-MM-dd HH:mm"),
        };

        if (data.repeat === 'recurring') {
            // Create slots continuously for selected days until the end date
            const selectedDays = Object.keys(data.selectedDays).filter(day => data.selectedDays[day]);

            const startDate = new Date(formattedData.fromDate);
            const endDate = parseISO(data.endDate);

            let currentDate = startDate;
            while (currentDate <= endDate) {
                if (selectedDays.includes(currentDate.toLocaleDateString('en-US', { weekday: 'long' }))) {
                    const newStart = format(new Date(`${currentDate.toDateString()} ${data.fromTime}`), "yyyy-MM-dd HH:mm");
                    const newEnd = format(new Date(`${currentDate.toDateString()} ${data.toTime}`), "yyyy-MM-dd HH:mm");
                    addEvent(data.title, newStart, newEnd);
                }
                currentDate = addDays(currentDate, 1);
            }
        } else {
            // Handle one-time slot creation
            addEvent(data.title, formattedData.fromDate, formattedData.toDate);
        }

        handleClose();
    };

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const content = (
        <form id="createForm" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} justifyContent="center" sx={{ pt: 3 }}>
                <Grid item xs={12}>
                    <Controller
                        name="title"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Title is required' }}
                        render={({ field }) => (
                            <CustomTextField
                                label="Title"
                                name="title"
                                value={field.value}
                                onChange={field.onChange}
                                error={!!errors.title}
                                helperText={errors.title ? errors.title.message : ''}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Controller
                        name="date"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'Date is required' }}
                        render={({ field }) => (
                            <CustomDateField
                                label="Date"
                                name="date"
                                value={field.value}
                                onChange={field.onChange}
                                error={!!errors.date}
                                helperText={errors.date ? errors.date.message : ''}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="fromTime"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'From Time is required' }}
                        render={({ field }) => (
                            <CustomTimeField
                                label="From Time"
                                name="fromTime"
                                value={field.value}
                                onChange={field.onChange}
                                error={!!errors.fromTime}
                                helperText={errors.fromTime ? errors.fromTime.message : ''}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="toTime"
                        control={control}
                        defaultValue=""
                        rules={{ required: 'To Time is required' }}
                        render={({ field }) => (
                            <CustomTimeField
                                label="To Time"
                                name="toTime"
                                value={field.value}
                                onChange={field.onChange}
                                error={!!errors.toTime}
                                helperText={errors.toTime ? errors.toTime.message : ''}
                            />
                        )}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <FormControl component="fieldset">
                        <Controller
                            name="repeat"
                            control={control}
                            defaultValue="onetime"
                            render={({ field }) => (
                                <RadioGroup row value={field.value} onChange={field.onChange}>
                                    <FormControlLabel value="onetime" control={<Radio />} label="One-Time" />
                                    <FormControlLabel value="recurring" control={<Radio />} label="Recurring" />
                                </RadioGroup>
                            )}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            {watch('repeat') === 'recurring' && (
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <FormGroup row>
                                {weekDays.map((day) => (
                                    <Controller
                                        key={day}
                                        name={`selectedDays.${day}`}
                                        control={control}
                                        defaultValue={false}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={field.value}
                                                        onChange={(e) => field.onChange(e.target.checked)}
                                                        name={day}
                                                    />
                                                }
                                                label={day}
                                            />
                                        )}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="endDate"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'End Date is required' }}
                            render={({ field }) => (
                                <CustomDateField
                                    label="End Date"
                                    name="endDate"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={!!errors.endDate}
                                    helperText={errors.endDate ? errors.endDate.message : ''}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            )}
        </form>
    );

    const actions = (
        <>
            <CustomButton onClick={handleClose} backgroundColor="white" color="#F56D3B" borderColor="#F56D3B">
                Back
            </CustomButton>
            <CustomButton type="submit" form="createForm" backgroundColor="#F56D3B" color="white" borderColor="#F56D3B">
                Submit
            </CustomButton>
        </>
    );

    return (
        <ReusableDialog
            open={open}
            handleClose={handleClose}
            title="Create New Slot"
            actions={actions}
            content={content}
        />
    );
};

export default CreateNewSlot;
