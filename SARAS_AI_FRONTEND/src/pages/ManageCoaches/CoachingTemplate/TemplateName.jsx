import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { Box } from "@mui/material";
import AddModule from "./TemplateModulePopup/AddModule";
import { useDispatch, useSelector } from "react-redux";
import {
  createCoachTemplateModule,
  getAllCoachTemplateModules,
  openEditModulePopup,
  openTemplateActivityPopup,
  openTemplateModulePopup,
  removeSelectedModule,
  setSelectedCoachTemplate,
  setSelectedModule,
} from "../../../redux/features/CoachModule/CoachTemplateSlice";
import TemplateModuleTable from "./TemplateTable/TemplateModuleTable";
import "./TemplateName.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import AddActivity from "./TemplateModulePopup/AddActivity";
import EditModule from "./TemplateModulePopup/EditModule";
import { useLocation } from "react-router-dom";

const TemplateName = () => {
  const {
    openModulePopUp,
    openActivityPopUp,
    template_name,
    selectedCoachTemplate,
    coachTemplates,
    newlyCreateTemplate,
    modulesData,
  } = useSelector((state) => state.coachTemplate);
  const [isActive, setIsActive] = useState(true);
  const [templateEditName, setTemplateEditName] = useState("");
  const [modulesData1, setModulesData1] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  const { newTemplateData } = location.state || {};

  useEffect(() => {
    dispatch(removeSelectedModule());
  }, [dispatch]);

  useEffect(() => {
    if (newTemplateData) {
      dispatch(setSelectedCoachTemplate(newTemplateData.id));
      setTemplateEditName(newTemplateData.name);
    }
  }, [dispatch, newTemplateData]);

  useEffect(() => {
    if (coachTemplates && coachTemplates.length) {
      const currentTemplateData = coachTemplates.find(
        (template) => template.id === selectedCoachTemplate
      );
      setTemplateEditName(currentTemplateData?.name || "");
      if (currentTemplateData?.length) {
        const tranformData = currentTemplateData.map((item) => ({
          id: item.id,
          module_name: item.module_name,
          is_active: item.is_active,
          activities: item.activities.map((property) => ({
            id: property.id,
            "Activity Name": property.activity_name,
            "Due Date": property.due_date,
            Activity: property.activity_type.type_name,
            Points: property.points,
            Prerequisites: "Activity 1, Activity 2",
            "After Due Date": property.after_due_date,
            is_active: property.is_active,
          })),
        }));
        setModulesData1(tranformData);
      }
    }
  }, [coachTemplates, selectedCoachTemplate]);

  const handleModule = () => {
    if (newlyCreateTemplate) {
      dispatch(setSelectedCoachTemplate(newlyCreateTemplate.data.id));
    }
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

  const handleAddModule = (moduleData) => {
    dispatch(createCoachTemplateModule({ ...moduleData, template_id: selectedCoachTemplate }));
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

  const dummyData = [];
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
  ];

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
      <TemplateModuleTable modulesData={dummyData} />
      {openModulePopUp && (
        <AddModule selectedTemplateId={selectedCoachTemplate} />
      )}
      {openActivityPopUp && <AddActivity />}
      {openEditModulePopup && <EditModule />}
    </>
  );
};

export default TemplateName;
