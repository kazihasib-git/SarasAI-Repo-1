import { Box, DialogActions, Grid, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarComponent from '../../../components/Calender/BigCalendar';
import MarkLeave from '../../../components/availability/MarkLeave';
import DeleteAllSlots from '../../../components/availability/DeleteAllSlots';
import CreateNewSlot from '../../../components/availability/CreateNewSlot';
import Slots from '../../../components/availability/Slots';
import CancelSchedule from '../../../components/availability/CancelSchedule';
import ReasonForLeave from '../../../components/availability/ReasonForLeave';
import ReschedulingSession from '../../../components/availability/ReschedulingSession';
import ScheduledSessions from '../../../components/availability/ScheduledSessions';
import { convertFromUTC } from '../../../utils/dateAndtimeConversion';
import {
    openCoachMarkLeave,
    fetchCoachSlots,
    fetchCoachScheduleById,
    openDeleteCoachSlots,
} from '../../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import EditBatches from '../../../components/availability/EditBatches';
import EditStudents from '../../../components/availability/EditStudents';
import { openCoachScheduleSession } from '../../../redux/features/adminModule/coach/coachSchedule';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Schedule from '../../../components/availability/Schedule';
import { openCreateNewSlots } from '../../../redux/features/adminModule/ta/taAvialability';
import ScheduleSession from '../../../components/availability/ScheduleSession';
import { timezoneIdToName } from '../../../utils/timezoneIdToName';
import EditStudentsFromSession from '../../../components/availability/EditStudentsFromSession';
import EditBatchesFromSession from '../../../components/availability/EditBatchesFromSession';
import CustomButton from '../../../components/CustomFields/CustomButton';
import { useGetTimezonesQuery } from '../../../redux/services/timezones/timezonesApi';
import { createEvent } from '../../../utils/eventUtil';

const CoachCalender = () => {
    const dispatch = useDispatch();
    const { id, name, timezoneId } = useParams();
    const { data: timezones, isLoading } = useGetTimezonesQuery();

    const [eventsList, setEventsList] = useState([]);
    const [slotViewData, setSlotViewData] = useState([]);

    const { createNewSlotOpen } = useSelector(state => state.taAvialability);

    const { openEditStudent, openEditBatch } = useSelector(
        state => state.taScheduling
    );

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

    const {
        scheduleCoachSessionOpen,
        openCoachEditBatch,
        openCoachEditStudent,
    } = useSelector(state => state.coachScheduling);

    useEffect(() => {
        dispatch(fetchCoachSlots(id));
        dispatch(fetchCoachScheduleById(id));
    }, [dispatch, id]);

    const convertEvents = async () => {
        if (
            scheduleCoachData &&
            scheduleCoachData.length > 0 &&
            timezoneId &&
            timezones
        ) {
            const timezonename = timezoneIdToName(Number(timezoneId), timezones);
            if (!timezonename) {
                console.error('Invalid timezone name');
                setEventsList([]);
                return;
            }
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
                            timezonename,
                        });

                        const startDateTime = new Date(
                            `${localTime.start_date}T${localTime.start_time}`
                        );
                        const endDateTime = new Date(
                            `${localTime.end_date}T${localTime.end_time}`
                        );

                        if (localTime.start_date !== localTime.end_date) {
                            const event1 = createEvent(
                                event,
                                startDateTime,
                                new Date(`${localTime.start_date}T23:59:59`)
                            );

                            const event2 = createEvent(
                                event,
                                new Date(`${localTime.end_date}T00:00:00`),
                                endDateTime
                            );

                            processedEvents.push(event1, event2);
                            return [event1, event2];
                        } else {
                            const newEvent = createEvent(
                                event,
                                startDateTime,
                                endDateTime
                            );
                            processedEvents.push(newEvent);
                            return newEvent;
                        }
                    })
                );

                setEventsList(processedEvents);
            } catch (error) {
                console.error('Error converting events:', error);
                setEventsList([]);
            }
        } else {
            setEventsList([]);
        }
    };

    const convertSlots = async () => {
        if (
            slotCoachData &&
            slotCoachData.length > 0 &&
            timezones &&
            timezoneId
        ) {
            const timezonename = timezoneIdToName(Number(timezoneId), timezones);
            try {
                const processedSlots = [];
                const transformedSlots = await Promise.all(
                    slotCoachData.map(async slot => {
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
                            return newSlot;
                        }
                    })
                );
                setSlotViewData(processedSlots);
            } catch (error) {
                console.error('Error converting slots:', error);
                setSlotViewData([]);
            }
        } else {
            setSlotViewData([]);
        }
    };

    useEffect(() => {
        convertEvents();
    }, [scheduleCoachData]);

    useEffect(() => {
        convertSlots();
    }, [slotCoachData]);

    const handleScheduleNewSession = () => {
        dispatch(openCoachScheduleSession({ id, name, timezoneId }));
    };

    const handleMarkLeave = () => {
        dispatch(openCoachMarkLeave());
    };

    const handleDeleteFutureSlots = () => {
        const data = { id, name, timezoneId };
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
                        <Schedule
                            componentName={'COACHSCHEDULE'}
                            timezoneID={timezoneId}
                        />
                    )}
                    {openCoachEditBatch && (
                        <EditBatches
                            componentname={'COACHSCHEDULE'}
                            timezoneID={timezoneId}
                        />
                    )}
                    {openCoachEditStudent && (
                        <EditStudents
                            componentname={'COACHSCHEDULE'}
                            timezoneID={timezoneId}
                        />
                    )}
                    {coachMarkLeaveOpen && (
                        <MarkLeave
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezoneID={timezoneId}
                        />
                    )}

                    {scheduledCoachSlotsOpen && (
                        <Slots
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezoneID={timezoneId}
                        />
                    )}

                    {scheduledCoachSessionOpen && (
                        <ScheduledSessions
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezoneID={timezoneId}
                        />
                    )}

                    {cancelCoachSessionOpen && (
                        <CancelSchedule
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezoneID={timezoneId}
                        />
                    )}

                    {reasonForCoachLeaveOpen && (
                        <ReasonForLeave
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezoneID={timezoneId}
                        />
                    )}

                    {resheduleCoachSessionOpen && (
                        <ReschedulingSession
                            id={id}
                            name={name}
                            componentName={'COACHCALENDER'}
                            timezoneID={timezoneId}
                        />
                    )}

                    {deletingCoachFutureSlots && (
                        <DeleteAllSlots
                            componentName={'COACHCALENDER'}
                            timezoneID={timezoneId}
                        />
                    )}

                    {createNewSlotOpen && (
                        <CreateNewSlot
                            // addEvent={addEvent}
                            componentName={'COACHCALENDER'}
                            timezoneID={timezoneId}
                        />
                    )}
                    {coachOpenEventData && (
                        <ScheduleSession
                            componentName={'COACHCALENDER'}
                            timezoneID={timezoneId}
                        />
                    )}
                    {coachEditScheduledBatches && (
                        <EditBatchesFromSession
                            componentName={'COACHCALENDER'}
                            timezoneID={timezoneId}
                        />
                    )}
                    {coachEditScheduledStudents && (
                        <EditStudentsFromSession
                            componentName={'COACHCALENDER'}
                            timezoneID={timezoneId}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};

export default CoachCalender;
