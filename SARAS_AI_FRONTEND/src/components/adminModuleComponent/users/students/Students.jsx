import React, { useState, useEffect } from 'react';
import {
    studentsApi,
    useGetStudentsQuery,
} from '../../../../redux/services/students/studentsApi'; // Import your API hook
import { Box } from '@mui/material';
import Header from '../../../Header/Header';
import Sidebar from '../../../Sidebar/Sidebar';
import { studentDummyDatadata } from '../../../../fakeData/studentData';
import DynamicTable from '../../../CommonComponent/DynamicTable';
import { useDispatch } from 'react-redux';

const Students = () => {
    const dispatch = useDispatch();
    const [input, setInput] = useState('');
    const [students, setStudents] = useState([]);

    const handleChange = value => {
        setInput(value);
    };

    const useDummyData = false;

    const { data: apiData, error, isLoading } = useGetStudentsQuery();

    useEffect(() => {
        if (apiData && apiData.length > 0) {
            const transformedData = apiData.map((item, index) => ({
                id: item.student_id,
                'Student Name': item.student_name,
                'Enrollment Id': item.enrollment_id,
                Program:
                    item.packages.map(pack => pack.name).join(',') || 'N/A',
                Batch:
                    item.batches.map(batch => batch.batch_name).join(', ') ||
                    'N/A',
            }));
            setStudents(transformedData);
        } else {
            setStudents([]);
        }
    }, [apiData]);

    // if (isLoading) {
    //     return <div>Loading....</div>;
    // }

    const headers = [
        'S. No.',
        'Student Name',
        'Enrollment Id',
        'Program',
        'Batch',
    ];

    // Filter students based on the search input
    const filteredStudents = students.filter(student =>
        student['Student Name'].toLowerCase().includes(input.toLowerCase())
    );

    return (
        <>
            <Header />
            <Sidebar />
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                marginTop={3}
                alignItems={'center'}
            >
                <p
                    style={{
                        fontFamily: 'ExtraLight',
                        fontSize: '40px',
                        justifyContent: 'center',
                        lineHeight: '40.18px',
                    }}
                >
                    Students
                </p>
                <div className="inputBtnContainer">
                    <div className="inputContainer">
                        <input
                            className="inputField"
                            placeholder="Search Here ..."
                            value={input}
                            onChange={e => handleChange(e.target.value)}
                        />
                    </div>
                </div>
            </Box>
            <DynamicTable
                headers={headers}
                initialData={filteredStudents}
                componentName={'STUDENTS'}
            />
        </>
    );
};

export default Students;
