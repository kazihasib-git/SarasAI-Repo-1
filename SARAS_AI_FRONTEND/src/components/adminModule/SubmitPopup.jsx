import { Box, Button, Dialog, DialogActions, DialogTitle, IconButton, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';

const SubmitPopup = ({ open, handleClose, handleAssignBatches, handleAssignStudents}) => {
    return (
        <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                sx={{
                    padding: '50px 0px 50px 0px',
                    borderRadius: '10px',
                    border: '2px solid #F56D38',
                    color: '#FFFFFF'
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
                    id="alert-dialog-title"
                    sx={{
                        m: 0,
                        p: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            font : 'Nohemi',
                            fontWeight: '600',
                            fontSize: '25px',
                            color: '#1A1E3D'
                        }}
                    >
                        'Coach' successfully created.
                    </Typography>
                </DialogTitle>

                <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                    <Box display="flex" justifyContent="center" width="100%" gap={2}>
                        <Button
                            variant="contained"
                            onClick={handleAssignStudents}
                            sx={{
                                backgroundColor: '#F56D3B',
                                color: 'white',
                                borderRadius: '50px',
                                textTransform: 'none',
                                padding: '10px 20px',
                                fontWeight: '700',
                                fontSize: '16px',
                                '&:hover': {
                                    //backgroundColor: '#D4522A'
                                }
                            }}
                        >
                            Assign Students
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleAssignBatches}
                            sx={{
                                backgroundColor: 'white',
                                color: '#F56D3B',
                                border: '2px solid #F56D3B',
                                borderRadius: '50px',
                                textTransform: 'none',
                                fontWeight: '700',
                                fontSize: '16px',
                                padding: '10px 20px',
                                '&:hover': {
                                    //backgroundColor: '#F56D3B',
                                    color: 'white'
                                }
                            }}
                        >
                            Assign Batches
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
    )
}

export default SubmitPopup