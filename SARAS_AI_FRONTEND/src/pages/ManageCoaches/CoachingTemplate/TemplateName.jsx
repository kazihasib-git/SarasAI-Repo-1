import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { Box } from "@mui/material";
import AddModule from "./TemplateModulePopup/AddModule";
import { useDispatch, useSelector } from "react-redux";
import { openEditModulePopup, openTemplateActivityPopup, openTemplateModulePopup, removeSelectedModule, setSelectedModule } from "../../../redux/features/CoachModule/CoachTemplateSlice";
import TemplateModuleTable from "./TemplateModuleTable/TemplateModuleTable";
import "./TemplateName.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import AddActivity from "./TemplateModulePopup/AddActivity";
import EditModule from "./TemplateModulePopup/EditModule";

const TemplateName = () => {
  const { openModulePopUp, openActivityPopUp, template_name ,selectedCoachTemplate, coachTemplates} = useSelector((state) => state.coachTemplate);
  const [isActive, setIsActive] = useState(true);
  const [modulesData, setModulesData] = useState([]);
  const dispatch = useDispatch();

console.log("Tempete name is", template_name);
console.log("coach templete", coachTemplates);
console.log("selcted coach templete",selectedCoachTemplate)
  useEffect(()=>{
    dispatch(removeSelectedModule());
  },[dispatch]);

  useEffect(()=>{
    if(coachTemplates && coachTemplates.length){
      const currentTemplateData = coachTemplates.find((template) => template.id === selectedCoachTemplate);
      console.log("currenteeee",currentTemplateData );
      if(currentTemplateData && currentTemplateData.length){
        const tranformData = currentTemplateData.map((item)=>({
            id: module.id,
            module_name : item.module_name,
            
            is_active : item.is_active,
            activities : item.activities.map((property)=>({
              id: property.id,
              "Activity Name": property.activity_name,
              "Due Date": property.due_date,
              Activity: property.activity_type.type_name,
              Points: property.points,
              Prerequisites: "Activity 1, Activity 2",
              "After Due Date": property.after_due_date,
              is_active: property.is_active
            }))    
        }));
        setModulesData(tranformData);
      }
    }
  },[coachTemplates]);

  const handleModule = () => {
    dispatch(openTemplateModulePopup());
  };

  const handleActivity = (module) => {
    dispatch(setSelectedModule(module.id));
    dispatch(openTemplateActivityPopup());
  };

  const handleEditModule = () => {
    dispatch(openEditModulePopup());
  };

  const headers = [
    "S. No.",
    "Activity Name",
    "Due Date",
    "Activity",
    "Points",
    "Prerequisites",
    "After Due Date",
    "Actions",
  ];

  const dummyData = [
    {
      id: 1,
      "Activity Name": "Introduction to React",
      "Due Date": "2024-07-15",
      Activity: "Video Name",
      Points: 10,
      Prerequisites: "Activity 1, Activity 2",
      "After Due Date": "Late Submission",
    },
    {
      id: 2,
      "Activity Name": "React Components",
      "Due Date": "2024-07-20",
      Activity: "Link Activity",
      Points: 15,
      Prerequisites: "Prerequisites",
      "After Due Date": "Late Submission",
    },
    {
      id: 3,
      "Activity Name": "State and Props",
      "Due Date": "2024-07-25",
      Activity: "Video Name",
      Points: 20,
      Prerequisites: "Prerequisites",
      "After Due Date": "No Penalty",
    },
    {
      id: 4,
      "Activity Name": "React Lifecycle",
      "Due Date": "2024-07-30",
      Activity: "Link Activity",
      Points: 25,
      Prerequisites: "Prerequisites",
      "After Due Date": "No Penalty",
    },
    {
      id: 5,
      "Activity Name": "Handling Events",
      "Due Date": "2024-08-05",
      Activity: "Video Name",
      Points: 30,
      Prerequisites: "Activity 1, Activity 2",
      "After Due Date": "Late Submission",
    },
  ];
  // const dummyData = [];

  const actionButtons = [
    {
      type: "switch",
    },
    {
      type: "edit",
      onClick: (id) => {
        console.log("CLICKED : ", id);
      },
    },
  ]; // Define your action buttons if any

  return (
    <>
      <Header />
      <Sidebar />
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        marginTop={3}
        alignItems={"center"}
      >
        <p style={{ fontSize: "44px", justifyContent: "center" }}>
       {template_name}
        </p>
        <div className="inputBtnContainer">
          <button className="buttonContainer" onClick={handleModule}>
            <i className="bi bi-plus-circle"></i>
            <span>Add Module</span>
          </button>
        </div>
      </Box>
      {!modulesData || modulesData.length === 0 ? (
        <div>{/* <p>No Data Available</p> */}</div>
      ) : (
        <>
        {modulesData && modulesData.map((module)=>(
        <>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            marginTop={3}
            alignItems={"center"}
          >
            
            <p style={{ fontSize: "24px", justifyContent: "center" }}>
              
              {module.module_name}
              <span
                style={{
                  borderRadius: "50px",
                  backgroundColor: module.is_active ? "#14D249" : "red",
                  color: "white",
                  padding: "3px 10px",
                  marginLeft: "10px",
                  fontSize:"12px"
                }}
              >
                {module.is_active ? "Active" : "Inactive"}
              </span>
            </p>
            <div className="inputBtnContainer">
              <button className="buttonTemplateContainer" onClick={handleActivity(module)}>
                <i className="bi bi-plus-circle"></i>
                <span>Add Activity</span>
              </button>

              <button className="buttonTemplateContainer" onClick={handleEditModule}>
                <FontAwesomeIcon icon={faPenToSquare} className="bi" />
                <span>Edit Module</span>
              </button>
            </div>
          </Box>

          <TemplateModuleTable
            headers={headers}
            initialData={Array.isArray(module.activities) ? module.activities : []}
            actionButtons={actionButtons}
            componentName={"TemplateName"}
          />
        </>
        ))}
        </>
      )}

      {openModulePopUp && <AddModule />}
      {/* {openActivityPopUp && <AddActivity />} */}
      {openEditModulePopup && <EditModule />}
    </>
  );
};

export default TemplateName;
