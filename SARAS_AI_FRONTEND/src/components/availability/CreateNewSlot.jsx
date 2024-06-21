import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, TextField, Radio, FormControlLabel, FormControl, FormLabel, RadioGroup, Checkbox, FormGroup } from '@mui/material';
import React, { useState } from 'react';
import moment from 'moment-timezone';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const CreateNewSlot = ({ open, handleClose }) => {
    const [formDate, setFormDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [timezone, setTimezone] = useState('');
    const [repeat, setRepeat] = useState('onetime');
    const [selectedDays, setSelectedDays] = useState([]);

    const timeZones = moment.tz.names();
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleSubmit = () => {
        handleClose();
    };

    const handleDayChange = (day) => {
        setSelectedDays((prev) => {
            if (prev.includes(day)) {
                return prev.filter((d) => d !== day);
            } else {
                return [...prev, day];
            }
        });
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
                Create New Slot
            </DialogTitle>
            <DialogContent sx={{ m: 2 }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="From Date"
                                inputFormat="dd/MM/yyyy"
                                value={formDate}
                                onChange={(date) => setFormDate(date)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
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
                                inputFormat="dd/MM/yyyy"
                                value={toDate}
                                onChange={(date) => setToDate(date)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
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
                    <Grid item xs={12} sm={12} md={6} justifyContent="center">
                        <TextField
                            select
                            label="Select Timezone"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '50px',
                                    padding: '10px 30px',
                                    border: '1px solid #D0D0EC'
                                },
                                '& .MuiPaper-root': {
                                    width: '400%',  // Set the width to 100% of the popup menu
                                    maxWidth: 'none'  // Ensure there's no max-width restricting the width
                                }
                            }}
                        >
                            {timeZones.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <FormControl component="fieldset">
                            <RadioGroup
                                row
                                value={repeat}
                                onChange={(e) => setRepeat(e.target.value)}
                                sx={{ justifyContent: 'center' }}
                            >
                                <FormControlLabel value="onetime" control={<Radio />} label="One-Time" />
                                <FormControlLabel value="recurring" control={<Radio />} label="Recurring" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
                {repeat === 'recurring' && (
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormGroup row>
                                    {weekDays.map((day) => (
                                        <FormControlLabel
                                            key={day}
                                            control={
                                                <Checkbox
                                                    checked={selectedDays.includes(day)}
                                                    onChange={() => handleDayChange(day)}
                                                    name={day}
                                                />
                                            }
                                            label={day}
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        backgroundColor: 'white',
                        color: '#F56D3B',
                        border: '2px solid #F56D3B',
                        borderRadius: '50px',
                        textTransform: 'none',
                        fontWeight: '700',
                        fontSize: '16px',
                        padding: '10px 20px',
                        mx: 1,
                        '&:hover': {
                            backgroundColor: '#F56D3B',
                            color: 'white',
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
                        color: 'white',
                        borderRadius: '50px',
                        textTransform: 'none',
                        padding: '10px 20px',
                        fontWeight: '700',
                        fontSize: '16px',
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

export default CreateNewSlot;
