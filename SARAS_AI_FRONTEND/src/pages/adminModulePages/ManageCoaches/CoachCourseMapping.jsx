import { Box, InputBase } from '@mui/material';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { useState, useEffect } from 'react';
import DynamicTable from '../../../components/CommonComponent/DynamicTable';
import { showCoachCourseMapping } from '../../../redux/features/adminModule/coach/coachSlice';
import { useDispatch, useSelector } from 'react-redux';

const headers = [
    'S. No.',
    'Coach Name',
    'Active Courses',
    // 'Action',
];

const actionButtons = [
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
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(showCoachCourseMapping());
    }, [dispatch]);

    useEffect(() => {
        if (coachCourseMappingData && coachCourseMappingData.length > 0) {
            const transformData = coachCourseMappingData.map((item, index) => ({
                id: item.id,
                name: item.name,
                Active_Courses: item.courses.length,
            }));

            setcaMappingData(transformData);
            setFilteredData(transformData);
        }
    }, [coachCourseMappingData]);

    const handleSearch = event => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        setCurrentPage(1); // Reset the current page to 1 when the search query changes

        const filtered = caMappingData.filter(item =>
            item.name.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
    };

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
                    currentPage={currentPage} // Pass the current page state to DynamicTable
                    onPageChange={page => setCurrentPage(page)} // Update the current page state when the page changes
                    componentName={'COACHCOURSEMAPPING'}
                />
            </Box>
        </>
    );
};

export default CoachCourseMapping;
