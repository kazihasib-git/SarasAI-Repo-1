import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useParams } from 'react-router-dom';
import AdminCoursesTable from '../../components/CommonComponent/AdminCoursesTable';

const AssignCoachCourses = () => {
    const { id } = useParams();

    return (
        <>
            <Header />
            <Sidebar />
            <AdminCoursesTable coachId={id} />
        </>
    );
};

export default AssignCoachCourses;
