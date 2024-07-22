import React, { useState } from 'react';
import {
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import editIcon from '../../../assets/editIcon.png';
import CreateMeetingDialog from '../../../pages/MODULE/coachModule/CreateMeetingDialog';

const CustomButton = ({
    onClick,
    children,
    color = '#FFFFFF',
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
                fontWeight: '700',
                fontSize: '16px',
                borderRadius: '50px',
                // padding: "18px 25px",
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

const ScheduledCall = () => {
    const [newMeetingPopUpOpen, setNewMeetingPopUpOpen] = useState(false);

    const handleClose = () =>{
        setNewMeetingPopUpOpen(false);
    }

    const [scheduledCalls, setScheduledCalls] = useState([
        {
            id: 1,
            title: 'Meeting Flow > Aman Gupta',
            participants: 'Participants',
            time: '12:30 PM - 01:30 PM',
            status: 'Join Meeting',
            statusColor: '#19B420',
        },
        {
            id: 2,
            title: 'Lorem Ipsum is simply dummy',
            participants: 'No Booking Yet',
            time: '12:30 PM - 01:30 PM',
            status: 'Scheduled',
            statusColor: '#F56D3B',
        },
        {
            id: 3,
            title: 'Lorem Ipsum is simply dummy',
            participants: 'No Booking Yet',
            time: '12:30 PM - 01:30 PM',
            status: 'Scheduled',
            statusColor: '#F56D3B',
        },
    ]);

    const onNewMeetingSubmit = (props) =>{
        console.log(props);
        setNewMeetingPopUpOpen(false);
    }

    return (

        <div style={{ padding: '20px' }}>
            {newMeetingPopUpOpen && (<CreateMeetingDialog open={newMeetingPopUpOpen} onClose={handleClose} onSubmit={onNewMeetingSubmit}/>)}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontFamily: 'ExtraLight',
                    }}
                >
                    Scheduled Calls
                </Typography>
                <CustomButton
                    color="#FFFFFF"
                    backgroundColor="#F56D3B"
                    borderColor="#F56D3B"
                    style={{ textTransform: 'none' }}
                    onClick={()=> setNewMeetingPopUpOpen(true)}
                >
                    <AddCircleOutlineIcon />
                    Create New Meeting
                </CustomButton>
            </Box>

            <Grid container spacing={2}>
                {scheduledCalls.map(call => (
                    <Grid item key={call.id} xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                minHeight: '150px',
                                minWidth: '300px',
                                backgroundColor: 'white',
                                position: 'relative',
                            }}
                        >
                                <IconButton
                                    color="primary"
                                    sx={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        marginLeft: '10px',
                                        display: 'flex',
                                        alignItems:
                                            'center',
                                        justifyContent:
                                            'center',
                                        color: '#F56D3B',
                                        backgroundColor:
                                            '#FEEBE3',
                                        gap: '4px',
                                        height: '30px',
                                        width: '70px',
                                        borderRadius:
                                            '15px',
                                        padding: '5px',
                                        '&:hover': {
                                            backgroundColor:
                                                'rgba(245, 235, 227, 0.8)',
                                        },
                                        '& img': {
                                            height: '16px', // adjust size as needed
                                            width: '16px', // adjust size as needed
                                        },
                                        '& small': {
                                            lineHeight:
                                                '16px', // match this with the image height for better alignment
                                        },
                                    }}
                                >
                                    <img
                                        src={editIcon}
                                        alt=""
                                    />
                                    <small
                                        style={{
                                            fontSize:
                                                '14px',
                                        }}
                                    >
                                        Edit
                                    </small>
                                </IconButton>
                            <CardContent>
                                <Typography gutterBottom sx={{ fontWeight: 'bold' }}>
                                    {call.title}
                                </Typography>
                                <Typography gutterBottom>
                                    {call.participants}
                                </Typography>
                                <Typography gutterBottom>
                                    {call.time}
                                </Typography>
                                <Box
                                    display="flex"
                                    justifyContent="flex-end"
                                    mt={2}
                                >
                                    <CustomButton
                                        color="#FFFFFF"
                                        backgroundColor={call.statusColor}
                                        borderColor={call.statusColor}
                                        style={{ textTransform: 'none' }}
                                    >
                                        {call.status}
                                    </CustomButton>
                                 </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
             
        </div>
    );
};

export default ScheduledCall;
