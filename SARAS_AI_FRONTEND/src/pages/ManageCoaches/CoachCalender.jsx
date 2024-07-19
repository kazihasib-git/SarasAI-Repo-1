import { Box, DialogActions, Grid, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CalendarComponent from "../../components/Calender/BigCalendar";
import MarkLeave from "../../components/availability/MarkLeave";
import DeleteAllSlots from "../../components/availability/DeleteAllSlots";
import CreateNewSlot from "../../components/availability/CreateNewSlot";
import ScheduleSession from "../../components/availability/ScheduleSession";
import Slots from "../../components/availability/Slots";
import CancelSchedule from "../../components/availability/CancelSchedule";
import ReasonForLeave from "../../components/availability/ReasonForLeave";
import ReschedulingSession from "../../components/availability/ReschedulingSession";
import ScheduledSessions from "../../components/availability/ScheduledSessions";

import {
  openCoachMarkLeave,
  fetchCoachSlots,
  fetchCoachScheduleById,
  openCoachCreateNewSlots,
} from "../../redux/features/CoachModule/CoachAvailabilitySlice";
import EditBatches from "../../components/availability/EditBatches";
import EditStudents from "../../components/availability/EditStudents";
import {
  openCoachEditBatch,
  openCoachEditStudent,
} from "../../redux/features/CoachModule/coachSchedule";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

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
        // padding: "18px 25px",
        border: `1.5px solid ${borderColor}`,
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

const CoachCalender = () => {
  const dispatch = useDispatch();
  const { id, name } = useParams();
  const [sheduleNewSession, setSheduleNewSession] = useState(false);
  const [deleteFutureSlots, setDeleteFutureSlots] = useState(false);
  //const [createNewSlot, setCreateNewSlot] = useState(false)

  const {
    coachMarkLeaveOpen,
    scheduledCoachSlotsOpen,
    scheduledCoachSessionOpen,
    cancelCoachSessionOpen,
    reasonForCoachLeaveOpen,
    resheduleCoachSessionOpen,
    createNewCoachSlotOpen,
    slotCoachData,
    scheduleCoachData,
  } = useSelector((state) => state.coachAvailability);
  //calendar
  const [eventsList, setEventsList] = useState([]);

  const addEvent = (title, startDateTime, endDateTime) => {
    const newStart = new Date(startDateTime);
    const newEnd = new Date(endDateTime);
    setEventsList((prev) => [...prev, { title, start: newStart, end: newEnd }]);
  };

  console.log("ta Id :", id);

  useEffect(() => {
    dispatch(fetchCoachSlots(id));
    dispatch(fetchCoachScheduleById(id));
  }, [id]);

  console.log(
    "slotCoachData",
    slotCoachData,
    "scheduleCoachData",
    scheduleCoachData
  );

  // useEffect(() => {
  //     ); // Replace `2` with the actual ID you need
  // }, [dispatch]);

  const handleScheduleNewSession = () => {
    console.log("Pressed");
    setSheduleNewSession();
  };

  const handleMarkLeave = () => {
    dispatch(openCoachMarkLeave());
  };

  const handleDeleteFutureSlots = () => {
    setDeleteFutureSlots(true);
  };

  const handleCreateNewSlot = () => {
    dispatch(openCoachCreateNewSlots());
  };

  return (
    <>
      <Header />
      <Sidebar />
      <Box sx={{ backgroundColor: "#f8f9fa" }}>
        <DialogActions sx={{ p: 2 }}>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography variant="h4" sx={{ mb: 4 }}>
                {name} Calender
              </Typography>
            </Grid>
            <Grid item>
              <Box display="flex" justifyContent="center" gap={2}>
                <CustomButton
                  onClick={handleScheduleNewSession}
                  color="#FFFFFF"
                  backgroundColor="#4E18A5"
                  borderColor="#4E18A5"
                >
                  <AddCircleOutlineIcon />
                  Schedule New Session
                </CustomButton>

                <CustomButton
                  onClick={handleMarkLeave}
                  color="#F56D3B"
                  backgroundColor="#FFFFFF"
                  borderColor="#F56D3B"
                >
                  Mark Leave
                </CustomButton>

                <CustomButton
                  onClick={handleDeleteFutureSlots}
                  color="#F56D3B"
                  backgroundColor="#FFFFFF"
                  borderColor="#F56D3B"
                >
                  Delete All Future Slots
                </CustomButton>

                <CustomButton
                  color="#FFFFFF"
                  backgroundColor="#F56D3B"
                  borderColor="#F56D3B"
                  onClick={handleCreateNewSlot}
                >
                  {/* <AddCircleOutlineIcon /> */}
                  Create New Slot
                </CustomButton>
              </Box>
            </Grid>
          </Grid>
        </DialogActions>

        <CalendarComponent
          eventsList={scheduleCoachData.data}
          addEvent={addEvent}
          slotData={slotCoachData}
          /*handleSelectEvent={handleSelectEvent}*/ componentName={
            "COACHCALENDER"
          }
        />
        {openCoachEditBatch && <EditBatches componentname={"COACHSCHEDULE"} />}
        {openCoachEditStudent && (
          <EditStudents componentname={"COACHSCHEDULE"} />
        )}

        {/* {sheduleNewSession && (
        <ScheduleSession
          open={sheduleNewSession}
          handleClose={() => setSheduleNewSession(false)}
        />
      )} */}
        {coachMarkLeaveOpen && (
          <MarkLeave id={id} name={name} componentName={"COACHCALENDER"} />
        )}

        {scheduledCoachSlotsOpen && (
          <Slots id={id} name={name} componentName={"COACHCALENDER"} />
        )}

        {scheduledCoachSessionOpen && (
          <ScheduledSessions
            id={id}
            name={name}
            componentName={"COACHCALENDER"}
          />
        )}

        {cancelCoachSessionOpen && (
          <CancelSchedule id={id} name={name} componentName={"COACHCALENDER"} />
        )}

        {reasonForCoachLeaveOpen && (
          <ReasonForLeave id={id} name={name} componentName={"COACHCALENDER"} />
        )}

        {resheduleCoachSessionOpen && (
          <ReschedulingSession
            id={id}
            name={name}
            componentName={"COACHCALENDER"}
          />
        )}

        {deleteFutureSlots && (
          <DeleteAllSlots
            open={deleteFutureSlots}
            handleClose={() => setDeleteFutureSlots(false)}
            id={id}
            name={name}
            componentName={"COACHCALENDER"}
          />
        )}

        {createNewCoachSlotOpen && (
          <CreateNewSlot addEvent={addEvent} componentName={"COACHCALENDER"} />
        )}
      </Box>
    </>
  );
};

export default CoachCalender;
