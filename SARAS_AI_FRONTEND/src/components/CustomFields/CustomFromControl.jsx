import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from '@mui/material';

const CustomFormControl = ({
    label,
    name,
    value,
    placeholder,
    onChange,
    errors,
    options,
    disabled,
}) => {
    const hasError = !!errors[name];

    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel
                shrink
                style={{ margin: 0 }}
                sx={{
                    color: hasError ? '#d32f2f' : '#1A1E3D',
                    '&.Mui-focused': {
                        color: '#1A1E3D', // Change label color on focus regardless of error
                    },
                    '&.MuiFormLabel-filled': {
                        color: hasError ? '#d32f2f' : '#1A1E3D', // Change label color when the field is filled
                    },
                    backgroundColor: 'white',
                }}
            >
                {label}
            </InputLabel>
            <Select
                label={label}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                error={hasError}
                disabled={disabled}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 200, // Set max height to make it scrollable
                        },
                    },
                }}
                sx={{
                    borderRadius: '50px',
                    height: '60px',
                    padding: '18px 2px',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D0D0EC',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D0D0EC',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: hasError ? '#d32f2f' : 'rgb(245, 109, 59)', // Change border color on focus based on error
                        color: '#1A1E3D',
                    },
                }}
            >
                {options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
            {hasError && (
                <Typography
                    variant="body2"
                    color="error"
                    sx={{ fontSize: '0.75rem' }}
                >
                    {errors[name].message}
                </Typography>
            )}
        </FormControl>
    );
};

export default CustomFormControl;
