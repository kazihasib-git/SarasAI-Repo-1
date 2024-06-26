import { Box, DialogActions, Grid, Typography, Button } from '@mui/material'
import React, { useState } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Calendar from '../../components/Calender/indexCalender';
import MarkLeave from '../../components/availability/MarkLeave';
import DeleteAllSlots from '../../components/availability/DeleteAllSlots';
import CreateNewSlot from '../../components/availability/CreateNewSlot';
import ScheduleSession from '../../components/availability/ScheduleSession';
import { openMarkLeave, closeMarkLeave } from '../../redux/features/taModule/taScheduling';
import { useDispatch, useSelector } from 'react-redux';
import Slots from '../../components/availability/Slots';
import ScheduledSessions from '../../components/availability/ScheduledSessions';
import CancelSchedule from '../../components/availability/CancelSchedule';
import ReasonForLeave from '../../components/availability/ReasonForLeave';
import ReschedulingSession from '../../components/availability/ReschedulingSession';

const CustomButton = ({ onClick, children, color = '#FFFFFF', backgroundColor = '#4E18A5', borderColor = '#FFFFFF', sx, ...props }) => {
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
                ...sx
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

const TaCalender
    = () => {
        const dispatch = useDispatch();
        const [sheduleNewSession, setSheduleNewSession] = useState(false)
        const [deleteFutureSlots, setDeleteFutureSlots] = useState(false)
        const [createNewSlot, setCreateNewSlot] = useState(false)
        const { 
            markLeaveOpen, 
            scheduledSlotsOpen, 
            scheduledSessionOpen, 
            cancelSessionOpen,
            reasonForLeaveOpen,
            resheduleSessionOpen,
        }  = useSelector((state) => state.taScheduling);

        const handleScheduleNewSession = () => {
            console.log("Pressed")
            setSheduleNewSession(true)
        }

        const handleMarkLeave = () => {
            dispatch(openMarkLeave());
        }

        const handleDeleteFutureSlots = () => {
            setDeleteFutureSlots(true)
        }

        const handleCreateNewSlot = () => {
            setCreateNewSlot(true)
        }

        console.log("markLeaveOpen", markLeaveOpen);
        console.log("scheduledSlotsOpen", scheduledSlotsOpen)
        console.log("scheduledSessionOpen", scheduledSessionOpen)
        console.log("cancelSessionOpen", cancelSessionOpen)

        return (
            <Box sx={{ backgroundColor: '#f8f9fa', p: 3 }}>
                <DialogActions sx={{ p: 2 }}>
                    <Grid container alignItems="center">
                        <Grid item xs>
                            <Typography variant='h4' sx={{ mb: 4 }}>
                                Ta Name
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Box display="flex" justifyContent="center" gap={2}>
                                <CustomButton
                                    onClick={handleScheduleNewSession}
                                    color='#FFFFFF'
                                    backgroundColor='#4E18A5'
                                    borderColor='#4E18A5'
                                >
                                    <AddCircleOutlineIcon />
                                    Schedule New Session
                                </CustomButton>

                                <CustomButton
                                    onClick={handleMarkLeave}
                                    color='#F56D3B'
                                    backgroundColor='#FFFFFF'
                                    borderColor='#F56D3B'
                                >
                                    Mark Leave
                                </CustomButton>

                                <CustomButton
                                    onClick={handleDeleteFutureSlots}
                                    color='#F56D3B'
                                    backgroundColor='#FFFFFF'
                                    borderColor='#F56D3B'
                                >
                                    Delete All Future Slots
                                </CustomButton>

                                <CustomButton
                                    color='#FFFFFF'
                                    backgroundColor='#F56D3B'
                                    borderColor='#F56D3B'
                                    onClick={handleCreateNewSlot}
                                >
                                    {/* <AddCircleOutlineIcon /> */}
                                    Create New Slot
                                </CustomButton>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogActions>
                <Calendar />
                {sheduleNewSession && <ScheduleSession open={sheduleNewSession} handleClose={() => setSheduleNewSession(false)} />}
                {markLeaveOpen && <MarkLeave />}
                {scheduledSlotsOpen && <Slots />}
                {scheduledSessionOpen && <ScheduledSessions /> }
                {cancelSessionOpen && <CancelSchedule />}
                {reasonForLeaveOpen && <ReasonForLeave /> }
                {resheduleSessionOpen && <ReschedulingSession /> }
                {deleteFutureSlots && <DeleteAllSlots open={deleteFutureSlots} handleClose={() => setDeleteFutureSlots(false)} />}
                {createNewSlot && <CreateNewSlot open={createNewSlot} handleClose={() => setCreateNewSlot(false)} />}
            </Box>
        )
    }

export default TaCalender
