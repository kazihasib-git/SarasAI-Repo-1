import { Box, CircularProgress } from '@mui/material';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useEffect, useState } from 'react';
import AddEditTA from '../../components/adminModule/tas/manageTAs/AddEditTA';
import DynamicTable from '../../components/CommonComponent/DynamicTable';
import './ManageTa.css';
import {
    getTA,
    openCreateTa,
    openEditTa,
    closeCreateTa,
    closeEditTa,
    updateTA,
} from '../../redux/features/adminModule/ta/taSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getTimezone } from '../../redux/features/utils/utilSlice';
import { timezoneIdToName } from '../../utils/timezoneIdToName';

const headers = [
    'S. No.',
    'TA Name',
    'Username',
    'Location',
    'Time Zone',
    'Actions',
];

const ManageTA = () => {
    
    const dispatch = useDispatch();
    const { timezones } = useSelector(state => state.util);
    const { tas, loading, error, createTAOpen, editTAOpen } = useSelector(
        state => state.taModule
    );

    const [tasData, setTasData] = useState([]);
    const [editData, setEditData] = useState();
    const [searchQuery, setSearchQuery] = useState('');
    const [actionButtonToggled, setActionButtonToggled] = useState(false);
    const [filteredData, setFilteredData] = useState([])

    useEffect(() => {
        dispatch(closeCreateTa());
        dispatch(closeEditTa());
        dispatch(getTimezone());

        dispatch(getTA());
    }, [dispatch]);

    useEffect(() => {
        if (tas && tas.length > 0) {
            // Transform data
            const transformData = tas.map(item => ({
                id: item.id,
                'TA Name': item.name,
                Username: item.username,
                Location: item.location,
                'Time Zone': timezoneIdToName(item.timezone_id, timezones),
                is_active: item.is_active,
            }));
    
            // Filter data based on the search query
            const filteredTasData = transformData.filter(data => {
                const matchName = data['TA Name']?.toLowerCase().includes(searchQuery.toLowerCase());
                const matchUsername = data.Username?.toLowerCase().includes(searchQuery.toLowerCase());
                const matchLocation = data.Location?.toLowerCase().includes(searchQuery.toLowerCase());
                const matchTimezone = data['Time Zone']?.toLowerCase().includes(searchQuery.toLowerCase());
    
                return matchName || matchUsername || matchLocation || matchTimezone;
            });
    
            // Set state with transformed and filtered data
            setTasData(transformData);
            setFilteredData(filteredTasData);
        } else {
            setTasData([]);
            setFilteredData([]);
        }
    }, [tas, searchQuery, timezones]);

    console.log("FILTERED DATA :", filteredData)

    const actionButtons = [
        {
            type: 'switch',
            onChange: (event, id) => {
                if (event && event.preventDefault) {
                    event.preventDefault();
                }

                const taToUpdate = tasData.find((ta) => ta.id === id)
                const updatedStatus = taToUpdate.is_active === 1 ? 0 : 1;

                dispatch(updateTA({ id, data : { is_active : updatedStatus }}))
                
                setTasData((prevTasData) => 
                    prevTasData.map((ta) => 
                        ta.id === id ? {...ta, is_active : updatedStatus } : ta
                    )
                );
                
                setActionButtonToggled(prev => !prev);
            },
        },
        {
            type: 'edit',
            onClick: (id, event) => {
                if (event && event.preventDefault) {
                    event.preventDefault();
                }
                handleEditTa(id);
            },
        },
    ];

    const handleAddTa = () => {
        dispatch(openCreateTa());
    };

    const handleEditTa = id => {
        const dataToEdit = tas.find(ta => ta.id === id);
        setEditData(dataToEdit);
        dispatch(openEditTa());
    };

    const handleChange = value => {
        setSearchQuery(value);
    };

    // Filter tasData based on the search query
    // const filteredTasData = tasData?.filter(
    //     ta =>
    //         ta['TA Name']?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //         ta.Username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //         ta.Location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //         ta['Time Zone']?.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    return (
        <>
            <Box m="20px">
                <Header />
                <Sidebar />
                {!createTAOpen && !editTAOpen && (
                    <>
                        <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            marginTop={3}
                            alignItems={'center'}
                        >
                            <p
                                style={{
                                    fontSize: '44px',
                                    justifyContent: 'center',
                                    fontFamily: 'ExtraLight',
                                }}
                            >
                                Manage TAs
                            </p>
                            <div className="inputBtnContainer">
                                <div className="inputContainer">
                                    <input
                                        className="inputField"
                                        placeholder="Search Here ..."
                                        value={searchQuery}
                                        onChange={e =>
                                            handleChange(e.target.value)
                                        }
                                    />
                                </div>
                                <button
                                    className="buttonContainer"
                                    onClick={handleAddTa}
                                >
                                    <i className="bi bi-plus-circle"></i>
                                    <span>Create TA</span>
                                </button>
                            </div>
                        </Box>
                        {!filteredData || filteredData.length === 0 ? (
                            <div>
                                <p>No Data Available</p>
                            </div>
                        ) : (
                            <DynamicTable
                                headers={headers}
                                initialData={filteredData}
                                actionButtons={actionButtons}
                                componentName={'MANAGETA'}
                            />
                        )}
                    </>
                )}

                {createTAOpen && <AddEditTA />}
                {editTAOpen && <AddEditTA data={editData} />}
            </Box>
        </>
    );
};

export default ManageTA;
