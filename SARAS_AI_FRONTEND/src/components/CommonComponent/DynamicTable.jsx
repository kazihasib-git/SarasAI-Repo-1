import React, { useEffect, useState } from "react";
import { Button, IconButton, Switch, Pagination, Box, Checkbox } from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { styled } from "@mui/material/styles";
import './DynamicTable.css'
import { useNavigate } from "react-router-dom";
import editIcon from '../../assets/editIcon.png';
import bin from '../../assets/bin.png';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const CustomButton = styled(Button)(({ theme }) => ({
    borderRadius: '20px',
    border: "1px solid #F56D3B",
    color: "#F56D3B",
    padding: '8px 16px',  // Add padding for horizontal and vertical spacing
    margin: '0 8px',      // Add horizontal margin between buttons
    '&:hover': {
        backgroundColor: "#F56D3B",
        color: '#fff',
        borderColor: '#F56D3B',
    },
    '&.active': {
        backgroundColor: "#F56D3B",
        color: '#fff',
    },
}));


const CalenderButton = styled(Button)(({ theme }) => ({
    borderRadius: '20px',
    border: 'none',
    color: '#F56D3B',
    backgroundColor: '#FEEBE3',
    transition: 'all 0.3s ease', // Corrected transition syntax
    '&:hover': {
        backgroundColor: '#FEEBE3',
        color: '#F56D3B',
        border: 'none', // Corrected border removal syntax
    },
    '&:focus': {
        outline: 'none', // Remove default focus outline if desired
    }
}));;

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 36,  // adjust width as needed
    height: 20,  // increased height
    padding: 0,
    marginTop: 5,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 17,  // adjust width to keep thumb proportional
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(16px)',  // adjust translation to match increased height
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 3,  // increased padding for larger height
        '&.Mui-checked': {
            transform: 'translateX(18px)',  // adjust translation to match increased height
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#14D249',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 14,  // increased width for larger thumb
        height: 14,  // increased height for larger thumb
        borderRadius: 7,  // adjusted to keep thumb circular
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 20 / 2,  // adjusted to match new height
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));



const DynamicTable = ({ headers, initialData, actionButtons }) => {
    const [data, setData] = useState(initialData.map(item => ({
        ...item,
        isActive: item.isActive !== undefined ? item.isActive : false,
    })));

    useEffect(() => {
        setData(initialData.map(item => ({
            ...item,
            isActive: item.isActive !== undefined ? item.isActive : false,
        })));
    }, [initialData]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (event, pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = (id) => {
        console.log("Deleting item with id:", id);
    };

    const handleView = (type, id) => {
        if (type === 'students') {
            navigate(`/active-students/`);
        } else if (type === 'batches') {
            navigate(`/active-batches/`);
        }
    };

    const handleToggle = (id) => {
        console.log("id : ", id)
        setData(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, isActive: !item.isActive } : item
            )
        );
    };

    const getColorForAvailability = (availability) => {
        switch (availability) {
            case 'Active':
                return '#06DD0F';
            case 'On Leave':
                return '#F48606';
            case 'Inactive':
                return '#808080';
            default:
                return '#000000';
        }
    };

    return (
        <div className="table-container">
            <table>
                <thead className="tableHead">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="tableBody">
                    {currentData.map((item, index) => (
                        <tr key={item.id} id="tableRow">
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            {Object.keys(item).map((key, idx) => {
                                if (key === 'activeStudents') {
                                    return (
                                        <td key={idx}>
                                            {item[key]}{" "}
                                            <CustomButton
                                                variant="outlined"
                                                color="secondary"
                                                endIcon={<CallMadeOutlinedIcon />}
                                                onClick={() => handleView('students', item.id)}
                                            >
                                                View
                                            </CustomButton>
                                        </td>
                                    );
                                } else if (key === 'activeBatches') {
                                    return (
                                        <td key={idx}>
                                            {item[key]}{" "}
                                            <CustomButton
                                                variant="outlined"
                                                color="secondary"
                                                endIcon={<CallMadeOutlinedIcon />}
                                                onClick={() => handleView('batches', item.id)}
                                            >
                                                View
                                            </CustomButton>
                                        </td>
                                    );
                                } else if (key === 'availability') {
                                    return (
                                        <td key={idx} style={{ color: getColorForAvailability(item[key]) }}>
                                            {item[key]}
                                        </td>
                                    );
                                } else if (key === 'calendar') {
                                    return (
                                        <td key={idx}>
                                            <CustomButton
                                                variant="outlined"
                                                color="secondary"
                                                endIcon={<CallMadeOutlinedIcon />}
                                                onClick={() => handleView('Calendar', item.id)}
                                            >
                                                Check
                                            </CustomButton>
                                        </td>
                                    );
                                } else if (key !== 'id' && key !== 'isActive') {
                                    return <td key={idx}>{item[key]}</td>;
                                }
                                return null;
                            })}
                            {
                                actionButtons && <td style={{ display: "flex", justifyContent: "center", verticalAlign: "middle" }}>
                                    {actionButtons.map((button, idx) => {
                                        if (button.type === 'switch') {
                                            return (
                                                <AntSwitch
                                                    key={idx}
                                                    checked={item.isActive}
                                                    onChange={() => handleToggle(item.id)}
                                                    inputProps={{ 'aria-label': 'ant design' }}
                                                />
                                            );
                                        }
                                        if (button.type === 'edit') {
                                            return (
                                                <IconButton
                                                    key={idx}
                                                    color="primary"
                                                    sx={{
                                                        marginLeft: "10px",
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#F56D3B',
                                                        backgroundColor: '#FEEBE3',
                                                        gap: '4px',
                                                        height: '30px',
                                                        width: '70px',
                                                        borderRadius: '15px',
                                                        padding: '5px',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(245, 235, 227, 0.8)',
                                                        },
                                                        '& img': {
                                                            height: '16px', // adjust size as needed
                                                            width: '16px', // adjust size as needed
                                                        },
                                                        '& small': {
                                                            lineHeight: '16px', // match this with the image height for better alignment
                                                        }
                                                    }}
                                                    onClick={() => button.onClick(item.id)}
                                                >
                                                    <img src={editIcon} alt="" />
                                                    <small style={{ fontSize: "14px" }}>Edit</small>
                                                </IconButton>
                                            );
                                        }
                                        if (button.type === 'delete') {
                                            return (
                                                <IconButton key={idx} color="primary" onClick={() => handleDelete(item.id)}>
                                                    <img src={bin} alt="" style={{ width: "20px", height: "20px" }} />
                                                </IconButton>
                                            );
                                        }
                                        if (button.type === 'calendar') {
                                            return (
                                                <CustomButton
                                                    key={idx}
                                                    variant="outlined"
                                                    color="secondary"
                                                    endIcon={<CallMadeOutlinedIcon />}
                                                    onClick={() => handleView('Calendar', item.id)}
                                                >
                                                    Check
                                                </CustomButton>
                                            );
                                        }
                                        return null;
                                    })}
                                </td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={(event) => handlePageChange(event, index + 1)}
                        className={index + 1 === currentPage ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};


export default DynamicTable;

