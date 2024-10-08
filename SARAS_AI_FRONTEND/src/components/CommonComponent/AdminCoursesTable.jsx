import React, { useEffect, useState } from 'react';
import { Checkbox, Box, Pagination, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    getAllCoursesWithTas,
    assignCourseToTa,
} from '../../redux/features/adminModule/ta/taSlice';
import { toast } from 'react-toastify';
import CustomButton from '../CustomFields/CustomButton';
const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
    color: '#F56D3B',
    '&.Mui-checked': {
        color: '#F56D3B',
    },
}));

const AdminCoursesTable = ({ taId }) => {
    const headers = [
        'Sr. No.',
        'Course Name',
        'Description',
        'Start Date',
        'End Date',
        'Assigned',
    ];
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [selectedCourses, setSelectedCourses] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { allCoursesWithTas } = useSelector(state => state.taModule);

    useEffect(() => {
        dispatch(getAllCoursesWithTas());
    }, [dispatch]);

    useEffect(() => {
        if (allCoursesWithTas && allCoursesWithTas.length > 0) {
            setData(allCoursesWithTas);

            // Update selectedCourses with course IDs where taId is present in tas
            const updatedSelectedCourses = allCoursesWithTas
                .filter(course =>
                    course.tas.some(ta => ta.id === parseInt(taId, 10))
                )
                .map(course => parseInt(course.id, 10));

            setSelectedCourses(updatedSelectedCourses);
        } else {
            setData([]);
            setSelectedCourses([]); // Clear selectedCourses if there are no courses
        }
    }, [allCoursesWithTas, taId]);

    const totalPages = Math.ceil(data?.length / itemsPerPage);
    const currentData = data?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleClick = courseId => {
        const updatedData = data.map(item => {
            if (item.id === courseId) {
                const taExists = item.tas.some(
                    ta => parseInt(ta.id, 10) === parseInt(taId, 10)
                ); // Compare as integers

                return {
                    ...item,
                    tas: taExists
                        ? item.tas.filter(
                              ta => parseInt(ta.id, 10) !== parseInt(taId, 10)
                          ) // Remove TA if exists
                        : [...item.tas, { id: parseInt(taId, 10) }], // Add TA if it doesn't exist
                };
            }
            return item;
        });

        setData(updatedData);
        setSelectedCourses(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    const handleSubmit = () => {
        const assignedCourses = selectedCourses.map(courseId => ({
            id: courseId,
        }));

        const requestData = {
            ta_id: taId,
            courses: assignedCourses,
        };

        // Dispatch the API call to assign/unassign the ta to/from the courses
        dispatch(assignCourseToTa(requestData))
            .unwrap()
            .then(response => {
                console.log('Course assigned successfully:', response);
            })
            .catch(error => {
                console.error('Failed to assign course:', error);
            });
        navigate('/ta-course-mapping'); // Navigate to the desired page
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
                            <th
                                key={index}
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #ddd',
                                }}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="commonTableBody">
                    {currentData.map((item, index) => (
                        <tr
                            key={item.id}
                            id="commonTableRow"
                            style={{ textAlign: 'center' }}
                        >
                            <td
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #ddd',
                                }}
                            >
                                {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #ddd',
                                }}
                            >
                                {item.name}
                            </td>
                            <td
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #ddd',
                                }}
                            >
                                {item.description}
                            </td>
                            <td
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #ddd',
                                }}
                            >
                                {new Date(item.start_date).toLocaleDateString()}
                            </td>
                            <td
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #ddd',
                                }}
                            >
                                {new Date(item.end_date).toLocaleDateString()}
                            </td>
                            <td
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #ddd',
                                }}
                            >
                                {item.tas.find(i => i.id == taId) != null ? (
                                    <CustomCheckbox
                                        checked={
                                            item.tas.find(i => i.id == taId) !=
                                            null
                                        }
                                        onChange={() => handleClick(item.id)}
                                    />
                                ) : (
                                    <CustomCheckbox
                                        checked={item.tas.includes(taId)}
                                        onChange={() => handleClick(item.id)}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div
                className="pagination"
                style={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
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
            <div className="mb-1">
                <CustomButton
                    type="submit"
                    // form="createForm"
                    backgroundColor="#F56D3B"
                    color="white"
                    borderColor="#F56D3B"
                    onClick={handleSubmit}
                    style={{ textTransform: 'none' }}
                >
                    Submit
                </CustomButton>
            </div>
        </div>
    );
};

export default AdminCoursesTable;
