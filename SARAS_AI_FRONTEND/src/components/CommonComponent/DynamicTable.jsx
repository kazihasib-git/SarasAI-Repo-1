import React, { useEffect, useState } from 'react';
import {
    Button,
    IconButton,
    Switch,
    Pagination,
    Box,
    Checkbox,
    Modal,
    Grid,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import { styled } from '@mui/material/styles';
import './DynamicTable.css';
import { useNavigate } from 'react-router-dom';
import editIcon from '../../assets/editIcon.png';
import bin from '../../assets/bin.png';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useDispatch } from 'react-redux';
import {
    activeDeactiveWOLCategory,
    toggleWOLQuestionStatus,
    updateWOLQuestion,
} from '../../redux/features/adminModule/coachingTools/wol/wolSlice';
import { openScheduleSession } from '../../redux/features/adminModule/ta/taScheduling';
import { openDeleteTaSlots } from '../../redux/features/adminModule/ta/taAvialability';
import {
    updateTA,
    activate_deactive_TA,
} from '../../redux/features/adminModule/ta/taSlice';
import {
    activate_deactivate_Coach,
    updateCoach,
} from '../../redux/features/adminModule/coach/coachSlice';
import { openCoachScheduleSession } from '../../redux/features/adminModule/coach/coachSchedule';
import AssessmentDialog from '../../pages/MODULE/coachModule/AssessmentDialog';
import {
    deleteTaMapping,
    showTAMapping,
} from '../../redux/features/adminModule/ta/taSlice';
import {
    deleteCoachMapping,
    showCoachMapping,
} from '../../redux/features/adminModule/coach/coachSlice';
import DeleteConfirmation from './DeleteConfirmation';

