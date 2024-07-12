import {
  Box,
  Button,
  Checkbox,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTextField from "../CustomFields/CustomTextField";
import PopUpTable from "../CommonComponent/PopUpTable";
import CustomTimeField from "../CustomFields/CustomTimeField";
import CustomDateField from "../CustomFields/CustomDateField";
import ReusableDialog from "../CustomFields/ReusableDialog";
import CustomFormControl from "../CustomFields/CustomFromControl";
import { useForm } from "react-hook-form";
import {
  timeZones,
  transformedTimeZones,
  validateTimeZone,
} from "../CustomFields/FormOptions";
import {
  closeScheduleSession,
  createTASchedule,
  getTaAvailableSlotsFromDate,
} from "../../redux/features/taModule/taScheduling";
import {
  closeCoachScheduleSession,
  createCoachSchedule,
  getCoachAvailableSlotsFromDate,
} from "../../redux/features/CoachModule/coachSchedule";
import {
  openAssignBatches,
  openAssignStudents,
} from "../../redux/features/taModule/taSlice";
import { Controller,
  openCoachAssignBatches,
  openCoachAssignStudents,
} from "../../redux/features/CoachModule/coachSlice";
import { getTimezone } from '../../redux/features/timezone/timezoneSlice';
import CustomTimeZoneForm from '../CustomFields/CustomTimeZoneForm';

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

const headers = ["S. No.", "Slot Date", "From Time", "To Time", "Select"];
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const actionButtons = [
  {
    type: "button",
  },
];

const Schedule = ({ componentName }) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [timezone, setTimezone] = useState("");
  const [repeat, setRepeat] = useState("onetime");
  const [selectedDays, setSelectedDays] = useState([]);
  const [slotData, setSlotData] = useState([{}]);
  const [selectedSlot, setSelectedSlot] = useState([{}]);
    const [availableSlotsOptions, setAvailableSlotsOptions] = useState([{}]);

  const dispatch = useDispatch();
  let scheduleSessionOpenKey, schedulingStateKey, availableKey, idKey, nameKey, timezoneKey, getAvailableSlotsAction, closeScheduleSessionAction, createScheduleAction;

  switch (componentName) {
    case "TASCHEDULE":
      scheduleSessionOpenKey = "scheduleSessionOpen";
      schedulingStateKey = "taScheduling";
      availableKey = "taAvailableSlots";
      idKey = "taID";
      nameKey = "taName";
      timezoneKey = "taTimezone";
      getAvailableSlotsAction = getTaAvailableSlotsFromDate;
      closeScheduleSessionAction = closeScheduleSession;
      createScheduleAction = createTASchedule;
      break;
    case "COACHSCHEDULE":
      scheduleSessionOpenKey = "scheduleCoachSessionOpen";
      schedulingStateKey = "coachScheduling";
      availableKey = "coachAvailableSlots";
      idKey = "coachID";
      nameKey = "coachName";
      timezoneKey = "coachTimezone";
      getAvailableSlotsAction = getCoachAvailableSlotsFromDate;
      closeScheduleSessionAction = closeCoachScheduleSession;
      createScheduleAction = createCoachSchedule;
      break;
    default:
      scheduleSessionOpenKey = null;
      schedulingStateKey = null;
      availableKey = null;
      idKey = null;
      nameKey = null;
      timezoneKey = null;
      getAvailableSlotsAction = null;
      closeScheduleSessionAction = null;
      createScheduleAction = null;
      break;
  }

  const schedulingState = useSelector((state) => (schedulingStateKey ? state[schedulingStateKey] : {}));
  const {
    [scheduleSessionOpenKey]: scheduleSessionOpen,
    [idKey]: adminUserID,
    [nameKey]: adminUserName,
    [timezoneKey]: adminUserTimezone,
    [availableKey]: availableSlots,
    students,
    batches,
  } = schedulingState;

  const {
    register,
    handleSubmit,
    control, formState: { errors },
  } = useForm();

  useEffect(() => {
    if (fromDate) {
      dispatch(getAvailableSlotsAction({ admin_user_id: adminUserID, date: fromDate }));
    }
  }, [fromDate, dispatch, adminUserID, getAvailableSlotsAction]);

    // const { timezones } = useSelector((state) => state.timezone);

    useEffect(() => {
        dispatch(getTimezone())
    }, [dispatch])

  useEffect(() => {
    console.log("AVIALABLE KEY : ", availableKey)
    console.log("Avaialable slots : ", availableSlots)
    if (availableSlots && availableSlots.length > 0) {
      const transformData = availableSlots.map((item, index) => ({
        "S. No.": index+1,
        "Slot Date": item.slot_date,
        "From Time": item.from_time,
        "To Time": item.to_time,
        id:item.id
      }));

            // I want to create options for the available slots to select the from and to time 
            // from time and to will come as a single label

            const options = availableSlots.map((item) => ({
                label: `${item.from_time} - ${item.to_time}`,
                value: item.id,
            }));

            setAvailableSlotsOptions(options);

      setSlotData(transformData);
    }
  }, [availableSlots]);

  const handleDayChange = (day) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  const handleSelectSlots = (id) => {
    setSelectedSlot((prev) => {
      if (prev.includes(id)) {
        return prev.filter((sid) => sid !== id);
      } else {
        return [...prev, id];
      }
    });
  };


    // 
    const handleSelectOption = (e) => {
        const selectedOption = e.target.value;
        console.log("selectedOption : ", selectedOption)
        const selectedSlot = taSlotData.filter((slot) => slot.id === selectedOption);
        console.log("selectedSlot : ", selectedSlot)
        setSelectedSlot(selectedSlot);
    }

  const handleAssignStudents = () => {
    if (componentName === "TASCHEDULE") {
      dispatch(openAssignStudents());
    } else if (componentName === "COACHSCHEDULE") {
      dispatch(openCoachAssignStudents());
    }
  };

    // const handleClear = () => {
    //     setSelectedSlot([{}]);
    // }

  const handleAssignBatches = () => {
    if (componentName === "TASCHEDULE") {
      dispatch(openAssignBatches());
    } else if (componentName === "COACHSCHEDULE") {
      dispatch(openCoachAssignBatches());
    }
  };

  const onSubmit = async (formData) => {
    const studentId = students.map((student) => student.id);
    const batchId = batches.map((batch) => batch.id);

    let weeksArray = Array(7).fill(0);
    if  (repeat === "recurring") {
      selectedDays.forEach((day) => {
        const index = weekDays.indexOf(day);
        weeksArray[index] = 1;
      });
    }  else if  (repeat === "onetime") {
      const index = new Date(fromDate).getDay();
      weeksArray[index] = 1;
    }
    console.log("FORM DATA : ", formData)
    formData.start_time = fromTime;
    formData.end_time = toTime;
    formData.timezone = timezone;
    formData.schedule_date = fromDate;
    formData.end_date = repeat === "recurring" ? toDate : fromDate;
    formData.admin_user_id = adminUserID;
    formData.slot_id = selectedSlot[1]; // Assuming single slot selection
    formData.event_status = "scheduled";
    formData.weeks = weeksArray;
    formData.timezone = adminUserTimezone;
    formData.studentId = studentId;
    formData.batchId = batchId;

    dispatch(createScheduleAction({ ...formData }));
    dispatch(closeScheduleSessionAction());
  };

  const content = (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100%", width: "100%" }}
    >
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} display="flex" justifyContent="center">
          <Box display="flex" justifyContent="center" gap={2} sx={{ mb: 3 }}>
            <Button
              variant="contained"
              onClick={handleAssignStudents}
              sx={{
                backgroundColor: "#F56D3B",
                color: "white",
                height: "60px",
                width: "201px",
                borderRadius: "50px",
                textTransform: "none",
                padding: "18px 30px",
                fontWeight: "700",
                fontSize: "16px",
                "&:hover": {
                  backgroundColor: "#D4522A",
                },
              }}
            >
              Students
            </Button>
            <Button
              variant="outlined"
              onClick={handleAssignBatches}
              sx={{
                backgroundColor: "white",
                color: "#F56D3B",
                height: "60px",
                width: "194px",
                border: "2px solid #F56D3B",
                borderRadius: "50px",
                textTransform: "none",
                fontWeight: "700",
                fontSize: "16px",
                padding: "18px 30px",
                "&:hover": {
                  backgroundColor: "#F56D3B",
                  color: "white",
                },
              }}
            >
              Batches
            </Button>
          </Box>
        </Grid>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box display="flex" justifyContent="center" m={4}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                <CustomDateField
                  label="From Date"
                  value={fromDate}
                  onChange={setFromDate}
                  name="schedule_date"
                  register={register}
                  validation={{ required: "From Date is required" }}
                  sx={{ width: "100%" }}
                />
              </Grid>
              {fromDate && (
                <>
                  {slotData.length === 0 ? (
                    <Grid item xs={12} display="flex" justifyContent="center">
                      <DialogContent>No Slot Available</DialogContent>
                    </Grid>
                  ) : (
                    <>
                      <Grid item xs={12} display="flex" justifyContent="center">
                        <PopUpTable
                          headers={headers}
                          initialData={slotData}
                          onRowClick={handleSelectSlots}
                          selectedBox={selectedSlot}
                        />
                      </Grid>
                      <Grid
                        container
                        spacing={3}
                        sx={{ pt: 3 }}
                        justifyContent="center"
                      >
                        <Grid
                          item
                          xs={12}
                          display="flex"
                          justifyContent="center"
                        >
                          <CustomTextField
                            label="Meeting Name"
                            name="meeting_name"
                            placeholder="Enter Meeting Name"
                            register={register}
                            validation={{
                              required: "Meeting Name is required",
                            }}
                            errors={errors}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          display="flex"
                          justifyContent="center"
                        >
                          <CustomTextField
                            label="Meeting URL"
                            name="meeting_url"
                            placeholder="Enter Meeting URL"
                            register={register}
                            validation={{ required: "Meeting URL is required" }}
                            errors={errors}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          display="flex"
                          justifyContent="center"
                        >
                          <CustomTimeField
                            label="From Time"
                            name="start_time"
                            value={fromTime}
                            onChange={setFromTime}
                            validation={{ required: "From Time is required" }}
                            errors={errors}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          display="flex"
                          justifyContent="center"
                        >
                          <CustomTimeField
                            label="End Time"
                            name="end_time"
                            value={toTime}
                            onChange={setToTime}
                            validation={{ required: "End Time is required" }}
                            errors={errors}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          display="flex"
                          justifyContent="center"
                        >
                          <CustomFormControl
                            label="Select Timezone"
                            name="timezone"
                            value={adminUserTimezone}
                            controlProps={{
                              select: true,
                              fullWidth: true,
                              value: timezone,
                              onChange: (e) => setTimezone(e.target.value),
                            }}
                            register={register}
                            validation={{ validate: validateTimeZone }}
                            errors={errors}
                            options={transformedTimeZones}
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        spacing={3}
                        justifyContent="center"
                        sx={{ pt: 3 }}
                      >
                        <Grid
                          item
                          xs={12}
                          display="flex"
                          justifyContent="center"
                        >
                          <FormControl component="fieldset">
                            <RadioGroup
                              row
                              value={repeat}
                              onChange={(e) => setRepeat(e.target.value)}
                              sx={{ justifyContent: "center" }}
                            >
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
                          </FormControl>
                        </Grid>
                      </Grid>
                      {repeat === "recurring" && (
                        <>
                          <Grid
                            container
                            spacing={3}
                            justifyContent="center"
                            sx={{ pt: 3 }}
                          >
                            <Grid item xs={12}>
                              <FormControl component="fieldset">
                                <FormGroup row>
                                  {weekDays.map((day) => (
                                    <FormControlLabel
                                      key={day}
                                      control={
                                        <Checkbox
                                          checked={selectedDays.includes(day)}
                                          onChange={() => handleDayChange(day)}
                                          name={day}
                                        />
                                      }
                                      label={day}
                                    />
                                  ))}
                                </FormGroup>
                              </FormControl>
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            display="flex"
                            justifyContent="center"
                          >
                            <CustomDateField
                              label="To Date"
                              value={toDate}
                              onChange={setToDate}
                              name="end_date"
                              register={register}
                              validation={{ required: "To Date is required" }}
                              sx={{ width: "100%" }}
                            />
                          </Grid>
                        </>
                      )}
                      <Grid item xs={12} display="flex" justifyContent="center">
                        <Button
                          type="submit"
                          variant="contained"
                          style={{
                            borderRadius: "50px",
                            padding: "18px 30px",
                            marginTop: 30,
                            backgroundColor: "#F56D3B",
                            height: "60px",
                            width: "121px",
                            fontSize: "16px",
                            fontWeight: "700px",
                            text: "#FFFFFF",
                          }}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </>
                  )}
                </>
              )}
            </Grid>
          </Box>
        </form>
      </Grid>
    </Box>
  );

  const actions = (
    <CustomButton
      onClick={handleSubmit}
      backgroundColor="#F56D3B"
      borderColor="#F56D3B"
      color="#FFFFFF"
    >
      Submit
    </CustomButton>
  );

  return (
    <ReusableDialog
      open={scheduleSessionOpen}
      handleClose={() => {dispatch(closeScheduleSessionAction())}}
      title={`Schedule Session for ${adminUserName}`}
      content={content}
    />
  );
};

export default Schedule;
