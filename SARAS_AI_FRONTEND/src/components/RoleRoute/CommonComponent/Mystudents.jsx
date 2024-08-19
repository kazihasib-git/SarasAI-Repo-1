import React, { useState, useEffect } from 'react';
// import { useGetStudentsQuery } from '../../../redux/services/students/studentsApi'; // Import your API hook
import { Box } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import {useDispatch, useSelector} from 'react-redux';
import DynamicTable from '../../CommonComponent/DynamicTable';
import { getMyStudents } from '../../../redux/features/taModule/tamenuSlice';

const Mystudents = ({ role }) => {
    const dispatch = useDispatch();
    const [input, setInput] = useState('');
    const [students, setStudents] = useState([]);

    const handleChange = value => {
        setInput(value);
    };

    const { myStudentData }  = useSelector(state => state.taMenu);

    useEffect(() => {
        dispatch(getMyStudents());
    }, []);

    useEffect(() => {
        if (myStudentData) {
            console.log('myStudentData', myStudentData);
            const transformedData = Object.values(myStudentData).map(item => ({
                id: item.Student_Id,
                Name: item.Student_Name,
                Program: item.Program,
                Batch: item.Batch,
                'Activities Scheduled': item.Live_Sessions_Scheduled,
                'Activities Completed': item.Live_Sessions_Attended,
                'Due Dates Missed': '',  
            }));
            setStudents(transformedData);
        }
    }, [myStudentData]);

    // const headers = ['S.No', 'Student Name', 'Acadamic Term', 'Batch', 'Live Sesions Scheduled', 'Live Sessions Attended', 'Status'];
    const headers = [
        'S.No',
        'Student Name',
        'Program',
        'Batch',
        'Activities Scheduled',
        'Activities Completed',
        'Due Dates Missed',
        'Status',
    ];

    const actionButtons = [
        {
            type: 'view',
            onClick: student => {
                navigate(`/student-detail/${student.id}`, {
                    state: { student },
                });
            },
        },
    ];
    // Filter students based on the search input
    const filteredStudents = students;
    // .filter(student =>
    //     student.Name.toLowerCase().includes(input.toLowerCase())
    // );

    return (
        <>
            {/* <Header /> */}
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                marginTop={3}
                alignItems={'center'}
            >
                <p style={{ fontSize: '44px', justifyContent: 'center' }}>
                    My Students
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
                actionButtons={actionButtons}
                componentName={'MYSTUDENTS'}
            />
        </>
    );
};

export default Mystudents;
