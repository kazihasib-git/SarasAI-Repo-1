import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const CustomFormControl = ({
  label,
  name,
  value,
  onChange,
  errors,
  options,
  disabled 
}) => {
  // console.log("label", label , name , value, options ) 
  return (
    <FormControl variant="outlined"  disabled={disabled} fullWidth>
      <InputLabel
        style={{ margin: 0 }}
        sx={{
          color: "#1A1E3D",
          "&.Mui-focused": {
            color: "#1A1E3D", // Change label color on focus
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        error={!!errors[name]}
        disabled={disabled}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200, // Set max height to make it scrollable
            },
          },
        }}
        sx={{
          borderRadius: "50px",
          height: "60px",
          padding: "18px 2px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D0D0EC",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D0D0EC",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(245, 109, 59)", // Change border color on focus
            color:"#1A1E3D"
          },
        }}
      > 
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {errors[name] && (
        <Typography variant="body2" color="error">
          {errors[name].message}
        </Typography>
      )}
    </FormControl>
  );
};

export default CustomFormControl;
