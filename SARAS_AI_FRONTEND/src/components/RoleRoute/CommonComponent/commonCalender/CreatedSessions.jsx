import { Box, Button, DialogContent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PopUpTable from '../../../CommonComponent/PopUpTable';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import CustomButton from '../../../CustomFields/CustomButton';
import { getCoachMenuSessionForLeave } from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import {
    closeCreatedSessions,
    openCancelSessionPopup,
    openReasonForLeavePopup,
    openReschedulePopup,
} from '../../../../redux/features/commonCalender/commonCalender';
import { convertFromUTC } from '../../../../utils/dateAndtimeConversion';
import { timezoneIdToName } from '../../../../utils/timezoneIdToName';
import { getTimezone } from '../../../../redux/features/utils/utilSlice';
const headers = [
    'S. No.',
    'Session Name',
    'Date',
    'Time',
    'Students',
    'Actions',
];

const studentHeader = ['S.No.', 'Student Name', 'Program', 'Batch'];

const sessionConfig = {
    TAMENU: {
        sliceName: 'taMenu',
        scheduledSessionState: 'sessionBySlots',
    },
    COACHMENU: {
        sliceName: 'coachMenu',
        scheduledSessionState: 'coachSessionsForLeave',
    },
};

const CreatedSessions = ({ componentName, timezone }) => {
    const dispatch = useDispatch();

    const { sliceName, scheduledSessionState } = sessionConfig[componentName];

    const selectState = useSelector(state => state[sliceName]);
    const { openCreatedSessions } = useSelector(state => state.commonCalender);

    const { [scheduledSessionState]: sessionsData } = selectState;
    const [scheduledSessions, setScheduledSessions] = useState([]);

    const { slotsLeaveData } = useSelector(state => state.commonCalender);

    const formatTime = time => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${ampm}`;
    };

    const convertMenuSessions = async () => {
        if (sessionsData && sessionsData.length > 0 && timezone?.time_zone) {
            try {
                const formattedData = await Promise.all(
                    sessionsData.map(async (session, index) => {
                        const localTime = await convertFromUTC({
                            start_date: session.date.split(' ')[0],
                            start_time: session.start_time,
                            end_time: session.end_time,
                            end_date: session.date.split(' ')[0], // Assuming the end date is the same as the start date
                            timezonename: timezone?.time_zone,
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
                            startDateTime,
                            endDateTime,
                        };
                    })
                );
                setScheduledSessions(formattedData);
            } catch (error) {
                console.error('Error converting sessions:', error);
                setScheduledSessions([]);
            }
        } else {
            setScheduledSessions([]);
        }
    };

    useEffect(() => {
        convertMenuSessions();
    }, [sessionsData, timezone?.time_zone]);

    const handleViewClick = students => {
        console.log('View clicked!', students);
    };

    const handleRescheduleClick = session => {
        dispatch(openReschedulePopup(session));
        dispatch(closeCreatedSessions());
    };

    const handleCancelClick = session => {
        dispatch(openCancelSessionPopup(session));
        dispatch(closeCreatedSessions());
    };

    const handleSubmit = () => {
        dispatch(openReasonForLeavePopup(slotsLeaveData));
        dispatch(closeCreatedSessions());
    };

    const content =
        !scheduledSessions && scheduledSessions.length === 0 ? (
            <DialogContent
                style={{ justifyContent: 'center', display: 'flex' }}
            >
                <Typography>No scheduled sessions.</Typography>
            </DialogContent>
        ) : (
            <PopUpTable
                headers={headers}
                initialData={scheduledSessions}
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
            open={openCreatedSessions}
            handleClose={() => {
                dispatch(closeCreatedSessions());
            }}
            title="Scheduled Sessions"
            content={content}
            actions={sessionsData.length === 0 ? actions : undefined}
        />
    );
};

export default CreatedSessions;
