import { Box, DialogActions, Grid, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarComponent from '../../../components/Calender/BigCalendar';
import { useDispatch, useSelector } from 'react-redux';
import TaMenuSidebar from './TeachingAssistantSidebar';
import Header from '../../../components/Header/Header';
import {
    getTaMenuSessions,
    getTaMenuSlots,
} from '../../../redux/features/taModule/tamenuSlice';
import {
    openCreateNewSlot,
    openMarkLeaveDate,
    openScheduleNewSession,
} from '../../../redux/features/commonCalender/commonCalender';
import CreateSlot from '../../../components/RoleRoute/CommonComponent/commonCalender/CreateSlot';
import CreateSession from '../../../components/RoleRoute/CommonComponent/commonCalender/CreateSession';
import SelectStudents from '../../../components/RoleRoute/CommonComponent/commonCalender/SelectStudents';
import SelectBatches from '../../../components/RoleRoute/CommonComponent/commonCalender/SelectBatches';
import MarkLeaveDate from '../../../components/RoleRoute/CommonComponent/commonCalender/MarkLeaveDate';
import CreatedSlots from '../../../components/RoleRoute/CommonComponent/commonCalender/CreatedSlots';
import SessionLink from '../../../components/RoleRoute/CommonComponent/commonCalender/SessionLink';
import { convertFromUTC } from '../../../utils/dateAndtimeConversion';
import { timezoneIdToName } from '../../../utils/timezoneIdToName';
import { getTimezone } from '../../../redux/features/utils/utilSlice';

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

const TAMenuCalendar = () => {
    const { timezones } = useSelector(state => state.util);
    const dispatch = useDispatch();
    const [eventsList, setEventsList] = useState([]);
    const [slotViewData, setSlotViewData] = useState([]);

    const {
        createNewSlotPopup,
        scheduleNewSessionPopup,
        selectStudentPopup,
        selectBatchPopup,
        markLeave,
        createdSlots,
        openSession,
    } = useSelector(state => state.commonCalender);

    const { taSlots, taSessions } = useSelector(state => state.taMenu);

    useEffect(() => {
        dispatch(getTaMenuSlots());
        dispatch(getTaMenuSessions());
        dispatch(getTimezone());
    }, [dispatch]);

    useEffect(() => {
        convertEvents();
    }, [taSessions, timezones]);

    useEffect(() => {
        convertSlots();
    }, [taSlots, timezones]);

    const convertEvents = async () => {
        if (
            taSessions &&
            taSessions.length > 0 &&
            storedTimezoneId &&
            timezones
        ) {
            const timezonename = timezoneIdToName(storedTimezoneId, timezones);
            if (!timezonename) {
                console.error('Invalid timezone name');
                setEventsList([]);
                return;
            }
            try {
                const processedEvents = [];
                await Promise.all(
                    taSessions.map(async event => {
                        const localTime = await convertFromUTC({
                            start_date: event.date.split(' ')[0],
                            start_time: event.start_time,
                            end_time: event.end_time,
                            end_date: event.date.split(' ')[0],
                            timezonename,
                        });

                        const startDateTime = new Date(
                            `${localTime.start_date}T${localTime.start_time}`
                        );
                        const endDateTime = new Date(
                            `${localTime.end_date}T${localTime.end_time}`
                        );

                        if (localTime.start_date !== localTime.end_date) {
                            processedEvents.push(
                                {
                                    id: event.id,
                                    start: startDateTime,
                                    end: new Date(
                                        `${localTime.start_date}T23:59:59`
                                    ),
                                    meetingName: event.meeting_name,
                                    meetingId : event.meeting_id,
                                    platformId : event.platform_id,
                                    platform_tools : event.platform_tool_details,
                                    platform_meeting : event.platform_meeting_details,
                                    students : event.students,
                                    batches : event.batch
                                },
                                {
                                    id: event.id,
                                    start: new Date(
                                        `${localTime.end_date}T00:00:00`
                                    ),
                                    end: endDateTime,
                                    meetingName: event.meeting_name,
                                    meetingId : event.meeting_id,
                                    platformId : event.platform_id,
                                    platform_tools : event.platform_tool_details,
                                    platform_meeting : event.platform_meeting_details,
                                    students : event.students,
                                    batches : event.batch
                                }
                            );
                        } else {
                            processedEvents.push({
                                id: event.id,
                                start: startDateTime,
                                end: endDateTime,
                                meetingName: event.meeting_name,
                                meetingId : event.meeting_id,
                                platformId : event.platform_id,
                                platform_tools : event.platform_tool_details,
                                platform_meeting : event.platform_meeting_details,
                                students : event.students,
                                batches : event.batch
                            });
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
        if (taSlots && taSlots.length > 0 && storedTimezoneId && timezones) {
            const timezonename = timezoneIdToName(storedTimezoneId, timezones);
            try {
                const processedSlots = [];
                await Promise.all(
                    taSlots.map(async slot => {
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
                            processedSlots.push(
                                {
                                    startDate: startDateTime,
                                    endDate: new Date(
                                        `${localTime.start_date}T23:59:59`
                                    ),
                                    leave: slot.leave,
                                },
                                {
                                    startDate: new Date(
                                        `${localTime.end_date}T00:00:00`
                                    ),
                                    endDate: endDateTime,
                                    leave: slot.leave,
                                }
                            );
                        } else {
                            processedSlots.push({
                                startDate: startDateTime,
                                endDate: endDateTime,
                                leave: slot.leave,
                            });
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

    const handleScheduleNewSession = () => {
        dispatch(openScheduleNewSession());
    };

    const handleMarkLeave = () => {
        dispatch(openMarkLeaveDate());
    };

    const handleCreateNewSlot = () => {
        dispatch(openCreateNewSlot());
    };

    return (
        <>
            <Header />
            <TaMenuSidebar />

            <Box sx={{ backgroundColor: '#f8f9fa', p: 3 }}>
                <DialogActions sx={{ p: 2 }}>
                    <Grid container alignItems="center">
                        <Grid item xs>
                            <Typography
                                variant="h4"
                                sx={{ mb: 4, fontFamily: 'ExtraLight' }}
                            >
                                {'My Calendar'}
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
                    componentName={'TAMENU'}
                />
                {createNewSlotPopup && <CreateSlot componentName={'TAMENU'} />}
                {scheduleNewSessionPopup && (
                    <CreateSession componentName={'TAMENU'} />
                )}
                {selectStudentPopup && (
                    <SelectStudents componentName={'TAMENU'} />
                )}
                {selectBatchPopup && <SelectBatches componentName={'TAMENU'} />}
                {markLeave && <MarkLeaveDate componentName={'TAMENU'} />}
                {createdSlots && <CreatedSlots componentName={'TAMENU'} />}
                {openSession && <SessionLink componentName={'TAMENU'} />}
            </Box>
        </>
    );
};

export default TAMenuCalendar;
