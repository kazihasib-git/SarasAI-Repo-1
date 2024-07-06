import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import moment from "moment";

const CustomDateField = ({
  label,
  name,
  value,
  onChange,
  sx,
  ...props
}) => {
  const momentValue = value ? moment(value, "YYYY-MM-DD") : null;

  const handleDateChange = (date) => {
    onChange(date.format("YYYY-MM-DD"));
  };

  return (
    <LocalizationProvider  dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        name={name}
        value={momentValue}
        onChange={handleDateChange}
        inputFormat="YYYY-MM-DD"
        InputLabelProps={{
          shrink: true,
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
                color: '#1A1E3D',
            },
          },
          ...sx,
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDateField;
