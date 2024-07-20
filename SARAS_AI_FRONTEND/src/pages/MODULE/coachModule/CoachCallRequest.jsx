import React, { useState } from 'react';
import {
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
} from '@mui/material';
import CoachMenu from './CoachMenu';
import DenyDialog from './DenyDialog';
import CreateMeetingDialog from './CreateMeetingDialog';

const CoachCallRequest = () => {
    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false); // State for dialog
    const [callRequests, setCallRequests] = useState([
        {
            id: 1,
            title: 'Meeting Request By Aman',
            for: '10 July, 2014 | 12:30 PM',
            requestedBy: 'Aman',
            messages:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
        },
        {
            id: 2,
            title: 'Meeting Request By Aman',
            for: '10 July, 2014 | 12:30 PM',
            requestedBy: 'Aman',
            messages:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
        {
            id: 3,
            title: 'Meeting Request By Aman',
            for: '10 July, 2014 | 12:30 PM',
            requestedBy: 'Aman',
            messages:
                'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        },
    ]);
    const [showFullMessages, setShowFullMessages] = useState({});

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleDialogSubmit = (data) => {
        console.log(data); // Handle the submitted data
        setDialogOpen(false);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDenySubmit = () => {
        setOpen(false);
    };

    const handleApprove = (id) => {
        setCallRequests(
            callRequests.map((request) =>
                request.id === id ? { ...request, approved: true } : request,
            ),
        );
    };

    const toggleShowFullMessage = (id) => {
        setShowFullMessages((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const truncateText = (text, limit) => {
        if (text.length <= limit) return text;
        return `${text.slice(0, limit)}...`;
    };

    return (
        <div style={{}}>
            <CoachMenu />

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
                        width: '274px',
                        height: '40px',
                        justifyContent: 'center',
                        fontFamily: 'ExtraLight',
                    }}
                >
                    Call Request
                </Typography>

                <div className="inputBtnContainer">
                    <button
                        className="buttonContainer"
                        onClick={handleDialogOpen}
                        style={{ backgroundColor: '#F56D3B', color: 'white' }}
                    >
                        <i className="bi bi-plus-circle"></i>
                        <span>Create New Meeting</span>
                    </button>
                </div>
            </Box>

            <Grid container spacing={2}>
                {callRequests.map((callRequest) => (
                    <Grid item key={callRequest.id} xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                minHeight: '250px',
                                backgroundColor: 'white',
                            }}
                        >
                            <CardContent>
                                <Typography gutterBottom sx={{ ml: 2 }}>
                                    {callRequest.title}
                                </Typography>
                                <Typography gutterBottom sx={{ ml: 2 }}>
                                    For:{' '}
                                    <span style={{ color: '#5F6383' }}>
                                        {callRequest.for}
                                    </span>
                                </Typography>
                                <Typography gutterBottom sx={{ ml: 2 }}>
                                    Requested By:{' '}
                                    <span style={{ color: '#5F6383' }}>
                                        {callRequest.requestedBy}
                                    </span>
                                </Typography>
                                <Typography gutterBottom sx={{ ml: 2 }}>
                                    Message:{' '}
                                    <span style={{ color: '#5F6383' }}>
                                        {showFullMessages[callRequest.id]
                                            ? callRequest.messages
                                            : truncateText(
                                                  callRequest.messages,
                                                  50,
                                              )}
                                    </span>
                                    {callRequest.messages.length > 50 && (
                                        <Button
                                            onClick={() =>
                                                toggleShowFullMessage(
                                                    callRequest.id,
                                                )
                                            }
                                            sx={{
                                                color: '#F56D3B',
                                                textTransform: 'none',
                                            }}
                                        >
                                            {showFullMessages[callRequest.id]
                                                ? 'less'
                                                : 'more'}
                                        </Button>
                                    )}
                                </Typography>
                                {callRequest.approved ? (
                                    <Button
                                        sx={{
                                            height: 43,
                                            width: 112,
                                            borderRadius: 40,
                                            backgroundColor: '#19B420',
                                            color: 'white',
                                            mt: 2,
                                            '&:hover': {
                                                backgroundColor: '#19B420',
                                            },
                                        }}
                                    >
                                        Approved
                                    </Button>
                                ) : (
                                    <Box display="flex" mt={2}>
                                        <Button
                                            onClick={() =>
                                                handleApprove(callRequest.id)
                                            }
                                            sx={{
                                                height: 43,
                                                width: 112,
                                                borderRadius: 40,
                                                backgroundColor: '#F56D3B',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#F56D3B',
                                                },
                                            }}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={handleClickOpen} // Open the Deny dialog
                                            sx={{
                                                height: 43,
                                                width: 112,
                                                borderRadius: 40,
                                                backgroundColor: '#F56D3B',
                                                color: 'white',
                                                ml: 1,
                                                '&:hover': {
                                                    backgroundColor: '#F56D3B',
                                                },
                                            }}
                                        >
                                            Deny
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <DenyDialog
                open={open}
                handleClose={handleClose}
                handleDenySubmit={handleDenySubmit}
            />

            <CreateMeetingDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                onSubmit={handleDialogSubmit}
            />
        </div>
    );
};

export default CoachCallRequest;
