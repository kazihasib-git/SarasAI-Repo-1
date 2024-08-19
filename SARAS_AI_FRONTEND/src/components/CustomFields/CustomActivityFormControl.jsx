import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Checkbox,
    ListItemText,
} from '@mui/material';

const CustomActivityFormControl = ({
    label,
    name,
    value = [], // Ensure value is initialized as an array
    onChange,
    errors,
    options,
    disabled,
}) => {
    const hasError = !!errors[name];

    const handleChange = (event) => {
        const {
            target: { value: selectedValue },
        } = event;
        // On selecting multiple values, MUI returns an array of the selected items
        onChange({
            target: {
                name,
                value: typeof selectedValue === 'string' ? selectedValue.split(',') : selectedValue,
            },
        });
    };

    return (
        <FormControl variant="outlined" disabled={disabled} fullWidth>
            <InputLabel
                style={{ margin: 0 }}
                sx={{
                    color: hasError ? 'red' : '#1A1E3D',
                    '&.Mui-focused': {
                        color: '#1A1E3D',
                    },
                    '&.MuiFormLabel-filled': {
                        color: hasError ? 'red' : '#1A1E3D',
                    },
                }}
            >
                {label}
            </InputLabel>
            <Select
                label={label}
                name={name}
                value={value} // Ensure value is an array
                onChange={handleChange} // Use the updated handleChange function
                error={hasError}
                multiple // Enable multiple selection
                renderValue={(selected) => selected.join(', ')} // Display selected values as a comma-separated string
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
                        borderColor: hasError ? 'red' : 'rgb(245, 109, 59)',
                        color: '#1A1E3D',
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        <Checkbox checked={value.indexOf(option.value) > -1} />
                        <ListItemText primary={option.label} />
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

export default CustomActivityFormControl;
