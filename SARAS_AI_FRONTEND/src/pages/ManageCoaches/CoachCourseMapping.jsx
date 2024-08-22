import { Box, InputBase, Button, Modal, Typography } from '@mui/material';

import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useState, useEffect } from 'react';
import { OnOffSwitch } from '../../components/Switch';
import editIcon from '../../assets/editIcon.png';
import DynamicTable from '../../components/CommonComponent/DynamicTable';
import {
    showCoachCourseMapping,
    showCoachMapping,
} from '../../redux/features/adminModule/coach/coachSlice';
import { useDispatch, useSelector } from 'react-redux';

const headers = [
    'S. No.',
    'COACH Name',
    'Active Courses',
    //'Action',
];

const actionButtons = [
    // {
    //   type: "switch",
    // },
    {
        type: 'delete',
        onClick: id => console.log(`Delete clicked for id ${id}`),
    },
];

const CoachCourseMapping = () => {
    const dispatch = useDispatch();
    const { coachCourseMappingData, loading } = useSelector(
        state => state.coachModule
    );
    const [caMappingData, setcaMappingData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    // console.log("camapping" , coachMapping);
    useEffect(() => {
        dispatch(showCoachCourseMapping());
    }, [dispatch]);

    useEffect(() => {
        console.log('...................', coachCourseMappingData);
        if (coachCourseMappingData && coachCourseMappingData.length > 0) {
            const transformData = coachCourseMappingData.map((item, index) => ({
                id: item.id,
                name: item.name,
                Active_Courses: item.courses.length,
            }));

            setcaMappingData(transformData);
            console.log('transform data', transformData);
        }
    }, [coachCourseMappingData]);

    const handleSearch = event => {
        setSearchQuery(event.target.value);
    };

    const filteredData = caMappingData?.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Box m={'10px'}>
                <Header />
                <Sidebar />
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    marginTop={3}
                >
                    <p
                        style={{
                            fontSize: '44px',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            fontFamily: 'ExtraLight',
                        }}
                    >
                        Coach Course Mapping
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
                    //actionButtons={actionButtons}
                    componentName={'COACHCOURSEMAPPING'}
                />
            </Box>
        </>
    );
};

export default CoachCourseMapping;
