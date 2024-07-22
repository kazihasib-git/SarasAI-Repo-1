import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomTextField from '../../../components/CustomFields/CustomTextField';
import CustomDateField from '../../../components/CustomFields/CustomDateField';
//import CustomFormControl from '../../../components/CustomFields/CustomFromControl';

//const inputPropsStyle = multiline ? { borderRadius: '25px', padding: '25px 30px 18px 30px' } : { height: '60px', borderRadius: '50px', padding: '18px 2px' };

const CreateTaMeeting = ({ open, onClose, onSubmit }) => {
    const [meeting, setMeeting] = useState('');
    const [duration, setDuration] = useState('');
    const [participants, setParticipants] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        onSubmit({ meeting, duration, participants, date, time, message });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Create New Meeting
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: '#F56D3B',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box mb={2}>
                    <TextField
                        select
                        label="Meeting"
                        value={meeting}
                        onChange={e => setMeeting(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="Meeting 1">Meeting 1</MenuItem>
                        <MenuItem value="Meeting 2">Meeting 2</MenuItem>
                        {/* Add more options as needed */}
                    </TextField>
                </Box>
                <Box mb={2}>
                    <TextField
                        select
                        label="Duration"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="30 mins">30 mins</MenuItem>
                        <MenuItem value="1 hour">1 hour</MenuItem>
                        {/* Add more options as needed */}
                    </TextField>
                </Box>
                <Box mb={2}>
                    <CustomTextField
                        label="Number of Participants"
                        placeholder="Enter number of participants"
                        value={participants}
                        onChange={e => setParticipants(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <CustomDateField
                        label="Date"
                        InputLabelProps={{ shrink: true }}
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <TextField
                        label="Time"
                        type="time"
                        InputLabelProps={{ shrink: true }}
                        value={time}
                        onChange={e => setTime(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box mb={2}>
                    <CustomTextField
                        label="Message"
                        placeholder="Enter the message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        fullWidth
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleSubmit}
                    style={{ backgroundColor: '#F56D3B', color: 'white' }}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateTaMeeting;
