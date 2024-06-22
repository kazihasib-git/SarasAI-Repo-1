import React, { useState } from 'react';
import { DialogContent, Grid, TextField, Button, IconButton } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloseIcon from '@mui/icons-material/Close';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomDateField from '../CustomFields/CustomDateField';

const CustomButton = ({ onClick, children, color = '#FFFFFF', backgroundColor = '#4E18A5', borderColor = '#FFFFFF', sx, ...props }) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                backgroundColor: backgroundColor,
                color: color,
                fontWeight: '700',
                fontSize: '16px',
                borderRadius: '50px',
                padding: "10px 20px",
                border: `2px solid ${borderColor}`,
                '&:hover': {
                    backgroundColor: color,
                    color: backgroundColor,
                    borderColor: color,
                },
                ...sx
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

const MarkLeave = ({ open, handleClose }) => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const handleSubmit = () => {
        handleClose();
    };

    const content = (
        <Grid container sx={{pt:3}} >
            <Grid item xs={12} sm={6}>
                <CustomDateField
                    label="From Date"
                    value={fromDate}
                    onChange={setFromDate}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomDateField
                    label="To Date"
                    value={toDate}
                    onChange={setToDate}
                />
            </Grid>
        </Grid>
    );
    const actions = (
        <CustomButton
            onClick={handleSubmit}
            backgroundColor='#F56D3B'
            borderColor= '#F56D3B'
            color='#FFFFFF'
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={open}
            handleClose={handleClose}
            title="Mark Leave"
            content={content}
            actions={actions}
        />
    );
};

export default MarkLeave;

