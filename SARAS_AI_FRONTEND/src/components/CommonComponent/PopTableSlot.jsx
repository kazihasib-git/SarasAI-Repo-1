import React, { useEffect, useState } from 'react';
import {
    IconButton,
    Checkbox,
    Button,
    Pagination,
    DialogContent,
    Typography,
} from '@mui/material';
import './popUpTable.css';
import ReusableDialog from '../CustomFields/ReusableDialog';

const CustomButton = ({
    onClick,
    children,
    variant = 'contained',
    color = '#FFFFFF',
    backgroundColor = '#4E18A5',
    borderColor = '#FFFFFF',
    sx,
    ...props
}) => {
    const variantStyles = {
        contained: {
            backgroundColor: backgroundColor,
            color: color,
            border: `2px solid ${borderColor}`,
            '&:hover': {
                backgroundColor: color,
                color: backgroundColor,
                borderColor: borderColor,
            },
        },
        outlined: {
            backgroundColor: 'transparent',
            color: '#F56D38',
            border: '2px solid #F56D38',
            '&:hover': {
                backgroundColor: '#F56D38',
                color: '#FFFFFF',
            },
        },
        text: {
            backgroundColor: 'transparent',
            color: '#F56D38',
            '&:hover': {
                backgroundColor: '#F56D38',
                color: '#FFFFFF',
            },
        },
    };

    return (
        <Button
            onClick={onClick}
            variant={variant}
            sx={{
                ...variantStyles[variant],
                fontWeight: '700',
                fontSize: '16px',
                borderRadius: '50px',
                padding: '10px 20px',
                textTransform: 'none',
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

const studentHeader = ['S. No.', 'Student Name', 'Program', 'Batch'];

const PopTableSlot = ({
    headers,
    initialData,
    onRowClick,
    selectedBox: initialSelectedBox = [],
    onViewClick,
    onRescheduleClick,
    onCancelClick,
    itemsPerPage = 10,
}) => {
    const [data, setData] = useState(initialData ?? []);
    const [openPopup, setOpenPopup] = useState(false);
    const [currentStudentNames, setCurrentStudentNames] = useState([]);
    const [showStudentDetails, setShowStudentDetails] = useState(false);
    const [studentDetailsData, setStudentDetailsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBox, setSelectedBox] = useState(initialSelectedBox);

    useEffect(() => {
        setData(initialData ?? []);
    }, [initialData]);

    const handleCheckboxChange = uniqueKey => {
        const id = uniqueKey.split('-')[0];

        if (selectedBox.includes(uniqueKey)) {
            // Remove from selectedBox if already selected
            setSelectedBox(selectedBox.filter(key => key !== uniqueKey));
        } else {
            // Add to selectedBox if not selected
            setSelectedBox([...selectedBox, uniqueKey]);
        }

        onRowClick(id); // Trigger the row click handler
    };

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleViewClick = studentList => {
        setCurrentStudentNames(studentList);
        setOpenPopup(true);
    };

    const handleStudentDetailsClick = student => {
        if (student.StudentList && student.StudentList.length > 0) {
            const studentDetails = student.StudentList.map((batch, index) => ({
                'S. No.': index + 1,
                'Student Name': batch.student_name,
                Program:
                    batch.packages.map(pack => pack.name).join(', ') || 'N/A',
                Batch:
                    batch.batches.map(bth => bth.batch_name).join(', ') ||
                    'N/A',
            }));
            setStudentDetailsData(studentDetails);
        }
        setShowStudentDetails(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setShowStudentDetails(false);
    };

    const handlePageChange = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const content =
        studentDetailsData.length === 0 ? (
            <DialogContent
                style={{ justifyContent: 'center', display: 'flex' }}
            >
                <Typography>No scheduled sessions.</Typography>
            </DialogContent>
        ) : (
            <PopTableSlot
                headers={studentHeader}
                initialData={studentDetailsData}
                onRowClick={() => {}}
                itemsPerPage={4}
            />
        );

    return (
        <>
            {showStudentDetails ? (
                <ReusableDialog
                    open={showStudentDetails}
                    handleClose={handleClosePopup}
                    title="Student Details"
                    content={content}
                />
            ) : (
                <>
                    <div className="table-container popUpModel">
                        <table>
                            <thead>
                                <tr>
                                    {headers.map((header, index) => (
                                        <th key={index}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="popUpBody">
                                {currentData && currentData.length > 0 ? (
                                    currentData.map((item, index) => (
                                        <tr
                                            key={`${item.id}-${index}`}
                                            id="popUpRow"
                                        >
                                            {headers.map((header, idx) => (
                                                <td key={idx}>
                                                    {header === 'Select' ? (
                                                        <Checkbox
                                                            checked={selectedBox.includes(
                                                                `${item.id}-${index}`
                                                            )}
                                                            onChange={() =>
                                                                handleCheckboxChange(
                                                                    `${item.id}-${index}`
                                                                )
                                                            }
                                                            sx={{
                                                                '& .MuiSvgIcon-root':
                                                                    {
                                                                        color: '#C2C2E7',
                                                                    },
                                                            }}
                                                            inputProps={{
                                                                'aria-label':
                                                                    'select all',
                                                            }}
                                                        />
                                                    ) : header === 'Actions' ? (
                                                        <div>
                                                            <CustomButton
                                                                backgroundColor="#F56D38"
                                                                color="#FFFFFF"
                                                                borderColor="#F56D38"
                                                                variant="contained"
                                                                onClick={() =>
                                                                    onRescheduleClick(
                                                                        item
                                                                    )
                                                                }
                                                                style={{
                                                                    textTransform:
                                                                        'none',
                                                                    padding:
                                                                        '4px 8px',
                                                                    fontSize:
                                                                        '0.875rem',
                                                                    minWidth:
                                                                        'auto',
                                                                }}
                                                            >
                                                                Reschedule
                                                            </CustomButton>
                                                            <div
                                                                style={{
                                                                    textDecoration:
                                                                        'underline',
                                                                    cursor: 'pointer',
                                                                    marginTop:
                                                                        '4px',
                                                                    color: '#F56D3B',
                                                                    fontSize:
                                                                        '0.570rem',
                                                                }}
                                                                onClick={() =>
                                                                    onCancelClick(
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                Cancel
                                                            </div>
                                                        </div>
                                                    ) : header ===
                                                      'Students' ? (
                                                        <>
                                                            {item.Students}
                                                            <CustomButton
                                                                variant="outlined"
                                                                backgroundColor="#FFFFFF"
                                                                borderColor="#F56D38"
                                                                color="#F56D38"
                                                                padding="4px 16px"
                                                                onClick={() =>
                                                                    handleStudentDetailsClick(
                                                                        item
                                                                    )
                                                                }
                                                                style={{
                                                                    textTransform:
                                                                        'none',
                                                                    padding:
                                                                        '4px 16px',
                                                                    marginBottom:
                                                                        '15px',
                                                                    fontSize:
                                                                        '0.875rem',
                                                                    minWidth:
                                                                        'auto',
                                                                }}
                                                            >
                                                                View
                                                            </CustomButton>
                                                        </>
                                                    ) : header === 'S. No.' ? (
                                                        (currentPage - 1) *
                                                            itemsPerPage +
                                                        index +
                                                        1
                                                    ) : typeof item[header] ===
                                                      'object' ? (
                                                        JSON.stringify(
                                                            item[header]
                                                        )
                                                    ) : (
                                                        (item[header] ?? 'N/A')
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr id="popUpRow">
                                        <td
                                            colSpan={headers.length}
                                            style={{ textAlign: 'center' }}
                                        >
                                            No Data Available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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
                                    transition:
                                        'background-color 0.3s, transform 0.3s',
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
                </>
            )}
        </>
    );
};

export default PopTableSlot;
