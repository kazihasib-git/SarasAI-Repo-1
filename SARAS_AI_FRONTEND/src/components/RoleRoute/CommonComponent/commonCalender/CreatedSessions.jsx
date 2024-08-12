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

const headers = [
    'S. No.',
    'Session Name',
    'Date',
    'Time',
    'Students',
    'Actions',
];

const studentHeader = ['S.No.', 'Student Name', 'Program', 'Batch'];

const CreatedSessions = ({ componentName }) => {
    const dispatch = useDispatch();

    let sliceName, scheduledSessionState;

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
        if (sessionsData && sessionsData.length > 0) {
            const formattedData = sessionsData.map((session, index) => ({
                'S. No.': index + 1,
                'Session Name': session.meeting_name,
                Date: session.date.split(' ')[0],
                Time: `${session.start_time} - ${session.end_time}`,
                Students: session.Students.length,
                StudentList: session.Students,
                id: session.id,
            }));
            setScheduledSessions(formattedData);
        }
    }, [sessionsData]);

    const handleViewClick = students => {
        console.log('View clicked!', students);
    };

    const handleRescheduleClick = session => {
        dispatch();
        dispatch();
    };

    const handleCancelClick = session => {
        dispatch(openCancelSessionPopup(session));
        dispatch(closeCreatedSessions());
    };

    const handleSubmit = () => {
        dispatch();
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
