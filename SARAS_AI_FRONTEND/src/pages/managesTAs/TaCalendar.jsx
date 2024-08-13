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
import {
    getTAScheduledSessions,
    openScheduleSession,
} from '../../redux/features/adminModule/ta/taScheduling';
import Schedule from '../../components/availability/Schedule';
import EditBatches from '../../components/availability/EditBatches';
import EditStudents from '../../components/availability/EditStudents';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import ScheduleSession from '../../components/availability/ScheduleSession';
import EditStudentsFromSession from '../../components/availability/EditStudentsFromSession';
import EditBatchesFromSession from '../../components/availability/EditBatchesFromSession';

import { convertFromUTC } from '../../utils/dateAndtimeConversion';
import { timezoneIdToName } from '../../utils/timezoneIdToName';
import { getTimezone } from '../../redux/features/utils/utilSlice';
import { ConnectingAirportsOutlined } from '@mui/icons-material';

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
const storedTimezoneId = Number(localStorage.getItem('timezone_id'));
const TaCalender = () => {
    const { timezones } = useSelector(state => state.util);

    const dispatch = useDispatch();
    const { id, name } = useParams();

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
        dispatch(getTimezone());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchTaSlots(id));
        dispatch(fetchTAScheduleById(id));
    }, [dispatch]);

    const convertEvents = async () => {
            if (scheduleData && scheduleData.length > 0 && storedTimezoneId) {
                const timezonename = timezoneIdToName(
                    storedTimezoneId,
                    timezones
                );
                if (!timezonename) {
                    console.error('Invalid timezone name');
                    setEventsList([]);
                    return;
                }
                try {
                    const transformedEvents = await Promise.all(
                        scheduleData.map(async event => {
                            const localTime = await convertFromUTC({
                                start_date: event.date.split(' ')[0],
                                start_time: event.start_time,
                                end_time: event.end_time,
                                end_date: event.date.split(' ')[0],
                                timezonename,
                            });
                            console.log(
                                'Converted Local Schedule Time:',
                                localTime
                            );
                            return {
                                id: event.id,
                                admin_user_id: event.admin_user_id,
                                meetingName: event.meeting_name,
                                meetingId: event.meeting_id,
                                platformId: event.platform_id,
                                start: new Date(
                                    `${localTime.start_date}T${localTime.start_time}`
                                ),
                                end: new Date(
                                    `${localTime.end_date}T${localTime.end_time}`
                                ),
                                platform_tools: event.platform_tool_details,
                                platform_meet: event.platform_meeting_details,
                            };
                        })
                    );
                    setEventsList(transformedEvents);
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
    }, [scheduleData]);

    console.log('setEventsList :', eventsList);

    const convertSlots = async () => {
            if (
                slotData &&
                slotData.length > 0 &&
                timezones &&
                storedTimezoneId
            ) {
                
                const timezonename = timezoneIdToName(
                    storedTimezoneId,
                    timezones
                );
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

                            const startDateTime = new Date(`${localTime.start_date}T${localTime.start_time}`);
                            const endDateTime = new Date(`${localTime.end_date}T${localTime.end_time}`);
                        
                            if (localTime.start_date !== localTime.end_date) {
                                const slot1 = {
                                    startDate: startDateTime,
                                    endDate: new Date(`${localTime.start_date}T23:59:59`),
                                    leave: slot?.leaves,
                                };
                    
                                const slot2 = {
                                    startDate: new Date(`${localTime.end_date}T00:00:00`),
                                    endDate: endDateTime,
                                    leave: slot?.leaves,
                                };
                    
                                console.log('slots created',slot1,slot2);
                                
                                processedSlots.push(slot1,slot2);
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
                    console.log('transformed slots',processedSlots);
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

    console.log('transformedSlots :', slotViewData);

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

    console.log('SlotViewData', slotViewData);
    // console.log("sessiond data", scheduleData.data);

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
                        <Schedule componentName={'TASCHEDULE'} />
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
                        />
                    )}
                    {scheduledSlotsOpen && (
                        <Slots
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                        />
                    )}
                    {scheduledSessionOpen && (
                        <ScheduledSessions
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                        />
                    )}
                    {cancelSessionOpen && (
                        <CancelSchedule
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                        />
                    )}
                    {reasonForLeaveOpen && (
                        <ReasonForLeave
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                        />
                    )}
                    {resheduleSessionOpen && (
                        <ReschedulingSession
                            id={id}
                            name={name}
                            componentName={'TACALENDER'}
                        />
                    )}
                    {deletingCoachFutureSlots && (
                        <DeleteAllSlots componentName={'TACALENDER'} />
                    )}
                    {createNewSlotOpen && (
                        <CreateNewSlot componentName={'TACALENDER'} />
                    )}
                    {openEventData && (
                        <ScheduleSession componentName={'TACALENDER'} />
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
