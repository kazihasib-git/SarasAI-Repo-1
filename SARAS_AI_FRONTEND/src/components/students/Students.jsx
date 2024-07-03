import React, { useState, useEffect } from 'react';
import { useGetStudentsQuery } from '../../redux/services/students/studentsApi'; // Import your API hook
import { Box } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { studentDummyDatadata } from '../../fakeData/studentData';
import DynamicTable from '../CommonComponent/DynamicTable';

const Students = () => {
    const [input, setInput] = useState('');
    const [students, setStudents] = useState([]);

    const handleChange = (value) => {
        setInput(value);
    };

    // Flag to use dummy data or API data
    const useDummyData = true;

    const { data: apiData, error, isLoading } = useGetStudentsQuery();

    useEffect(() => {
        console.log("DATA : ",apiData)
        const dataToUse = useDummyData ? studentDummyDatadata : apiData;
        if (dataToUse) {
            const transformedData = dataToUse.map(item => ({
                id: item.id,
                Name: item.name,
                User: item.user_id,
                Email: item.email,
                'Phone Number': item.phone,
            }));
            setStudents(transformedData);
        }
    }, [apiData, useDummyData]);

    if (isLoading) {
        return <div>Loading....</div>;
    }

    // if (error && !useDummyData) {
    //     return <div>Error Loading students</div>;
    // }

    const headers = ['ID',  'Name', 'User', 'Email', 'Phone Number'];

    return (
        <>
            <Header />
            <Sidebar />
            <Box display={"flex"} justifyContent={"space-between"} marginTop={3} alignItems={"center"}>
                <p style={{ fontSize: "44px", justifyContent: "center" }}>Students</p>
                <div className='inputBtnContainer'>
                    <div className="inputContainer">
                        <input className="inputField" placeholder="Search Here ..." value={input} onChange={(e) => handleChange(e.target.value)} />
                    </div>
                </div>
            </Box>
            <DynamicTable
                headers={headers}
                initialData={students}
                componentName={"STUDENTS"}
            />
        </>
    );
};

export default Students;
