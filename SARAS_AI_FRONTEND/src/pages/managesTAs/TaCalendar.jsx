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
    const dispatch = useDispatch();
    const { id, name } = useParams();
    const [timezoneID, setTimezoneId] = useState(null);

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

useEffect(() => {
        // Fetch timezoneID from localStorage
        const storedTimezoneId = localStorage.getItem('timezone_id');
        if (storedTimezoneId) {
            setTimezoneId(storedTimezoneId);
        }
    }, []);

    useEffect(() => {
        if (scheduleData && scheduleData.data) {
            const transformedEvents = scheduleData.data.map(event => ({
                id: event.id,
                admin_user_id: event.admin_user_id,
                meetingName: event.meeting_name,
                meetingId: event.meeting_id,
                platformId: event.platform_id,
                start: new Date(
                    event.date.split(' ')[0] + 'T' + event.start_time
                ),
                end: new Date(event.date.split(' ')[0] + 'T' + event.end_time),
                platform_tools: event.platform_tool_details,
                platform_meet: event.platform_meeting_details,
            }));
            setEventsList(transformedEvents);
        } else {
            setEventsList([]);
        }
    }, [scheduleData]);

  useEffect(() => {
    const timezonename = 'Asia/Kolkata';
    const convertSlots = async () => {
        if (slotData.data && slotData.data.length > 0) {
            const transformedSlots = await Promise.all(
                slotData.data.map(async slot => {
                    const localTime = await convertFromUTC({
                        slot_date: slot.slot_date,
                        from_time: slot.from_time,
                        to_time: slot.to_time,
                        end_date: slot.slot_date, 
                        timezonename 
                    });
                    
                    console.log('Converted Local Time:', localTime);
                    return {
                        startDate: new Date(localTime.date_slot + 'T' + localTime.start_time),
                        endDate: new Date(localTime.date_slot + 'T' + localTime.time_end),
                        leave: slot?.leaves,
                    };
                })
            );

            setSlotViewData(transformedSlots);
        } else {
            setSlotViewData([]);
        }
    };

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
