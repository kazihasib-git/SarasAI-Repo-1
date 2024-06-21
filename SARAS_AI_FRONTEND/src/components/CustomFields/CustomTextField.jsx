import React from 'react';
import { TextField } from '@mui/material';
import './CustomField.css';
const CustomTextField = ({ label, name, placeholder, register, validation, errors, type = "text", multiline = false, rows = 1 }) => {
    const inputPropsStyle = multiline ? { borderRadius: '25px', padding: '25px 30px 18px 30px' } : { height: '60px', borderRadius: '50px', padding: '18px 30px' };

    return (
        <TextField
            label={label}
            name={name}
            type={type}
            placeholder={placeholder}
            fullWidth
            multiline={multiline}
            rows={rows}
            {...register(name, validation)}
            error={!!errors[name]}
            helperText={errors[name]?.message}
            variant="outlined"
            InputProps={{ 
                style: inputPropsStyle,
                classes: {
                    root: 'custom-input-root',
                    focused: 'custom-input-focused',
                    notchedOutline: 'custom-input-notchedOutline'
                }
            }}
            InputLabelProps={{ style: { margin: 0 } }}
            sx={{
                '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                        color: 'rgb(245, 109, 59)', // Change label color on focus
                    },
                },
                '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                        borderColor: 'rgb(245, 109, 59)', // Change border color on focus
                    },
                    '&.Mui-focused.Mui-autocomplete-input': {
                        backgroundColor: 'transparent', // Override background color for autofill state
                    },
                    '&.Mui-focused.Mui-filled': {
                        backgroundColor: 'transparent', // Override background color for autofill state
                    },
                },
                '& .custom-input-root': {
                    backgroundColor: 'white', // Set background color for the input field
                },
                '& .custom-input-focused': {
                    backgroundColor: 'white', // Set background color when focused
                },
                '& .custom-input-notchedOutline': {
                    borderColor: '#D0D0EC', // Set outline color
                },
            }}
        />
    );
};

export default CustomTextField;
