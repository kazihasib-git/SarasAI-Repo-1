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
import Sidebar from '../../../components/Sidebar/Sidebar';
import ScheduleSession from '../../../components/availability/ScheduleSession';
import EditStudentsFromSession from '../../../components/availability/EditStudentsFromSession';
import EditBatchesFromSession from '../../../components/availability/EditBatchesFromSession';

import { convertFromUTC } from '../../../utils/dateAndtimeConversion';
import { timezoneIdToName } from '../../../utils/timezoneIdToName';
import { useGetTimezonesQuery } from '../../../redux/services/timezones/timezonesApi';
import { createEvent } from '../../../utils/eventUtil';
import CustomButton from '../../../components/CustomFields/CustomButton';


const TaCalender = () => {

     const dispatch = useDispatch();
    const { id, name, timezoneId } = useParams();
    const { data: timezones, isLoading } = useGetTimezonesQuery();

    const timezoneName = timezones ? timezoneIdToName(Number(timezoneId), timezones) : 0;

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

    useEffect(() => {
        dispatch(fetchTaSlots(id));
        dispatch(fetchTAScheduleById(id));
    }, [dispatch, id]);

    const convertEvents = async () => {
        if (scheduleData && scheduleData.length > 0 && timezoneName) {
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
                            timezoneName,
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
                setEventsList([]); // Reset to empty array on error
            }
        } else {
            setEventsList([]);
        }
    };

    const convertSlots = async () => {
        if (slotData && slotData.length > 0 && timezoneName) {
            try {
                const processedSlots = [];

                const transformedSlots = await Promise.all(
                    slotData.map(async slot => {
                        const localTime = await convertFromUTC({
                            start_date: slot.slot_date,
                            start_time: slot.from_time,
                            end_time: slot.to_time,
                            end_date: slot.slot_end_date,
                            timezoneName,
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
        convertEvents();
    }, [scheduleData, timezoneName]);

    useEffect(() => {
        convertSlots();
    }, [slotData, timezoneName]);

    const handleScheduleNewSession = () => {
        dispatch(openScheduleSession({ id, name, timezoneId }));
    };

    const handleMarkLeave = () => {
        dispatch(openMarkLeave());
    };

    const handleDeleteFutureSlots = () => {
        const data = { id, name, timezoneId };
        dispatch(openDeleteTaSlots(data));
    };

    const handleCreateNewSlot = () => {
        dispatch(openCreateNewSlots());
    };

    return (
        <Box m={'20px'}>
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
                            <Box display="flex" justifyContent="center" gap={2}>
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
                        timezoneId={timezoneId}
                        timezoneName={timezoneName}
                    />
                )}
                {openEditBatch && (
                    <EditBatches
                        componentName={'TASCHEDULE'}
                        timezoneId={timezoneId}
                        timezoneName={timezoneName}
                    />
                )}
                {openEditStudent && (
                    <EditStudents
                        componentName={'TASCHEDULE'}
                        timezoneId={timezoneId}
                        timezoneName={timezoneName}
                    />
                )}
                {markLeaveOpen && (
                    <MarkLeave
                        id={id}
                        name={name}
                        componentName={'TASCHEDULE'}
                        timezoneId={timezoneId}
                        timezoneName={timezoneName}
                    />
                )}
                {scheduledSlotsOpen && (
                    <Slots
                        id={id}
                        name={name}
                        componentName={'TASCHEDULE'}
                        timezoneId={timezoneId}
                        timezoneName={timezoneName}
                    />
                )}
                {scheduledSessionOpen && (
                    <ScheduledSessions
                        id={id}
                        name={name}
                        componentName={'TASCHEDULE'}
                        timezoneId={timezoneId}
                        timezoneName={timezoneName}
                    />
                )}
                {cancelSessionOpen && (
                    <CancelSchedule
                        id={id}
                        name={name}
                        componentName={'TASCHEDULE'}
                        timezoneId={timezoneId}
                        timezoneName={timezoneName}
                    />
                )}
                {reasonForLeaveOpen && (
                    <ReasonForLeave
                        id={id}
                        name={name}
                        componentName={'TASCHEDULE'}
                        timezoneId={timezoneId}
                        timezoneName={timezoneName}
                    />
                )}
                {resheduleSessionOpen && (
                    <ReschedulingSession
                        id={id}
                        name={name}
                        componentName={'TASCHEDULE'}
                        timezoneId={timezoneId}
                        timezoneName={timezoneName}
                    />
                )}
                {deletingCoachFutureSlots && (
                    <DeleteAllSlots
                        componentName={'TASCHEDULE'}
                        timezoneId={timezoneId}
                        timezoneName={timezoneName}
                    />
                )}
                {createNewSlotOpen && (
                    <CreateNewSlot
                        componentName={'TASCHEDULE'}
                        timezoneId={timezoneId}
                        timezoneName={timezoneName}
                    />
                )}
                {openEventData && (
                    <ScheduleSession
                        componentName={'TASCHEDULE'}
                        timezoneId={timezoneId}
                        timezoneName={timezoneName}
                    />
                )}
                {taEditScheduledStudents && (
                    <EditStudentsFromSession
                        componentName={'TASCHEDULE'}
                        timezoneId={timezoneId}
                        timezoneName={timezoneName}
                    />
                )}
                {taEditScheduledBatches && (
                    <EditBatchesFromSession
                        componentName={'TASCHEDULE'}
                        timezoneId={timezoneId}
                        timezoneName={timezoneName}
                    />
                )}
            </Box>
        </Box>
    );
};

export default TaCalender;

