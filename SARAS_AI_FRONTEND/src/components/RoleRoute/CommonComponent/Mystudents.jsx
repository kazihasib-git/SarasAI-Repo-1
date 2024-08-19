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
        if(role=='TA'){
            if (myStudentData) {
                console.log('myStudentData', myStudentData);
                const transformedData = Object.values(myStudentData).map(item => ({
                    id: item.Student_Id,
                    Name: item.Student_Name,
                    Program: item.Program,
                    Batch: item.Batch,
                    'Live Sessions Scheduled': item.Live_Sessions_Scheduled,
                    'Live Sessions Attended': item.Live_Sessions_Attended, 
                }));
                setStudents(transformedData);
            }
        }else{
            if (myStudentData) {
                console.log('myStudentData', myStudentData);
                const transformedData = Object.values(myStudentData).map(item => ({
                    id: item.Student_Id,
                    Name: item.Student_Name,
                    Program: item.Program,
                    Batch: item.Batch,
                    'Activities Scheduled': '',
                    'Activities Completed': '',
                    'Due Dates Missed': '',  
                }));
                setStudents(transformedData);
            }
        }
        
    }, [myStudentData]);

    let headers = [];

    if(role === 'TA') {
        headers = [
            'S.No',
            'Student Name',
            'Program',
            'Batch',
            'Live Sessions Scheduled',
            'Live Sessions Attended',
            'Status',
        ];
    }else{
        headers = [
            'S.No',
            'Student Name',
            'Program',
            'Batch',
            'Activities Scheduled',
            'Activities Completed',
            'Due Dates Missed',
            'Status',
        ];
    }

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
                <p style={{fontFamily:'ExtraLight', fontSize:'40px', justifyContent: 'center' }}>
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
