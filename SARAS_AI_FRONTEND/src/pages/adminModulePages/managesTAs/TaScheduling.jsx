import { Box, InputBase, Button, Modal, Typography } from '@mui/material';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { useEffect, useState } from 'react';
import DynamicTable from '../../../components/CommonComponent/DynamicTable';
import { useDispatch, useSelector } from 'react-redux';
import Schedule from '../../../components/availability/Schedule';
import { showTAMapping } from '../../../redux/features/adminModule/ta/taSlice';
import EditBatches from '../../../components/availability/EditBatches';
import EditStudents from '../../../components/availability/EditStudents';

const TaScheduling = () => {
    const dispatch = useDispatch();
    const { assignStudentOpen, taMapping, assignBatchOpen, loading } =
        useSelector(state => state.taModule);
    const { scheduleSessionOpen, openEditBatch, openEditStudent } = useSelector(
        state => state.taScheduling
    );

    const [searchQuery, setSearchQuery] = useState('');
    const { taId } = useSelector(state => state.taScheduling);
    const { todaysAvailableTa } = useSelector(state => state.taAvialability);
    const [selectedTA, setSelectedTA] = useState(null);
    const [taScheduleData, setTaScheduleData] = useState([]);

    useEffect(() => {
        dispatch(showTAMapping());
    }, [dispatch]);

    useEffect(() => {
        if (taMapping && taMapping.length > 0) {
            const transformData = taMapping.map((item, index) => ({
                id: item.id,
                name: item.name,
                Username: item.username,
                Active_Students: item.Active_Students,
                Active_Batches: item.Active_Batches,
                timezoneId : item.timezone_id,
            }));

            setTaScheduleData(transformData);
        } else {
            setTaScheduleData([]);
        }
    }, [taMapping]);

    const handleSearch = event => {
        setSearchQuery(event.target.value);
    };

    const filteredData = taScheduleData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const headers = [
        'S. No.',
        'TA Name',
        'Username',
        'Active Students',
        'Active Batches',
        'timezone',
        'Action',
    ];

    const actionButtons = [
        {
            type: 'calendar',
        },
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
                        TA Scheduling
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
                    componentName={'TAMAPPING'}
                />
            </Box>
            {scheduleSessionOpen && <Schedule componentName={'TASCHEDULE'} />}
            {openEditBatch && <EditBatches componentname={'TASCHEDULE'} />}
            {openEditStudent && <EditStudents componentname={'TASCHEDULE'} />}
        </>
    );
};

export default TaScheduling;
