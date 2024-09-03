import { Box, DialogActions, Grid, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarComponent from '../../../components/Calender/BigCalendar';
import MarkLeave from '../../../components/availability/MarkLeave';
import DeleteAllSlots from '../../../components/availability/DeleteAllSlots';
import CreateNewSlot from '../../../components/availability/CreateNewSlot';
import {
    openMarkLeave,
    closeMarkLeave,
    getSlots,
    fetchCoachSlots,
    fetchTAScheduleById,
    selectTAScheduleData,
    openCreateNewSlots,
    fetchTaSlots,
    openDeleteTaSlots,
} from '../../../redux/features/adminModule/ta/taAvialability';
import { useDispatch, useSelector } from 'react-redux';
import Slots from '../../../components/availability/Slots';
import ScheduledSessions from '../../../components/availability/ScheduledSessions';
import CancelSchedule from '../../../components/availability/CancelSchedule';
import ReasonForLeave from '../../../components/availability/ReasonForLeave';
import ReschedulingSession from '../../../components/availability/ReschedulingSession';
import { useParams } from 'react-router-dom';
import {
    getTAScheduledSessions,
    openScheduleSession,
} from '../../../redux/features/adminModule/ta/taScheduling';
import Schedule from '../../../components/availability/Schedule';
import EditBatches from '../../../components/availability/EditBatches';
import EditStudents from '../../../components/availability/EditStudents';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import ScheduleSession from '../../../components/availability/ScheduleSession';
import EditStudentsFromSession from '../../../components/availability/EditStudentsFromSession';
import EditBatchesFromSession from '../../../components/availability/EditBatchesFromSession';

import { convertFromUTC } from '../../../utils/dateAndtimeConversion';
import { timezoneIdToName } from '../../../utils/timezoneIdToName';
import { getTimezone } from '../../../redux/features/utils/utilSlice';
import { getTodayTaAvailability } from '../../../redux/features/adminModule/ta/taAvialability';
import { useGetTimezonesQuery } from '../../../redux/services/timezones/timezonesApi';

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
const TaCalender = () => {
    const { id, name } = useParams();
    const [selectedTA, setSelectedTA] = useState(null);
    const { data: timezones, isLoading } = useGetTimezonesQuery();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTodayTaAvailability());
    }, [dispatch]);

    useEffect(() => {
        findTaTimeZone(todaysAvailableTa);
    }, [id, todaysAvailableTa]);

    const {
        slotData,
        scheduleData,
        markLeaveOpen,
        scheduledSlotsOpen,
        scheduledSessionOpen,
        cancelSessionOpen,
        reasonForLeaveOpen,
        resheduleSessionOpen,
        createNewSlotOpen,
        scheduledSlotsData,
        deletingCoachFutureSlots,
        openEventData,
        taEditScheduledStudents,
        taEditScheduledBatches,
        todaysAvailableTa,
    } = useSelector(state => state.taAvialability);

    const {
        taScheduledSessions,
        scheduleSessionOpen,
        openEditBatch,
        openEditStudent,
    } = useSelector(state => state.taScheduling);

    //calendar
    const [eventsList, setEventsList] = useState([]);
    const [slotViewData, setSlotViewData] = useState([]);

    const findTaTimeZone = todaysAvailableTa => {
        if (todaysAvailableTa && Number(id)) {
            const selectedTa = todaysAvailableTa.find(
                ta => ta.id === Number(id)
            );
            setSelectedTA(selectedTa || null);
        } else {
            setSelectedTA(null);
        }
    };

    // const storedTimezoneId = selectedTA ? selectedTA.timezone_id : Number(localStorage.getItem('timezone_id'));
    const storedTimezoneId = selectedTA ? selectedTA.timezone_id : '';

    useEffect(() => {
        dispatch(fetchTaSlots(id));
        dispatch(fetchTAScheduleById(id));
        dispatch(getTimezone());
    }, [dispatch, id, resheduleSessionOpen]);

    const formatTime = time => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${ampm}`;
    };

    const convertEvents = async () => {
        if (
            scheduleData &&
            scheduleData.length > 0 &&
            storedTimezoneId &&
            selectedTA
        ) {
            const timezonename = timezoneIdToName(storedTimezoneId, timezones);
            if (!timezonename) {
                console.error('Invalid timezone name');
                setEventsList([]);
                return;
            }
            try {
                const processedEvents = [];
                const transformedEvents = await Promise.all(
                    scheduleData.map(async event => {
                        const localTime = await convertFromUTC({
                            start_date: event.date.split(' ')[0],
                            start_time: event.start_time,
                            end_time: event.end_time,
                            end_date: event.end_date
                                ? event.end_date
                                : event.date.split(' ')[0],
                            timezonename,
                        });
                        const startDateTime = new Date(
                            `${localTime.start_date}T${localTime.start_time}`
                        );
                        const endDateTime = new Date(
                            `${localTime.end_date}T${localTime.end_time}`
                        );

                        if (localTime.start_date !== localTime.end_date) {
                            const event1 = {
                                id: event.id,
                                admin_user_id: event.admin_user_id,
                                meetingName: event.meeting_name,
                                meetingId: event.meeting_id,
                                platformId: event.platform_id,
                                start: startDateTime,
                                end: new Date(
                                    `${localTime.start_date}T23:59:59`
                                ),
                                platform_tools: event.platform_tool_details,
                                platform_meet: event.platform_meeting_details,
                            };

                            const event2 = {
                                id: event.id,
                                admin_user_id: event.admin_user_id,
                                meetingName: event.meeting_name,
                                meetingId: event.meeting_id,
                                platformId: event.platform_id,
                                start: new Date(
                                    `${localTime.end_date}T00:00:00`
                                ),
                                end: endDateTime,
                                platform_tools: event.platform_tool_details,
                                platform_meet: event.platform_meeting_details,
                            };

                            processedEvents.push(event1, event2);
                            return [event1, event2];
                        } else {
                            const newEvent = {
                                id: event.id,
                                admin_user_id: event.admin_user_id,
                                meetingName: event.meeting_name,
                                meetingId: event.meeting_id,
                                platformId: event.platform_id,
                                start: startDateTime,
                                end: endDateTime,
                                platform_tools: event.platform_tool_details,
                                platform_meet: event.platform_meeting_details,
                            };
                            processedEvents.push(newEvent);
                            return newEvent;
                        }
                    })
                );

                setEventsList(processedEvents);
            } catch (error) {
                console.error('Error converting events:', error);
                setEventsList([]); // Reset to empty array on error
            }
        } else {
            setEventsList([]);
        }
    };
    useEffect(() => {
        convertEvents();
    }, [scheduleData, timezones, storedTimezoneId, selectedTA]);

    const convertSlots = async () => {
        if (slotData && slotData.length > 0 && timezones && storedTimezoneId) {
            const timezonename = timezoneIdToName(storedTimezoneId, timezones);
            try {
                const processedSlots = [];

                const transformedSlots = await Promise.all(
                    slotData.map(async slot => {
                        const localTime = await convertFromUTC({
                            start_date: slot.slot_date,
                            start_time: slot.from_time,
                            end_time: slot.to_time,
                            end_date: slot.slot_end_date,
                            timezonename,
                        });

                        const startDateTime = new Date(
                            `${localTime.start_date}T${localTime.start_time}`
                        );
                        const endDateTime = new Date(
                            `${localTime.end_date}T${localTime.end_time}`
                        );

                        if (localTime.start_date !== localTime.end_date) {
                            const slot1 = {
                                startDate: startDateTime,
                                endDate: new Date(
                                    `${localTime.start_date}T23:59:59`
                                ),
                                leave: slot?.leaves,
                            };

                            const slot2 = {
                                startDate: new Date(
                                    `${localTime.end_date}T00:00:00`
                                ),
                                endDate: endDateTime,
                                leave: slot?.leaves,
                            };

                            processedSlots.push(slot1, slot2);
                            return [slot1, slot2];
                        } else {
                            const newSlot = {
                                startDate: startDateTime,
                                endDate: endDateTime,
                                leave: slot?.leaves,
                            };
                            processedSlots.push(newSlot);
                            return {
                                startDate: startDateTime,
                                endDate: endDateTime,
                                leave: slot?.leaves,
                            };
                        }
                    })
                );

                setSlotViewData(processedSlots);
            } catch (error) {
                console.error('Error converting slots:', error);
                setSlotViewData([]); // Reset to empty array on error
            }
        } else {
            setSlotViewData([]);
        }
    };

    useEffect(() => {
        convertSlots();
    }, [slotData]);

    const handleScheduleNewSession = () => {
        dispatch(openScheduleSession({ id, name }));
    };

    const handleMarkLeave = () => {
        dispatch(openMarkLeave());
    };

    const handleDeleteFutureSlots = () => {
        const data = { id, name };
        dispatch(openDeleteTaSlots(data));
    };

    const handleCreateNewSlot = () => {
        dispatch(openCreateNewSlots());
    };

    return (
        <>
            <Box m={'20px'}>
                <Header />
                <Sidebar />
                <Box sx={{ backgroundColor: '#f8f9fa', p: 3 }}>
                    <DialogActions sx={{ p: 2 }}>
                        <Grid container alignItems="center">
                            <Grid item xs>
                                <Typography variant="h4" sx={{ mb: 4 }}>
                                    {`${name}'s Calendar`}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    gap={2}
                                >
                                    <CustomButton
                                        onClick={handleScheduleNewSession}
                                        color="#FFFFFF"
                                        backgroundColor="#4E18A5"
                                        borderColor="#4E18A5"
                                        style={{ textTransform: 'none' }}
                                    >
                                        <AddCircleOutlineIcon />
                                        Schedule New Session
                                    </CustomButton>

                                    <CustomButton
                                        onClick={handleMarkLeave}
                                        color="#F56D3B"
                                        backgroundColor="#FFFFFF"
                                        borderColor="#F56D3B"
                                        style={{ textTransform: 'none' }}
                                    >
                                        Mark Leave
                                    </CustomButton>

                                    <CustomButton
                                        onClick={handleDeleteFutureSlots}
                                        color="#F56D3B"
                                        backgroundColor="#FFFFFF"
                                        borderColor="#F56D3B"
                                        style={{ textTransform: 'none' }}
                                    >
                                        Delete All Future Slots
                                    </CustomButton>

                                    <CustomButton
                                        color="#FFFFFF"
                                        backgroundColor="#F56D3B"
                                        borderColor="#F56D3B"
                                        onClick={handleCreateNewSlot}
                                        style={{ textTransform: 'none' }}
                                    >
                                        {/* <AddCircleOutlineIcon /> */}
                                        <AddCircleOutlineIcon
                                            sx={{ marginRight: 1 }}
                                        />
                                        Create New Slot
                                    </CustomButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </DialogActions>

                    <CalendarComponent
                        eventsList={eventsList}
                        slotData={slotViewData}
                        componentName={'TACALENDER'}
                    />
                    {scheduleSessionOpen && (
                        <Schedule
                            componentName={'TASCHEDULE'}
                            timezoneID={storedTimezoneId}
                        />
                    )}
                    {openEditBatch && (
                        <EditBatches componentname={'TASCHEDULE'} />
                    )}
                    {openEditStudent && (
                        <EditStudents componentname={'TASCHEDULE'} />
                    )}
                    {markLeaveOpen && (
                        <MarkLeave
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezoneID={storedTimezoneId}
                        />
                    )}
                    {scheduledSlotsOpen && (
                        <Slots
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezoneID={storedTimezoneId}
                        />
                    )}
                    {scheduledSessionOpen && (
                        <ScheduledSessions
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezoneID={storedTimezoneId}
                        />
                    )}
                    {cancelSessionOpen && (
                        <CancelSchedule
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezoneID={storedTimezoneId}
                        />
                    )}
                    {reasonForLeaveOpen && (
                        <ReasonForLeave
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezoneID={storedTimezoneId}
                        />
                    )}
                    {resheduleSessionOpen && (
                        <ReschedulingSession
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezoneID={storedTimezoneId}
                        />
                    )}
                    {deletingCoachFutureSlots && (
                        <DeleteAllSlots
                            componentName={'TACALENDER'}
                            timezoneID={storedTimezoneId}
                        />
                    )}
                    {createNewSlotOpen && (
                        <CreateNewSlot
                            componentName={'TACALENDER'}
                            timezoneID={storedTimezoneId}
                        />
                    )}
                    {openEventData && (
                        <ScheduleSession
                            componentName={'TACALENDER'}
                            timezoneID={storedTimezoneId}
                        />
                    )}
                    {taEditScheduledStudents && (
                        <EditStudentsFromSession componentName={'TACALENDER'} />
                    )}
                    {taEditScheduledBatches && (
                        <EditBatchesFromSession componentName={'TACALENDER'} />
                    )}
                </Box>
            </Box>
        </>
    );
};

export default TaCalender;
