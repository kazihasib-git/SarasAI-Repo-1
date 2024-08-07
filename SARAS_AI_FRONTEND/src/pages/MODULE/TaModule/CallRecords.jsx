import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment'; // Ensure moment is installed

import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SessionNotes from '../coachModule/SessionNotes';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    IconButton,
} from '@mui/material';
import calender from '../../../assets/calender.svg';
import Header from '../../../components/Header/Header';
import TaMenuSidebar from './TeachingAssistantSidebar';
import {
    assignSessionNotes,
    getTaCallRecords,
} from '../../../redux/features/taModule/tamenuSlice';

const CustomButton = ({
    onClick,
    children,
    color = '#F56D3B',
    backgroundColor = '#4E18A5',
    borderColor = '#FFFFFF',
    sx,
    ...props
}) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                backgroundColor: backgroundColor,
                color: color,
                fontWeight: '500',
                fontSize: '13px',
                borderRadius: '40px',
                gap: '10px',
                padding: '16px, 20px, 16px, 20px',
                border: `1.5px solid ${borderColor}`,
                '&:hover': {
                    backgroundColor: color,
                    color: backgroundColor,
                    borderColor: color,
                },
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

const CallRecords = () => {
    const calls = [
        {
            id: 1,
            title: 'Aman Gupta Meeting',
            time: '10 July | 12:30 PM',
            participants: 'Aman Gupta, Amandeep',
            status: 'Join Meeting',
            description:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
        {
            id: 2,
            title: 'John Doe Meeting',
            time: '11 July | 1:30 PM',
            participants: 'John Doe, Jane Smith',
            status: 'Join Meeting',
            description:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
        {
            id: 3,
            title: 'Project Sync',
            time: '12 July | 3:00 PM',
            participants: 'Alice Johnson, Bob Brown',
            status: 'Join Meeting',
            description:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
    ];
    const [open, setOpen] = useState(false);
    const [selectedCall, setSelectedCall] = useState(null);
    const [date, setDate] = useState(moment()); // Initialize with current date

    const dispatch = useDispatch();
    //const calls = useSelector(state => state.taMenu.taCallRecords); // Adjust based on your state structure

    useEffect(() => {
        dispatch(getTaCallRecords(date.format('YYYY-MM-DD')));
    }, [date, dispatch]);

    const handleClickOpen = call => {
        setSelectedCall(call);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSaveNotes = notes => {
        if (selectedCall && selectedCall.id) {
            dispatch(
                assignSessionNotes({
                    id: selectedCall.id,
                    data: { session_notes: notes },
                })
            );
        } else {
            console.error('SelectedCall or ID is missing.');
        }
    };

    const handleIncrement = () => {
        const newDate = moment(date).add(1, 'days');
        setDate(newDate);
    };

    const handleDecrement = () => {
        const newDate = moment(date).subtract(1, 'days');
        setDate(newDate);
    };

    return (
        <div>
            <Header />
            <TaMenuSidebar />

            <Box m="40px">
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb="20px"
                >
                    <Typography
                        variant="h6"
                        component="p"
                        sx={{
                            color: '#1A1E3D',
                            fontSize: '40px',
                            fontFamily: 'ExtraLight',
                        }}
                    >
                        Call Records
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb="20px">
                    <Typography variant="h6" mx="20px">
                        <img
                            src={calender}
                            style={{
                                width: '32px',
                                height: '32px',
                                marginRight: '10px',
                            }}
                        />
                        {date.format('D MMMM, YYYY')}
                    </Typography>
                    <IconButton
                        // style={{ height: '9.24px', width: '23.28' }}
                        onClick={handleDecrement}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>
                    <IconButton onClick={handleIncrement}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>

                <Box
                    display="flex"
                    flexWrap="wrap"
                    gap="20px"
                    justifyContent="space-between"
                >
                    {calls.map(call => (
                        <Card
                            key={call.id}
                            sx={{
                                flex: '1 1 calc(33.333% - 20px)',
                                backgroundColor: 'white',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minWidth: '250px',
                            }}
                        >
                            <CardContent>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography variant="h6">
                                        {call.title}
                                    </Typography>
                                </Box>
                                <Typography color="textSecondary">
                                    {call.participants}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                >
                                    Time: {call.time}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{ mt: 2, mb: 2 }}
                                >
                                    {call.description}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{ mt: 2, mb: 2 }}
                                >
                                    Participants: {call.participants}
                                </Typography>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <CustomButton
                                        onClick={() => handleClickOpen(call)}
                                        color="#F56D3B"
                                        backgroundColor="#FFFFFF"
                                        borderColor="#F56D3B"
                                        style={{ textTransform: 'none' }}
                                    >
                                        Session Notes
                                    </CustomButton>
                                    <CustomButton
                                        color="#F56D3B"
                                        backgroundColor="#FFFFFF"
                                        borderColor="#F56D3B"
                                        style={{ textTransform: 'none' }}
                                    >
                                        Call Recordings
                                    </CustomButton>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>

            <SessionNotes
                open={open}
                onClose={handleClose}
                onSave={handleSaveNotes}
                role="TA"
            />
        </div>
    );
};

export default CallRecords;
