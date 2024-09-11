import { Box, DialogActions, Grid, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarComponent from '../../components/Calender/BigCalendar';
import MarkLeave from '../../components/availability/MarkLeave';
import DeleteAllSlots from '../../components/availability/DeleteAllSlots';
import CreateNewSlot from '../../components/availability/CreateNewSlot';
import Slots from '../../components/availability/Slots';
import CancelSchedule from '../../components/availability/CancelSchedule';
import ReasonForLeave from '../../components/availability/ReasonForLeave';
import ReschedulingSession from '../../components/availability/ReschedulingSession';
import ScheduledSessions from '../../components/availability/ScheduledSessions';
import { convertFromUTC } from '../../utils/dateAndtimeConversion';
import {
    openCoachMarkLeave,
    fetchCoachSlots,
    fetchCoachScheduleById,
    openCoachCreateNewSlots,
    openDeleteCoachSlots,
} from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import { openCoachScheduleSession } from '../../redux/features/adminModule/coach/coachSchedule';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { openCreateNewSlots } from '../../redux/features/adminModule/ta/taAvialability';
import ScheduleSession from '../../components/availability/ScheduleSession';
import { fetchtimezoneDetails } from '../../utils/timezoneIdToName';
import EditStudentsFromSession from '../../components/availability/EditStudentsFromSession';
import EditBatchesFromSession from '../../components/availability/EditBatchesFromSession';
import CreateNewSession from '../../components/availability/CreateNewSession';
import SelectStudents from '../../components/students/SelectStudents';
import SelectBatches from '../../components/batches/SelectBatches';
import CustomButton from '../../components/CustomFields/CustomButton';
import { useGetTimezonesQuery } from '../../redux/services/timezones/timezonesApi';

const CoachCalender = () => {
    const dispatch = useDispatch();
    const { id, name, timezoneId } = useParams();
    const { data: timezones, error, isLoading } = useGetTimezonesQuery();

    const [timezoneDetails, setTimezoneDetails] = useState();
    const [eventsList, setEventsList] = useState([]);
    const [slotViewData, setSlotViewData] = useState([]);

    useEffect(() => {
        if (id) {
            dispatch(fetchCoachSlots(id));
            dispatch(fetchCoachScheduleById(id));
        }
    }, [dispatch, id]);

    const { createNewSlotOpen } = useSelector(state => state.taAvialability);

    const {
        coachMarkLeaveOpen,
        scheduledCoachSlotsOpen,
        scheduledCoachSessionOpen,
        cancelCoachSessionOpen,
        reasonForCoachLeaveOpen,
        resheduleCoachSessionOpen,
        createNewCoachSlotOpen,
        slotCoachData,
        scheduleCoachData,
        deletingCoachFutureSlots,
        coachOpenEventData,
        coachEditScheduledStudents,
        coachEditScheduledBatches,
    } = useSelector(state => state.coachAvailability);

    const { scheduleCoachSessionOpen } = useSelector(
        state => state.coachScheduling
    );

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
        if (timezoneDetails) {
            scheduleCoachData?.length > 0 ? convertEvents() : setEventsList([]);
        }
    }, [timezoneDetails, scheduleCoachData]);

    useEffect(() => {
        if (timezoneDetails) {
            slotCoachData?.length > 0 ? convertSlots() : setSlotViewData([]);
        }
    }, [timezoneDetails, slotCoachData]);

    const convertEvents = async () => {
        try {
            const processedEvents = [];
            const transformedEvents = await Promise.all(
                scheduleCoachData.map(async event => {
                    const localTime = await convertFromUTC({
                        start_date: event.date.split(' ')[0],
                        start_time: event.start_time,
                        end_time: event.end_time,
                        end_date: event.end_date
                            ? event.end_date
                            : event.date.split(' ')[0],
                        timezonename: timezoneDetails.time_zone,
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
                            end: new Date(`${localTime.start_date}T23:59:59`),
                            platform_tools: event.platform_tool_details,
                            platform_meet: event.platform_meeting_details,
                        };

                        const event2 = {
                            id: event.id,
                            admin_user_id: event.admin_user_id,
                            meetingName: event.meeting_name,
                            meetingId: event.meeting_id,
                            platformId: event.platform_id,
                            start: new Date(`${localTime.end_date}T00:00:00`),
                            end: endDateTime,
                            platform_tools: event.platform_tool_details,
                            platform_meet: event.platform_meeting_details,
                        };

                        // console.log('events created', event1, event2);
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
            // console.log('transformed events', processedEvents);
            setEventsList(processedEvents);
        } catch (error) {
            console.error('Error converting events:', error);
            setEventsList([]);
        }
    };

    const convertSlots = async () => {
        try {
            const processedSlots = [];
            const transformedSlots = await Promise.all(
                slotCoachData.map(async slot => {
                    const localTime = await convertFromUTC({
                        start_date: slot.slot_date,
                        start_time: slot.from_time,
                        end_time: slot.to_time,
                        end_date: slot.slot_end_date,
                        timezonename: timezoneDetails.time_zone,
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

                        // console.log('slots created', slot1, slot2);
                        processedSlots.push(slot1, slot2);
                        return [slot1, slot2];
                    } else {
                        const newSlot = {
                            startDate: startDateTime,
                            endDate: endDateTime,
                            leave: slot?.leaves,
                        };
                        processedSlots.push(newSlot);
                        return newSlot;
                    }
                })
            );
            setSlotViewData(processedSlots);
        } catch (error) {
            console.error('Error converting slots:', error);
            setSlotViewData([]);
        }
    };

    const handleScheduleNewSession = () => {
        dispatch(openCoachScheduleSession({ id, name }));
    };

    const handleMarkLeave = () => {
        dispatch(openCoachMarkLeave());
    };

    const handleDeleteFutureSlots = () => {
        const data = { id, name };
        dispatch(openDeleteCoachSlots(data));
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
                                <Typography
                                    variant="h4"
                                    sx={{ mb: 4, fontFamily: 'ExtraLight' }}
                                >
                                    {name}'s Calendar
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
                                    >
                                        <AddCircleOutlineIcon />
                                        Schedule New Session
                                    </CustomButton>

                                    <CustomButton
                                        onClick={handleMarkLeave}
                                        color="#F56D3B"
                                        backgroundColor="#FFFFFF"
                                        borderColor="#F56D3B"
                                    >
                                        Mark Leave
                                    </CustomButton>

                                    <CustomButton
                                        onClick={handleDeleteFutureSlots}
                                        color="#F56D3B"
                                        backgroundColor="#FFFFFF"
                                        borderColor="#F56D3B"
                                    >
                                        Delete All Future Slots
                                    </CustomButton>

                                    <CustomButton
                                        color="#FFFFFF"
                                        backgroundColor="#F56D3B"
                                        borderColor="#F56D3B"
                                        onClick={handleCreateNewSlot}
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
                        componentName={'COACHCALENDER'}
                    />
                    {scheduleCoachSessionOpen && (
                        <CreateNewSession
                            id={id}
                            name={name}
                            componentName={'COACHSCHEDULE'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {openBatches && (
                        <SelectBatches
                            id={id}
                            name={name}
                            componentName={'COACHSCHEDULE'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {openStudents && (
                        <SelectStudents
                            id={id}
                            name={name}
                            componentName={'COACHSCHEDULE'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {coachMarkLeaveOpen && (
                        <MarkLeave
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}

                    {scheduledCoachSlotsOpen && (
                        <Slots
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}

                    {scheduledCoachSessionOpen && (
                        <ScheduledSessions
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}

                    {cancelCoachSessionOpen && (
                        <CancelSchedule
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}

                    {reasonForCoachLeaveOpen && (
                        <ReasonForLeave
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}

                    {resheduleCoachSessionOpen && (
                        <ReschedulingSession
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}

                    {deletingCoachFutureSlots && (
                        <DeleteAllSlots
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}

                    {createNewSlotOpen && (
                        <CreateNewSlot
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {coachOpenEventData && (
                        <ScheduleSession
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {coachEditScheduledBatches && (
                        <EditBatchesFromSession
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {coachEditScheduledStudents && (
                        <EditStudentsFromSession
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};

export default CoachCalender;
