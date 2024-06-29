import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

const CustomFormControl = ({
  label,
  name,
  register,
  validation,
  errors,
  options,
}) => {
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel
        style={{ margin: 0 }}
        sx={{
          color: "#9A9DAD",
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
        {...register(name, validation)}
        error={!!errors[name]}
        sx={{
          borderRadius: "50px",
          height: "60px",
          padding: "18px 30px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D0D0EC",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D0D0EC",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(245, 109, 59)", // Change border color on focus
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
