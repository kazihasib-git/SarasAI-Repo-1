import React from 'react';
import { Box, InputBase, Link as MuiLink } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
// import Calendar from '../../components/Calender/indexCalender';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import { mockDataAvilable } from '../../fakeData/availableData';
import { Link } from 'react-router-dom';

const TaAvialablity = () => {
    const theme = useTheme();
    const [checkCalender, setCheckCalender] = useState(false);

    const columns = [
        { field: 'id', headerName: 'ID' },
        {
            field: 'taName',
            headerName: 'TA Name',
            flex: 1,
            cellClassName: 'name-column--cell',
        },
        {
            field: 'username',
            headerName: 'User Name',
            flex: 1,
            cellClassName: 'name-column--cell',
        },
        {
            field: 'availability',
            headerName: 'Availability',
            flex: 1,
            cellClassName: 'name-column--cell',
        },
        {
            field: 'calendar',
            headerName: 'Calendar',
            flex: 1,
            cellClassName: 'name-column--cell',
            renderCell: (params) => (
                <MuiLink component={Link} to="/tacalender">
                    Check
                </MuiLink>
            ),
        },
    ];

    return (
        <>
            <Box m="40px">
                <Header />
                <Sidebar />
                <Box display="flex" justifyContent="space-between">
                    <p
                        style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            justifyContent: 'center',
                            margin: 0,
                        }}
                    >
                        TA Avialablity
                    </p>
                    <Box
                        display="flex"
                        backgroundColor="#FFF"
                        borderRadius="30px"
                        width="30vh"
                    >
                        <InputBase
                            sx={{ ml: 2, flex: 1 }}
                            placeholder="Search here ..."
                        />
                    </Box>
                </Box>
                <Box
                    m="20px 0 0 0"
                    height="70vh"
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
                    <DataGrid rows={mockDataAvilable} columns={columns} />
                </Box>
            </Box>
        </>
    );
};

export default TaAvialablity;
