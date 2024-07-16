import React from "react";
import AddEditTA from "../../components/adminModule/tas/manageTAs/AddEditTA";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Box } from "@mui/material";

const CreateTAPage = () => {
  return (
    <>
      <Box m={"10px"} >
        <Header />
        <Sidebar />
        <AddEditTA />
      </Box>
    </>
  );
};

export default CreateTAPage;
