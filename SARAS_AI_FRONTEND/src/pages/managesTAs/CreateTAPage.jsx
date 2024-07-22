import React from 'react';
import AddEditTA from '../../components/adminModule/tas/manageTAs/AddEditTA';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Box } from '@mui/material';

const CreateTAPage = () => {
    return (
        <>
            <Header />
            <Sidebar />
            <AddEditTA />
        </>
    );
};

export default CreateTAPage;
