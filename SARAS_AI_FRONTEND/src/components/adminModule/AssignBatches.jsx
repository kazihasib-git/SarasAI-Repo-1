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

const AssignBatches = () => {
  const dispatch = useDispatch();
  const { assignBatchOpen, ta_name, taID, batchMapping = [], loading, } = useSelector((state) => state.taModule);

  const { taName, taID: taId } = useSelector((state) => state.taScheduling);

  const [selectedBatch, setSelectedBatch] = useState("");
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);

  useEffect(() => {
    if (assignBatchOpen) {
      dispatch(getBatchMapping());
    }
  }, [assignBatchOpen, dispatch]);

  useEffect(() => {
    if (batchMapping) {
      const transformedData = batchMapping.map((batch) => ({
        "S. No.": batch.id,
        "Batch Name": batch.name,
        Branch: batch.branch,
        Select: batch.is_active ? "Active" : "Inactive",
        batch_id: batch.id,
        //"Academic Term": batch.academic_term || "N/A",
        /*
        Batch: batch.children ? batch.children.map((child) => child.name).join(", ") batch.name,
        */
      }));

      /*
      // Initialize selected batches with active ones
      const activeBatches = batchMapping
        .filter((batch) => batch.is_active === 1)
        .map((batch) => batch.id);
      setSelectedBatches(activeBatches);
      */

      // Filter by selected batch
      const filtered = transformedData.filter(
        (batch) =>
          batch["Branch"] &&
          batch["Branch"].toLowerCase().includes(selectedBatch.toLowerCase())
      );

      setFilteredBatches(filtered);
    }
  }, [batchMapping, selectedBatch]);

  const batchOptions = [
    ...new Set(
      batchMapping.flatMap((batch) => [
        batch.name,
        ...batch.children.map((child) => child.name),
      ])
    ),
  ];

  const handleSelectBatch = (id) => {
    console.log("IDDD : ", id);
    setSelectedBatches((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const data = {
      ta_id: taID ? taID : taId,
      batches: selectedBatches.map((id) => ({ id: id.toString() })),
    };
    dispatch(postAssignBatches({ id: taID ? taID : taId, data })).then(() => {
      if (taId) {
        if (taId) {
          dispatch(openScheduleSession({ id: taId, name: taName, batches: selectedBatches.map((id) => ({ id: id.toString() })) }));
        }
      }
      dispatch(openSuccessPopup());
    });
    dispatch(closeAssignBatches());
  };

  const headers = [
    "S. No.",
    "Batch Name",
    "Branch",
    //"Academic Term",
    //"Batch",
    "Select",
  ];

  const content = (
    <>
      <Grid container spacing={2} justifyContent="center">
        <Grid item sm={6}>
          <CustomTextField
            select
            label="Branch"
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
        <Grid item xs={12} mb={2}>
          <CustomTextField
            label="Search By Batch Name"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          />
        </Grid>
      </Grid>

      <PopUpTable
        headers={headers}
        initialData={filteredBatches}
        onRowClick={handleSelectBatch}
        selectedBox={selectedBatches}
      />

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ mt: 2, textAlign: "center" }}
      >
        {selectedBatches.length} batch(es) Selected
      </Typography>
    </>
  );

  const actions = (
    <Button
      onClick={handleSubmit}
      style={{
        backgroundColor: "#F56D3B",
        borderColor: "#F56D3B",
        color: "#FFFFFF",
      }}
    >
      Submit
    </Button>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  const assignedTA = ta_name || taName;

  return (
    <ReusableDialog
      open={assignBatchOpen}
      handleClose={() => dispatch(closeAssignBatches())}
      title={`Assign Batches to ${assignedTA}`}
      content={content}
      actions={actions}
    />
  );
};

export default AssignBatches;
