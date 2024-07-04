import React from 'react'
import ReusableDialog from '../CustomFields/ReusableDialog'
import { Box, Button, DialogContent, Typography } from '@mui/material';
import DynamicTable from '../CommonComponent/DynamicTable';
import { useDispatch, useSelector } from 'react-redux';
import { closeScheduledSession, openCancelSession, openRescheduleSession } from '../../redux/features/taModule/taAvialability';
import PopUpTable from '../CommonComponent/PopUpTable';

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
                padding: "10px 20px",
                border: `2px solid ${borderColor}`,
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


const ScheduledSessions = () => {
    const dispatch = useDispatch();
    const { scheduledSessionOpen } = useSelector((state) => state.taAvialability);

    const actionButtons = [
        {
            type: "button",

        },
    ];

    const headers = ['S. No.', 'Session Name', 'Date', 'Time', 'Students', 'Actions']

    // const dummyData =[];
    const dummyData = [
        { id: 1, sessionName: 'Math 101', date: '2023-06-25', time: '10:00 AM', students: 30, actions: 'View' },
        { id: 2, sessionName: 'Physics 201', date: '2023-06-26', time: '11:00 AM', students: 25, actions: 'View' },
        { id: 3, sessionName: 'Chemistry 301', date: '2023-06-27', time: '12:00 PM', students: 20, actions: 'View' },
        { id: 4, sessionName: 'Biology 401', date: '2023-06-28', time: '01:00 PM', students: 15, actions: 'View' },
        { id: 5, sessionName: 'English 101', date: '2023-06-29', time: '02:00 PM', students: 10, actions: 'View' }
    ];

    const handleSubmit = () => {
        console.log("*** ScheduledSessions")
    }

    const content = (
        dummyData.length === 0 ? (
            <DialogContent>
                <Typography>
                    No scheduled sessions.
                </Typography>
            </DialogContent>
        ) : (
            <PopUpTable
                headers={headers}
                initialData={dummyData}
                actionButtons={actionButtons}
            />
        )
    )

    const actions = (
        <Box>
            <CustomButton
                onClick={handleSubmit}
                backgroundColor='#F56D3B'
                borderColor='#F56D3B'
                color='#FFFFFF'
            >
                Submit
            </CustomButton>
            <CustomButton
                onClick={()  => {
                    dispatch(closeScheduledSession())
                    dispatch(openRescheduleSession())
                }}
                backgroundColor="#FFFFFF"
                borderColor="#F56D38"
                color="#F56D38"
                sx={{ mr: 2 }}
            >
                Reschedule Session
            </CustomButton>

            <CustomButton
                onClick={() => {
                    dispatch(closeScheduledSession())
                    dispatch(openCancelSession())
                }}
                backgroundColor="#F56D38"
                borderColor="#F56D38"
                color="#FFFFFF"
            >
                Cancel Session
            </CustomButton>
        </Box>
    );

    return (
        <ReusableDialog
            open={scheduledSessionOpen}
            handleClose={() => dispatch(closeScheduledSession())}
            title="Scheduled Sessions"
            content={content}
            actions={actions}
        />
    )
}

export default ScheduledSessions