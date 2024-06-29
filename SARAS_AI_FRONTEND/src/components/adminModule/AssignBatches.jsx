import React, { useState, useEffect } from "react";
import { Button, MenuItem, Typography, Grid, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAssignBatches,
  openSuccessPopup,
  getBatchMapping,
  getTA,
  postAssignBatches,
} from "../../redux/features/taModule/taSlice";
import CustomTextField from "../CustomFields/CustomTextField";
import ReusableDialog from "../CustomFields/ReusableDialog";
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

const AssignBatches = () => {
  const dispatch = useDispatch();
  const {
    assignBatchOpen,
    ta_name,
    taID,
    batchMapping = [],
    loading,
    } = useSelector((state) => state.taModule);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    if (assignBatchOpen) {
      dispatch(getBatchMapping());
    }
  }, [assignBatchOpen, dispatch]);

  useEffect(() => {
    if (batchMapping) {
      const transformedData = batchMapping.map((batch) => ({
        "S. No.": batch.Student_id,
        "batch Name": batch.student_name,
        "Academic Term": batch.academic_term,
        Batch: batch.batch_name || NA,
        Select: batch.is_actives ? 0 : 1,
      }));

      if (selectedBatch) {
        setFilteredStudents(
          transformedData.filter((batch) =>
            batch.Batch.toLowerCase().includes(selectedBatch.toLowerCase())
          )
        );
      } else {
        setFilteredStudents(transformedData);
      }
    }
  }, [selectedBatch, batchMapping]);

  const handleSelectStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = (batches) => {
    if (batches === "AssignBatches") {
      dispatch(getTA()).then((taData) => {
        const data = {
          ta_id: taID,
          batchs: selectedStudents.map((id) => ({ Id: id.toString() })),
        };
        dispatch(postAssignBatches({ id: taData.student_id, data }));
      });
    }
    dispatch(closeAssignBatches());
    dispatch(openSuccessPopup());
  };

  const headers = [
    "S. No.",
    "batch Name",
    "Academic Term",
    "Batch",
    "Select",
  ];

  const batchOptions = [
    ...new Set(
      batchMapping?.map((batch) => batch.batch_name)
    ),
  ];

  const content = (
    <>
      <Grid container spacing={2} justifyContent="center">
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
          <Divider sx={{ mt: 2, mb: 4, border: "1px solid #C2C2E7" }} />
        </Grid>
        <Grid item xs={12}>
          <CustomTextField
            label="Search By Batches"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          />
        </Grid>
      </Grid>

      <PopUpTable
        headers={headers}
        initialData={filteredStudents}
        onRowClick={handleSelectStudent}
        selectedStudents={selectedStudents}
      />

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ mt: 2, textAlign: "center" }}
      >
        {selectedStudents.length} batch(s) Selected
      </Typography>
    </>
  );

  const actions = (
    <CustomButton
      onClick={() => handleSubmit("AssignBatches")}
      backgroundColor="#F56D3B"
      borderColor="#F56D3B"
      color="#FFFFFF"
    >
      Submit
    </CustomButton>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ReusableDialog
      open={assignBatchOpen}
      handleClose={() => dispatch(closeAssignBatches())}
      title={`Assign Batches to ${ta_name}`}
      content={content}
      actions={actions}
    />
  );
};

export default AssignBatches;
