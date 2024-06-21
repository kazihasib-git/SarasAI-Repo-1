import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const MarkLeave = ({ open, handleClose }) => {
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
                    position: 'relative'
                },
                '@media (max-width: 600px)': {
                    '& .MuiPaper-root': {
                        padding: '10px',
                    },
                }
            }}
        >
            <IconButton 
                onClick={handleClose} 
                sx={{ 
                    color: '#F56D3B', 
                    position: 'absolute', 
                    top: 10, 
                    right: 10 
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogTitle 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    color: '#1A1E3D', 
                    fontSize: '24px', 
                    fontWeight: '600' 
                }}
            >
                Mark Leave
            </DialogTitle>
            <DialogContent sx={{ m: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="From Date"
                                inputFormat="MM/dd/yyyy"
                                renderInput={(params) => <TextField {...params} />}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': { 
                                        borderRadius: '50px', 
                                        padding: '10px 30px', 
                                        border: '1px solid #D0D0EC' 
                                    } 
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="To Date"
                                inputFormat="MM/dd/yyyy"
                                renderInput={(params) => <TextField {...params} />}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': { 
                                        borderRadius: '50px', 
                                        padding: '10px 20px', 
                                        border: '1px solid #D0D0EC' 
                                    } 
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ 
                        backgroundColor: '#F56D3B', 
                        borderRadius: '50px', 
                        color: '#FFFFFF', 
                        padding: '10px 20px',
                        '&:hover': {
                            backgroundColor: '#E25A27'
                        } 
                    }}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MarkLeave;
