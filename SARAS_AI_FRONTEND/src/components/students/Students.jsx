import React, { useState, useEffect } from 'react';
import { useGetStudentsQuery } from '../../redux/services/students/studentsApi'; // Import your API hook
import { Box } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { studentDummyDatadata } from '../../fakeData/studentData';

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
                ID: item.id,
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

    const DynamicTable = ({ headers, initialData }) => {
        const [data, setData] = useState(initialData.map(item => ({ ...item })));
        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 10;
        const totalPages = Math.ceil(data.length / itemsPerPage);
        const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
        const navigate = useNavigate();

        const handlePageChange = (event, pageNumber) => {
            setCurrentPage(pageNumber);
        };

        return (
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={item.ID}>
                                {headers.map((header, idx) => (
                                    <td key={idx}>{item[header]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        color="primary"
                        sx={{
                            width: '65vw',
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '20px',
                            '.MuiPaginationItem-root': {
                                backgroundColor: '#fff',
                                border: '1px solid #ddd',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.3s, transform 0.3s',
                                '&:hover': {
                                    backgroundColor: '#DFDFF4',
                                    transform: 'scale(1.1)',
                                },
                                '&.Mui-selected': {
                                    backgroundColor: '#F56D3B',
                                    color: '#fff',
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: '#DFDFF4',
                                    cursor: 'not-allowed',
                                },
                            },
                        }}
                    />
                </div>
            </div>
        );
    };

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
            />
        </>
    );
};

export default Students;
