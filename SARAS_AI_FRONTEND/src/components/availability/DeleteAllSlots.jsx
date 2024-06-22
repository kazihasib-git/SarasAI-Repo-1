import React from 'react';
import { Button, DialogContent, DialogContentText, Grid, TextField } from '@mui/material';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomTextField from '../CustomFields/CustomTextField';

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


const DeleteAllSlots = ({ open, handleClose }) => {
    const handleSubmit = () => {
        handleClose();
    };

    const content = (
        <>
            <DialogContentText
                sx={{
                    color: '#1A1E3D',
                    textAlign: 'center',
                    // mb: 3,
                }}
            >
                Are you sure?
            </DialogContentText>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CustomTextField
                        label="Reason for Deletion"
                        fullWidth
                        placeholder="Enter reason for deletion"
                        variant="outlined"
                        multiline
                        rows={4}
                    />
                </Grid>
            </Grid>
        </>
    );

    const actions = (
        <>
            <CustomButton
                onClick={handleClose}
                backgroundColor= '#FFFFFF'
                borderColor= '#F56D3B'
                color= '#F56D3B'
            >
                Back
            </CustomButton>
            <CustomButton
                onClick={handleSubmit}
                backgroundColor= '#F56D3B'
                borderColor= '#F56D3B'
                color= '#FFFFFF'
            >
                Submit
            </CustomButton>
        </>
    );

    return (
        <ReusableDialog
            open={open}
            handleClose={handleClose}
            title="Delete All Future Slots"
            content={content}
            actions={actions}
        />
    );
};

export default DeleteAllSlots;

