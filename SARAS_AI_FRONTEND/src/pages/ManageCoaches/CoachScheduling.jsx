import { Box, InputBase, Button, Modal, Typography } from '@mui/material';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useEffect, useState } from 'react';
import DynamicTable from '../../components/CommonComponent/DynamicTable';
import { useDispatch, useSelector } from 'react-redux';
import Schedule from '../../components/availability/Schedule';
import { showCoachMapping } from '../../redux/features/adminModule/coach/coachSlice';
import EditBatches from '../../components/availability/EditBatches';
import EditStudents from '../../components/availability/EditStudents';
import {
    openCoachEditBatch,
    openCoachEditStudent,
} from '../../redux/features/adminModule/coach/coachSchedule';

const CoachSheduling = () => {

    const dispatch = useDispatch();
    const { assignCoachStudentOpen, assignCoachBatchOpen, loading } =
        useSelector(state => state.coachModule);
    
        const { scheduleCoachSessionOpen } = useSelector(
        state => state.coachScheduling
    );
    
    const { coachMapping } = useSelector(state => state.coachModule);
    const [coachScheduleData, setCoachScheduleData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(showCoachMapping());
    }, [dispatch]);

    // const { coachID } = useSelector(state => state.coachScheduling);
    // const { todaysAvailableCoach } = useSelector(state => state.coachAvailability);
    // const [selectedCoach, setSelectedCoach] = useState(null);
    

    // const findTaTimeZone = (todaysAvailableCoach) => {
    //     if (todaysAvailableCoach && Number(coachID)) {
    //         const selectedCoach = todaysAvailableCoach.find(coach => coach.id === Number(coachID));
    //         setSelectedCoach(selectedCoach || null);  // Set to null if not found
    //     } else {
    //         setSelectedCoach(null);  // Set to null if conditions are not met
    //     }
    // }
    // useEffect(() => {
    //     findTaTimeZone(todaysAvailableCoach);
    // }, [coachID, todaysAvailableCoach]);


    // const storedTimezoneId = selectedCoach ? selectedCoach.timezone_id : Number(localStorage.getItem('timezone_id'));

    useEffect(() => {
        if (coachMapping && coachMapping.length > 0) {
            const transformData = coachMapping.map((item, index) => ({
                id: item.id,
                name: item.name,
                Username: item.username,
                Active_Students: item.Active_Students,
                Active_Batches: item.Active_Batches,
                timezone: item.timezone_id,
            }));

            setCoachScheduleData(transformData);
        }else {
            setCoachScheduleData([])
        }
    }, [coachMapping]);

    const handleSearch = event => {
        setSearchQuery(event.target.value);
    };

    const filteredData = coachScheduleData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const actionButtons = [
        {
            type: 'calendar',
        },
    ];

    const headers = [
        'S. No.',
        'Coach Name',
        'Username',
        'Active Students',
        'Active Batches',
        'Action',
    ];

    return (
        <>
            <Box m="20px">
                <Header />
                <Sidebar />
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <p
                        style={{
                            fontSize: '44px',
                            justifyContent: 'center',
                            fontFamily: 'ExtraLight',
                        }}
                    >
                        Coach Scheduling
                    </p>
                    <Box display={'flex'}>
                        <Box
                            display={'flex'}
                            backgroundColor="#FFF"
                            borderRadius={'30px'}
                            width={'20vw'}
                            height={'5vh'}
                            marginBottom={'15px'}
                            marginRight={'10px'}
                        >
                            <InputBase
                                sx={{ ml: 2, flex: 1 }}
                                placeholder="Search here ..."
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                        </Box>
                    </Box>
                </Box>
                <DynamicTable
                    headers={headers}
                    initialData={filteredData}
                    actionButtons={actionButtons}
                    componentName={'COACHMAPPING'}
                />
            </Box>
            {scheduleCoachSessionOpen && (
                <Schedule componentName={'COACHSCHEDULE'} />
            )}
            {/* {assignCoachStudentOpen && (
        <AssignStudents componentname={"ADDITCOACH"} />
      )}
      {assignCoachBatchOpen && <AssignBatches componentname={"ADDITCOACH"} />} */}
            {openCoachEditBatch && (
                <EditBatches componentname={'COACHSCHEDULE'} />
            )}
            {openCoachEditStudent && (
                <EditStudents componentname={'COACHSCHEDULE'} />
            )}
        </>
    );
};

export default CoachSheduling;
