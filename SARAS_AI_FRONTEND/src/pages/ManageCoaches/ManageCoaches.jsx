import { Box, InputBase, Button, Snackbar, Alert } from '@mui/material';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useEffect, useState } from 'react';
import AddEditCoach from '../../components/adminModule/coaches/manageCoaches/AddEditCoach';
import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../components/CommonComponent/DynamicTable';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCoach,
    openCreateCoach,
    closeCreateCoach,
    openEditCoach,
    closeEditCoach,
    setSelectedCoach,
    updateCoach,
} from '../../redux/features/adminModule/coach/coachSlice';
import { getTimezone } from '../../redux/features/utils/utilSlice';
import { timezoneIdToName } from '../../utils/timezoneIdToName';

const ManageCoaches = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State variables
    const [selectedCoachData, setSelectedCoachData] = useState(null);
    const [coachesData, setCoachesData] = useState([]);
    const [editData, setEditData] = useState();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [actionButtonToggled, setActionButtonToggled] = useState(false);


    // Get coaches and timezones from Redux store
    const { coaches, createCoachOpen, editCoachOpen } = useSelector(
        state => state.coachModule
    );
    const { timezones } = useSelector(state => state.util);

    useEffect(() => {
        dispatch(closeCreateCoach());
        dispatch(closeEditCoach());
        dispatch(getCoach());
        dispatch(getTimezone()); // Fetch timezones when the component mounts
    }, [dispatch]);

    // useEffect(() => {
    //     const transformData = async () => {
    //         if (coaches.length > 0 && timezones.length > 0) {
    //             const transformed = await Promise.all(
    //                 coaches.map(async item => {
    //                     const timezonename = await timezoneIdToName(
    //                         item.timezone_id,
    //                         timezones
    //                     );
    //                     console.log('timezonename: ', timezonename);
    //                     return {
    //                         id: item.id,
    //                         'Coach Name': item.name,
    //                         Username: item.username,
    //                         Location: item.location,
    //                         'Time Zone': timezonename,
    //                         is_active: item.is_active,
    //                     };
    //                 })
    //             );
    //             setCoachesData(transformed);
    //         }
    //     };

    //     transformData();
    // }, [coaches, timezones]);

    useEffect(() => {
        if(coaches && coaches.length > 0){
            const transformData = coaches.map((item) => ({
                id: item.id,
                'Coach Name': item.name,
                Username: item.username,
                Location: item.location,
                'Time Zone': timezoneIdToName(item.timezone_id, timezones),
                is_active: item.is_active,
            }));


            // Filter data based on the search query
            const filteredCoachesData = transformData.filter(data => {
                const matchName = data['Coach Name']?.toLowerCase().includes(searchQuery.toLowerCase());
                const matchUsername = data.Username?.toLowerCase().includes(searchQuery.toLowerCase());
                const matchLocation = data.Location?.toLowerCase().includes(searchQuery.toLowerCase());
                const matchTimezone = data['Time Zone']?.toLowerCase().includes(searchQuery.toLowerCase());
    
                return matchName || matchUsername || matchLocation || matchTimezone;
            });

            setCoachesData(transformData);
            setFilteredData(filteredCoachesData);
        }else {
            setCoachesData([]);
            setFilteredData([])
        }
    },[coaches, searchQuery, timezones]);

    console.log("FILTERED DATA :", filteredData)

    const handleAddCoach = () => {
        navigate('/createcoach');
    };

    const handleEditCoaches = id => {
        const coachData = coaches.find(ta => ta.id === id);
        setSelectedCoachData(coachData);
        setEditData(coachData);
        dispatch(openEditCoach());
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const headers = [
        'S. No.',
        'Coach Name',
        'Username',
        'Location',
        'Time Zone',
        'Action',
    ];

    const actionButtons = [
        {
            type: 'switch',
            onChange: (event, id) => {
                if (event && event.preventDefault) {
                    event.preventDefault();
                }

                const coachToUpdate = coachesData.find((coach) => coach.id === id)
                const updatedStatus = coachToUpdate.is_active === 1 ? 0 : 1;

                dispatch(updateCoach({ id, data : { is_active : updatedStatus }}))
                
                setCoachesData((prevCoachesData) => 
                    prevCoachesData.map((coach) => 
                        coach.id === id ? {...coach, is_active : updatedStatus } : coach
                    )
                );
                
                setActionButtonToggled(prev => !prev);
            },

        },
        {
            type: 'edit',
            onClick: (id, event) => {
                if(event && event.preventDefault) {
                    event.preventDefault()
                }
                handleEditCoaches(id);
            },
        },
    ];

    // Filter coachesData based on the search query
    // const filteredCoachesData = coachesData.filter(coach =>
    //     ['Coach Name', 'Username', 'Location', 'Time Zone'].some(
    //         key =>
    //             coach[key] &&
    //             coach[key]
    //                 .toString()
    //                 .toLowerCase()
    //                 .includes(searchQuery.toLowerCase())
    //     )
    // );

    return (
        <>
            {!createCoachOpen && !editCoachOpen && (
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
                            Manage Coach
                        </p>
                        <Box display={'flex'}>
                            <Box
                                display={'flex'}
                                backgroundColor="#FFF"
                                borderRadius={'30px'}
                                width={'30vh'}
                                marginRight={'10px'}
                            >
                                <InputBase
                                    sx={{ m1: 2, flex: 1, marginLeft: 5 }}
                                    placeholder="Search here ..."
                                    value={searchQuery}
                                    onChange={e =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </Box>
                            <Button
                                variant="contained"
                                onClick={handleAddCoach}
                                style={{
                                    backgroundColor: '#F56D3B',
                                    borderRadius: '30px',
                                    textTransform: 'none',
                                }}
                            >
                                <i
                                    style={{ marginRight: '5px' }}
                                    className="bi bi-plus-circle"
                                ></i>
                                <span>Create Coach</span>
                            </Button>
                        </Box>
                    </Box>
                    <Box
                        m="20px 0 0 0"
                        height={'70vh'}
                        sx={{
                            '& .MuiDataGrid-root': {
                                border: 'none',
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: 'none',
                            },
                            '& .name-column--cell': {
                                color: '#5F6383',
                            },
                            '& .MuiDataGrid-columnHeader': {
                                backgroundColor: '#FFF',
                                borderBottom: 'none',
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                color: '#1A1E3D',
                                fontWeight: '600',
                                fontSize: 16,
                            },
                            '& .MuiDatGrid-virtualScroller': {
                                backgroundColor: '#FFF',
                            },
                            '& .MuiDataGrid-footerContainer': {
                                borderTop: 'none',
                                backgroundColor: '#FFF',
                            },
                            '& .MuiDataGrid-virtualScrollerContent': {
                                backgroundColor: '#FFF',
                            },
                        }}
                    >
                        <DynamicTable
                            headers={headers}
                            initialData={filteredData}
                            actionButtons={actionButtons}
                            componentName={'MANAGECOACH'}
                        />
                    </Box>
                </Box>
            )}
            {createCoachOpen && <AddEditCoach />}
            {editCoachOpen && <AddEditCoach data={editData} />}
            {/* Snackbar for success message */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Form submitted successfully!
                </Alert>
            </Snackbar>
        </>
    );
};

export default ManageCoaches;
