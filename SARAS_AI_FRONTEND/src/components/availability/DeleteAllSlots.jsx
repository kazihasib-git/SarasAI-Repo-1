import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

const DeleteAllSlots = ({ open, handleClose }) => {
    const handleSubmit = () => {
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '10px',
                    padding: '20px',
                    position: 'relative',
                },
                '@media (max-width: 600px)': {
                    '& .MuiPaper-root': {
                        padding: '10px',
                    },
                },
            }}
        >
            <IconButton
                onClick={handleClose}
                sx={{
                    color: '#F56D3B',
                    position: 'absolute',
                    top: 10,
                    right: 10,
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogTitle
                sx={{
                    font: 'Nodemi',
                    fontWeight: '600',
                    fontSize: '24px',
                    color: '#1A1E3D',
                    textAlign: 'center',
                }}
            >
                Delete All Future Slots
            </DialogTitle>
            <DialogContent>
                <DialogContentText
                    sx={{
                        color: '#1A1E3D',
                        textAlign: 'center',
                        mb: 3,
                    }}
                >
                    Are you sure ?
                </DialogContentText>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Reason for Deletion"
                            fullWidth
                            placeholder="Enter reason for deletion"
                            variant="outlined"
                            multiline
                            rows={4}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                },
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
                    onClick={handleClose}
                    variant="contained"
                    sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '50px',
                        color: '#F56D3B',
                        border: '1px solid #F56D3B',
                        px: 3,
                        py: 1,
                        mx: 1,
                        '&:hover': {
                            backgroundColor: '#F56D3B',
                            color: '#FFFFFF',
                        },
                    }}
                >
                    Back
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        backgroundColor: '#F56D3B',
                        borderRadius: '50px',
                        color: '#FFFFFF',
                        px: 3,
                        py: 1,
                        mx: 1,
                        '&:hover': {
                            backgroundColor: '#E25A27',
                        },
                    }}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteAllSlots;
