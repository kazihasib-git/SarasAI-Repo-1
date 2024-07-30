import { Box, DialogActions, Grid, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarComponent from '../../../components/Calender/BigCalendar';
import MarkLeave from '../../../components/availability/MarkLeave';
import { useDispatch, useSelector } from 'react-redux';
import Slots from '../../../components/availability/Slots';
import ScheduledSessions from '../../../components/availability/ScheduledSessions';
import CancelSchedule from '../../../components/availability/CancelSchedule';
import ReasonForLeave from '../../../components/availability/ReasonForLeave';
import ReschedulingSession from '../../../components/availability/ReschedulingSession';
import EditBatches from '../../../components/availability/EditBatches';
import EditStudents from '../../../components/availability/EditStudents';
import CoachMenu from './CoachMenu';
import {
    getCoachMenuSessions,
    getCoachMenuSlots,
    openMarkLeavePopup,
} from '../../../redux/features/coach/coachmenuprofileSilce';
import CreateSlot from '../../../components/RoleRoute/CommonComponent/commonCalender/CreateSlot';
import {
    openCreateNewSlot,
    openMarkLeaveDate,
    openScheduleNewSession,
} from '../../../redux/features/commonCalender/commonCalender';
import SelectStudents from '../../../components/RoleRoute/CommonComponent/commonCalender/SelectStudents';
import SelectBatches from '../../../components/RoleRoute/CommonComponent/commonCalender/SelectBatches';
import MarkLeaveDate from '../../../components/RoleRoute/CommonComponent/commonCalender/MarkLeaveDate';
import CreatedSlots from '../../../components/RoleRoute/CommonComponent/commonCalender/CreatedSlots';
import SessionLink from '../../../components/RoleRoute/CommonComponent/commonCalender/SessionLink';

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
    const dispatch = useDispatch();
    const [slotEvent, setSlotEvent] = useState([]);
    const [sessionEvent, setSessionEvent] = useState([]);

    const {
        createNewSlotPopup,
        scheduleNewSessionPopup,
        selectStudentPopup,
        selectBatchPopup,
        markLeave,
        createdSlots,
        openSession,
    } = useSelector(state => state.commonCalender);

    const {
        coachSlots,
        coachSessions,
        createCoachLeavePopup,
        LeaveSlotsPopup,
        cancelSessionOnLeave,
        leaveScheduledSessionPopup,
        leaveRescheduleSessionPopup,
        reasonForLeavePopup,
    } = useSelector(state => state.coachMenu);

    useEffect(() => {
        dispatch(getCoachMenuSlots());
        dispatch(getCoachMenuSessions());
    }, [dispatch]);

    console.log('coach slots :', coachSlots);
    console.log('coachSessions', coachSessions);

    useEffect(() => {
        if (coachSessions && coachSessions.length > 0) {
            const transformedEvents = coachSessions.map(event => ({
                title: event.meeting_name,
                start: new Date(
                    event.date.split(' ')[0] + 'T' + event.start_time
                ),
                end: new Date(event.date.split(' ')[0] + 'T' + event.end_time),
                meetlink : event.meeting_url,
                students : event.students,
                batches : event.batch,
            }));
            setSessionEvent(transformedEvents);
        }
    }, [coachSessions]);

    useEffect(() => {
        if (coachSlots && coachSlots.length > 0) {
            const transformedSlots = coachSlots.map(slot => ({
                startDate: new Date(slot.slot_date + 'T' + slot.from_time),
                endDate: new Date(slot.slot_date + 'T' + slot.to_time),
            }));
            setSlotEvent(transformedSlots);
        }
    }, [coachSlots]);

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
                    eventsList={sessionEvent}
                    slotData={slotEvent}
                    componentName={'COACHMENU'}
                />
                {createNewSlotPopup && (
                    <CreateSlot componentName={'COACHMENU'} />
                )}
                {scheduleNewSessionPopup && (
                    <CreateSession componentName={'COACHMENU'} />
                )}
                {selectStudentPopup && (
                    <SelectStudents componentName={'COACHMENU'} />
                )}
                {selectBatchPopup && (
                    <SelectBatches componentName={'COACHMENU'} />
                )}

                {markLeave && <MarkLeaveDate componentName={'COACHMENU'} />}

                {createdSlots && <CreatedSlots componentName={'COACHMENU'} />}

                {leaveScheduledSessionPopup && (
                    <ScheduledSessions componentName={'COACHMENU_CALENDER'} />
                )}
                {cancelSessionOnLeave && (
                    <CancelSchedule componentName={'COACHMENU_CALENDER'} />
                )}
                {leaveRescheduleSessionPopup && (
                    <ReschedulingSession componentName={'COACHMENU_CALENDER'} />
                )}
                {reasonForLeavePopup && (
                    <ReasonForLeave componentName={'COACHMENU_CALENDER'} />
                )}
                {openSession && (
                    <SessionLink componentName={'COACHMENU'} />
                )}
                {/*{sheduleNewSession && <ScheduleSession open={sheduleNewSession} handleClose={() => setSheduleNewSession(false)} componentName={"TACALENDER"} />}
                 */}
            </Box>
        </>
    );
};

export default CoachMenuCalendar;
