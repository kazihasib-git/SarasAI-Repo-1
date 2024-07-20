import { Box, Button, InputBase, Typography, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { mockDataAvilable } from '../../fakeData/availableData';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { DynamicTable } from '../managesTAs/TaAvaialablity';
import { useDispatch, useSelector } from 'react-redux';
import { getTodayCoachAvailability } from '../../redux/features/CoachModule/CoachAvailabilitySlice';
import { useEffect, useState } from 'react';

const headers = [
    'S. No.',
    'Coach Name',
    'Username',
    'Availability',
    'Calendar',
];

const CoachAvialablity = () => {
    const dispatch = useDispatch();
    const { todaysAvailableCoach } = useSelector(
        (state) => state.coachAvailability,
    );
    const [coachAvailabilityData, setCoachAvailabilityData] = useState([]);

    useEffect(() => {
        dispatch(getTodayCoachAvailability());
    }, [dispatch]);

    useEffect(() => {
        if (todaysAvailableCoach && todaysAvailableCoach.length > 0) {
            const transformData = todaysAvailableCoach.map((item, index) => ({
                id: item.id,
                taName: item.name,
                username: item.username,
                Availability: item.availability_status,
                // calendar: 'Check',
            }));
            setCoachAvailabilityData(transformData);
        }
    }, [todaysAvailableCoach]);
    console.log('Coach Available Data : ', coachAvailabilityData);

    const actionButtons = [
        {
            type: 'calender',
        },
    ];

    return (
        <>
            <Box m="20px">
                <Header />
                <Sidebar />
                <Box display={'flex'} justifyContent={'space-between'}>
                    <p
                        style={{
                            fontSize: '44px',
                            justifyContent: 'center',
                            fontFamily: 'ExtraLight',
                        }}
                    >
                        Coach Availability
                    </p>
                    {/* <Box> */}
                    <Box
                        display={'flex'}
                        backgroundColor="#FFF"
                        borderRadius={'30px'}
                        width={'20vw'}
                        height={'5vh'}
                    >
                        <InputBase
                            sx={{ ml: 2, flex: 1 }}
                            placeholder="Search here ..."
                        />
                    </Box>
                    {/* </Box> */}
                </Box>
                <DynamicTable
                    headers={headers}
                    initialData={coachAvailabilityData}
                    componentName={'COACHAVAILABLE'}
                    actionButtons={actionButtons}
                />
            </Box>
        </>
    );
};

export default CoachAvialablity;
