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
const storedTimezoneId = Number(localStorage.getItem('timezone_id'));

const studentHeader = ['S.No.', 'Student Name', 'Program', 'Batch'];

const CreatedSessions = ({ componentName }) => {
    const { timezones } = useSelector(state => state.util);

    const dispatch = useDispatch();

    let sliceName, scheduledSessionState;
    useEffect(() => {
        dispatch(getTimezone());
    }, [dispatch]);
    switch (componentName) {
        case 'TAMENU':
            sliceName = 'taMenu';
            scheduledSessionState = '';
            break;

        case 'COACHMENU':
            sliceName = 'coachMenu';
            scheduledSessionState = 'coachSessionsForLeave';
            break;

        default:
            sliceName = null;
            scheduledSessionState = null;
            break;
    }

    const selectState = useSelector(state => state[sliceName]);
    const { openCreatedSessions } = useSelector(state => state.commonCalender);

    const { [scheduledSessionState]: sessionsData } = selectState;
    const [scheduledSessions, setScheduledSessions] = useState([]);
    const [students, setStudent] = useState([]);

    useEffect(() => {
        const convertSessions = async () => {
            if (
                sessionsData &&
                sessionsData.length > 0 &&
                storedTimezoneId &&
                timezones
            ) {
                const timezonename = timezoneIdToName(
                    storedTimezoneId,
                    timezones
                );
                if (!timezonename) {
                    console.error('Invalid timezone name');
                    setScheduledSessions([]);
                    return;
                }

                try {
                    const formattedData = await Promise.all(
                        sessionsData.map(async (session, index) => {
                            const localTime = await convertFromUTC({
                                start_date: session.date.split(' ')[0],
                                start_time: session.start_time,
                                end_time: session.end_time,
                                end_date: session.date.split(' ')[0], // Assuming the end date is the same as the start date
                                timezonename,
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
                                Time: `${localTime.start_time} - ${localTime.end_time}`,
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

        convertSessions();
    }, [sessionsData, storedTimezoneId, timezones]);

    const handleViewClick = students => {
        console.log('View clicked!', students);
    };

    const handleRescheduleClick = session => {
       
    };

    const handleCancelClick = session => {
        dispatch(openCancelSessionPopup(session));
        dispatch(closeCreatedSessions());
    };

    const handleSubmit = () => {
        //dispatch();
        dispatch(closeCreatedSessions());
    };

    const content =
        scheduledSessions.length === 0 ? (
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
