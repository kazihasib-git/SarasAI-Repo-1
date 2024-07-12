import React from "react";
import ReusableDialog from "../CustomFields/ReusableDialog";
import { Box, Button, DialogContent, Typography } from "@mui/material";
import DynamicTable from "../CommonComponent/DynamicTable";
import { useDispatch, useSelector } from "react-redux";
import PopUpTable from "../CommonComponent/PopUpTable";

import {
  closeScheduledSession,
  openCancelSession,
  openRescheduleSession,
  openScheduledSlots,
  reasonForLeave,
} from "../../redux/features/taModule/taAvialability";

import {
  closeCoachScheduledSession,
  openCoachCancelSession,
  openCoachRescheduleSession,
  openCoachScheduledSlots,
} from "../../redux/features/CoachModule/CoachAvailabilitySlice";
import { useParams } from "react-router-dom";

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

const ScheduledSessions = ({ componentName }) => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Ensure the correct ID is used

  let scheduleSessionOpenKey,
    scheduledSessionDataKey,
    schedulingStateKey,
    closeSessionAction,
    openCancelAction,
    openRescheduleAction,
    openSlotsAction,
    slotEventAction;

  switch (componentName) {
    case "TACALENDER":
      scheduleSessionOpenKey = "scheduledSessionOpen";
      scheduledSessionDataKey = "scheduledSessionData";
      schedulingStateKey = "taAvialability";
      closeSessionAction = closeScheduledSession;
      openCancelAction = openCancelSession;
      openRescheduleAction = openRescheduleSession;
      openSlotsAction = openScheduledSlots;
      slotEventAction = "slotEventData"
      break;
    case "COACHCALENDER":
      scheduleSessionOpenKey = "scheduledCoachSessionOpen";
      scheduledSessionDataKey = "scheduledCoachSessionData";
      schedulingStateKey = "coachAvailability";
      closeSessionAction = closeCoachScheduledSession;
      openCancelAction = openCoachCancelSession;
      openRescheduleAction = openCoachRescheduleSession;
      openSlotsAction = openCoachScheduledSlots;
      slotEventAction = "slotCoachEventData"
      break;
    default:
      scheduleSessionOpenKey = null;
      scheduledSessionDataKey = null;
      schedulingStateKey = null;
      closeSessionAction = null;
      openCancelAction = null;
      openRescheduleAction = null;
      openSlotsAction = null;
      slotEventAction = null;
      break;
  }

  const schedulingState = useSelector((state) =>
    schedulingStateKey ? state[schedulingStateKey] : {}
  );
  const {
    [scheduleSessionOpenKey]: scheduledSessionOpen,
    [scheduledSessionDataKey]: scheduledSessionData = [],
    [slotEventAction]:slotEventData,
  } = schedulingState;

  const headers = [
    "S. No.",
    "Session Name",
    "Date",
    "Time",
    "Students",
    "Actions",
  ];

  const formattedData = scheduledSessionData.map((session, index) => ({
    "S. No.": session.id,
    "Session Name": session.meeting_name,
    Date: session.date.split(" ")[0],
    Time: `${session.start_time} - ${session.end_time}`,
    Students: session.Students.length,
    StudentList: session.Students,
  }));

  const handleViewClick = (students) => {
    // Open a popup to view the students
    console.log("View clicked!", students);
  };

  const handleRescheduleClick = (session) => {
    dispatch(closeSessionAction());
    dispatch(openRescheduleAction(session));
    console.log("Reschedule clicked!", session);
  };

  const handleCancelClick = (session) => {
    dispatch(closeSessionAction());
    dispatch(openCancelAction(session));
    console.log("Cancel clicked!", session);
  };

  const handleSubmit = () => {
    console.log("*** ScheduledSessions");
    // dispatch(reasonForLeave(slotEventData);
  };

  const content =
    formattedData.length === 0 ? (
      <DialogContent style={{ justifyContent: "center", display: "flex" }}>
        <Typography>No scheduled sessions.</Typography>
      </DialogContent>
    ) : (
      <PopUpTable
        headers={headers}
        initialData={formattedData}
        onViewClick={handleViewClick}
        onRescheduleClick={handleRescheduleClick}
        onCancelClick={handleCancelClick}
      />
    );

  const actions = (
    <Box>
      <CustomButton
        onClick={handleSubmit}
        backgroundColor="#F56D3B"
        borderColor="#F56D3B"
        color="#FFFFFF"
      >
        Submit
      </CustomButton>
    </Box>
  );

  return (
    <ReusableDialog
      open={scheduledSessionOpen}
      handleClose={() => {
        dispatch(openSlotsAction());
        dispatch(closeSessionAction());
      }}
      title="Scheduled Sessions"
      content={content}
      actions={scheduledSessionData.length === 0 ? actions : undefined}
    />
  );
};

export default ScheduledSessions;
