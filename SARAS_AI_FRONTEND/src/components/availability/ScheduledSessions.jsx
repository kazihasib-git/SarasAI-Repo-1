import React, { useState, useEffect } from 'react';
import ReusableDialog from '../CustomFields/ReusableDialog';
import { Box, DialogContent, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PopUpTable from '../CommonComponent/PopUpTable';

import {
    closeScheduledSession,
    openCancelSession,
    openRescheduleSession,
    openScheduledSlots,
    reasonForLeave,
    openReasonForLeave,
} from '../../redux/features/adminModule/ta/taAvialability';

import {
    closeCoachScheduledSession,
    openCoachCancelSession,
    openCoachRescheduleSession,
    openCoachScheduledSlots,
    openCoachReasonForLeave,
    reasonForCoachLeave,
} from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import CustomButton from '../CustomFields/CustomButton';
import { convertFromUTC } from '../../utils/dateAndtimeConversion';

const headers = [
    'S. No.',
    'Session Name',
    'Date',
    'Time',
    'Students',
    'Actions',
];

const scheduledConfig = {
    TACALENDER: {
        scheduleSessionOpenKey: 'scheduledSessionOpen',
        scheduledSessionDataKey: 'scheduledSessionData',
        schedulingStateKey: 'taAvialability',
        closeSessionAction: closeScheduledSession,
        openCancelAction: openCancelSession,
        openRescheduleAction: openRescheduleSession,
        openSlotsAction: openScheduledSlots,
        slotEventKey: 'slotEventData',
        openReasonAction: openReasonForLeave,
        reasonForLeaveAction: reasonForLeave,
    },
    COACHCALENDER: {
        scheduleSessionOpenKey: 'scheduledCoachSessionOpen',
        scheduledSessionDataKey: 'scheduledCoachSessionData',
        schedulingStateKey: 'coachAvailability',
        closeSessionAction: closeCoachScheduledSession,
        openCancelAction: openCoachCancelSession,
        openRescheduleAction: openCoachRescheduleSession,
        openSlotsAction: openCoachScheduledSlots,
        slotEventKey: 'slotCoachEventData',
        openReasonAction: openCoachReasonForLeave,
        reasonForLeaveAction: reasonForCoachLeave,
    },
};

const ScheduledSessions = ({ id, name, componentName, timezone }) => {
    const dispatch = useDispatch();

    const { timezones, platforms } = useSelector(state => state.util);
    const [sessionData, setSessionData] = useState([]);

    const {
        scheduleSessionOpenKey,
        scheduledSessionDataKey,
        schedulingStateKey,
        closeSessionAction,
        openCancelAction,
        openRescheduleAction,
        openSlotsAction,
        slotEventKey,
        openReasonAction,
        reasonForLeaveAction,
    } = scheduledConfig[componentName];

    const schedulingState = useSelector(state =>
        schedulingStateKey ? state[schedulingStateKey] : {}
    );
    const {
        [scheduleSessionOpenKey]: scheduledSessionOpen,
        [scheduledSessionDataKey]: scheduledSessionData = [],
        [slotEventKey]: slotEventData,
    } = schedulingState;

    const formatTime = time => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${ampm}`;
    };

    const convertSessions = async () => {
        if (
            scheduledSessionData &&
            scheduledSessionData.length > 0 &&
            timezone.time_zone
        ) {
            try {
                const processedSessions = await Promise.all(
                    scheduledSessionData.map(async (session, index) => {
                        const localTime = await convertFromUTC({
                            start_date: session.date.split(' ')[0],
                            start_time: session.start_time,
                            end_time: session.end_time,
                            end_date: session.date.split(' ')[0],
                            timezonename: timezone.time_zone,
                        });

                        const startDateTime = new Date(
                            `${localTime.start_date}T${localTime.start_time}`
                        );
                        const endDateTime = new Date(
                            `${localTime.end_date}T${localTime.end_time}`
                        );
                        return {
                            'S. No.': index + 1,
                            'Session Name': session.meeting_name,
                            Date: localTime.start_date,
                            Time: `${formatTime(localTime.start_time)} - ${formatTime(localTime.end_time)}`,
                            Students: session.Students.length,
                            StudentList: session.Students,
                            id: session.id,
                            // startDateTime,
                            // endDateTime
                        };
                    })
                );
                setSessionData(processedSessions);
            } catch (error) {
                console.error('Error converting sessions:', error);
                setSessionData([]);
            }
        } else {
            setSessionData([]);
        }
    };

    useEffect(() => {
        convertSessions();
    }, [scheduledSessionData, timezone.time_zone]);

    // const formattedData = scheduledSessionData.map((session, index) => ({
    //     'S. No.': index + 1,
    //     'Session Name': session.meeting_name,
    //     Date: session.date.split(' ')[0],
    //     Time: `${session.start_time} - ${session.end_time}`,
    //     Students: session.Students.length,
    //     StudentList: session.Students,
    //     id: session.id,
    // }));

    const handleViewClick = students => {};

    const handleRescheduleClick = session => {
        dispatch(closeSessionAction());
        dispatch(openRescheduleAction(session));
    };

    const handleCancelClick = session => {
        dispatch(closeSessionAction());
        dispatch(openCancelAction(session));
    };

    const handleSubmit = () => {
        dispatch(openReasonAction(slotEventData));
        dispatch(closeSessionAction());
    };

    const content =
        sessionData.length === 0 ? (
            <DialogContent
                style={{ justifyContent: 'center', display: 'flex' }}
            >
                <Typography>No scheduled sessions.</Typography>
            </DialogContent>
        ) : (
            <PopUpTable
                headers={headers}
                initialData={sessionData}
                onViewClick={handleViewClick}
                onRescheduleClick={handleRescheduleClick}
                onCancelClick={handleCancelClick}
            />
        );

    const actions = (
        <Box>
            <CustomButton
                onClick={handleSubmit}
                backgroundColor="#F56D3B"
                borderColor="#F56D3B"
                color="#FFFFFF"
                style={{ textTransform: 'none' }}
            >
                Submit
            </CustomButton>
        </Box>
    );

    return (
        <ReusableDialog
            open={scheduledSessionOpen}
            handleClose={() => {
                // dispatch(openSlotsAction());
                dispatch(closeSessionAction());
            }}
            title="Scheduled Sessions"
            content={content}
            actions={scheduledSessionData.length === 0 ? actions : undefined}
        />
    );
};

export default ScheduledSessions;
