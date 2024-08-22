import { Box, InputBase, Button, Modal, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { mockMappingDat } from '../../fakeData/mappingData';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useEffect, useState } from 'react';
import { OnOffSwitch } from '../../components/Switch';
import editIcon from '../../assets/editIcon.png';
import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../components/CommonComponent/DynamicTable';
import { useDispatch, useSelector } from 'react-redux';
import Schedule from '../../components/availability/Schedule';
import { showTAMapping } from '../../redux/features/adminModule/ta/taSlice';
import EditBatches from '../../components/availability/EditBatches';
import EditStudents from '../../components/availability/EditStudents';

const TaScheduling = () => {
    const dispatch = useDispatch();
    const { assignStudentOpen, taMapping, assignBatchOpen, loading } =
        useSelector(state => state.taModule);
    const { scheduleSessionOpen, openEditBatch, openEditStudent } = useSelector(
        state => state.taScheduling
    );

    const { taId } = useSelector(state => state.taScheduling);
    const { todaysAvailableTa } = useSelector(state => state.taAvialability);
    const [selectedTA, setSelectedTA] = useState(null);

    const findTaTimeZone = todaysAvailableTa => {
        if (todaysAvailableTa && Number(taId)) {
            const selectedTa = todaysAvailableTa.find(
                ta => ta.id === Number(taId)
            );
            setSelectedTA(selectedTa || null); // Set to null if not found
        } else {
            setSelectedTA(null); // Set to null if conditions are not met
        }
    };
    useEffect(() => {
        findTaTimeZone(todaysAvailableTa);
    }, [taId, todaysAvailableTa]);

    const storedTimezoneId = selectedTA
        ? selectedTA.timezone_id
        : Number(localStorage.getItem('timezone_id'));

    const [taScheduleData, setTaScheduleData] = useState([]);

    useEffect(() => {
        dispatch(showTAMapping());
    }, [dispatch]);

    useEffect(() => {
        console.log('TASCHEDULE : ', taMapping);
        if (taMapping && taMapping.length > 0) {
            const transformData = taMapping.map((item, index) => ({
                id: item.id,
                name: item.name,
                Username: item.username,
                Active_Students: item.Active_Students,
                Active_Batches: item.Active_Batches,
                timezone: item.time_zone,
            }));

            setTaScheduleData(transformData);
        }
    }, [taMapping]);

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
                    style={{
                        fontSize: '44px',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        fontFamily: 'ExtraLight',
                    }}
                >
                    <p style={{ fontSize: '44px', justifyContent: 'center' }}>
                        TA Scheduling{' '}
                    </p>
                </Box>
                <DynamicTable
                    headers={headers}
                    initialData={taScheduleData}
                    actionButtons={actionButtons}
                    componentName={'TAMAPPING'}
                />
            </Box>
            {scheduleSessionOpen && (
                <Schedule
                    componentName={'TASCHEDULE'}
                    timezoneID={storedTimezoneId}
                />
            )}
            {openEditBatch && (
                <EditBatches
                    componentname={'TASCHEDULE'}
                    timezoneID={storedTimezoneId}
                />
            )}
            {openEditStudent && (
                <EditStudents
                    componentname={'TASCHEDULE'}
                    timezoneID={storedTimezoneId}
                />
            )}
        </>
    );
};

export default TaScheduling;
