import { Box, DialogActions, Grid, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarComponent from '../../components/Calender/BigCalendar';
import { useDispatch, useSelector } from 'react-redux';
import CoachMenu from './CoachMenu';
import {
    getCoachMenuSessions,
    getCoachMenuSlots,
    openMarkLeavePopup,
} from '../../redux/features/coachModule/coachmenuprofileSilce';
import CreateSlot from '../../components/RoleRoute/CommonComponent/commonCalender/CreateSlot';
import {
    openCreateNewSlot,
    openMarkLeaveDate,
    openScheduleNewSession,
} from '../../redux/features/commonCalender/commonCalender';
import SelectStudents from '../../components/RoleRoute/CommonComponent/commonCalender/SelectStudents';
import SelectBatches from '../../components/RoleRoute/CommonComponent/commonCalender/SelectBatches';
import MarkLeaveDate from '../../components/RoleRoute/CommonComponent/commonCalender/MarkLeaveDate';
import CreatedSlots from '../../components/RoleRoute/CommonComponent/commonCalender/CreatedSlots';
import SessionLink from '../../components/RoleRoute/CommonComponent/commonCalender/SessionLink';
import CreateSession from '../../components/RoleRoute/CommonComponent/commonCalender/CreateSession';
import CreatedSessions from '../../components/RoleRoute/CommonComponent/commonCalender/CreatedSessions';
import CancelSession from '../../components/RoleRoute/CommonComponent/commonCalender/CancelSession';
import { convertFromUTC } from '../../utils/dateAndtimeConversion';
import { timezoneIdToName } from '../../utils/timezoneIdToName';
import { getTimezone } from '../../redux/features/utils/utilSlice';
import LeaveReason from '../../components/RoleRoute/CommonComponent/commonCalender/LeaveReason';
import RescheduleCreatedSession from '../../components/RoleRoute/CommonComponent/commonCalender/RescheduleCreatedSession';
import EditBatchesSessionLink from '../../components/RoleRoute/CommonComponent/commonCalender/EditBatchesSessionLink';
import EditStudentsSessionLink from '../../components/RoleRoute/CommonComponent/commonCalender/EditStudentsSessionLink';

const storedTimezoneId = Number(localStorage.getItem('timezone_id'));

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

const CoachMenuCalendar = () => {
    const { timezones } = useSelector(state => state.util);

    const dispatch = useDispatch();
    const [eventsList, setEventsList] = useState([]);
    const [slotViewData, setSlotViewData] = useState([]);

    const [platformName, setPlatformName] = useState(null);
    const [platformUrl, setplatformUrl] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);

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

    const { coachSlots, coachSessions } = useSelector(state => state.coachMenu);

    useEffect(() => {
        dispatch(getTimezone());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getCoachMenuSlots());
        dispatch(getCoachMenuSessions());
    }, [dispatch]);

    useEffect(() => {
        convertEvents();
    }, [coachSessions]);

    useEffect(() => {
        convertSlots();
    }, [coachSlots]);

    const convertEvents = async () => {
        if (
            coachSessions &&
            coachSessions.length > 0 &&
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
                    coachSessions.map(async event => {
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
        if (
            coachSlots &&
            coachSlots.length > 0 &&
            storedTimezoneId &&
            timezones
        ) {
            const timezonename = timezoneIdToName(storedTimezoneId, timezones);
            try {
                const processedSlots = [];
                await Promise.all(
                    coachSlots.map(async slot => {
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

    // coachSessions.forEach(session => {
    //     const platformName = session.platform_tool_details?.name;
    //     const platformUrl = session.platform_meeting_details?.host_meeting_url;
    //     setPlatformName(platformName);
    //     setplatformUrl(platformUrl);
    //     console.log(`Platform Name: ${platformName}`);
    //     console.log(`Platform Meeting URL: ${platformUrl}`);
    //     // Perform other actions with platformName and platformUrl
    // });

    // useEffect(() => {
    //     coachSessions.map(session => {
    //         const platformName = session.platform_tool_details?.name;
    //         const platformUrl =
    //             session.platform_meeting_details?.host_meeting_url;
    //         setPlatformName(platformName);
    //         setplatformUrl(platformUrl);
    //     });
    //     console.log(`Platform Name: ${platformName}`);
    //     console.log(`Platform Meeting URL: ${platformUrl}`);
    // }, [coachSessions]);

    const targetSessionId = sessionEventData.id;

    useEffect(() => {
        const targetSession = coachSessions.find(
            session => session.id === targetSessionId
        );

        if (targetSession) {
            const platformName = targetSession.platform_tool_details?.name;
            const platformUrl =
                targetSession.platform_meeting_details?.host_meeting_url;

            setPlatformName(platformName);
            setplatformUrl(platformUrl);
        } else {
            setPlatformName('');
            setplatformUrl('');
        }
    }, [coachSessions, targetSessionId]);

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
                        timezoneID={storedTimezoneId}
                    />
                )}
                {scheduleNewSessionPopup && (
                    <CreateSession
                        componentName={'COACHMENU'}
                        timezoneID={storedTimezoneId}
                    />
                )}
                {selectStudentPopup && (
                    <SelectStudents componentName={'COACHMENU'} />
                )}
                {selectBatchPopup && (
                    <SelectBatches componentName={'COACHMENU'} />
                )}

                {markLeave && (
                    <MarkLeaveDate
                        componentName={'COACHMENU'}
                        timezoneID={storedTimezoneId}
                    />
                )}

                {createdSlots && (
                    <CreatedSlots
                        componentName={'COACHMENU'}
                        timezoneID={storedTimezoneId}
                    />
                )}

                {openCreatedSessions && (
                    <CreatedSessions
                        componentName={'COACHMENU'}
                        timezoneID={storedTimezoneId}
                    />
                )}
                {openCancelSession && (
                    <CancelSession
                        componentName={'COACHMENU'}
                        timezoneID={storedTimezoneId}
                    />
                )}
                {RescheduleSession && (
                    <RescheduleCreatedSession
                        componentName={'COACHMENU'}
                        timezoneID={storedTimezoneId}
                    />
                )}
                {openLeaveReason && (
                    <LeaveReason
                        componentName={'COACHMENU'}
                        timezoneID={storedTimezoneId}
                    />
                )}
                {openSession && (
                    <SessionLink
                        componentName={'COACHMENU'}
                        coachSessions={coachSessions}
                        platformName={platformName}
                        platformUrl={platformUrl}
                    />
                )}
                {openEditStudentsPopup && (
                    <EditStudentsSessionLink componentName={'COACHMENU'} />
                )}
                {openEditBatchesPopup && (
                    <EditBatchesSessionLink componentName={'COACHMENU'} />
                )}
            </Box>
        </>
    );
};

export default CoachMenuCalendar;
