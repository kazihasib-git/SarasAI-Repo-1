import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
} from '@mui/material';
import Header from '../../../components/Header/Header';
import TaMenuSidebar from './TeachingAssistantSidebar';
import DenyDialog from './DenyDialog';
import CreateMeetingDialog from '../coachModule/CreateMeetingDialog';
import { toast } from 'react-toastify';
import {
    getTaCallRequests,
    approveCallRequest,
    denyCallRequest,
} from '../../../redux/features/taModule/tamenuSlice';

import { useDispatch, useSelector } from 'react-redux';
import {
    fetchtimezoneDetails,
    timezoneIdToName,
} from '../../../utils/timezoneIdToName';
import { convertFromUTC } from '../../../utils/dateAndtimeConversion';
import CustomHostNameForm from '../../../components/CustomFields/CustomHostNameField';
import { useGetTimezonesQuery } from '../../../redux/services/timezones/timezonesApi';
import { useGetHostsQuery } from '../../../redux/services/hosts/hostsApi';
import { useGetPlatformsQuery } from '../../../redux/services/platforms/platformsApi';

const CallRequest = () => {
    const {
        data: timezones,
        error: timezoneError,
        isLoading: timezonesLoading,
    } = useGetTimezonesQuery();
    const {
        data: hosts,
        error: hostsError,
        isLoading: hostsLoading,
    } = useGetHostsQuery();
    const {
        data: platforms,
        error: platformError,
        isLoading: platformLoading,
    } = useGetPlatformsQuery();

    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const { timezoneId } = useSelector(state => state.auth);
    const { taCallRequests,loading} = useSelector(state => state.taMenu);
    const [callRequests, setCallRequests] = useState([]);
    const [denyRequestId, setDenyRequestId] = useState(null);
    const [hostEmail, setHostEmail] = useState();
    const [error, setError] = useState({});
    const [showFullMessages, setShowFullMessages] = useState({});
    const [timezoneDetails, setTimezoneDetails] = useState();
    const [openCreateMeetingDialog, setOpenCreateMeetingDialog] =
        useState(false);

    useEffect(() => {
        dispatch(getTaCallRequests());
    }, [dispatch]);

    useEffect(() => {
        if (timezoneId && timezones?.length > 0) {
            const timezone = fetchtimezoneDetails(timezoneId, timezones);
            setTimezoneDetails(timezone);
        }
    }, [timezoneId, timezones]);

    useEffect(() => {
        if (timezoneDetails && taCallRequests?.length > 0) {
            processTaCallRequests(taCallRequests);
        } else {
            setCallRequests([]);
        }
    }, [timezoneDetails, taCallRequests]);

    const processTaCallRequests = async requests => {
        try {
            const processedRequests = await Promise.all(
                requests.map(async request => {
                    const localTime = await convertFromUTC({
                        start_date: request.date,
                        start_time: request.start_time,
                        end_time: request.end_time,
                        end_date: request.date,
                        timezonename: timezoneDetails.time_zone,
                    });

                    return {
                        ...request,
                        date: localTime.start_date,
                        start_time: localTime.start_time,
                        end_time: localTime.end_time,
                        title: `Session request by ${request.sender.name}`,
                        For: `${localTime.start_date} | ${convertTo12HourFormat(localTime.start_time)}`,
                    };
                })
            );
            setCallRequests(processedRequests);
        } catch (error) {
            console.error('Error converting call requests:', error);
            setCallRequests([]);
        }
    };

    const handleClickOpen = id => {
        setDenyRequestId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDenySubmit = (id, reason) => {
        dispatch(denyCallRequest({id, reason}));
        setOpen(false);
    };

    const handleApprove = id => {
        if (hostEmail) {
            dispatch(approveCallRequest({ id, hostEmail }));
        }else{
            toast.error('Please select a host');
        }
    };

    const toggleShowFullMessage = id => {
        setShowFullMessages(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const truncateText = (text, limit) => {
        if (text.length <= limit) return text;
        return `${text.slice(0, limit)}...`;
    };

    const handleCreateMeetingOpen = () => {
        setOpenCreateMeetingDialog(true);
    };

    const handleCreateMeetingClose = () => {
        setOpenCreateMeetingDialog(false);
    };

    const handleCreateMeetingSubmit = data => {
        setOpenCreateMeetingDialog(false);
    };

    function convertTo12HourFormat(time24) {
        const [hours, minutes] = time24.split(':').map(Number);
        const suffix = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${hours12}:${formattedMinutes} ${suffix}`;
    }

    const handleChange = (field, value) => {
        setHostEmail(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div>
            <Header />
            <TaMenuSidebar />
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontFamily: 'ExtraLight' }}
                >
                    Call Request
                </Typography>
            </Box>
            <Grid container spacing={2}>
                {callRequests.map(callRequest => (
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
                                        {callRequest.For}
                                    </span>
                                </Typography>
                                <Typography gutterBottom sx={{ ml: 2 }}>
                                    Requested By:{' '}
                                    <span style={{ color: '#5F6383' }}>
                                        {callRequest.sender.name}
                                    </span>
                                </Typography>
                                <Typography gutterBottom sx={{ ml: 2 }}>
                                    Message:{' '}
                                    <span style={{ color: '#5F6383' }}>
                                        {showFullMessages[callRequest.id]
                                            ? callRequest.message
                                            : truncateText(
                                                  callRequest.message,
                                                  50
                                              )}
                                    </span>
                                    {callRequest.message.length > 50 && (
                                        <Button
                                            onClick={() =>
                                                toggleShowFullMessage(
                                                    callRequest.id
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

                                {callRequest.status == 'Approved' ? (
                                    <Button
                                        sx={{
                                            height: 43,
                                            width: 112,
                                            borderRadius: 40,
                                            backgroundColor: '#19B420',
                                            color: 'white',
                                            mt: 2,
                                            ml: 6,
                                            '&:hover': {
                                                backgroundColor: '#19B420',
                                            },
                                        }}
                                    >
                                        Approved
                                    </Button>
                                ) : (
                                    <>
                                        <Typography gutterBottom sx={{ ml: 2 }}>
                                            <Grid
                                                item
                                                xs={12}
                                                display="flex"
                                                justifyContent="center"
                                            >
                                                <CustomHostNameForm
                                                    label="Host Name"
                                                    name="host_email_id"
                                                    value={hostEmail}
                                                    onChange={e =>
                                                        handleChange(
                                                            'host_email_id',
                                                            e.target.value
                                                        )
                                                    }
                                                    options={hosts?.users}
                                                    errors={
                                                        !!error.host_email_id
                                                    }
                                                />
                                            </Grid>
                                        </Typography>
                                        <Box display="flex" mt={2} ml={6}>
                                            <Button
                                                onClick={() =>
                                                    handleApprove(
                                                        callRequest.id
                                                    )
                                                }
                                                sx={{
                                                    height: 43,
                                                    width: 112,
                                                    borderRadius: 40,
                                                    backgroundColor: '#F56D3B',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#F56D3B',
                                                    },
                                                }}
                                                disabled={loading}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleClickOpen(
                                                        callRequest.id
                                                    )
                                                }
                                                sx={{
                                                    height: 43,
                                                    width: 112,
                                                    borderRadius: 40,
                                                    color: '#F56D3B',
                                                    border: '2px solid #F56D3B',
                                                    ml: 1,
                                                    '&:hover': {
                                                        backgroundColor:
                                                            '#F56D3B',
                                                        color: 'white',
                                                    },
                                                }}
                                                disabled={loading}
                                            >
                                                Deny
                                            </Button>
                                        </Box>
                                    </>
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
                denyRequestId={denyRequestId}
            />
        </div>
    );
};

export default CallRequest;
