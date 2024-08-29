import React from 'react';
import ReusableDialog from '../CustomFields/ReusableDialog';
import { Box, DialogContent, DialogTitle, Typography } from '@mui/material';
import CustomButton from '../CustomFields/CustomButton';

const DeleteConfirmation = ({ open, handleClose, onConfirm }) => {

    const handleDelete = () => {
        onConfirm(); // Call the confirmation function
    };

    const actions = (
        <Box>
            <CustomButton
                onClick={handleDelete}
                backgroundColor="#FFFFFF"
                borderColor="#F56D38"
                color="#F56D38"
                sx={{ mr: 2 }}
            >
                Yes
            </CustomButton>
            <CustomButton
                onClick={handleClose}
                backgroundColor="#F56D38"
                borderColor="#F56D38"
                color="#FFFFFF"
            >
                No
            </CustomButton>
        </Box>
    );

    const content = (
        <DialogContent
            style={{ display: 'flex', justifyContent: 'center' }}
        >
            <Typography>Are you sure you want to delete?</Typography>
        </DialogContent>
    );

    return (
        <ReusableDialog
            open={open}
            handleClose={handleClose}
            title={"Delete Confirmation"}
            content={content}
            actions={actions}
        />
    );
};

export default DeleteConfirmation;
