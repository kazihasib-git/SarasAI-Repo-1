import { Box, DialogActions, Grid, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarComponent from '../../components/Calender/BigCalendar';
import MarkLeave from '../../components/availability/MarkLeave';
import DeleteAllSlots from '../../components/availability/DeleteAllSlots';
import CreateNewSlot from '../../components/availability/CreateNewSlot';
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
} from '../../redux/features/adminModule/ta/taAvialability';
import { useDispatch, useSelector } from 'react-redux';
import Slots from '../../components/availability/Slots';
import ScheduledSessions from '../../components/availability/ScheduledSessions';
import CancelSchedule from '../../components/availability/CancelSchedule';
import ReasonForLeave from '../../components/availability/ReasonForLeave';
import ReschedulingSession from '../../components/availability/ReschedulingSession';
import { useParams } from 'react-router-dom';
import { openScheduleSession } from '../../redux/features/adminModule/ta/taScheduling';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import ScheduleSession from '../../components/availability/ScheduleSession';
import EditStudentsFromSession from '../../components/availability/EditStudentsFromSession';
import EditBatchesFromSession from '../../components/availability/EditBatchesFromSession';
import { convertFromUTC } from '../../utils/dateAndtimeConversion';
import {
    fetchtimezoneDetails,
    timezoneIdToName,
} from '../../utils/timezoneIdToName';
import CustomButton from '../../components/CustomFields/CustomButton';
import CreateNewSession from '../../components/availability/CreateNewSession';
import SelectBatches from '../../components/batches/SelectBatches';
import SelectStudents from '../../components/students/SelectStudents';
import { useGetTimezonesQuery } from '../../redux/services/timezones/timezonesApi';

const TaCalender = () => {
    const dispatch = useDispatch();
    const { id, name, timezoneId } = useParams();
    const { data : timezones, error, isLoading } = useGetTimezonesQuery();

    useEffect(() => {
        if(id){
        dispatch(fetchTaSlots(id));
        dispatch(fetchTAScheduleById(id));
        }
    }, [dispatch, id]);

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
        deletingCoachFutureSlots,
        openEventData,
        taEditScheduledStudents,
        taEditScheduledBatches,
    } = useSelector(state => state.taAvialability);

    const { scheduleSessionOpen } = useSelector(state => state.taScheduling);

    const { openBatches, openStudents } = useSelector(
        state => state.batchesAndStudents
    );

    //calendar
    const [eventsList, setEventsList] = useState([]);
    const [slotViewData, setSlotViewData] = useState([]);
    const [timezoneDetails, setTimezoneDetails] = useState();

    useEffect(() => {
        if (timezoneId && timezones?.length > 0) {
            const timezone = fetchtimezoneDetails(timezoneId, timezones);
            if (timezone){
                setTimezoneDetails(timezone);
                if(scheduleData?.length > 0) {
                    convertEvents();
                }
                if(slotData?.length > 0){
                    convertSlots();
                }
            }else {
                setSlotViewData([])
                setEventsList([])
            }
        }else {
            setSlotViewData([])
            setEventsList([])
        }
    }, [timezoneId, timezones, scheduleData, slotData]);

    const convertEvents = async () => {
        if (
            scheduleData &&
            scheduleData.length > 0 &&
            timezoneDetails?.time_zone
        ) {
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
                            timezonename: timezoneDetails?.time_zone,
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

    const convertSlots = async () => {
        if (slotData && slotData.length > 0 && timezoneDetails?.time_zone) {
            try {
                const processedSlots = [];

                const transformedSlots = await Promise.all(
                    slotData.map(async slot => {
                        const localTime = await convertFromUTC({
                            start_date: slot.slot_date,
                            start_time: slot.from_time,
                            end_time: slot.to_time,
                            end_date: slot.slot_end_date,
                            timezonename: timezoneDetails?.time_zone,
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
                        //<Schedule
                        <CreateNewSession
                            id={id}
                            name={name}
                            componentName={'TASCHEDULE'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {openBatches && (
                        <SelectBatches
                            id={id}
                            name={name}
                            componentName={'TASCHEDULE'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {openStudents && (
                        <SelectStudents
                            id={id}
                            name={name}
                            componentName={'TASCHEDULE'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {markLeaveOpen && (
                        <MarkLeave
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {scheduledSlotsOpen && (
                        <Slots
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {scheduledSessionOpen && (
                        <ScheduledSessions
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {cancelSessionOpen && (
                        <CancelSchedule
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {reasonForLeaveOpen && (
                        <ReasonForLeave
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {resheduleSessionOpen && (
                        <ReschedulingSession
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {deletingCoachFutureSlots && (
                        <DeleteAllSlots
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {createNewSlotOpen && (
                        <CreateNewSlot
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {openEventData && (
                        <ScheduleSession
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {taEditScheduledStudents && (
                        <EditStudentsFromSession
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}
                    {taEditScheduledBatches && (
                        <EditBatchesFromSession
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                            timezone={timezoneDetails}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};

export default TaCalender;
