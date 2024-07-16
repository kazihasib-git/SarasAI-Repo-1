import React, { useState, useEffect } from "react";
import { Button, MenuItem, Typography, Grid, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAssignBatches,
  openSuccessPopup,
  postAssignBatches,
  getAssignBatches,
} from "../../redux/features/taModule/taSlice";

import {
  closeCoachAssignBatches,
  openCoachSuccessPopup,
  postCoachAssignBatches,
  getCoachAssignBatches,
} from "../../redux/features/CoachModule/coachSlice";

import CustomTextField from "../CustomFields/CustomTextField";
import ReusableDialog from "../CustomFields/ReusableDialog";
import PopUpTable from "../CommonComponent/PopUpTable";
import {
  closeEditBatch,
  openScheduleSession,
} from "../../redux/features/taModule/taScheduling";

import {
  closeCoachEditBatch,
  openCoachScheduleSession,
} from "../../redux/features/CoachModule/coachSchedule";

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

const EditBatches = ({ componentname }) => {
  const dispatch = useDispatch();
  const [selectedBatch, setSelectedBatch] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [filteredBatches, setFilteredBatches] = useState([]);

//   const {
//     openEditBatch,
//     taID: taaaId,
//     batches,
//   } = useSelector((state) => state.taScheduling);

  let stateModuleKey,
    nameKey,
    assignBatchOpenKey,
    editBatchKey,
    selectedBatchKey,
    openScheduleSessionAction,
    closeDialogAction,
    openSuccessAction,
    getAssignBatchesAction,
    postAssignAction;
  let schedulingState, nameKeyScheduling, idKeyScheduling;

  switch (componentname) {
    case "COACHSCHEDULE":
      stateModuleKey = "coachModule";
      nameKey = "coach_name";
      assignBatchOpenKey = "openCoachEditBatch";
      editBatchKey = "assignedBatches";
      selectedBatchKey = "batches";
      closeDialogAction = closeCoachEditBatch;
      openSuccessAction = openCoachSuccessPopup;
      getAssignBatchesAction = getCoachAssignBatches;
      postAssignAction = postCoachAssignBatches;
      schedulingState = useSelector((state) => state.coachScheduling);
      nameKeyScheduling = "coachName";
      idKeyScheduling = "coachID";
      openScheduleSessionAction = openCoachScheduleSession;
      break;
    case "TASCHEDULE":
      stateModuleKey = "taModule";
      nameKey = "ta_name";
      assignBatchOpenKey = "openEditBatch";
      editBatchKey = "assignedBatches";
      selectedBatchKey = "batches";
      closeDialogAction = closeEditBatch;
      openSuccessAction = openSuccessPopup;
      getAssignBatchesAction = getAssignBatches;
      postAssignAction = postAssignBatches;
      schedulingState = useSelector((state) => state.taScheduling);
      nameKeyScheduling = "taName";
      idKeyScheduling = "taID";
      openScheduleSessionAction = openScheduleSession;
      break;
    default:
      stateModuleKey = null;
      assignBatchOpenKey = null;
      nameKey = null;
      editBatchKey = null;
      selectedBatchKey = null;
      closeDialogAction = null;
      openSuccessAction = null;
      getAssignBatchesAction = null;
      postAssignAction = null;
      schedulingState = null;
      nameKeyScheduling = null;
      idKeyScheduling = null;
      openScheduleSessionAction = null;
      break;
  }

  const stateSelector = useSelector((state) =>
    stateModuleKey ? state[stateModuleKey] : {}
  );

  const {
    [nameKeyScheduling]: assignedName,
    [idKeyScheduling]: assignedId,
    [assignBatchOpenKey]: assignBatchOpen,
    [selectedBatchKey]: selectedBatches,
  } = schedulingState || {};

  const {
    [nameKey]: assignedTAName,
    taID,
    coachID,
    [editBatchKey]: assignedBatches,
    
    //[editStudentKey]: assignedStudents,
    loading,
  } = stateSelector || {};

  useEffect(() => {
    // console.log("idKeyScheduling : ", idKeyScheduling, assignedId, taaaId);

    if (stateModuleKey && assignBatchOpen) {
      dispatch(getAssignBatchesAction(assignedId));
      // dispatch(getAssignBatches(taaaId));
      // dispatch(getAssignBatches(taID || coachID));
    }
  }, [dispatch]);

  useEffect(() => {
    if (assignedBatches) {
      console.log("assignedBatches", assignedBatches);

      const transformedData = assignedBatches.map((batch, index) => ({
        "S. No.": index + 1,
        "Batch Name": batch.batch.name,
        Branch: batch.batch.branch,
        //Select: batch.is_active ? "Active" : "Inactive",
        id: batch.id,
      }));

      console.log("transformedData", transformedData);

      const filtered = transformedData.filter((batch) => {
        const matchesBranch = selectedBranch
          ? batch.Branch === selectedBranch
          : true;
        const matchesQuery = searchQuery
          ? batch["Batch Name"]
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : true;
        return matchesBranch && matchesQuery;
      });

      setFilteredBatches(filtered);
    }
  }, [assignedBatches, selectedBranch, searchQuery]);

  const batchOptions = assignedBatches
    ? [...new Set(assignedBatches.map((batch) => batch.branch))]
    : [];

  useEffect(() => {
    if (selectedBatches) {
      setSelectedBatch(selectedBatches.map((prev) => prev.id));
    }
  }, [selectedBatches]);

  const handleSelectBatch = (id) => {
    setSelectedBatch((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const id =
      componentname === "COACHSCHEDULE"
        ? coachID || assignedId
        : taID || assignedId;
    const data = {
      [componentname === "COACHSCHEDULE" ? "Coach_id" : "ta_id"]: id,
      name: assignedName,
      batches: selectedBatch.map((id) => ({ id })),
    };

    // dispatch(
    //     openSessionAction({
    //     id,
    //     name: assignedName,
    //     batches: selectedBatch.map((id) => ({ id })),
    //   })
    // );
    dispatch(openScheduleSessionAction(data));

    /*
        dispatch(postAssignAction({ id, data })).then(() => {
            if (assignedId) {
                dispatch(
                    openScheduleSession({
                        id: assignedId,
                        name: assignedName,
                        batches: selectedBatch.map((id) => ({ id: id.toString() })),
                    })
                );
            }
            dispatch(openSuccessAction());
        })
        */
    dispatch(closeEditBatch());
  };

  const headers = ["S. No.", "Batch Name", "Branch", "Select"];

  const content = (
    <>
      <Grid container spacing={2} justifyContent="center">
        <Grid item sm={6}>
          <CustomTextField
            select
            label="Branch"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
          >
            {batchOptions.map((branch) => (
              <MenuItem key={branch} value={branch}>
                {branch}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
      </Grid>
      <PopUpTable
        headers={headers}
        initialData={filteredBatches}
        onRowClick={handleSelectBatch}
        selectedBox={selectedBatch}
      />
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ mt: 2, textAlign: "center" }}
      >
        {selectedBatch.length} batch(es) Selected
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

  if (loading) {
    return <div>Loading...</div>;
  }

  const assignedTA = assignedTAName || assignedName;

  return (
    <ReusableDialog
      open={assignBatchOpen}
      handleClose={() => dispatch(closeDialogAction())}
      //   handleClose={() => dispatch(closeEditBatch())}
      title={`Assign Batches to ${assignedTA}`}
      content={content}
      actions={actions}
    />
  );
};

export default EditBatches;
