import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const CustomTimeDaysjsField = ({
    label,
    name,
    value,
    onChange,
    sx,
    fullWidth,
    ...props
}) => {
    // Convert the value to a Dayjs object if it exists, else use null
    const dayjsValue = value ? dayjs(value, 'HH:mm:ss') : null;

    const handleTimeChange = date => {
        if (date) {
            onChange(date.format('HH:mm:ss A')); // Pass the formatted time back to the parent
        } else {
            onChange(''); // Handle clearing the time
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
                label={label}
                name={name}
                value={dayjsValue}
                onChange={handleTimeChange}
                format="HH:mm A"
                InputLabelProps={{
                    shrink: true,
                    sx: {
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease-in-out',
                        '&.MuiInputLabel-shrink': {
                            top: 0,
                            transform: 'translateY(-100%) scale(0.75)',
                            fontSize: '0.75rem',
                        },
                    },
                }}
                {...props}
                slotProps={{
                    textField: {
                        fullWidth: fullWidth,  // Ensure fullWidth is passed correctly
                    },
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '50px',
                        '& fieldset': {
                            borderColor: '#D0D0EC',
                        },
                        '&:hover fieldset': {
                            borderColor: '#D0D0EC',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'rgb(245, 109, 59)',
                        },
                        '& .MuiInputBase-input': {
                            padding: '16.5px 14px',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        margin: 0,
                        color: '#1A1E3D',
                        '&.Mui-focused': {
                            color: '#1A1E3D',
                        },
                    },
                    ...sx,
                }}
            />
        </LocalizationProvider>
    );
};

export default CustomTimeDaysjsField;
