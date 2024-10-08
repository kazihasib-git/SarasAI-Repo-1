import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CoachMenu from './CoachMenu';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SessionNotes from './SessionNotes';

import {
    getCoachCallRecords,
    assignSessionNotes,
} from '../../../redux/features/coachModule/coachmenuprofileSilce';
import moment from 'moment';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    IconButton,
    Popover,
} from '@mui/material';
import calender from '../../../assets/calender.svg';
import VideoUploadDialog from '../../../components/integrations/videoUpload';
import VideoPopup from '../../../components/integrations/videoPlayerPopUp';
import {
    fetchtimezoneDetails,
    timezoneIdToName,
} from '../../../utils/timezoneIdToName';
import { convertFromUTC } from '../../../utils/dateAndtimeConversion';
import CustomButton from '../../../components/CustomFields/CustomButton';
import { useGetTimezonesQuery } from '../../../redux/services/timezones/timezonesApi';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const CoachCallRecord = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [selectedCall, setSelectedCall] = useState(null);
    const [date, setDate] = useState(moment());
    const [videoDialogOpen, setVideoDialogOpen] = useState(false);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [idVideo, setIdVideo] = useState(null);
    const [processedCalls, setProcessedCalls] = useState([]);
    const [timezoneDetails, setTimezoneDetails] = useState();
    const [anchorEl, setAnchorEl] = useState(null);

    const { timezoneId } = useSelector(state => state.auth);
    const calls = useSelector(state => state.coachMenu.coachCallRecords);
    const { data: timezones, error, isLoading } = useGetTimezonesQuery();
    const { userData } = useSelector(state => state.auth);

    function formatDate(date, offset) {
        const localDate = new Date(date);
        const offsetInMilliseconds = offset * 60 * 60 * 1000; // Convert hours to milliseconds
        const adjustedDate = new Date(
            localDate.getTime() + offsetInMilliseconds
        );
        return adjustedDate.toISOString().split('T')[0];
    }

    useEffect(() => {
        if (timezoneId && timezones?.length > 0) {
            const timezone = fetchtimezoneDetails(timezoneId, timezones);
            setTimezoneDetails(timezone);
        }
    }, [timezoneId, timezones]);

    useEffect(() => {
        if (timezoneDetails) {
            const data = {
                date: formatDate(date, timezoneDetails.utc_offset),
                timezone_name: timezoneDetails?.time_zone,
            };
            dispatch(getCoachCallRecords(data));
        }
    }, [dispatch, date, timezoneDetails]);

    useEffect(() => {
        if (timezoneDetails && calls && calls.length > 0) {
            processCalls();
        } else {
            setProcessedCalls([]);
        }
    }, [calls, timezoneDetails]);

    const processCalls = async () => {
        try {
            const processed = await Promise.all(
                calls.map(async call => {
                    const localTime = await convertFromUTC({
                        start_date: call.date,
                        start_time: call.start_time,
                        end_time: call.end_time,
                        end_date: call.date,
                        timezonename: timezoneDetails.time_zone,
                    });

                    return {
                        ...call,
                        date: localTime.start_date,
                        start_time: localTime.start_time,
                        end_time: localTime.end_time,
                    };
                })
            );
            setProcessedCalls(processed);
        } catch (error) {
            console.error('Error processing calls:', error);
            setProcessedCalls([]);
        }
    };

    function convertTo12HourFormat(time24) {
        const [hours, minutes, seconds] = time24.split(':').map(Number);
        const suffix = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${hours12}:${formattedMinutes} ${suffix}`;
    }

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

    const today = moment().startOf('day');

    const handleIncrement = () => {
        const nextDate = date.clone().add(1, 'days');
        if (nextDate.isSameOrBefore(today, 'day')) {
            setDate(nextDate);
        }
    };
    const sortedCalls = processedCalls.sort((a, b) => {
        const timeA = moment(a.start_time, 'HH:mm A');
        const timeB = moment(b.start_time, 'HH:mm A');
        return timeA - timeB;
    });
    const handleDecrement = () => {
        const newDate = moment(date).subtract(1, 'days');
        setDate(newDate);
    };

    const handleOpenUploadDialog = call => {
        setIdVideo(call.id);
        setUploadDialogOpen(true);
    };
    const handleCloseUploadDialog = () => {
        setUploadDialogOpen(false);
        setVideoUrl('');
        setIdVideo(null);
        dispatch(getCoachCallRecords(date.format('YYYY-MM-DD')));
    };

    const handlePlayVideo = url => {
        setVideoUrl(url);
        setVideoDialogOpen(true);
    };

    const handleDateChange = newDate => {
        const today = moment().startOf('day');
        const formattedDate = newDate ? moment(newDate).format('YYYY-MM-DD') : '';

        if(formattedDate && moment(formattedDate).isAfter(today)) {
            setDate(moment());
            handleCalendarClose();
        }
        
        if (newDate && newDate.isValid()) {
            setDate(newDate);
            handleCalendarClose();
        }
    };

    const handleCalendarOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleCalendarClose = () => {
        setAnchorEl(null);
    };

    const openCal = Boolean(anchorEl);
    const id = openCal ? 'calendar-popover' : undefined;

    return (
        <div>
            <CoachMenu />

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
                        {date.format('D MMMM, YYYY')}
                    </Typography>
                    <IconButton onClick={handleDecrement}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleIncrement}
                        disabled={date.isSame(today, 'day')}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                    <Popover
                        id={id}
                        open={openCal}
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
                        <DateCalendar 
                        date={date}
                        disableFuture = {true} 
                        onChange={handleDateChange} />
                    </Popover>
                </Box>
            </LocalizationProvider>
                <Box
                    display="flex"
                    flexWrap="wrap"
                    gap="20px"
                    justifyContent="space-between"
                >
                    {sortedCalls.map(call => (
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
                                        {/* {userData.name}`session */}
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
                                    |{' '}
                                    {convertTo12HourFormat(call.start_time) ||
                                        'No Start Time'}{' '}
                                    -{' '}
                                    {convertTo12HourFormat(call.end_time) ||
                                        'No End Time'}
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
                                        style={{
                                            textTransform: 'none',
                                            fontFamily: 'Medium',
                                            textAlign: 'left',
                                        }}
                                    >
                                        Session Notes
                                    </CustomButton>
                                    {call.session_recording_url ? (
                                        <CustomButton
                                            onClick={() =>
                                                handlePlayVideo(
                                                    call.session_recording_url
                                                )
                                            }
                                            color="#F56D3B"
                                            backgroundColor="#FFFFFF"
                                            borderColor="#F56D3B"
                                            style={{
                                                textTransform: 'none',
                                                fontFamily: 'Medium',
                                                textAlign: 'left',
                                            }}
                                        >
                                            Call Recordings
                                        </CustomButton>
                                    ) : (
                                        <CustomButton
                                            color="#F56D3B"
                                            backgroundColor="#FFFFFF"
                                            borderColor="#F56D3B"
                                            style={{
                                                textTransform: 'none',
                                                fontFamily: 'Medium',
                                                textAlign: 'left',
                                            }}
                                            onClick={() =>
                                                handleOpenUploadDialog(call)
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
                role="COACH"
                selectedId={selectedCall}
            />

            <VideoUploadDialog
                open={uploadDialogOpen}
                onClose={handleCloseUploadDialog}
                role="COACH"
                selectedId={idVideo}
            />

            {videoDialogOpen && (
                <VideoPopup
                    open={videoDialogOpen}
                    videoUrl={videoUrl}
                    onClose={() => setVideoDialogOpen(false)}
                />
            )}
        </div>
    );
};

export default CoachCallRecord;
