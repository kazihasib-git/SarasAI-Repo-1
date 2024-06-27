import React, { useEffect, useState } from "react";
import { Button, IconButton, Switch, Pagination, Box, Checkbox } from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { styled } from "@mui/material/styles";
import './popUpTable.css'
import { useNavigate } from "react-router-dom";
import editIcon from '../../assets/editIcon.png';
import bin from '../../assets/bin.png';

const PopUpTable = ({ headers, initialData, actionButtons }) => {
    const [data, setData] = useState(initialData.map(item => ({
        ...item,
        isSelected: item.isSelected !== undefined ? item.isSelected : false,
    })));

    useEffect(() => {
        setData(initialData.map(item => ({
            ...item,
            isSelected: item.isSelected !== undefined ? item.isSelected : false,
        })));
    }, [initialData]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const navigate = useNavigate();
    return (
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
                    {currentData.map((item, index) => (
                        <tr key={item.id} id="popUpRow">
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
                                } else if (key !== 'id' && key !== 'isSelected') {
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
                                                    checked={item.isSelected}
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
                                        if (button.type === 'checkbox') {
                                            return (
                                                <Checkbox
                                                    key={idx}
                                                    sx={{
                                                        '& .MuiSvgIcon-root': {
                                                            color: '#C2C2E7', // Color for the tick
                                                        },
                                                    }}
                                                    inputProps={{ 'aria-label': 'select all' }}
                                                />
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

        </div>
    )
}

export default PopUpTable