const DynamicTable = ({
    headers,
    initialData,
    actionButtons,
    componentName,
}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const itemsPerPage = 10;

    const [data, setData] = useState(
        initialData.map(item => ({
            ...item,
            is_active: item.is_active !== undefined ? item.is_active : 0,
        }))
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [assessmentModalOpen, setassessmentModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [assessmentData, setAssessmentData] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [itemIdToDelete, setItemIdToDelete] = useState(null);

    useEffect(() => {
        setData(
            initialData.map(item => ({
                ...item,
                is_active: item.is_active !== undefined ? item.is_active : 0,
            }))
        );

        // Calculate new total pages
        const newTotalPages = Math.ceil(initialData.length / itemsPerPage);

        // Adjust current page if it's now out of bounds
        if (currentPage > newTotalPages) {
            setCurrentPage(Math.max(1, newTotalPages));
        }
    }, [initialData]);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (event, pageNumber) => {
        const maxPage = Math.ceil(data.length / itemsPerPage);
        setCurrentPage(Math.min(Math.max(1, pageNumber), maxPage));
    };
    const handleOpenDialog = itemId => {
        setItemIdToDelete(itemId);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setItemIdToDelete(null);
    };
    const handleConfirmDelete = id => {
        if (id) {
            handleDelete(id);
        }
        handleCloseDialog();
    };
    const handleDelete = id => {
        if (componentName === 'TAMAPPING') {
            dispatch(deleteTaMapping(id)).then(() => {
                dispatch(showTAMapping());
            });
        } else if (componentName === 'COACHMAPPING') {
            dispatch(deleteCoachMapping(id)).then(() => {
                dispatch(showCoachMapping());
            });
        }
    };

    const handleCalender = (type, id, taName, timezoneId) => {
        if (componentName === 'COACHAVAILABLE') {
            navigate(`/coach-calender/${taName}/${id}/${timezoneId}`);
        } else if (componentName === 'TAAVAILABLE')
            navigate(`/ta-calendar/${taName}/${id}/${timezoneId}`);
    };

    const handleView = (type, id) => {
        if (componentName === 'TAMAPPING' || componentName === 'TASCHEDULE') {
            if (type === 'students') {
                navigate(`/active-students/${id}`); // Append id as a parameter
            } else if (type === 'batches') {
                navigate(`/active-batches/${id}`); // Append id as a parameter
            } else if (type === 'view report') {
                navigate(`/view-report/${id}`); // Append id as a parameter
            }
        } else if (componentName === 'MYSTUDENTS') {
            const item = data.find(item => item.id === id);
            // setModalData(item);
            // setModalOpen(true);
            navigate(`/student_details/${id}`);
        } else if (componentName === 'ASSESSMENT') {
            const dummyAssessmentData = [
                {
                    name: 'Assessment 1',
                    status: 'Completed',
                    source: 'Wheel of Life',
                },
                {
                    name: 'Assessment 2',
                    status: 'Completed',
                    source: 'Wheel of Life',
                },
                {
                    name: 'Assessment 3',
                    status: 'In Progress',
                    source: 'Core Values',
                },
                {
                    name: 'Assessment 4',
                    status: 'Not Attempted',
                    source: 'Core Values II',
                },
            ];

            if (type === 'view report') {
                setAssessmentData(dummyAssessmentData);
                setassessmentModalOpen(true);
            }
        } else {
            if (
                componentName === 'COACHMAPPING' ||
                componentName === 'COACHSCHEDULE'
            ) {
                if (type === 'students') {
                    navigate(`/active-Coach-students/${id}`); // Append id as a parameter
                } else if (type === 'batches') {
                    navigate(`/active-Coach-batches/${id}`); // Append id as a parameter
                }
            } else if (componentName === 'COACHCOURSEMAPPING') {
                if (type === 'courses') {
                    navigate(`/active-Coach-courses/${id}`); // Append id as a parameter
                }
            } else if (componentName === 'TACOURSEMAPPING') {
                if (type === 'courses') {
                    navigate(`/active-Ta-courses/${id}`); // Append id as a parameter
                }
            }
        }
    };

    const handlePopup = (id, name, timezoneId) => {
        const data = { id, name, timezoneId };
        if (componentName === 'TASCHEDULE') {
            dispatch(openScheduleSession(data));
        } else {
            if (componentName === 'COACHSCHEDULE')
                dispatch(openCoachScheduleSession(data));
        }
    };

    const handleToggle = (id, event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const updatedData = data.map(item =>
            item.id === id
                ? { ...item, is_active: item.is_active === 1 ? 0 : 1 }
                : item
        );

        setData(updatedData);
        // const toggleButton = actionButtons.find(
        //     action => action.type === 'switch'
        // );
        // if (toggleButton && toggleButton.onChange) {
        //     toggleButton.onChange(id);
        // }

        const toggledItem = updatedData.find(item => item.id === id);
        const requestData = { is_active: toggledItem.is_active };

        switch (componentName) {
            case 'MANAGETA':
                dispatch(activate_deactive_TA({ id }));
                break;

            case 'MANAGECOACH':
                dispatch(activate_deactivate_Coach({ id }));
                break;

            case 'WOLCATEGORY':
                dispatch(activeDeactiveWOLCategory(id));
                break;

            case 'WOLQUESTION':
                dispatch(toggleWOLQuestionStatus(id));
                break;

            default:
                console.warn(
                    `No API call defined for component: ${componentName}`
                );
                break;
        }
    };

    const getColorForAvailability = availability => {
        switch (availability) {
            case 'Available':
                return '#00C808';
            case 'On leave':
                return '#F48606';
            case 'Leave':
                return '#F48606';
            case 'In active':
                return '#060FDD';
            case 'Active':
                return '#06DD0F';
            default:
                return '#000000';
        }
    };
    const handleCloseModal = () => {
        setModalOpen(false);
        setModalData(null);
    };

    return (
        <div className="tableContainer">
            <table>
                <thead className="tableHead">
                    <tr>
                        {headers.map(
                            (header, index) =>
                                header !== 'timezone' && (
                                    <th key={index}>{header}</th>
                                )
                        )}
                    </tr>
                </thead>
                <tbody className="tableBody">
                    {currentData.length === 0 ? (
                        <tr>
                            <td
                                colSpan={headers.length}
                                style={{ textAlign: 'center' }}
                            >
                                No Data Available
                            </td>
                        </tr>
                    ) : (
                        currentData.map((item, index) => (
                            <tr key={item.id} id="tableRow">
                                <td>
                                    {(currentPage - 1) * itemsPerPage +
                                        index +
                                        1}
                                </td>
                                {Object.keys(item).map((key, idx) => {
                                    if (key === 'Availability') {
                                        return (
                                            <td
                                                key={idx}
                                                style={{
                                                    color: getColorForAvailability(
                                                        item[key]
                                                    ),
                                                    fontFamily: 'Regular',
                                                    letterSpacing: '0.8px',
                                                }}
                                            >
                                                {item[key]}
                                            </td>
                                        );
                                    } else if (key === 'Active_Students') {
                                        return (
                                            <td key={idx}>
                                                {item[key]}{' '}
                                                <CustomButton
                                                    variant="outlined"
                                                    color="secondary"
                                                    endIcon={
                                                        <CallMadeOutlinedIcon />
                                                    }
                                                    onClick={() =>
                                                        handleView(
                                                            'students',
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    View
                                                </CustomButton>
                                            </td>
                                        );
                                    } else if (key === 'Active_Batches') {
                                        return (
                                            <td key={idx}>
                                                {item[key]}{' '}
                                                <CustomButton
                                                    variant="outlined"
                                                    color="secondary"
                                                    endIcon={
                                                        <CallMadeOutlinedIcon />
                                                    }
                                                    onClick={() =>
                                                        handleView(
                                                            'batches',
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    View
                                                </CustomButton>
                                            </td>
                                        );
                                    } else if (key === 'Active_Courses') {
                                        return (
                                            <td key={idx}>
                                                {item[key]}{' '}
                                                <CustomButton
                                                    variant="outlined"
                                                    color="secondary"
                                                    endIcon={
                                                        <CallMadeOutlinedIcon />
                                                    }
                                                    onClick={() =>
                                                        handleView(
                                                            'courses',
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    View
                                                </CustomButton>
                                            </td>
                                        );
                                    } else if (
                                        key !== 'id' &&
                                        key !== 'is_active' &&
                                        key !== 'timezone' &&
                                        key !== 'timezoneId'
                                    ) {
                                        // Check if item[key] is an object, and handle accordingly
                                        if (
                                            typeof item[key] === 'object' &&
                                            item[key] !== null
                                        ) {
                                            // Render a string representation or a relevant property of the object
                                            return (
                                                <td key={idx}>
                                                    {JSON.stringify(item[key])}
                                                </td>
                                            );
                                        } else {
                                            return (
                                                <td key={idx}>{item[key]}</td>
                                            );
                                        }
                                    }
                                    return null; // Ensure all paths return a value
                                })}

                                {actionButtons && (
                                    <td
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            verticalAlign: 'middle',
                                        }}
                                    >
                                        {actionButtons.map((button, idx) => {
                                            if (button.type === 'switch') {
                                                return (
                                                    <AntSwitch
                                                        key={idx}
                                                        checked={item.is_active}
                                                        onChange={() =>
                                                            handleToggle(
                                                                item.id
                                                            )
                                                        }
                                                        inputProps={{
                                                            'aria-label':
                                                                'ant design',
                                                        }}
                                                    />
                                                );
                                            }
                                            if (button.type === 'edit') {
                                                return (
                                                    <IconButton
                                                        key={idx}
                                                        color="primary"
                                                        sx={{
                                                            marginLeft: '10px',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            justifyContent:
                                                                'center',
                                                            color: '#F56D3B',
                                                            backgroundColor:
                                                                '#FEEBE3',
                                                            gap: '4px',
                                                            height: '30px',
                                                            width: '70px',
                                                            borderRadius:
                                                                '15px',
                                                            padding: '5px',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    'rgba(245, 235, 227, 0.8)',
                                                            },
                                                            '& img': {
                                                                height: '16px', // adjust size as needed
                                                                width: '16px', // adjust size as needed
                                                            },
                                                            '& small': {
                                                                lineHeight:
                                                                    '16px', // match this with the image height for better alignment
                                                            },
                                                        }}
                                                        onClick={() =>
                                                            button.onClick(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        <img
                                                            src={editIcon}
                                                            alt=""
                                                        />
                                                        <small
                                                            style={{
                                                                fontSize:
                                                                    '14px',
                                                            }}
                                                        >
                                                            Edit
                                                        </small>
                                                    </IconButton>
                                                );
                                            }
                                            if (button.type === 'delete') {
                                                return (
                                                    <>
                                                        <IconButton
                                                            key={idx}
                                                            color="primary"
                                                            // onClick={() =>
                                                            //     handleDelete(
                                                            //         item.id
                                                            //     )
                                                            // }
                                                            onClick={() =>
                                                                handleOpenDialog(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={bin}
                                                                alt=""
                                                                style={{
                                                                    width: '20px',
                                                                    height: '20px',
                                                                }}
                                                            />
                                                        </IconButton>
                                                    </>
                                                );
                                            }
                                            if (button.type === 'calendar') {
                                                return (
                                                    <CalenderButton
                                                        key={idx}
                                                        variant="outlined"
                                                        color="secondary"
                                                        startIcon={
                                                            <CalendarMonthIcon />
                                                        }
                                                        onClick={() =>
                                                            handlePopup(
                                                                item.id,
                                                                item.name,
                                                                item.timezoneId
                                                            )
                                                        }
                                                    >
                                                        Schedule
                                                    </CalenderButton>
                                                );
                                            }
                                            if (button.type === 'calender') {
                                                return (
                                                    <td key={idx}>
                                                        <CustomButton
                                                            variant="outlined"
                                                            color="secondary"
                                                            endIcon={
                                                                <CallMadeOutlinedIcon />
                                                            }
                                                            onClick={() =>
                                                                handleCalender(
                                                                    'Calendar',
                                                                    item.id,
                                                                    item.taName,
                                                                    item.timezoneId
                                                                )
                                                            }
                                                        >
                                                            Check
                                                        </CustomButton>
                                                    </td>
                                                );
                                            }

                                            if (button.type === 'view') {
                                                return (
                                                    <CustomButton
                                                        key={idx}
                                                        variant="outlined"
                                                        color="secondary"
                                                        endIcon={
                                                            <CallMadeOutlinedIcon />
                                                        }
                                                        onClick={() =>
                                                            handleView(
                                                                'view report',
                                                                item.id
                                                            )
                                                        }
                                                        disabled={
                                                            actionButtons.find(
                                                                button =>
                                                                    button.type ===
                                                                    'view'
                                                            ).disabled
                                                        }
                                                    >
                                                        View
                                                    </CustomButton>
                                                );
                                            }
                                            return null; // Handle unexpected button types gracefully
                                        })}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
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
            {/* Modal Component */}
            {assessmentModalOpen && (
                <AssessmentDialog
                    open={assessmentModalOpen}
                    onClose={() => setassessmentModalOpen(false)}
                    assessmentData={assessmentData}
                />
            )}
            {isDialogOpen && (
                <DeleteConfirmation
                    open={isDialogOpen}
                    handleClose={handleCloseDialog}
                    onConfirm={() => {
                        handleConfirmDelete(itemIdToDelete);
                    }}
                />
            )}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <IconButton
                        sx={{ alignSelf: 'flex-end' }}
                        onClick={handleCloseModal}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography id="modal-title" variant="h6" component="h2">
                        View Detail
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 4,
                                    backgroundColor: '#edf0f0',
                                }}
                            >
                                <div>
                                    <h5>Student Name</h5>
                                    <h6 style={{ textAlign: 'center' }}>
                                        Ankit Sharma
                                    </h6>
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 4,
                                    backgroundColor: '#edf0f0',
                                }}
                            >
                                <div>
                                    <h5>Academic Term</h5>
                                    <h6 style={{ textAlign: 'center' }}>
                                        Lorem Ipsum
                                    </h6>
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 4,
                                    backgroundColor: '#edf0f0',
                                }}
                            >
                                <div>
                                    <h5>Batch</h5>
                                    <h6 style={{ textAlign: 'center' }}>
                                        Batch 1
                                    </h6>
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 4,
                                    backgroundColor: '#edf0f0',
                                }}
                            >
                                <div>
                                    <h5>Activities Scheduled</h5>
                                    <h6 style={{ textAlign: 'center' }}>
                                        Friday June 21, 11:00 to 11:30 AM
                                    </h6>
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 4,
                                    backgroundColor: '#edf0f0',
                                }}
                            >
                                <div>
                                    <h5>Student Name</h5>
                                    <h6 style={{ textAlign: 'center' }}>
                                        Student Name
                                    </h6>
                                </div>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    height: 80,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 4,
                                    backgroundColor: '#edf0f0',
                                }}
                            >
                                <div>
                                    <h5>Student Name</h5>
                                    <h6 style={{ textAlign: 'center' }}>
                                        Student Name
                                    </h6>
                                </div>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
};

const CustomButton = styled(Button)(({ theme }) => ({
    borderRadius: '20px',
    border: '1px solid #F56D3B',
    color: '#F56D3B',
    padding: '8px 16px', // Add padding for horizontal and vertical spacing
    margin: '0 8px', // Add horizontal margin between buttons
    textTransform: 'none',
    '&:hover': {
        backgroundColor: '#F56D3B',
        color: '#fff',
        borderColor: '#F56D3B',
    },
    '&.active': {
        backgroundColor: '#F56D3B',
        color: '#fff',
    },
    '&.Mui-disabled': {
        color: '#ccc', // Gray out the text color for disabled state
        borderColor: '#ccc', // Change the border color for disabled state
    },
}));

const CalenderButton = styled(Button)(({ theme }) => ({
    borderRadius: '20px',
    border: 'none',
    color: '#F56D3B',
    backgroundColor: '#FEEBE3',
    textTransform: 'none',
    transition: 'all 0.3s ease', // Corrected transition syntax
    '&:hover': {
        backgroundColor: '#FEEBE3',
        color: '#F56D3B',
        border: 'none', // Corrected border removal syntax
    },
    '&:focus': {
        outline: 'none', // Remove default focus outline if desired
    },
}));

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 36, // adjust width as needed
    height: 20, // increased height
    padding: 0,
    marginTop: 5,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 17, // adjust width to keep thumb proportional
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(16px)', // adjust translation to match increased height
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 3, // increased padding for larger height
        '&.Mui-checked': {
            transform: 'translateX(18px)', // adjust translation to match increased height
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor:
                    theme.palette.mode === 'dark' ? '#177ddc' : '#14D249',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 14, // increased width for larger thumb
        height: 14, // increased height for larger thumb
        borderRadius: 7, // adjusted to keep thumb circular
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 20 / 2, // adjusted to match new height
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,.35)'
                : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));

export default DynamicTable;
