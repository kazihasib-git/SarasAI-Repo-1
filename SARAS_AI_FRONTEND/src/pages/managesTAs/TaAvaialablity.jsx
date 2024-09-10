import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import './CommonComponent.css';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { getTodayTaAvailability } from '../../redux/features/adminModule/ta/taAvialability';
import DynamicTable from '../../components/CommonComponent/DynamicTable';

const headers = [
    'Sr. No.',
    'TA Name',
    'Username',
    'Current Availability',
    'Calendar',
];

const TaAvailability = () => {
    const dispatch = useDispatch();
    const { todaysAvailableTa } = useSelector(state => state.taAvialability);
    const [taAvailabilityData, setTaAvailabilityData] = useState([]);

    useEffect(() => {
        dispatch(getTodayTaAvailability());
    }, [dispatch]);

    useEffect(() => {
        if (todaysAvailableTa && todaysAvailableTa.length > 0) {
            const transformData = todaysAvailableTa.map((item, index) => ({
                id: item.id,
                taName: item.name,
                username: item.username,
                Availability: item.availability_status,
                timezoneId: item.timezone_id,
                // calendar: 'Check',
            }));
            setTaAvailabilityData(transformData);
        } else {
            setTaAvailabilityData([]);
        }
    }, [todaysAvailableTa]);

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
                        TA Availability
                    </p>
                </Box>
                <DynamicTable
                    headers={headers}
                    initialData={taAvailabilityData}
                    actionButtons={actionButtons}
                    componentName={'TAAVAILABLE'}
                />
            </Box>
        </>
    );
};

export default TaAvailability;
