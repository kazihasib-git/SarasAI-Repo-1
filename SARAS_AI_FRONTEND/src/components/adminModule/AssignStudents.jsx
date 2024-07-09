import React, { useState, useEffect } from "react";
import { Button, MenuItem, Typography, Grid, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAssignStudents,
  openSuccessPopup,
  getStudentBatchMapping,
  getTA,
  postAssignStudents,
} from "../../redux/features/taModule/taSlice";
import CustomTextField from "../CustomFields/CustomTextField";
import ReusableDialog from "../CustomFields/ReusableDialog";
import PopUpTable from "../CommonComponent/PopUpTable";
import { openScheduleSession } from "../../redux/features/taModule/taScheduling";

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

const AssignStudents = () => {
  const dispatch = useDispatch();
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [searchName, setSearchName] = useState(""); // State for search input
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const { assignStudentOpen, ta_name, taID, studentBatchMapping } = useSelector((state) => state.taModule);

  const { taName,  taID  : taId , taTimezone } = useSelector((state) => state.taScheduling);

  useEffect(() => {
    if (assignStudentOpen) {
      dispatch(getStudentBatchMapping());
    }
  }, [assignStudentOpen, dispatch]);

  useEffect(() => {
    if (studentBatchMapping) {
      console.log("STUDENT BATCH MAPPING : ", studentBatchMapping);
      const transformedData = studentBatchMapping.map((student, index) => ({
        "S. No.": student.student_id,
        "Student Name": student.student_name,
        "Academic Term": student.academic_term,
        Batch:
          student.batches.map((batch) => batch.batch_name).join(", ") || "N/A",
        Select: student.is_active ? "Active" : "Inactive",
        student_id: student.student_id,
        is_active: student.is_active,
      }));

      
      // Set pre-selected students based on is_active status
      // const preSelectedStudents = transformedData
      //   .filter((student) => student.is_active)
      //   .map((student) => student.student_id);
      // setSelectedStudents(preSelectedStudents);

      // Filter by selected batch and search name
      const filtered = transformedData.filter((student) =>
        student["Student Name"].toLowerCase().includes(searchName.toLowerCase()) &&
        (!selectedBatch || student.Batch.includes(selectedBatch))
      );

      setFilteredStudents(filtered);
    }
  }, [studentBatchMapping, selectedBatch, searchName]);

  // Ensure studentBatchMapping is not null or undefined before using flatMap
  const batchOptions = studentBatchMapping
    ? [
      ...new Set(
        studentBatchMapping.flatMap((student) => student.batches.map(batch => batch.batch_name))
      ),
    ]
    : [];

  const academicTermOptions = studentBatchMapping
    ? [
      ...new Set(
        studentBatchMapping.map((student) => student.academic_term)
      ),
    ]
    : [];

  const handleSelectStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const data = {
      ta_id: taID ? taID : taId,
      student: selectedStudents.map((id) => ({ id: id.toString() })),
    };
    dispatch(postAssignStudents({ id: taID ? taID : taId, data }))
      .then(() => {
        // Open Schedule Session
        if(taId){
          dispatch(openScheduleSession({ id: taId, name: taName , timezone : taTimezone ,student : selectedStudents.map((id) => ({ id: id.toString() })) }));
        }
        // Open Success Popup
        dispatch(openSuccessPopup());
      });
    dispatch(closeAssignStudents());
  };

  const headers = [
    "S. No.",
    "Student Name",
    "Academic Term",
    "Batch",
    "Select",
  ];

  const content = (
    <>
      <Grid container spacing={2}>
        <Grid item  sm={6}>
          <CustomTextField
            select
            label="Academic Term"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
          >
            {academicTermOptions.map((term) => (
              <MenuItem key={term} value={term}>
                {term}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <CustomTextField
            select
            label="Batch"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            {batchOptions.map((batch) => (
              <MenuItem key={batch} value={batch}>
                {batch}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ border: "1px solid #C2C2E7" }} />
        </Grid>

        <Grid item xs={12} marginBottom={2}>
          <CustomTextField
            label="Search By Student Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </Grid>
      </Grid>

      <PopUpTable
        headers={headers}
        initialData={filteredStudents}
        onRowClick={handleSelectStudent}
        selectedBox={selectedStudents}
      />

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ mt: 2, textAlign: "center" }}
      >
        {selectedStudents.length} Student(s) Selected
      </Typography>
    </>
  );

  const actions = (
    <CustomButton
      onClick={handleSubmit}
      style={{
        backgroundColor: "#F56D3B",
        borderColor: "#F56D3B",
        color: "#FFFFFF",
      }}
    >
      Submit
    </CustomButton>
  );

  console.log('ta_name:', ta_name, 'taName:', taName)

  const assignedTA = ta_name || taName;

  return (
    <ReusableDialog
      open={assignStudentOpen}
      handleClose={() => dispatch(closeAssignStudents())}
      title={`Assign Students to ${assignedTA}`}
      content={content}
      actions={actions}
    />
  );
};

export default AssignStudents;
