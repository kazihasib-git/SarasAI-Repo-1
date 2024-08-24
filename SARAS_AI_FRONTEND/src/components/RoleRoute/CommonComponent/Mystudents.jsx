import React, { useState, useEffect } from 'react';
// import { useGetStudentsQuery } from '../../../redux/services/students/studentsApi'; // Import your API hook
import { Box } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import DynamicTable from '../../CommonComponent/DynamicTable';
import { getMyStudents } from '../../../redux/features/taModule/tamenuSlice';

const Mystudents = ({ role }) => {
    const [input, setInput] = useState('');
    const [students, setStudents] = useState([]);

    const handleChange = value => {
        setInput(value);
    };

    const { myStudentData } = useSelector(state =>
        role === 'TA' ? state.taMenu : state.coachMenu
    );

    // useEffect(() => {
    //     dispatch(getMyStudents());
    // }, []);

    useEffect(() => {
        if (role === 'TA') {
            if (myStudentData) {
                console.log('myStudentData', myStudentData);
                const transformedData = Object.values(myStudentData).map(
                    item => ({
                        id: item.Student_Id,
                        Name: item.Student_Name,
                        Program: item.Program,
                        Batch: item.Batch,
                        'Live Sessions Scheduled': item.Live_Sessions_Scheduled,
                        'Live Sessions Attended': item.Live_Sessions_Attended,
                    })
                );
                setStudents(transformedData);
            }
        } else if (role === 'Coach') {
            if (myStudentData) {
                console.log('myStudentData', myStudentData);
                const transformedData = myStudentData.map(student => {
                    // Extract package names
                    const packageNames = student.packages
                        .map(pkg => pkg.package_name)
                        .join(', ');

                    // Extract batch names
                    const batchNames = student.student_batch_mappings
                        .map(mapping => mapping.batch.name)
                        .join(', ');

                    // Count the number of activities
                    // Assuming you have multiple modules within a template
                    const activitiesScheduled = student.coachingtemplate.reduce((count, template) => {
                        return count + template.modules.reduce((moduleCount, module) => {
                            console.log(`Module ${module.module_name} has ${module.activities.length} activities.`);
                            return moduleCount + module.activities.length;
                        }, 0);
                    }, 0);
                    console.log(`Total activities scheduled: ${activitiesScheduled}`);
                    

                    // Set default values for Activities Completed and Due Dates Missed
                    const activitiesCompleted = 0;
                    const dueDatesMissed = 0;

                    return {
                        id: student.id,
                        Name: student.name,
                        Program: packageNames,
                        Batch: batchNames,
                        'Activities Scheduled': activitiesScheduled,
                        'Activities Completed': activitiesCompleted,
                        'Due Dates Missed': dueDatesMissed,
                    };
                });
                setStudents(transformedData);
            }
        }
    }, [myStudentData, role]); // Include role in dependencies to handle role change

    let headers = [];

    if (role === 'TA') {
        headers = [
            'S.No',
            'Student Name',
            'Program',
            'Batch',
            'Live Sessions Scheduled',
            'Live Sessions Attended',
            'Status',
        ];
    } else {
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

    // const actionButtons = [
    //     {
    //         type: 'view',
    //         onClick: student => {
    //             navigate(`/student-detail/${student.id}`, {
    //                 state: { student },
    //             });
    //         },
    //     },
    // ];
    const actionButtons = [
        {
            type: 'view',
            onClick: () => {},
            disabled: true,
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
                <p
                    style={{
                        fontFamily: 'ExtraLight',
                        fontSize: '40px',
                        justifyContent: 'center',
                    }}
                >
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
