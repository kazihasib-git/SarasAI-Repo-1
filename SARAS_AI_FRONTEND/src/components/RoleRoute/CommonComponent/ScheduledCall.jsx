import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    Popover,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import editIcon from '../../../assets/editIcon.png';
import CreateMeetingDialog from '../../../pages/MODULE/coachModule/CreateMeetingDialog';
import calender from '../../../assets/calender.svg';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getCoachScheduledCalls } from '../../../redux/features/coachModule/coachmenuprofileSilce';
import { getTaScheduledCalls } from '../../../redux/features/taModule/tamenuSlice';
import CreateSession from './commonCalender/CreateSession';
import {
    openScheduleNewSession,
    openSessionPopup,
    openEditSession,
} from '../../../redux/features/commonCalender/commonCalender';
import SessionLink from './commonCalender/SessionLink';
import EditSession from './commonCalender/EditSession';
import ParticipantsDialog from '../../../pages/MODULE/coachModule/ParticipantsDialog';
import { convertFromUTC } from '../../../utils/dateAndtimeConversion';
import {
    fetchtimezoneDetails,
} from '../../../utils/timezoneIdToName';
import CustomButton from '../../CustomFields/CustomButton';
import {
    openParticipantsDialog,
    closeParticipantsDialog,
    closeEditParticipantsDialog,
} from '../../../redux/features/commonCalender/commonCalender';
import EditParticipantsDialog from './EditParticipantsDialog';
import EditStudentsSessionLink from './commonCalender/EditStudentsSessionLink';
import EditBatchesSessionLink from './commonCalender/EditBatchesSessionLink';
import { useGetTimezonesQuery } from '../../../redux/services/timezones/timezonesApi';

const scheduleCallConfig = {
    TA: {
        sliceName: 'taMenu',
        getScheduledCallsApi: getTaScheduledCalls,
        getScheduledCallsState: 'taScheduledCalls',
    },
    Coach: {
        sliceName: 'coachMenu',
        getScheduledCallsApi: getCoachScheduledCalls,
        getScheduledCallsState: 'coachScheduledCalls',
    },
};

