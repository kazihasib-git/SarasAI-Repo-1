import React, { useState } from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import moment from 'moment';

const CustomFutureDateField = ({
    label,
    name,
    value,
    onChange,
    disableFutureDates,
    sx,
    errors,
    helperText,
    ...props
}) => {
    const [localError, setLocalError] = useState(''); // Local error state for invalid dates

    const handleDateChange = date => {
        const today = moment().startOf('day'); // Get today's date
        const formattedDate = date ? moment(date).format('YYYY-MM-DD') : '';

        // Check if the entered date is in the past
        onChange(formattedDate);
        if (formattedDate && moment(formattedDate).isBefore(today)) {
            setLocalError('The date must be today or a future date.'); // Set error message
            return;
        }

        // Clear the error if the date is valid
        setLocalError('');
        onChange(formattedDate);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
                label={label}
                name={name}
                value={value ? moment(value, 'YYYY-MM-DD') : null}
                onChange={handleDateChange}
                disablePast={true} // Disable past dates
                disableFuture={disableFutureDates}
                slotProps={{
                    textField: {
                        InputLabelProps: {
                            shrink: true,
                        },
                        sx: {
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '50px',
                                height: '60px',
                                '& fieldset': {
                                    borderColor: localError
                                        ? 'red' // Red border on error
                                        : '#D0D0EC',
                                },
                                '&:hover fieldset': {
                                    borderColor: localError
                                        ? 'red' // Red border on hover if error
                                        : '#D0D0EC',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: localError
                                        ? 'red' // Red border when focused if error
                                        : 'rgb(245, 109, 59)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                margin: 0,
                                color: localError ? 'red' : '#1A1E3D', // Red label on error
                                '&.Mui-focused': {
                                    color: localError ? 'red' : '#1A1E3D',
                                },
                            },
                            width: '100%', // Ensure full width
                            ...sx,
                        },
                        error: !!localError || errors, // Show red border if error exists
                        helperText: localError || helperText, // Show local or external error message
                        ...props,
                    },
                }}
            />
        </LocalizationProvider>
    );
};

export default CustomFutureDateField;
