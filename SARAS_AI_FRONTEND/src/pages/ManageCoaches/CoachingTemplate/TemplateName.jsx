import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { Box } from "@mui/material";
import AddModule from "./TemplateModulePopup/AddModule";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoachTemplateModules, openEditModulePopup, openTemplateActivityPopup, openTemplateModulePopup, removeSelectedModule, setSelectedModule } from "../../../redux/features/CoachModule/CoachTemplateSlice";
import TemplateModuleTable from "./TemplateTable/TemplateModuleTable";
import "./TemplateName.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import AddActivity from "./TemplateModulePopup/AddActivity";
import EditModule from "./TemplateModulePopup/EditModule";
import { useLocation } from "react-router-dom";

const TemplateName = () => {
  const { openModulePopUp, openActivityPopUp, template_name ,selectedCoachTemplate, newlyCreateTemplate, modulesData} = useSelector((state) => state.coachTemplate);
  const [isActive, setIsActive] = useState(true);
  const [templateEditName, setTemplateEditName] = useState();
  const [modulesData1, setModulesData1] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation()
  ;
    const { newTemplateData } = location.state || {};

console.log("Template name is", template_name);
console.log("coach templete", coachTemplates);
console.log("selcted coach templete",selectedCoachTemplate)
  useEffect(()=>{
    dispatch(removeSelectedModule());
  },[dispatch]);

  useEffect(()=>{
    if(coachTemplates && coachTemplates.length){
      const currentTemplateData = coachTemplates.find((template) => template.id === selectedCoachTemplate);
      setTemplateEditName(currentTemplateData.name)
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
        setModulesData1(tranformData);
      }
    }
  },[coachTemplates]);

  const handleModule = () => {
    dispatch(openTemplateModulePopup());
  };
  useEffect(() => {
    if (selectedCoachTemplate) {
      dispatch(getAllCoachTemplateModules(selectedCoachTemplate));
    }
  }, [dispatch, selectedCoachTemplate]);

  const handleActivity = () => {
    dispatch(setSelectedModule());
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

  // const dummyData = [
  //   {
  //     id: 1,
  //     "Activity Name": "Introduction to React",
  //     "Due Date": "2024-07-15",
  //     Activity: "Video Name",
  //     Points: 10,
  //     Prerequisites: "Activity 1, Activity 2",
  //     "After Due Date": "Late Submission",
  //   },
  //   {
  //     id: 2,
  //     "Activity Name": "React Components",
  //     "Due Date": "2024-07-20",
  //     Activity: "Link Activity",
  //     Points: 15,
  //     Prerequisites: "Prerequisites",
  //     "After Due Date": "Late Submission",
  //   },
  //   {
  //     id: 3,
  //     "Activity Name": "State and Props",
  //     "Due Date": "2024-07-25",
  //     Activity: "Video Name",
  //     Points: 20,
  //     Prerequisites: "Prerequisites",
  //     "After Due Date": "No Penalty",
  //   },
  //   {
  //     id: 4,
  //     "Activity Name": "React Lifecycle",
  //     "Due Date": "2024-07-30",
  //     Activity: "Link Activity",
  //     Points: 25,
  //     Prerequisites: "Prerequisites",
  //     "After Due Date": "No Penalty",
  //   },
  //   {
  //     id: 5,
  //     "Activity Name": "Handling Events",
  //     "Due Date": "2024-08-05",
  //     Activity: "Video Name",
  //     Points: 30,
  //     Prerequisites: "Activity 1, Activity 2",
  //     "After Due Date": "Late Submission",
  //   },
  // ];

  const dummyData =[]
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
       {templateEditName || template_name}
        </p>
        <div className="inputBtnContainer">
          <button className="buttonContainer" onClick={handleModule}>
            <i className="bi bi-plus-circle"></i>
            <span>Add Module</span>
          </button>
        </div>
      </Box>
      
        <>
        
        

          <TemplateModuleTable
            modulesData={modulesData}
          />
        </>
        
      

      {openModulePopUp && <AddModule />}
      {openActivityPopUp && <AddActivity />}
      {openEditModulePopup && <EditModule />}
    </>
  );
};

export default TemplateName;
