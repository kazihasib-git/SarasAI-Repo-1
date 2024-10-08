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
import SelectBatches from '../../components/batches/SelectBatches';
import SelectStudents from '../../components/students/SelectStudents';
import CreateNewSession from '../../components/availability/CreateNewSession';

const CoachScheduling = () => {
    const dispatch = useDispatch();
    const { assignCoachStudentOpen, assignCoachBatchOpen, loading } =
        useSelector(state => state.coachModule);

    const { scheduleCoachSessionOpen } = useSelector(
        state => state.coachScheduling
    );

    const { openBatches, openStudents } = useSelector(
        state => state.batchesAndStudents
    );

    const { coachMapping } = useSelector(state => state.coachModule);
    const [coachScheduleData, setCoachScheduleData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(showCoachMapping());
    }, [dispatch]);

    useEffect(() => {
        if (coachMapping && coachMapping.length > 0) {
            const transformData = coachMapping.map((item, index) => ({
                id: item.id,
                name: item.name,
                Username: item.username,
                Active_Students: item.Active_Students,
                Active_Batches: item.Active_Batches,
                timezoneId: item.timezone_id,
            }));

            setCoachScheduleData(transformData);
        } else {
            setCoachScheduleData([]);
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
                    componentName={'COACHSCHEDULE'}
                />
            </Box>
            {scheduleCoachSessionOpen && (
                <CreateNewSession componentName={'COACHSCHEDULE'} />
            )}
            {openBatches && <SelectBatches componentName={'COACHSCHEDULE'} />}
            {openStudents && <SelectStudents componentName={'COACHSCHEDULE'} />}
            {/* {openCoachEditBatch && (
                <EditBatches componentname={'COACHSCHEDULE'} />
            )}
            {openCoachEditStudent && (
                <EditStudents componentname={'COACHSCHEDULE'} />
            )} */}
        </>
    );
};

export default CoachScheduling;
