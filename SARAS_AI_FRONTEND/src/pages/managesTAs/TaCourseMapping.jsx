import { Box, InputBase } from '@mui/material';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useState, useEffect } from 'react';
import DynamicTable from '../../components/CommonComponent/DynamicTable';
import { showTaCourseMapping } from '../../redux/features/adminModule/ta/taSlice';
import { useDispatch, useSelector } from 'react-redux';

const headers = [
    'S. No.',
    'Ta Name',
    'Active Courses',
];

const TaCourseMapping = () => {
    const dispatch = useDispatch();
    const { taCourseMappingData, loading, error } = useSelector(state => state.taModule);
    const [taMappingData, settaMappingData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(showTaCourseMapping());
    }, [dispatch]);

    // useEffect(() => {
    //     console.log("taCourseMappingData:", taCourseMappingData); // Log the data for debugging

    //     if (Array.isArray(taCourseMappingData) && taCourseMappingData.length > 0) {
    //         try {
    //             const transformData = taCourseMappingData.map((item, index) => {
    //                 if (!item || typeof item !== 'object') {
    //                     console.error(`Invalid item at index ${index}:`, item);
    //                     return null;
    //                 }
    //                 return {
    //                     id: item.id,
    //                     name: item.name,
    //                     Active_Courses: Array.isArray(item.courses) ? item.courses.length : 0,
    //                 };
    //             }).filter(Boolean);

    //             settaMappingData(transformData);
    //             setFilteredData(transformData);
    //         } catch (error) {
    //             console.error("Error transforming taCourseMappingData:", error);
    //         }
    //     } else {
    //         settaMappingData([]);
    //         setFilteredData([]);
    //     }
    // }, [taCourseMappingData]);
   console.log("tacoursemappingdata:::" , taCourseMappingData) ; 

    useEffect(() => {
        if (taCourseMappingData && taCourseMappingData.length > 0) {
            const transformData = taCourseMappingData.map((item) => ({
                id: item.id,
                name: item.name,
                Active_Courses: item.courses_for_ta.length,
                
            }));
            console.log('length of active courses :' ,  transformData.Active_Courses) ; 
            settaMappingData(transformData);
            setFilteredData(transformData);
        }
    }, [taCourseMappingData]);


    const handleSearch = event => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        setCurrentPage(1); // Reset the current page to 1 when the search query changes

        const filtered = taMappingData.filter(item =>
            item.name.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
    };

    // if (loading) {
    //     return <div>Loading...</div>;
    // }

    // if (error) {
    //     return <div>Error: {error}</div>;
    // }

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
                        Ta Course Mapping   
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
                    currentPage={currentPage}
                    onPageChange={page => setCurrentPage(page)}
                    componentName={'TACOURSEMAPPING'}
                />
            </Box>
        </>
    );
};

export default TaCourseMapping;