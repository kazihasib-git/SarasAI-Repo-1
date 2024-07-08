import React, { useEffect, useMemo, useState } from "react";
import ReusableDialog from "../CustomFields/ReusableDialog";
import CustomDateField from "../CustomFields/CustomDateField";
import { Button, DialogContent, Grid } from "@mui/material";
import ReactTable from "../table/ReactTable";
import CustomTimeField from "../CustomFields/CustomTimeField";
import DynamicTable from "../CommonComponent/DynamicTable";
import { useDispatch, useSelector } from "react-redux";
import {
  closeRescheduleSession,
  fetchAvailableSlots,
  openReasonForLeave,
} from "../../redux/features/taModule/taAvialability";
import CustomTextField from "../CustomFields/CustomTextField";
import PopUpTable from "../CommonComponent/PopUpTable";

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

const ReschedulingSession = () => {
  const dispatch = useDispatch();
  const { resheduleSessionOpen, availableSlotsData } = useSelector(
    (state) => state.taAvailability
  );
  const [selectDate, setselectDate] = useState(null);
  const [transformedSlotsData, setTransformedSlotsData] = useState([]);
  const headers = ["S. No.", "Slots Available", "Select All"];

  useEffect(() => {
    if (selectDate) {
      console.log("Fetching slots for date:", selectDate);
      const data = {
        admin_user_id: 73,
        date: selectDate,
      };
      dispatch(fetchAvailableSlots(data));
    }
  }, [selectDate, dispatch]);

  useEffect(() => {
    if (availableSlotsData.length > 0) {
      const transformData = availableSlotsData.map((slot, index) => ({
        id: slot.id,
        "Slots Available": `${slot.from_time} - ${slot.to_time}`,
        // isSelected: false,
      }));

      setTransformedSlotsData(transformData);
    }
  }, [availableSlotsData]);

  const handleDateChange = (date) => {
    console.log("Date selected:", date);
    setselectDate(date);
  };

  const handleSubmit = () => {
    console.log("*** Submitting Reschedule Session....");
    dispatch(closeRescheduleSession());
    dispatch(openReasonForLeave());
  };

  const actionButtons = [
    {
      type: "checkbox",
    },
  ];

  const content = (
    <>
      <Grid item xs={12} sm={6} mb={2} pt={"16px"}>
        <CustomDateField
          label="SelectDate"
          value={selectDate}
          onChange={handleDateChange}
          name="dateOfBirth"
          sx={{ width: "100%" }}
        />
      </Grid>

      {availableSlotsData.length === 0 ? (
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          No Slot Available
        </DialogContent>
      ) : (
        <>
          <PopUpTable
            headers={headers}
            initialData={transformedSlotsData}
            actionButtons={actionButtons}
          />
          <Grid
            container
            sx={{
              pt: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Grid item xs={12} sm={6}>
              <CustomTimeField label="From Time" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomDateField label="End Time" />
            </Grid>
          </Grid>
        </>
      )}
    </>
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
      open={resheduleSessionOpen}
      handleClose={() => dispatch(closeRescheduleSession())}
      title="Reschedule Session"
      content={content}
      actions={actions}
    />
  );
};

export default ReschedulingSession;
