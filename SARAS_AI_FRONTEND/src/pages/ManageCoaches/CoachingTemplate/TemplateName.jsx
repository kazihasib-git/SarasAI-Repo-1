import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { Box } from "@mui/material";
import AddModule from "./TemplateModulePopup/AddModule";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoachTemplateModules, openEditModulePopup, openTemplateActivityPopup, openTemplateModulePopup, removeSelectedModule, setSelectedModule } from "../../../redux/features/CoachModule/CoachTemplateSlice";
import TemplateModuleTable from "./TemplateTable/TemplateModuleTable";
import "./TemplateName.css";

import AddActivity from "./TemplateModulePopup/AddActivity";
import EditModule from "./TemplateModulePopup/EditModule";
import { useLocation } from "react-router-dom";

const TemplateName = () => {
  const { openModulePopUp, openActivityPopUp, template_name ,selectedCoachTemplate, coachTemplates, modulesData} = useSelector((state) => state.coachTemplate);
  const [isActive, setIsActive] = useState(true);
  const [templateEditName, setTemplateEditName] = useState();
  const [modulesData1, setModulesData1] = useState([]);
  const dispatch = useDispatch();
  
  const location = useLocation()
  ;
    const { newTemplateData } = location.state || {};

// console.log("Template name is", template_name);
// console.log("coach templete", coachTemplates);
// console.log("selcted coach templete",selectedCoachTemplate)
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
      module_name: "Module 1",
      is_active: true,
      activities: [
        {
          id: 1,
          activity_name: "Activity 1",
          due_date: "2024-08-01",
          points: 10,
          after_due_date: "Allowed",
          is_active: true,
        },
        {
          id: 2,
          activity_name: "Activity 2",
          due_date: "2024-08-05",
          points: 15,
          after_due_date: "Not Allowed",
          is_active: false,
        },
      ],
    },
    {
      id: 2,
      module_name: "Module 2",
      is_active: false,
      activities: [
        {
          id: 3,
          activity_name: "Activity 3",
          due_date: "2024-08-10",
          points: 20,
          after_due_date: "Allowed",
          is_active: true,
        },
        {
          id: 4,
          activity_name: "Activity 4",
          due_date: "2024-08-15",
          points: 25,
          after_due_date: "Not Allowed",
          is_active: true,
        },
        {
          id: 5,
          activity_name: "Activity 5",
          due_date: "2024-08-20",
          points: 30,
          after_due_date: "Allowed",
          is_active: false,
        },
      ],
    },
    {
      id: 3,
      module_name: "Module 3",
      is_active: true,
      activities: [],
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
