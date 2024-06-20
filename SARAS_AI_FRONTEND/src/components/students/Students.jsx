import { Box, InputBase } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { studentDummyDatadata } from '../../fakeData/studentData'
import { DataGrid } from '@mui/x-data-grid'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import { useGetStudentsQuery } from '../../redux/services/students/studentsApi' 

const Students = () => {
    /*
    const { data : students, error, isLoading } = useGetStudentsQuery();

    if(isLoading){
        return <div>Loading....</div>
    }

    if(error){
        return <div> Error Loading students </div>
    }

    */

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", flex: 1, cellClassName: "name-column--cell" },
        { field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell" },
        { field: "user_id", headerName: "User Id", flex: 1, cellClassName: "name-column--cell" },
        { field: "email", headerName: "Email", flex: 1, cellClassName: "name-column--cell" },
        { field: "phone", headerName: "Phone Number", flex: 1, cellClassName: "name-column--cell" },
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
                        rows={studentDummyDatadata}
                        columns={columns}
                    />
                </Box>
            </Box>

        </div>
    )
}

export default Students