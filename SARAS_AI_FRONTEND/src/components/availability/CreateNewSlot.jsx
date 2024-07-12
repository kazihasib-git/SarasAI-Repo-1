import React from "react";
import {
  Grid,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import CustomDateField from "../CustomFields/CustomDateField";
import CustomTimeField from "../CustomFields/CustomTimeField"; // Assuming you have a CustomTimeField component
import ReusableDialog from "../CustomFields/ReusableDialog";
import { format, addDays, parseISO } from "date-fns";
import CustomTextField from "../CustomFields/CustomTextField";

import { transformedTimeZones } from "../CustomFields/FormOptions";
import CustomFormControl from "../CustomFields/CustomFromControl";
import { useSelector } from "react-redux";
import CustomTimeZoneForm from "../CustomFields/CustomTimeZoneForm";
import { WidthFull } from "@mui/icons-material";

const CustomButton = ({
  onClick,
  children,
  color = "#FFFFFF",
  backgroundColor = "#4E18A5",
  borderColor = "#FFFFFF",
  sx,
  ...props
}) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: backgroundColor,
        color: color,
        fontWeight: "700",
        fontSize: "16px",
        borderRadius: "50px",
        padding: "10px 20px",
        border: `2px solid ${borderColor}`,
        "&:hover": {
          backgroundColor: color,
          color: backgroundColor,
          borderColor: color,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

const CreateNewSlot = ({ open, handleClose, addEvent }) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      gender: "",
      time_zone: "",
      highest_qualification: "",
      date_of_birth: null,
    },
  });

  const { timezones } = useSelector((state) => state.timezone);

  const onSubmit = (data) => {
    // Format the date and time inputs
    const formattedData = {
      ...data,
      fromDate: format(
        new Date(`${data.date} ${data.fromTime}`),
        "yyyy-MM-dd HH:mm"
      ),
      toDate: format(
        new Date(`${data.date} ${data.toTime}`),
        "yyyy-MM-dd HH:mm"
      ),
    };

    if (data.repeat === "recurring") {
      // Convert selected days to 0,1 form
      const selectedDaysBinary = weekDays.map((day) =>
        data.selectedDays[day] ? 1 : 0
      );

      // Create slots continuously for selected days until the end date
      const startDate = new Date(formattedData.fromDate);
      const endDate = parseISO(data.endDate);

      let currentDate = startDate;
      while (currentDate <= endDate) {
        if (selectedDaysBinary[currentDate.getDay()] === 1) {
          const newStart = format(
            new Date(`${currentDate.toDateString()} ${data.fromTime}`),
            "yyyy-MM-dd HH:mm"
          );
          const newEnd = format(
            new Date(`${currentDate.toDateString()} ${data.toTime}`),
            "yyyy-MM-dd HH:mm"
          );
          addEvent(data.title, newStart, newEnd);
        }
        currentDate = addDays(currentDate, 1);
      }
    } else {
      // Handle one-time slot creation
      addEvent(data.title, formattedData.fromDate, formattedData.toDate);
    }

    handleClose();
  };

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const content = (
    <form id="createForm" onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        spacing={2}
        style={{ display: "flex", justifyContent: "space-between" }} // Reduced padding
        sx={{ pt: 2 }} // Reduced top padding
      >
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="date"
            control={control}
            defaultValue=""
            rules={{ required: "Date is required" }}
            render={({ field }) => (
              <CustomDateField
                label="From Date"
                name="date"
                value={field.value}
                onChange={field.onChange}
                error={!!errors.date}
                helperText={errors.date ? errors.date.message : ""}
                style={{ width: '100%'  }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="date"
            control={control}
            defaultValue=""
            rules={{ required: "Date is required" }}
            render={({ field }) => (
              <CustomDateField
                label="To Date"
                name="date"
                value={field.value}
                onChange={field.onChange}
                error={!!errors.date}
                helperText={errors.date ? errors.date.message : ""}
                style={{ width: '100%'  }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} style={{ marginTop: '16px', width: '100%' }}>
          <Controller
            name="time_zone"
            control={control}
            rules={{ required: "Time Zone is required" }}
            render={({ field }) => {
              return (
                <CustomTimeZoneForm
                  label="Time Zone"
                  name="time_zone"
                  value={field.value}
                  onChange={field.onChange}
                  errors={errors}
                  options={timezones}
                  sx={{ width: '100%' }}
                />
               
              );
            }}
          />
        </Grid>

        {/* Add the Time Zone form control */}
      </Grid>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <FormControl component="fieldset">
            <Controller
              name="repeat"
              control={control}
              defaultValue="onetime"
              render={({ field }) => (
                <RadioGroup row value={field.value} onChange={field.onChange}>
                  <FormControlLabel
                    value="onetime"
                    control={<Radio />}
                    label="One-Time"
                  />
                  <FormControlLabel
                    value="recurring"
                    control={<Radio />}
                    label="Recurring"
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Grid>
      </Grid>
      {watch("repeat") === "recurring" && (
        <Grid
          container
          spacing={2}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormGroup row sx={{ display: "flex", justifyContent: "center" }}>
                {weekDays.map((day, index) => (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    lg={2}
                    key={day}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Controller
                      name={`selectedDays.${day}`}
                      control={control}
                      defaultValue={false}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              name={day}
                            />
                          }
                          label={day}
                        />
                      )}
                    />
                  </Grid>
                ))}
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
      )}
    </form>
  );

  const actions = (
    <>
      <CustomButton
        onClick={handleClose}
        backgroundColor="white"
        color="#F56D3B"
        borderColor="#F56D3B"
      >
        Back
      </CustomButton>
      <CustomButton
        type="submit"
        form="createForm"
        backgroundColor="#F56D3B"
        color="white"
        borderColor="#F56D3B"
      >
        Submit
      </CustomButton>
    </>
  );

  return (
    <ReusableDialog
      open={open}
      handleClose={handleClose}
      title="Create New Slot"
      actions={actions}
      content={content}
    />
  );
};

export default CreateNewSlot;
