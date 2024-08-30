import React, { useState } from 'react';
import {
    FormControl,
    InputLabel,
    Autocomplete,
    TextField,
    Typography,
    OutlinedInput,
} from '@mui/material';

const CustomTimeZoneForm = ({
    label,
    name,
    value,
    placeholder,
    onChange,
    errors,
    options,
    disabled,
}) => {
    const [inputValue, setInputValue] = useState('');

    const hasError = !!errors[name];

    return (
        <FormControl variant="outlined" disabled={disabled} fullWidth>
            <InputLabel
                shrink
                style={{ margin: 0 }}
                sx={{
                    color: hasError ? '#1A1E3D' : '#1A1E3D',
                    '&.Mui-focused': {
                        color: '#1A1E3D', // Change label color on focus regardless of error
                    },
                    '&.MuiFormLabel-filled': {
                        color: hasError ? '#1A1E3D' : '#1A1E3D', // Change label color when the field is filled
                    },
                    backgroundColor: 'white',
                }}
            >
                {label}
            </InputLabel>
            <Autocomplete
                value={options.find(option => option.id === value) || null}
                onChange={(event, newValue) => {
                    onChange({
                        target: {
                            name,
                            value: newValue ? newValue.id : '',
                        },
                    });
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                disabled={disabled}
                options={options}
                getOptionLabel={option => option.time_zone}
                renderInput={params => (
                    <TextField
                        {...params}
                        //label={label}
                        placeholder={placeholder}
                        variant="outlined"
                        error={hasError}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '50px',
                                height: '60px',
                                padding: '18px 2px',
                                '& fieldset': {
                                    borderColor: '#D0D0EC', // Default border color
                                },
                                '&:hover fieldset': {
                                    borderColor: '#D0D0EC', //'rgb(245, 109, 59)', // Border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: hasError
                                        ? '#d32f2f'
                                        : 'rgb(245, 109, 59)', // Border color on focus
                                },
                            },
                        }}
                    />
                )}
                sx={{
                    '& .MuiAutocomplete-popover': {
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#D0D0EC', // Border color of the dropdown
                            },
                            '&:hover fieldset': {
                                borderColor: 'rgb(245, 109, 59)', // Border color on hover
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: hasError
                                    ? '#d32f2f'
                                    : 'rgb(245, 109, 59)', // Border color on focus
                            },
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
