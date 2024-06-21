import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CustomTextField from './CustomTextField'; // Adjust the path according to your file structure

const CustomDateField = ({ label, name, register, validation, errors, ...props }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      label={label}
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
        '& .MuiInputBase-input': {
          backgroundColor: 'white', // Set background color for the input field
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#D0D0EC', // Set outline color
        },
      }}
      // renderInput={(params) => (
      //   <CustomTextField
      //     {...params}
      //     name={name}
      //     ref={register(validation)}
      //     error={!!errors[name]}
      //     helperText={errors[name]?.message || ''}
      //   />
      // )}

      {...props}
    />
  </LocalizationProvider>
);

export default CustomDateField;
