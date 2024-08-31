import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { useParams } from 'react-router-dom';
import AdminCoursesTable from '../../../components/CommonComponent/AdminCoursesTable';

const AssignTaCourses = () => {
    const { id } = useParams();

    return (
        <>
            <Header />
            <Sidebar />
            <AdminCoursesTable
                taId={id}
            />
        </>
    );
};

export default AssignTaCourses;
