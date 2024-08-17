import React from 'react';
import {
    FormControl,
    InputLabel,
    TextField,
    Typography,
} from '@mui/material';

const CustomTimeZoneForm = ({
    label,
    name,
    value,
    placeholder,
    onChange,
    errors,
    disabled,
}) => {
    const hasError = !!errors[name];

    return (
        <FormControl variant="outlined" disabled={disabled} fullWidth>
            <InputLabel
                shrink
                style={{ margin: 0 }}
                sx={{
                    color: hasError ? '#d32f2f' : '#1A1E3D',
                    '&.Mui-focused': {
                        color: '#1A1E3D',
                    },
                    '&.MuiFormLabel-filled': {
                        color: hasError ? '#d32f2f' : '#1A1E3D',
                    },
                    backgroundColor: 'white',
                }}
            >
                {label}
            </InputLabel>
            <TextField
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                variant="outlined"
                error={hasError}
                disabled={disabled}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '50px',
                        height: '60px',
                        padding: '18px 2px',
                        '& fieldset': {
                            borderColor: '#D0D0EC',
                        },
                        '&:hover fieldset': {
                            borderColor: '#D0D0EC',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: hasError ? '#d32f2f' : 'rgb(245, 109, 59)',
                        },
                    },
                }}
            />
            {hasError && (
                <Typography
                    variant="body2"
                    color="error"
                    sx={{ fontSize: '0.75rem' }}
                >
                    {errors[name]?.message}
                </Typography>
            )}
        </FormControl>
    );
};

export default CustomTimeZoneForm;