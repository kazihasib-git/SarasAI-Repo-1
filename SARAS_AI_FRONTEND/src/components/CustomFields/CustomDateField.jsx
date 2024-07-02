import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import CustomTextField from "./CustomTextField"; // Adjust the path according to your file structure
import dayjs from "dayjs";
const CustomDateField = ({
  label,
  name,
  register,
  validation,
  errors,
  value, // Ensure `value` is passed and used properly
  onChange,
  sx,
  ...props
}) => {
  const dayjsValue = typeof value === "string" ? dayjs(value) : value;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {console.log}
      <DatePicker
        label={label}
        name={name} // Ensure `name` is passed if needed
        value={dayjsValue} // Pass the date value received from props
        onChange={onChange} // Handle onChange event to update the date value
        InputLabelProps={{
          shrink: true, // Ensure the label behaves correctly
        }}
        {...props}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
            "& fieldset": {
              borderColor: "#D0D0EC",
            },
            "&:hover fieldset": {
              borderColor: "#D0D0EC",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgb(245, 109, 59)",
            },
          },
          "& .MuiInputLabel-root": {
            margin: 0,
            color: '#1A1E3D',
            '&.Mui-focused': {
                color: '#1A1E3D', // Change label color on focus
            },
          },
          ...sx,
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDateField;
