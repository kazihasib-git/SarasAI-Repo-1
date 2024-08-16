import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import the close icon
import CustomButton from '../../CustomFields/CustomButton'; // Assuming CustomButton is styled as needed

const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ position: 'relative', marginBottom: '0' }}>
                Are you sure you want to delete?
                <IconButton
                    //color="#F56D3B"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 12,
                        top: 8,
                        color: '#F56D3B',
                    }}
                >
                    <CloseIcon sx={{ color: '#F56D3B' }} />
                </IconButton>
            </DialogTitle>
            {/* <DialogContent>Are you sure you want to delete?</DialogContent> */}
            <DialogActions
                sx={{
                    justifyContent: 'center',
                    padding: '16px',
                }}
            >
                <CustomButton
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    sx={{
                        backgroundColor: '#F56D3B',
                        color: 'white',
                        textTransform: 'none',
                        border: 'none',

                        '&:hover': {
                            backgroundColor: '#F56D3B',
                        },
                        '&:focus': {
                            backgroundColor: '#F56D3B',
                        },
                    }}
                >
                    Delete
                </CustomButton>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