const ScheduledCall = ({ role }) => {
    const dispatch = useDispatch();
    const { participantsDialogOpen, editParticipantsDialogOpen } = useSelector(
        state => state.commonCalender
    );
    const { data : timezones, error, isLoading } = useGetTimezonesQuery();
    const { timezoneId } = useSelector(state => state.auth);
    const [timezoneDetails, setTimezoneDetails] = useState();

    const [initialParticipantsData, setInitialParticipantsData] =
        useState(null);
    const [newMeetingPopUpOpen, setNewMeetingPopUpOpen] = useState(false);
    const [date, setDate] = useState(moment());
    const [anchorEl, setAnchorEl] = useState(null);
    const [scheduledCalls, setScheduledCalls] = useState([]);

    const { sliceName, getScheduledCallsApi, getScheduledCallsState } =
        scheduleCallConfig[role];

    const stateSelector = useSelector(state => state[sliceName]);
    const { [getScheduledCallsState]: scheduledCallsData } = stateSelector;

    const {
        scheduleNewSessionPopup,
        selectStudentPopup,
        selectBatchPopup,
        openSession,
        editSession,
        openEditStudentsPopup,
        openEditBatchesPopup,
    } = useSelector(state => state.commonCalender);

    const { openBatches, openStudents } = useSelector(
        state => state.batchesAndStudents
    );

    useEffect(() => {
        if (timezoneId && timezones?.length > 0) {
            const timezone = fetchtimezoneDetails(timezoneId, timezones);
            setTimezoneDetails(timezone);
        }
    }, [timezoneId, timezones]);
    
    useEffect(() => {
        if (timezoneDetails && scheduledCallsData?.length > 0) {
            processScheduledCalls(scheduledCallsData);
        } else {
            setScheduledCalls([]);
        }
    }, [timezoneDetails, scheduledCallsData]);

    function formatDate(date, offset) {
        const localDate = new Date(date);
        const offsetInMilliseconds = offset * 60 * 60 * 1000; // Convert hours to milliseconds
        const adjustedDate = new Date(localDate.getTime() + offsetInMilliseconds);
        return adjustedDate.toISOString().split('T')[0];
    }

    useEffect(() => {
        if(timezoneDetails){
            const data = {
                date: formatDate(date, timezoneDetails.utc_offset),
                timezone_name: timezoneDetails?.time_zone,
            };
            dispatch(getScheduledCallsApi(data));
        }
    }, [dispatch, date, timezoneDetails]);

    function convertTo12HourFormat(time24) {
        // Split the time into hours, minutes, and seconds
        const [hours, minutes, seconds] = time24.split(':').map(Number);

        const suffix = hours >= 12 ? 'PM' : 'AM';

        const hours12 = hours % 12 || 12;

        const formattedMinutes = minutes.toString().padStart(2, '0');

        return `${hours12}:${formattedMinutes} ${suffix}`;
    }

    const processScheduledCalls = async requests => {
        const newRequests = requests.map(request => ({ ...request }));

        const sortedRequests = newRequests.sort((a, b) => {
            return a.start_time.localeCompare(b.start_time);
        });

        const transformedRequests = await Promise.all(
            sortedRequests.map(async request => {
                const localTime = await convertFromUTC({
                    start_date: request.date.split(' ')[0],
                    start_time: request.start_time,
                    end_time: request.end_time,
                    end_date: request.end_date,
                    timezonename: timezoneDetails?.time_zone,
                });

                const newRequest = {
                    ...request,
                    date: localTime.start_date,
                    end_date: localTime.end_date,
                    start_time: localTime.start_time,
                    end_time: localTime.end_time,
                };

                return newRequest;
            })
        );

        const processedCalls = transformedRequests.map(request => ({
            ...request,
            time: `${convertTo12HourFormat(request.start_time)} - ${convertTo12HourFormat(request.end_time)}`,
        }));
        setScheduledCalls(processedCalls);
    };

    const handleDateChange = newDate => {
        if (newDate && newDate.isValid()) {
            setDate(newDate);
            handleCalendarClose();
        }
    };

    const handleIncrement = () => {
        setDate(prevDate => moment(prevDate).add(1, 'days'));
    };

    const handleDecrement = () => {
        setDate(prevDate => moment(prevDate).subtract(1, 'days'));
    };

    const handleCalendarOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleCalendarClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'calendar-popover' : undefined;

    const handleClose = () => {
        setNewMeetingPopUpOpen(false);
    };
    const sortedCalls = scheduledCalls.sort((a, b) => {
        const timeA = moment(a.start_time, 'HH:mm A');
        const timeB = moment(b.start_time, 'HH:mm A');
        return timeA - timeB;
    });
    const onNewMeetingSubmit = props => {
        setNewMeetingPopUpOpen(false);
    };

    const handleClickJoinSession = call => {
        //window.open(call.platform_meeting.host_meeting_url, '_blank');

        const transformedCall = {
            id: call.id,
            start: new Date(call.date.split(' ')[0] + 'T' + call.start_time),
            end: new Date(call.date.split(' ')[0] + 'T' + call.end_time),
            meetingName: call.meeting_name,
            meetingId: call.meeting_id,
            platformId: call.platform_id,
            platform_tools: call.platform_tool_details,
            platform_meeting: call.platform_meeting_details,
            students: call.students,
            batches: call.batch,
        };
        dispatch(openSessionPopup(transformedCall));
    };

    const handleCreateNewSession = () => {
        dispatch(openScheduleNewSession());
    };

    const handleEditClick = sessionData => {
        dispatch(openEditSession({ sessionData }));
    };

    const handleOpenParticipantsDialog = participantsData => {
        setInitialParticipantsData(participantsData);
        dispatch(openParticipantsDialog(participantsData));
    };
    const handleCloseParticipantsDialog = () => {
        dispatch(closeParticipantsDialog());
    };

    const handleCloseEditParticipantsDialog = () => {
        dispatch(closeEditParticipantsDialog(initialParticipantsData));
    };

    return (
        <div style={{ padding: '20px' }}>
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
                    onClick={handleCreateNewSession}
                >
                    <AddCircleOutlineIcon />
                    Create New Session
                </CustomButton>
            </Box>

            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Box display="flex" alignItems="center" mb="20px">
                    <Typography variant="h6" mx="20px">
                        <img
                            src={calender}
                            style={{
                                width: '32px',
                                height: '32px',
                                marginRight: '10px',
                                cursor: 'pointer',
                            }}
                            onClick={handleCalendarOpen}
                        />
                        {date.format('MMMM DD, YYYY')}
                    </Typography>
                    <IconButton onClick={handleDecrement}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <IconButton onClick={handleIncrement}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleCalendarClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                    >
                        <DateCalendar date={date} onChange={handleDateChange} />
                    </Popover>
                </Box>
            </LocalizationProvider>

            <Grid container spacing={2}>
                {sortedCalls.map(call => (
                    <Grid item key={call.id} xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                minHeight: '150px',
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
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#F56D3B',
                                    backgroundColor: '#FEEBE3',
                                    gap: '4px',
                                    height: '30px',
                                    width: '70px',
                                    borderRadius: '15px',
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
                                        lineHeight: '16px', // match this with the image height for better alignment
                                    },
                                }}
                                onClick={() => handleEditClick(call)}
                            >
                                <img src={editIcon} alt="" />
                                <small
                                    style={{
                                        fontSize: '14px',
                                    }}
                                >
                                    Edit
                                </small>
                            </IconButton>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    {call.meeting_name}
                                </Typography>
                                <Typography gutterBottom>
                                    {call.students.length > 0 ? (
                                        <a
                                            onClick={() =>
                                                handleOpenParticipantsDialog(
                                                    call
                                                )
                                            }
                                            style={{
                                                textDecoration: 'underline',
                                                color: '#F56D3B',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Participants
                                        </a>
                                    ) : (
                                        <>No bookings yet</>
                                    )}
                                </Typography>
                                <Typography gutterBottom>
                                    {call.time}
                                </Typography>
                                <Box
                                    display="flex"
                                    justifyContent="flex-end"
                                    mt={2}
                                >
                                    {call.event_status === 'join meeting' ? (
                                        <CustomButton
                                            color="#FFFFFF"
                                            backgroundColor="#19B420"
                                            borderColor="#19B420"
                                            style={{ textTransform: 'none' }}
                                            onClick={() =>
                                                handleClickJoinSession(call)
                                            }
                                        >
                                            Join Session
                                        </CustomButton>
                                    ) : call.event_status ===
                                      'call schedule' ? (
                                        <CustomButton
                                            color="#FFFFFF"
                                            backgroundColor="#F56D3B"
                                            borderColor="#F56D3B"
                                            style={{ textTransform: 'none' }}
                                        >
                                            Scheduled
                                        </CustomButton>
                                    ) : (
                                        <span
                                            style={{
                                                color: '#19B420',
                                                textTransform: 'none',
                                                padding: '10px',
                                            }}
                                        >
                                            Completed
                                        </span>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {newMeetingPopUpOpen && (
                <CreateMeetingDialog
                    open={newMeetingPopUpOpen}
                    onClose={handleClose}
                    onSubmit={onNewMeetingSubmit}
                />
            )}
            {editParticipantsDialogOpen && (
                <EditParticipantsDialog
                    openEdit={editParticipantsDialogOpen}
                    onCloseEdit={handleCloseEditParticipantsDialog}
                    timezone={timezoneId}
                    role={role}
                />
            )}
            {participantsDialogOpen && (
                <ParticipantsDialog
                    open={participantsDialogOpen}
                    onClose={handleCloseParticipantsDialog}
                    role={role}
                />
            )}
            {scheduleNewSessionPopup &&
                (role == 'Coach' ? (
                    <CreateSession
                        role={role}
                        componentName={'COACHMENU'}
                        timezone={timezoneId}
                    />
                ) : (
                    <CreateSession
                        role={role}
                        componentName={'TAMENU'}
                        timezone={timezoneId}
                    />
                ))}

            {editSession &&
                (role == 'Coach' ? (
                    <EditSession
                        role={role}
                        componentName={'COACHMENU'}
                        timezone={timezoneId}
                    />
                ) : (
                    <EditSession
                        role={role}
                        componentName={'TAMENU'}
                        timezone={timezoneId}
                    />
                ))}

            {openSession &&
                (role == 'Coach' ? (
                    <SessionLink componentName={'COACHMENU'} />
                ) : (
                    <SessionLink componentName={'TAMENU'} />
                ))}
            {openEditStudentsPopup &&
                (role == 'Coach' ? (
                    <EditStudentsSessionLink componentName={'COACHMENU'} />
                ) : (
                    <EditStudentsSessionLink componentName={'TAMENU'} />
                ))}
            {openEditBatchesPopup &&
                (role == 'Coach' ? (
                    <EditBatchesSessionLink componentName={'COACHMENU'} />
                ) : (
                    <EditBatchesSessionLink componentName={'TAMENU'} />
                ))}
        </div>
    );
};

export default ScheduledCall;
