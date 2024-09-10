import { Box, DialogActions, Grid, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarComponent from '../../../components/Calender/BigCalendar';
import { useDispatch, useSelector } from 'react-redux';
import CoachMenu from './CoachMenu';
import {
    getCoachMenuSessions,
    getCoachMenuSlots,
    openMarkLeavePopup,
} from '../../../redux/features/coachModule/coachmenuprofileSilce';
import CreateSlot from '../../../components/RoleRoute/CommonComponent/commonCalender/CreateSlot';
import {
    openCreateNewSlot,
    openMarkLeaveDate,
    openScheduleNewSession,
} from '../../../redux/features/commonCalender/commonCalender';
import MarkLeaveDate from '../../../components/RoleRoute/CommonComponent/commonCalender/MarkLeaveDate';
import CreatedSlots from '../../../components/RoleRoute/CommonComponent/commonCalender/CreatedSlots';
import SessionLink from '../../../components/RoleRoute/CommonComponent/commonCalender/SessionLink';
import CreateSession from '../../../components/RoleRoute/CommonComponent/commonCalender/CreateSession';
import CreatedSessions from '../../../components/RoleRoute/CommonComponent/commonCalender/CreatedSessions';
import CancelSession from '../../../components/RoleRoute/CommonComponent/commonCalender/CancelSession';
import { convertFromUTC } from '../../../utils/dateAndtimeConversion';
import {
    fetchtimezoneDetails,
    timezoneIdToName,
} from '../../../utils/timezoneIdToName';
import LeaveReason from '../../../components/RoleRoute/CommonComponent/commonCalender/LeaveReason';
import RescheduleCreatedSession from '../../../components/RoleRoute/CommonComponent/commonCalender/RescheduleCreatedSession';
import EditStudentsFromSession from '../../../components/availability/EditStudentsFromSession';
import EditBatchesFromSession from '../../../components/availability/EditBatchesFromSession';
import EditBatchesSessionLink from '../../../components/RoleRoute/CommonComponent/commonCalender/EditBatchesSessionLink';
import EditStudentsSessionLink from '../../../components/RoleRoute/CommonComponent/commonCalender/EditStudentsSessionLink';
import CustomButton from '../../../components/CustomFields/CustomButton';
import SelectStudents from '../../../components/students/SelectStudents';
import SelectBatches from '../../../components/batches/SelectBatches';
import { useGetTimezonesQuery } from '../../../redux/services/timezones/timezonesApi';

const CoachMenuCalendar = () => {
    const dispatch = useDispatch();
    const { timezoneId } = useSelector(state => state.auth);
    const { data : timezones, error, isLoading } = useGetTimezonesQuery();

    const [eventsList, setEventsList] = useState([]);
    const [slotViewData, setSlotViewData] = useState([]);
    const [timezoneDetails, setTimezoneDetails] = useState();

    useEffect(() => {
        dispatch(getCoachMenuSlots());
        dispatch(getCoachMenuSessions());
    }, [dispatch]);

    const {
        createNewSlotPopup,
        scheduleNewSessionPopup,
        selectStudentPopup,
        selectBatchPopup,
        markLeave,
        createdSlots,
        openCreatedSessions,
        openCancelSession,
        openSession,
        sessionEventData,
        openLeaveReason,
        RescheduleSession,
        openEditStudentsPopup,
        openEditBatchesPopup,
    } = useSelector(state => state.commonCalender);

    const { coachSlots, coachSessions } = useSelector((state) => state.coachMenu);

    const { openBatches, openStudents } = useSelector(
        state => state.batchesAndStudents
    );

    useEffect(() => {
        if (timezoneId && timezones?.length > 0) {
            const timezoneData = fetchtimezoneDetails(timezoneId, timezones);
            if (timezoneData){
                setTimezoneDetails(timezoneData);
                if(coachSessions?.length > 0) {
                    convertEvents();
                }
                if(coachSlots?.length > 0){
                    convertSlots();
                }
            }else{
                slotViewData([])
                sessionEventData([])
            }
        }else {
            slotViewData([])
            sessionEventData([])
        }
    }, [timezoneId, timezones, coachSlots, coachSessions])  ;

    const convertEvents = async () => {
        if (
            coachSessions &&
            coachSessions.length > 0 &&
            timezoneDetails?.time_zone
        ) {
            try {
                const processedEvents = [];
                await Promise.all(
                    coachSessions.map(async event => {
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
                                platform_meeting:
                                    event.platform_meeting_details,
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
        } else {
            setEventsList([]);
        }
    };

    const convertSlots = async () => {
        if (coachSlots && coachSlots.length > 0 && timezoneDetails?.time_zone) {
            try {
                const processedSlots = [];
                await Promise.all(
                    coachSlots.map(async slot => {
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
    const handleSessionSelect = coachSessions => {
        setSelectedSession(coachSessions.id);
    };

    return (
        <>
            <CoachMenu />
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
                                    {/* <AddCircleOutlineIcon /> */}
                                    Create New Slot
                                </CustomButton>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogActions>
                <CalendarComponent
                    eventsList={eventsList}
                    slotData={slotViewData}
                    componentName={'COACHMENU'}
                    onSelectEvent={handleSessionSelect}
                />
                {createNewSlotPopup && (
                    <CreateSlot
                        componentName={'COACHMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {scheduleNewSessionPopup && (
                    <CreateSession
                        componentName={'COACHMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {openStudents && (
                    <SelectStudents
                        componentName={'COACHMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {openBatches && (
                    <SelectBatches
                        componentName={'COACHMENU'}
                        timezone={timezoneDetails}
                    />
                )}

                {markLeave && (
                    <MarkLeaveDate
                        componentName={'COACHMENU'}
                        timezone={timezoneDetails}
                    />
                )}

                {createdSlots && (
                    <CreatedSlots
                        componentName={'COACHMENU'}
                        timezone={timezoneDetails}
                    />
                )}

                {openCreatedSessions && (
                    <CreatedSessions
                        componentName={'COACHMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {openCancelSession && (
                    <CancelSession
                        componentName={'COACHMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {RescheduleSession && (
                    <RescheduleCreatedSession
                        componentName={'COACHMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {openLeaveReason && (
                    <LeaveReason
                        componentName={'COACHMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {openSession && (
                    <SessionLink
                        componentName={'COACHMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {openEditStudentsPopup && (
                    <EditStudentsSessionLink
                        componentName={'COACHMENU'}
                        timezone={timezoneDetails}
                    />
                )}
                {openEditBatchesPopup && (
                    <EditBatchesSessionLink
                        componentName={'COACHMENU'}
                        timezone={timezoneDetails}
                    />
                )}
            </Box>
        </>
    );
};

export default CoachMenuCalendar;
