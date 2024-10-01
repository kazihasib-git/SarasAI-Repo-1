import React from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';

const CustomDateField = ({
    label,
    name,
    value,
    onChange,
    disableFutureDates,
    sx,
    disabled,
    ...props
}) => {
    const handleDateChange = date => {
        const today = moment().endOf('day'); // Get today's date
        const formattedDate = date ? moment(date).format('YYYY-MM-DD') : '';

        // Check if the future dates are disabled and entered date is in the future
        if (disableFutureDates && date && moment(date).isAfter(today)) {
            onChange(''); // Clear the field if future date is entered
            return;
        }

        onChange(formattedDate);
    };
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
                label={label}
                name={name}
                value={value ? moment(value, 'YYYY-MM-DD') : null}
                onChange={handleDateChange}
                disableFuture={disableFutureDates}
                disabled={disabled}
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
                                    borderColor: '#D0D0EC',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#D0D0EC',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'rgb(245, 109, 59)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                margin: 0,
                                color: '#1A1E3D',
                                '&.Mui-focused': {
                                    color: '#1A1E3D',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                margin: 0,
                                color: disabled ? '#A0A0A0' : '#1A1E3D', // Label color when disabled
                                '&.Mui-focused': {
                                    color: disabled ? '#A0A0A0' : '#1A1E3D', // Label color on focus when disabled
                                },
                            },
                            '& .Mui-disabled .MuiInputLabel-root': {
                                color: '#A0A0A0', // Ensure label color is gray when disabled
                            },
                            width: '100%', // Ensure full width
                            ...sx,
                        },
                        ...props,
                    },
                }}
            />
        </LocalizationProvider>
    );
};

export default CustomDateField;
