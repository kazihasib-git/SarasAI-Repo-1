import React, { useState, useEffect } from "react";
import { Button, MenuItem, Typography, Grid, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAssignStudents,
  openSuccessPopup,
  getStudentBatchMapping,
  postAssignStudents,
  getAssignStudents,
} from "../../redux/features/taModule/taSlice";
import CustomTextField from "../CustomFields/CustomTextField";
import ReusableDialog from "../CustomFields/ReusableDialog";
import PopUpTable from "../CommonComponent/PopUpTable";
import {
  closeEditStudent,
  openScheduleSession,
} from "../../redux/features/taModule/taScheduling";

import {
  closeCoachEditStudent,
  openCoachScheduleSession,
} from "../../redux/features/CoachModule/coachSchedule";

import {
  closeCoachAssignStudents,
  openCoachSuccessPopup,
  getCoachStudentBatchMapping,
  postCoachAssignStudents,
  getCoachAssignStudents,
} from "../../redux/features/CoachModule/coachSlice";

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

const EditStudents = ({ componentname }) => {
  const dispatch = useDispatch();
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [searchName, setSearchName] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const {
    openEditStudent,
    taID: taaId,
    students,
  } = useSelector((state) => state.taScheduling);
  const { assignedStudents } = useSelector((state) => state.taModule);

  let stateModuleKey,
    nameKey,
    assignStudentOpenKey,
    assignMappingKey,
    closeDialogAction,
    openSuccessAction,
    getAssignStudentAction,
    postAssignAction;
  let schedulingState,
    nameKeyScheduling,
    idKeyScheduling,
    openScheduleSessionAction;

  switch (componentname) {
    case "ADDITCOACH":
      stateModuleKey = "coachModule";
      nameKey = "coach_name";
      assignStudentOpenKey = "openCoachEditStudent";
      assignMappingKey = "coachStudentBatchMapping";
      closeDialogAction = closeCoachAssignStudents;
      openSuccessAction = openCoachSuccessPopup;
      getAssignStudentAction = getCoachStudentBatchMapping;
      postAssignAction = postCoachAssignStudents;
      schedulingState = useSelector((state) => state.coachScheduling);
      nameKeyScheduling = "coachName";
      idKeyScheduling = "coachID";
      openScheduleSessionAction= openCoachScheduleSession
      break;
    case "ADDEDITTA":
      stateModuleKey = "taModule";
      nameKey = "ta_name";
      assignStudentOpenKey = "openEditStudent";
      assignMappingKey = "studentBatchMapping";
      closeDialogAction = closeAssignStudents;
      openSuccessAction = openSuccessPopup;
      getAssignStudentAction = getStudentBatchMapping;
      postAssignAction = postAssignStudents;
      schedulingState = useSelector((state) => state.taScheduling);
      nameKeyScheduling = "taName";
      idKeyScheduling = "taID";
      openScheduleSessionAction = openScheduleSession
      break;
    default:
      stateModuleKey = null;
      nameKey = null;
      assignStudentOpenKey = null;
      assignMappingKey = null;
      closeDialogAction = null;
      openSuccessAction = null;
      getAssignStudentAction = null;
      postAssignAction = null;
      schedulingState = null;
      nameKeyScheduling = null;
      idKeyScheduling = null;
      openScheduleSessionAction = null
      break;
  }

  const stateSelector = useSelector((state) =>
    stateModuleKey ? state[stateModuleKey] : {}
  );
  const { [nameKeyScheduling]: assignedName, [idKeyScheduling]: assignedId } =
    schedulingState || {};

  const {
    [assignStudentOpenKey]: assignStudentOpen,
    [nameKey]: assignedTAName,
    taID,
    coachID,
    [assignMappingKey]: studentBatchMapping,
  } = stateSelector || {};

  useEffect(() => {
    // dispatch(getAssignStudents(taaId));
    if (stateModuleKey && assignStudentOpen) {
      dispatch(getAssignStudentAction(assignedId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (assignedStudents) {
      console.log("STUDENT BATCH MAPPING : ", assignedStudents);
      const transformedData = assignedStudents.map((stu, index) => ({
        "S. No.": index + 1,
        "Student Name": stu.student.name,
        "Academic Term": stu.student.academic_term,
        Batch:
          stu.student.batches.map((batch) => batch.batch_name).join(", ") ||
          "N/A",
        Select: stu.is_active ? "Active" : "Inactive",
        student_id: stu.student_id,
        is_active: stu.is_active,
        id: stu.student.id,
      }));

      const filtered = transformedData.filter((student) => {
        const matchesTerm = selectedTerm
          ? student["Academic Term"] === selectedTerm
          : true;
        const matchesBatch = selectedBatch
          ? student.Batch.includes(selectedBatch)
          : true;
        const matchesName = searchName
          ? student["Student Name"]
              .toLowerCase()
              .includes(searchName.toLowerCase())
          : true;
        return matchesTerm && matchesBatch && matchesName;
      });

      setFilteredStudents(filtered);
    }
  }, [studentBatchMapping, selectedTerm, selectedBatch, searchName]);

  const batchOptions = studentBatchMapping
    ? [
        ...new Set(
          studentBatchMapping
            .filter(
              (student) =>
                !selectedTerm || student.academic_term === selectedTerm
            )
            .flatMap((student) =>
              student.batches.map((batch) => batch.batch_name)
            )
        ),
      ]
    : [];

  const academicTermOptions = studentBatchMapping
    ? [...new Set(studentBatchMapping.map((student) => student.academic_term))]
    : [];

  useEffect(() => {
    if (students) {
      setSelectedStudents(students.map((student) => student.id));
    }
  }, [students]);

  const handleSelectStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const id =
      componentname === "ADDITCOACH"
        ? coachID || assignedId
        : taID || assignedId;
    const data = {
      [componentname === "ADDITCOACH" ? "Coach_id" : "ta_id"]: id,
      student: selectedStudents.map((id) => ({ id })),
    };

    dispatch(
      openScheduleSession({
        id,
        name: assignedName,
        student: selectedStudents.map((id) => ({ id })),
      })
    );

    /*
        dispatch(postAssignAction({ id, data })).then(() => {
          if (assignedId) {
            dispatch(
              openScheduleSession({
                id: assignedId,
                name: assignedName,
                student: selectedStudents.map((id) => ({ id: id.toString() })),
              })
            );
          }
          dispatch(openSuccessAction());
        });
         */
    dispatch(closeEditStudent());
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
        <Grid item sm={6}>
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

  const assignedTA = assignedTAName || assignedName;
  return (
    <ReusableDialog
      open={assignMappingKey}
    //   handleClose={() => dispatch(closeEditStudent())}
        handleClose={() => dispatch(closeDialogAction())}
      title={`Assign Students to '${assignedTA}'`}
      content={content}
      actions={actions}
    />
  );
};

export default EditStudents;
