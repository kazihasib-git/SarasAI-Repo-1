import React, { useMemo, useState } from "react";
import ReusableDialog from "../CustomFields/ReusableDialog";
import CustomDateField from "../CustomFields/CustomDateField";
import { Button, DialogContent, Grid } from "@mui/material";
import ReactTable from "../table/ReactTable";
import CustomTimeField from "../CustomFields/CustomTimeField";
import DynamicTable from "../CommonComponent/DynamicTable";
import { useDispatch, useSelector } from "react-redux";
import {
  closeRescheduleSession,
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
  const { resheduleSessionOpen } = useSelector((state) => state.taAvialability);
  const [selectDate, setselectDate] = useState(null);
  const headers = ["S. No.", "Slots Available", "Select All"];

//   const dummyData = [
//     { id: 1, slotsAvailable: "9:00 AM - 10:00 AM", isSelected: false },
//     { id: 2, slotsAvailable: "10:00 AM - 11:00 AM", isSelected: false },
//     { id: 3, slotsAvailable: "11:00 AM - 12:00 PM", isSelected: false },
//     { id: 4, slotsAvailable: "12:00 PM - 1:00 PM", isSelected: false },
//     { id: 5, slotsAvailable: "1:00 PM - 2:00 PM", isSelected: false },
//     { id: 6, slotsAvailable: "2:00 PM - 3:00 PM", isSelected: false },
//     { id: 7, slotsAvailable: "3:00 PM - 4:00 PM", isSelected: false },
//   ];

    const dummyData = []

  const handleSubmit = () => {
    console.log("*** Submiting REschedule Session....");
    dispatch(closeRescheduleSession());
    dispatch(openReasonForLeave());
  };

  const actionButtons = [
    {
      type: "checkbox",
      //   onClick: (id) => {
      //     handleEditTaClick(id);
      //   },
    },
  ];

  const content = (
    <>
      <Grid item xs={12} sm={6}  mb={2} pt={"16px"}>
        <CustomDateField
          label="SelectDate"
          value={selectDate}
          onChange={setselectDate}
          name="dateOfBirth"
          //  register={register}
          //  validation={{ required: "Date of birth is required" }}
          //  errors={errors}
          sx={{ width: "100%" }}
        />
      </Grid>

      {dummyData.length === 0 ? (
        <DialogContent sx={{ display:"flex", justifyContent:"center", alignItems:"center" }}>No Slot Available</DialogContent>
      ) : (
        <>
          <PopUpTable
            headers={headers}
            initialData={dummyData}
            actionButtons={actionButtons}
          />
          <Grid
            container
            sx={{
              pt: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center", // Add this line if needed
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
