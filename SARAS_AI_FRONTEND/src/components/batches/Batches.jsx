import React from 'react'
import { useGetBatchesQuery } from '../../redux/services/batches/batchesApi'
import { Box, InputBase } from '@mui/material'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import { DataGrid } from '@mui/x-data-grid'
import { batchesDummyData } from "../../fakeData/batchesData"

const Batches = () => {
    /*
    const { data : batches, error , isLoading } = useGetBatchesQuery()

    if(isLoading){
        return <div>Loading....</div>
    }

    if(error){
        return <div>Error loading batches</div>
    }
    */
   
    const columns = useMemo(() => [
        { field: "course_id", headerName: "ID", flex: 1, cellClassName: "name-column--cell" },
        { field : "title", headerName : 'Title', flex: 1, cellClassName: "name-column--cell"},
        { field : "description", headerName : 'Description', flex: 1, cellClassName: "name-column--cell"},
        { field : "duration", headerName : 'Duration', flex: 1, cellClassName: "name-column--cell"},
        { field : "level", headerName : 'Level', flex: 1, cellClassName: "name-column--cell"},
    ], []);
      
    return (
        <div>
            <Box m="40px">
                <Header />
                <Sidebar />
                <Box display={"flex"} justifyContent={"space-between"}>
                    <p style={{ fontSize: "22px", fontWeight: "700", justifyContent: "center", margin: 0 }}>Students</p>
                    <Box display={"flex"}>
                        <Box
                            display={"flex"}
                            backgroundColor="#FFF"
                            borderRadius={"30px"}
                            width={"30vh"}
                            marginRight={"10px"}
                        >
                            <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search here ..." />
                        </Box>
                    </Box>
                </Box>
                <Box m="20px 0 0 0" height={"70vh"} sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none"
                    },
                    "& .name-column--cell": {
                        color: "#5F6383"
                    },
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#FFF",
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        color: "#1A1E3D",
                        fontWeight: "600",
                        fontSize: 16
                    },
                    "& .MuiDatGrid-virtualScroller": {
                        backgroundColor: "#FFF"
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: "#FFF"
                    },
                    "& .MuiDataGrid-virtualScrollerContent": {
                        backgroundColor: "#FFF"
                    }
                }}>
                    <DataGrid
                        rows={batchesData}
                        columns={columns}
                    />
                </Box>
            </Box>
        </div>
    )
}

export default Batches