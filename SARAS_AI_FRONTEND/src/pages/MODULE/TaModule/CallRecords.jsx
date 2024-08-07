import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment'; // Ensure moment is installed

import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SessionNotes from '../coachModule/SessionNotes';

//import VideoUploadDialog from '../../../components/integrations/videoUpload';
import VideoUpload from './../../../components/integrations/videoUpload';
//import VideoUploadAndPlayer from '../../../components/integrations/VideoUploadAndPlayer';
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
import VideoUploadAndPlayer from '../../../components/integrations/VideoPlayer';

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
    // const calls = [
    //     {
    //         id: 1,
    //         meeting_name: 'Aman Gupta Meeting',
    //         date: '10 July | 12:30 PM',
    //         students: 'Aman Gupta, Amandeep',
    //         status: 'Join Meeting',
    //         description:
    //             'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    //     },
    //     {
    //         id: 2,
    //         title: 'John Doe Meeting',
    //         time: '11 July | 1:30 PM',
    //         participants: 'John Doe, Jane Smith',
    //         status: 'Join Meeting',
    //         description:
    //             'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    //     },
    //     {
    //         id: 3,
    //         title: 'Project Sync',
    //         time: '12 July | 3:00 PM',
    //         participants: 'Alice Johnson, Bob Brown',
    //         status: 'Join Meeting',
    //         description:
    //             'Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    //     },
    // ];
    const [open, setOpen] = useState(false);
    const [selectedCall, setSelectedCall] = useState(null);
    const [date, setDate] = useState(moment()); // Initialize with current date
    const [videoDialogOpen, setVideoDialogOpen] = useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    const dispatch = useDispatch();
    const calls = useSelector(state => state.taMenu.taCallRecords); // Adjust based on your state structure

    useEffect(() => {
        dispatch(getTaCallRecords(date.format('YYYY-MM-DD')));
    }, [date, dispatch]);

    const handleClickOpen = call => {
        setSelectedCall(call);
        setOpen(true);
        console.log('data', call);
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

                                // width: '300px',
                                // height: '350px',

                                // margin: '10px',
                            }}
                        >
                            <CardContent>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                >
                                    <Typography variant="h6">
                                        {call.meeting_name}
                                    </Typography>
                                </Box>
                                <Typography variant="h7" component="span">
                                    Time:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    component="span"
                                    sx={{ ml: 1 }}
                                >
                                    {moment(call.date).format('MMMM D, YYYY') ||
                                        'No Date'}{' '}
                                    | {call.start_time || 'No Start Time'} -{' '}
                                    {call.end_time || 'No End Time'}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{ mt: 2, mb: 2 }}
                                >
                                    {call.message || 'No Message'}
                                </Typography>

                                <Typography variant="h7" component="span">
                                    Participants:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    component="span"
                                    sx={{ mt: 2, mb: 2, ml: 1 }}
                                >
                                    {call.students
                                        ?.map(student => student.name)
                                        .join(', ') || 'No Participants'}
                                </Typography>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    sx={{ mt: 2 }}
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
                                    {call.session_recording_url ? (
                                        <CustomButton
                                            // onClick={() =>
                                            //     setVideoDialogOpen(true)
                                            // }
                                            color="#F56D3B"
                                            backgroundColor="#FFFFFF"
                                            borderColor="#F56D3B"
                                            style={{ textTransform: 'none' }}
                                            // disabled={!call.session_recording_url}
                                        >
                                            Call Recordings
                                        </CustomButton>
                                    ) : (
                                        <CustomButton
                                            color="#F56D3B"
                                            backgroundColor="#FFFFFF"
                                            borderColor="#F56D3B"
                                            style={{ textTransform: 'none' }}
                                            open={uploadDialogOpen}
                                            onClick={() =>
                                                setUploadDialogOpen(true)
                                            }
                                        >
                                            Upload Recordings
                                        </CustomButton>
                                    )}
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
                selectedId={selectedCall}
            />
            {/* <CallRecordingDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
            /> */}
            {/* <VideoUploadAndPlayer
                open={videoDialogOpen}
                onClose={() => setVideoDialogOpen(false)}
            /> */}
            <VideoUpload
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
            />
        </div>
    );
};

export default CallRecords;
