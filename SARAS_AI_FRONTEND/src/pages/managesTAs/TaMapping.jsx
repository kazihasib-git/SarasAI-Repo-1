import React, { useEffect, useState } from 'react';
import { Box, InputBase } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { showTAMapping } from '../../redux/features/adminModule/ta/taSlice';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import DynamicTable from '../../components/CommonComponent/DynamicTable';
import { timezoneIdToName } from '../../utils/timezoneIdToName';
import {deleteTaMapping } from '../../redux/features/adminModule/ta/taSlice';
import { getTimezone } from '../../redux/features/utils/utilSlice';
const headers = [
    'S. No.',
    'TA Name',
    'Username',
    // 'Time Zone',
    'Active Students',
    'Active Batches',
    'Actions',
];
const actionButtons = [
    {
        type: 'delete',
        onClick: id => console.log(`Delete clicked for id ${id}`),
    },
];

const TaMapping = () => {
    const dispatch = useDispatch();
    const { taMapping, loading } = useSelector(state => state.taModule);
    const [taMappingData, setTaMappingData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { timezones } = useSelector(state => state.util);

    useEffect(() => {
        dispatch(showTAMapping());
        dispatch(getTimezone());
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            if (taMapping && taMapping.length > 0) {
                const transformData = await Promise.all(taMapping.map(async (item) => {
                    const timezoneName = await timezoneIdToName(item.timezone_id , timezones);
                    return {
                        id: item.id,
                        name: item.name,
                        username: item.username,
                        // timezone_name: timezoneName,
                        Active_Students: item.Active_Students,
                        Active_Batches: item.Active_Batches,
                        is_active: item.is_active
                    };
                }));

                setTaMappingData(transformData);
            } else {
                setTaMappingData([]);
            }
        };

        fetchData();
    }, [taMapping]);

    const handleSearch = event => {
        setSearchQuery(event.target.value);
    };

    const filteredData = taMappingData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box m="20px">
            <Header />
            <Sidebar />
            <Box display={'flex'} justifyContent={'space-between'}>
                <p
                    style={{
                        fontSize: '44px',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        fontFamily: 'ExtraLight',
                    }}
                >
                    TA Mapping
                </p>
                <Box display={'flex'}>
                    <Box
                        marginTop={1}
                        display={'flex'}
                        backgroundColor="#FFF"
                        borderRadius={'30px'}
                        width={'20vw'}
                        height={'5vh'}
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
    );
};

export default TaMapping;
