import React, { useState } from "react";
import ReusableDialog from "../../../../components/CustomFields/ReusableDialog";
import { Button, Grid, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import CustomTextField from "../../../../components/CustomFields/CustomTextField";
import { closeTemplateActivityPopup, createCoachTemplateActivity } from "../../../../redux/features/CoachModule/CoachTemplateSlice";
import { useDispatch, useSelector } from "react-redux";
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
const AddActivity = () => {
 const dispatch = useDispatch();
 const [activityName, setActivityName] = useState("");
 const [activityType, setActivityType] = useState("");
 const [dueDate, setDueDate] = useState("");
 const [points, setPoints] = useState("");
 const [afterDueDate, setAfterDueDate] = useState("");
 const { openActivityPopUp, selectedModule } = useSelector((state) => state.coachTemplate);
 const handleAfterDueDateChange = (event) => {
   setAfterDueDate(event.target.value);
 };
 const content = (
<Grid
     container
     sx={{
       display: "flex",
       flexDirection: "column",
       alignItems: "center",
       textAlign: "center",
       width: "100%", // Ensure the container takes the full width
     }}
>
<Grid
       item
       xs={12}
       sm={6}
       md={6}
       style={{ margin: "10px 0px", width: "80%" }}
>
<CustomTextField
         label="Activity Name"
         variant="outlined"
         value={activityName}
         onChange={(e) => setActivityName(e.target.value)}
         placeholder="Enter Activity Name"
         name="activityName"
         fullWidth
       />
</Grid>
<Grid
       item
       xs={12}
       sm={6}
       md={6}
       style={{ margin: "10px 0px", width: "80%" }}
>
<CustomTextField
         label="Due Date"
         type="date"
         variant="outlined"
         value={dueDate}
         onChange={(e) => setDueDate(e.target.value)}
         placeholder="Enter Due Date"
         name="dueDate"
         fullWidth
         InputLabelProps={{ shrink: true }} // To show the label even when no value is selected
       />
</Grid>
<Grid
       item
       xs={12}
       sm={6}
       md={6}
       style={{ margin: "10px 0px", width: "80%" }}
>
<CustomTextField
         label="Points"
         variant="outlined"
         value={points}
         onChange={(e) => setPoints(e.target.value)}
         placeholder="Enter Points"
         name="points"
         fullWidth
       />
</Grid>
<Grid
 item
 xs={12}
 sm={6}
 md={6}
 style={{ margin: "10px 0px", width: "80%" }}
>
<FormControl fullWidth variant="outlined" sx={{ borderRadius: "50px" }}>
<InputLabel
     id="after-due-date-label"
     sx={{
       color: "black",
       "&.Mui-focused": {
         color: "black",
       },
     }}
>
     After Due Date
</InputLabel>
<Select
     labelId="after-due-date-label"
     id="after-due-date"
     value={afterDueDate}
     onChange={handleAfterDueDateChange}
     label="After Due Date"
     sx={{
       borderRadius: "50px",
       "& .MuiOutlinedInput-root": {
         borderRadius: "50px",
       },
       "& .MuiInputBase-input": {
         borderRadius: "50px",
       },
     }}
>
<MenuItem value={"Close Activity"}>Close Activity</MenuItem>
<MenuItem value={"No Penalty"}>No Penalty</MenuItem>
<MenuItem value={"Not Accepted"}>Not Accepted</MenuItem>
</Select>
</FormControl>
</Grid>
</Grid>
 );
 const handleSubmit = () => {
   const data = {
   "module_id": 4,
   "activity_name": "1907 module-4 Activity-1",
   "due_date": "2024-07-29",
   "points": 100,
   "after_due_date": "No Effect"
   };
   dispatch(createCoachTemplateActivity(data));
   dispatch(closeTemplateActivityPopup());
 };
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
<>
<ReusableDialog
       open={openActivityPopUp}
       handleClose={() => dispatch(closeTemplateActivityPopup())}
       title="Add Activity"
       content={content}
       actions={actions}
     />
</>
 );
};
export default AddActivity;