import React, { useState, useCallback } from "react";
import { Box, Button, Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import LinkActivityPopup from "../TemplateModulePopup/LinkActivity";
import PrerequisitesPopup from "../TemplateModulePopup/Prerequisites";
import editIcon from "../../../../assets/editIcon.png"; // Assuming this is the correct path to your edit icon
import { openTemplateActivityPopup } from "../../../../redux/features/CoachModule/CoachTemplateSlice";
 
const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: "20px",
  border: "1px solid #F56D3B",
  color: "#F56D3B",
  padding: "5px 10px",
  margin: "0 8px",
  "&:hover": {
    backgroundColor: "#F56D3B",
    color: "#fff",
    borderColor: "#F56D3B",
  },
}));
 
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 36,
  height: 20,
  padding: 0,
  marginTop: 5,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 17,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(16px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 3,
    "&.Mui-checked": {
      transform: "translateX(18px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#14D249",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 14,
    height: 14,
    borderRadius: 7,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 20 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));
 
const TemplateModuleTable = ({ modulesData }) => {
  const [linkActivityPopupOpen, setLinkActivityPopupOpen] = useState(false);
  const [prerequisitesPopupOpen, setPrerequisitesPopupOpen] = useState(false);
  const dispatch = useDispatch();
 
  const handleToggle = (moduleId, activityId) => {
    console.log(`Toggled activity ${activityId} in module ${moduleId}`);
    // Implement toggle action dispatch
  };
 
  const openLinkActivityPopup = () => {
    setLinkActivityPopupOpen(true);
  };
 
  const closeLinkActivityPopup = () => {
    setLinkActivityPopupOpen(false);
  };
 
  const openPrerequisitesPopup = () => {
    setPrerequisitesPopupOpen(true);
  };
 
  const closePrerequisitesPopup = () => {
    setPrerequisitesPopupOpen(false);
  };
 
  const handleActivity = () => {
    // console.log("Add Activity clicked for module:", module.module_name);
    dispatch(openTemplateActivityPopup())
    // Implement your logic for adding activity
  };
 
  const handleEditModule = (id) => {
    console.log("Edit Module clicked", id);
    // Implement your logic for editing module
  };
 
  return (
    <>
    {console.log("Module Data : ",modulesData)}
      {modulesData.map((module) => (
        <Box key={module.id} marginTop={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" padding={2} borderRadius="0px" border="0px solid #e0e0e0">
            <p style={{ fontSize: "24px", justifyContent: "center", margin: 0 }}>
              {module.module_name}
              <span
                style={{
                  borderRadius: "50px",
                  backgroundColor: module.is_active ? "#14D249" : "red",
                  color: "white",
                  padding: "3px 10px",
                  marginLeft: "10px",
                  fontSize: "12px",
                }}
              >
                {module.is_active ? "Active" : "Inactive"}
              </span>
            </p>
            <div className="inputBtnContainer" style={{ display: "flex", alignItems: "center" }}>
              <CustomButton className="buttonTemplateContainer" onClick={handleActivity}>
                <i className="bi bi-plus-circle"></i>
                <span>Add Activity</span>
              </CustomButton>
 
              <CustomButton className="buttonTemplateContainer" onClick={handleEditModule}>
              <FontAwesomeIcon icon={faPenToSquare} className="bi" />
                <span >Edit Module</span>
              </CustomButton>
            </div>
          </Box>
          {module.activities.length > 0 && (
            <Box marginTop={1} padding={2} border="1px solid #e0e0e0" borderRadius="8px" backgroundColor="#fff">
              <div className="tableContainer">
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead className="tableHead">
                    <tr>
                      <th style={{ padding: "8px 0" }}>S. No.</th>
                      <th style={{ padding: "8px 0" }}>Activity Name</th>
                      <th style={{ padding: "8px 0" }}>Due Date</th>
                      <th style={{ padding: "8px 0" }}>Activity</th>
                      <th style={{ padding: "8px 0" }}>Points</th>
                      <th style={{ padding: "8px 0" }}>Prerequisites</th>
                      <th style={{ padding: "8px 0" }}>After Due Date</th>
                      <th style={{ padding: "8px 0" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="tableBody">
                    {module.activities.map((activity, index) => (
                      <tr key={activity.id}>
                        <td style={{ padding: "8px 0", borderBottom: "1px solid #e0e0e0" }}>{index + 1}</td>
                        <td style={{ padding: "8px 0", borderBottom: "1px solid #e0e0e0" }}>{activity.activity_name}</td>
                        <td style={{ padding: "8px 0", borderBottom: "1px solid #e0e0e0" }}>{activity.due_date}</td>
                        <td style={{ padding: "8px 0", borderBottom: "1px solid #e0e0e0" }}>
                          <CustomButton onClick={openLinkActivityPopup} className="linkActivityBtn">
                            Link Activity
                          </CustomButton>
                        </td>
                        <td style={{ padding: "8px 0", borderBottom: "1px solid #e0e0e0" }}>{activity.points}</td>
                        <td style={{ padding: "8px 0", borderBottom: "1px solid #e0e0e0" }}>
                          <CustomButton onClick={openPrerequisitesPopup} className="prerequisitesBtn">
                            Prerequisite
                          </CustomButton>
                        </td>
                        <td style={{ padding: "8px 0", borderBottom: "1px solid #e0e0e0" }}>{activity.after_due_date}</td>
                        <td style={{ padding: "8px 0", borderBottom: "1px solid #e0e0e0" }}>
                        <AntSwitch
                            key={activity.id}
                            checked={activity.is_active}
                            onChange={() => handleToggle(activity.id)}
                            inputProps={{ "aria-label": "ant design" }}
                          />
                        </td>
                        <td style={{ padding: "8px 0", borderBottom: "1px solid #e0e0e0" }}>
                          <CustomButton onClick={handleEditModule(module.id)} className="editBtn">
                            <FontAwesomeIcon icon={faPenToSquare} style={{ color: "#F56D3B" }} />
                            <span style={{ fontSize: "14px", marginLeft: "5px", color: "#F56D3B" }}>Edit</span>
                          </CustomButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Box>
          )}
        </Box>
      ))}
      <LinkActivityPopup open={linkActivityPopupOpen} handleClose={closeLinkActivityPopup} />
      <PrerequisitesPopup open={prerequisitesPopupOpen} handleClose={closePrerequisitesPopup} />
    </>
  );
};
 
export default TemplateModuleTable;