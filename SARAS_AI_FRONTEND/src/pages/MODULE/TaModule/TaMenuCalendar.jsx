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
import { fetchtimezoneDetails } from '../../../utils/timezoneIdToName';
import CancelSession from '../../../components/RoleRoute/CommonComponent/commonCalender/CancelSession';
import RescheduleCreatedSession from '../../../components/RoleRoute/CommonComponent/commonCalender/RescheduleCreatedSession';
import LeaveReason from '../../../components/RoleRoute/CommonComponent/commonCalender/LeaveReason';
import CreatedSessions from '../../../components/RoleRoute/CommonComponent/commonCalender/CreatedSessions';
import EditBatchesSessionLink from '../../../components/RoleRoute/CommonComponent/commonCalender/EditBatchesSessionLink';
import EditStudentsSessionLink from '../../../components/RoleRoute/CommonComponent/commonCalender/EditStudentsSessionLink';
import CustomButton from '../../../components/CustomFields/CustomButton';
import { useGetTimezonesQuery } from '../../../redux/services/timezones/timezonesApi';

const TAMenuCalendar = () => {
    const dispatch = useDispatch();
    const { timezoneId } = useSelector(state => state.auth);
    const { data: timezones, error, isLoading } = useGetTimezonesQuery();

    const [eventsList, setEventsList] = useState([]);
    const [slotViewData, setSlotViewData] = useState([]);
    const [timezoneDetails, setTimezoneDetails] = useState();
    const [selectedSession, setSelectedSession] = useState(null);

    const {
        createNewSlotPopup,
        scheduleNewSessionPopup,
        selectStudentPopup,
        selectBatchPopup,
        markLeave,
        createdSlots,
        openSession,
        sessionEventData,
        openCreatedSessions,
        openCancelSession,
        openLeaveReason,
        RescheduleSession,
        openEditStudentsPopup,
        openEditBatchesPopup,
    } = useSelector(state => state.commonCalender);

    const { taSlots, taSessions } = useSelector(state => state.taMenu);
    const { openBatches, openStudents } = useSelector(
        state => state.batchesAndStudents
    );

    useEffect(() => {
        dispatch(getTaMenuSlots());
        dispatch(getTaMenuSessions());
    }, [dispatch]);

    useEffect(() => {
        if (timezoneId && timezones?.length > 0) {
            const timezone = fetchtimezoneDetails(timezoneId, timezones);
            setTimezoneDetails(timezone);
        }
    }, [timezoneId, timezones]);

    useEffect(() => {
        if (timezoneDetails) {
            taSessions?.length > 0 ? convertEvents() : setEventsList([]);
        }
    }, [timezoneDetails, taSessions]);

    useEffect(() => {
        if (timezoneDetails) {
            taSlots?.length > 0 ? convertSlots() : setSlotViewData([]);
        }
    }, [timezoneDetails, taSlots]);

    const convertEvents = async () => {
        try {
            const processedEvents = [];
            await Promise.all(
                taSessions.map(async event => {
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
                        processedEvents.push(
                            {
                                id: event.id,
                                start: startDateTime,
                                end: new Date(
                                    `${localTime.start_date}T23:59:59`
                                ),
                                meetingName: event.meeting_name,
                                meetingId: event.meeting_id,
                                platformId: event.platform_id,
                                platform_tools: event.platform_tool_details,
                                platform_meeting:
                                    event.platform_meeting_details,
                                students: event.students,
                                batches: event.batch,
                            },
                            {
                                id: event.id,
                                start: new Date(
                                    `${localTime.end_date}T00:00:00`
                                ),
                                end: endDateTime,
                                meetingName: event.meeting_name,
                                meetingId: event.meeting_id,
                                platformId: event.platform_id,
                                platform_tools: event.platform_tool_details,
                                platform_meeting:
                                    event.platform_meeting_details,
                                students: event.students,
                                batches: event.batch,
                            }
                        );
                    } else {
                        processedEvents.push({
                            id: event.id,
                            start: startDateTime,
                            end: endDateTime,
                            meetingName: event.meeting_name,
                            meetingId: event.meeting_id,
                            platformId: event.platform_id,
                            platform_tools: event.platform_tool_details,
                            platform_meeting: event.platform_meeting_details,
                            students: event.students,
                            batches: event.batch,
                        });
                    }
                })
            );
            setEventsList(processedEvents);
        } catch (error) {
            console.error('Error converting events:', error);
            setEventsList([]);
        }
    };

    const convertSlots = async () => {
        try {
            const processedSlots = [];
            await Promise.all(
                taSlots.map(async slot => {
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
                        processedSlots.push(
                            {
                                startDate: startDateTime,
                                endDate: new Date(
                                    `${localTime.start_date}T23:59:59`
                                ),
                                leave: slot.leaves,
                            },
                            {
                                startDate: new Date(
                                    `${localTime.end_date}T00:00:00`
                                ),
                                endDate: endDateTime,
                                leave: slot.leaves,
                            }
                        );
                    } else {
                        processedSlots.push({
                            startDate: startDateTime,
                            endDate: endDateTime,
                            leave: slot.leaves,
                        });
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
        dispatch(openScheduleNewSession());
    };

    const handleMarkLeave = () => {
        dispatch(openMarkLeaveDate());
    };

    const handleCreateNewSlot = () => {
        dispatch(openCreateNewSlot());
    };
    const handleSessionSelect = taSessions => {
        setSelectedSession(taSessions.id);
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
                    onSelectEvent={handleSessionSelect}
                />
                {createNewSlotPopup && (
                    <CreateSlot
                        componentName={'TAMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {scheduleNewSessionPopup && (
                    <CreateSession
                        componentName={'TAMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {openBatches && (
                    <SelectBatches
                        componentName={'TAMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {openStudents && (
                    <SelectStudents
                        componentName={'TAMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {markLeave && (
                    <MarkLeaveDate
                        componentName={'TAMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {createdSlots && (
                    <CreatedSlots
                        componentName={'TAMENU'}
                        timezone={timezoneDetails}
                    />
                )}

                {openCreatedSessions && (
                    <CreatedSessions
                        componentName={'TAMENU'}
                        timezone={timezoneDetails}
                    />
                )}

                {openCancelSession && (
                    <CancelSession
                        componentName={'TAMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {RescheduleSession && (
                    <RescheduleCreatedSession
                        componentName={'TAMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {openLeaveReason && (
                    <LeaveReason
                        componentName={'TAMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {openSession && (
                    <SessionLink
                        componentName={'TAMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {openEditStudentsPopup && (
                    <EditStudentsSessionLink
                        componentName={'TAMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {openEditBatchesPopup && (
                    <EditBatchesSessionLink
                        componentName={'TAMENU'}
                        timezone={timezoneDetails}
                    />
                )}
            </Box>
        </>
    );
};
export default TAMenuCalendar;
