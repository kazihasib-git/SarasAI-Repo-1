import { Box, Button, DialogContent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PopUpTable from '../../../CommonComponent/PopUpTable';
import ReusableDialog from '../../../CustomFields/ReusableDialog';

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
                padding: '10px 20px',
                border: `2px solid ${borderColor}`,
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
            scheduledSessionData = '';
            break;

        case 'COACHMENU':
            sliceName = 'coachMenu';
            scheduledSessionData = '';
            break;

        default:
            sliceName = null;
            scheduledSessionData = '';
            break;
    }

    const selectState = useSelector(state => state[sliceName]);

    const { [scheduledSessionState]: scheduledSessionData } = selectState;
    const [scheduledSessions, setScheduledSessions] = useState([]);
    const [students, setStudent] = useState([]);

    useEffect(() => {
        if (scheduledSessionData && scheduledSessionData.length > 0) {
            const formattedData = scheduledSessionData.map(
                (session, index) => ({
                    'S. No.': index + 1,
                    'Session Name': session.meeting_name,
                    Date: session.date.split(' ')[0],
                    Time: `${session.start_time} - ${session.end_time}`,
                    Students: session.Students.length,
                    StudentList: session.Students,
                    id: session.id,
                })
            );
            setScheduledSessions(formattedData);

            const formattedStudentsData = scheduledSessionData.Students.map(
                (student, index) => ({
                    'S. No.': index + 1,
                    'Student Name': student.name,
                    Program: '',
                    Batch: '',
                })
            );
            setStudent(formattedStudentsData);
        }
    }, [scheduledSessionData]);

    const handleViewClick = students => {
        <PopUpTable headers={studentHeader} initialData={students} />;
    };

    const handleRescheduleClick = session => {
        dispatch();
        dispatch();
    };

    const handleCancelClick = session => {
        dispatch();
        dispatch();
    };

    const handleSubmit = () => {
        dispatch();
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
            open={scheduledSessionOpen}
            handleClose={() => {
                dispatch(openSlotsAction());
                dispatch(closeSessionAction());
            }}
            title="Scheduled Sessions"
            content={content}
            actions={scheduledSessions.length === 0 ? actions : undefined}
        />
    );
};

export default CreatedSessions;
