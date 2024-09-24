import React from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';

const CustomFutureDateField = ({
    label,
    name,
    value,
    onChange,
    disableFutureDates,
    sx,
    ...props
}) => {
    const today = moment().startOf('day'); // Get today's date


    const handleDateChange = date => {
        const formattedDate = date ? moment(date).format('YYYY-MM-DD') : '';
        // Check if the past dates are disabled and entered date is in the past
        if (date && moment(date).isBefore(today)) {
            onChange('');
            return;
        }
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

export default CustomFutureDateField;
