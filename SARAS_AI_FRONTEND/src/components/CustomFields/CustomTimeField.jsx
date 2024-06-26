import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CustomTextField from './CustomTextField'; // Adjust the path according to your file structure

const CustomTimeField = ({ label, name, register, validation, errors, sx, ...props }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <TimePicker
      label={label}
      InputLabelProps={{
        shrink: true, // This ensures the label is not overlapping with the input.
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
            borderColor: 'rgb(245, 109, 59)', // Change border color on focus
          },
          '&.Mui-focused .MuiAutocomplete-input': {
            backgroundColor: 'transparent', // Override background color for autofill state
          },
          '&.Mui-focused .MuiFilledInput-root': {
            backgroundColor: 'transparent', // Override background color for autofill state
          },
        },
        '& .MuiInputLabel-root': {
          margin: 0, // Apply margin 0 to the label
          '&.Mui-focused': {
            color: 'rgb(245, 109, 59)', // Change label color on focus
          },
        },
        ...sx
      }}
      {...props}
    />
  </LocalizationProvider>
);

export default CustomTimeField;
