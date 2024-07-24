import { Box, DialogActions, Grid, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Calendar from '../../../components/Calender/indexCalender';
import CalendarNew from '../../../components/Calender/IndexCalenderNew';
import CalendarComponent from '../../../components/Calender/BigCalendar';
import MarkLeave from '../../../components/availability/MarkLeave';

import CreateNewSlot from '../../../components/availability/CreateNewSlot';
import ScheduleSession from '../../../components/availability/ScheduleSession';
import {
    openMarkLeave,
    closeMarkLeave,
    getSlots,
    fetchCoachSlots,
    fetchTAScheduleById,
    selectTAScheduleData,
    openCreateNewSlots,
} from '../../../redux/features/taModule/taAvialability';
import { useDispatch, useSelector } from 'react-redux';
import Slots from '../../../components/availability/Slots';
import ScheduledSessions from '../../../components/availability/ScheduledSessions';
import CancelSchedule from '../../../components/availability/CancelSchedule';
import ReasonForLeave from '../../../components/availability/ReasonForLeave';
import ReschedulingSession from '../../../components/availability/ReschedulingSession';
// import { PickersInputBaseSectionsContainer } from "@mui/x-date-pickers/PickersTextField/PickersInputBase/PickersInputBase";
// import NewCal from "../../../components/Calender/IndexCalenderNew";
// import { add } from "date-fns";
import { useParams } from 'react-router-dom';
import {
    getTAScheduledSessions,
    openScheduleSession,
} from '../../../redux/features/taModule/taScheduling';
import moment from 'moment';
import Schedule from '../../../components/availability/Schedule';
// import AssignStudents from "../../../components/adminModule/AssignStudents";
// import AssignBatches from "../../managesTAs/AssignedBatches";
import EditBatches from '../../../components/availability/EditBatches';
import EditStudents from '../../../components/availability/EditStudents';
import CoachMenu from './CoachMenu';
import {
    getCoachSessions,
    getCoachSlots,
} from '../../../redux/features/coach/coachmenuprofileSilce';

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

    const [sheduleNewSession, setSheduleNewSession] = useState(false);
    const [createNewSlot, setCreateNewSlot] = useState(false);

    //   const { assignBatchOpen, assignStudentOpen } = useSelector(
    //     (state) => state.taModule
    //   );

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
    } = useSelector(state => state.taAvialability);

    const {
        taScheduledSessions,
        scheduleSessionOpen,
        openEditBatch,
        openEditStudent,
    } = useSelector(state => state.taScheduling);

    //calendar
    const [eventsList, setEventsList] = useState([]);

    useEffect(() => {
        dispatch(getCoachSlots());
        dispatch(getCoachSessions());
    }, [dispatch]);

    useEffect(() => {
        if (scheduleData && scheduleData.data) {
            const transformedEvents = scheduleData.data.map(event => ({
                title: event.meeting_name,
                start: new Date(
                    event.date.split(' ')[0] + 'T' + event.start_time
                ),
                end: new Date(event.date.split(' ')[0] + 'T' + event.end_time),
            }));
            setEventsList(transformedEvents);
        }
    }, [scheduleData]);

    console.log('slotData', slotData, 'scheduleData', scheduleData);

    const handleScheduleNewSession = () => {
        // console.log("Pressed")
        setSheduleNewSession();
        dispatch(openScheduleSession());
    };

    const handleMarkLeave = () => {
        dispatch(openMarkLeave());
    };

    //   const handleDeleteFutureSlots = () => {
    //     setDeleteFutureSlots(true);
    //   };

    const handleCreateNewSlot = () => {
        dispatch(openCreateNewSlots());
    };

    console.log('session', scheduleData);
    console.log('sessiond data', scheduleData.data);

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

                                {/* <CustomButton
                onClick={handleDeleteFutureSlots}
                color="#F56D3B"
                backgroundColor="#FFFFFF"
                borderColor="#F56D3B"
                style={{ textTransform: "none" }}
              >
                Delete All Future Slots
              </CustomButton> */}

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
                    slotData={slotData}
                    componentName={'TACALENDER'}
                />
                {scheduleSessionOpen && (
                    <Schedule componentName={'TASCHEDULE'} />
                )}
                {openEditBatch && <EditBatches componentname={'ADDEDITTA'} />}
                {openEditStudent && (
                    <EditStudents componentname={'ADDEDITTA'} />
                )}
                {/*{sheduleNewSession && <ScheduleSession open={sheduleNewSession} handleClose={() => setSheduleNewSession(false)} componentName={"TACALENDER"} />} */}
                {markLeaveOpen && (
                    <MarkLeave
                    // id={id}
                    // name={name}
                    // componentName={'TACALENDER'}
                    />
                )}
                {scheduledSlotsOpen && (
                    <Slots
                    // id={id} name={name} componentName={'TACALENDER'}
                    />
                )}
                {scheduledSessionOpen && (
                    <ScheduledSessions
                    // id={id}
                    // name={name}
                    // componentName={'TACALENDER'}
                    />
                )}
                {cancelSessionOpen && (
                    <CancelSchedule
                    // id={id}
                    // name={name}
                    // componentName={'TACALENDER'}
                    />
                )}
                {reasonForLeaveOpen && (
                    <ReasonForLeave
                    // id={id}
                    // name={name}
                    // componentName={'TACALENDER'}
                    />
                )}
                {resheduleSessionOpen && (
                    <ReschedulingSession
                    // id={id}
                    // name={name}
                    // componentName={'TACALENDER'}
                    />
                )}
                {/* {deleteFutureSlots && (
        <DeleteAllSlots
          open={deleteFutureSlots}
          handleClose={() => setDeleteFutureSlots(false)}
          id={id}
          name={name}
          componentName={"TACALENDER"}
        />
      )} */}
                {createNewSlotOpen && (
                    <CreateNewSlot componentName={'TACALENDER'} />
                )}
                {/* {assignStudentOpen && <AssignStudents componentname="ADDEDITTA" />}
                {assignBatchOpen && <AssignBatches componentname="ADDEDITTA" />} */}
            </Box>
        </>
    );
};

export default CoachMenuCalendar;
