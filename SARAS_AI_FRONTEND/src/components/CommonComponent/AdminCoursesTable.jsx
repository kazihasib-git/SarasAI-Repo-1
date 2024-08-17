import React, { useEffect, useState } from 'react';
import { Checkbox, Box, Pagination } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCoursesWithCoaches, assignCourseToCoach } from '../../redux/features/adminModule/coach/coachSlice';

const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    color: '#F56D3B',
    '&.Mui-checked': {
        color: '#F56D3B',
    },
}));

const AdminCoursesTable = ({ coachId }) => {
    const headers = ['Sr. No.', 'Course Name', 'Description', 'Start Date', 'End Date', 'Assigned'];
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const dispatch = useDispatch();

    const { allCoursesWithCoaches } = useSelector(
        state => state.coachModule
    );

    useEffect(() => {
        dispatch(getAllCoursesWithCoaches());
    }, [dispatch]);

    useEffect(() => {
        setData(allCoursesWithCoaches);
    }, [allCoursesWithCoaches]);

    const handlePageChange = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleClick = (courseId) => {
        const updatedData = data.map(item =>
            item.id === courseId
                ? {
                    ...item,
                    coaches: item.coaches.includes(coachId)
                        ? item.coaches.filter(c => c !== coachId)
                        : [...item.coaches, coachId],
                }
                : item
        );
    
        setData(updatedData);
    
        const assignedCourses = updatedData
            .filter(item => item.coaches.includes(coachId))
            .map(item => ({ id: item.id }));
    
        const requestData = {
            Coach_id: coachId,
            courses: assignedCourses,
        };
    
        console.log(requestData);
    
        // Dispatch the API call to assign/unassign the coach to/from the course
        //dispatch(assignCourseToCoach(requestData));
    };

    return (
        <div className="table-container">
            <Box display={'flex'} justifyContent={'space-between'}>
                <p
                    style={{
                        fontSize: '44px',
                        fontFamily: 'ExtraLight',
                    }}
                >
                    Assigned Courses
                </p>
            </Box>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead className="commonTableHead">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="commonTableBody">
                    {currentData.map((item, index) => (
                        <tr key={item.id} id="commonTableRow" style={{ textAlign: 'center' }}>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.name}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{item.description}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                {new Date(item.start_date).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                {new Date(item.end_date).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                <CustomCheckbox
                                    checked={item.coaches.includes(coachId)}
                                    onChange={() => handleClick(item.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    variant="outlined"
                    color="primary"
                    sx={{
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

export default AdminCoursesTable;
