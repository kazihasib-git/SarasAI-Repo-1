import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import moment from 'moment';

const CustomTimeField = ({
    label,
    name,
    value,
    onChange,
    sx,
    fullWidth,
    ...props
}) => {
    const momentValue = value ? moment(value, 'YYYY-MM-DDTHH:mm:ss') : null;

    const handleTimeChange = date => {
        onChange(date.format('HH:mm:ss'));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
                label={label}
                name={name}
                value={momentValue}
                onChange={handleTimeChange}
                inputFormat="HH:mm:ss"
                InputLabelProps={{
                    shrink: true,
                    sx: {
                        // Center the label vertically when in placeholder position
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
                        fullWidth: { fullWidth },
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
                            padding: '16.5px 14px', // Adjust padding to match label's centered position
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

export default CustomTimeField;