import { Box, InputBase } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { studentDummyDatadata } from '../../fakeData/stuData'
import { DataGrid } from '@mui/x-data-grid'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import { useDispatch, useSelector } from 'react-redux'

const Students = () => {
    const dispatch = useDispatch()
    // const studentState = useState((state) => state.data)

    // useEffect(() => {
    //     dispatch(getStudents())
    // },[dispatch])

    // if (studentState.loading) {
    //     return <div>Loading...</div>
    // }

    // if(studentState.error) {
    //     return <div>Error: {studentState.error}</div>
    // }

    const processData = (data) => {
        return data.flatMap(entry => {
          if (entry.packages.length === 0) {
            // If no packages, return a single entry with null package fields
            return [{
              id: entry.id,
              name: entry.name,
              user_id: entry.user_id,
              email: entry.email,
              phone: entry.phone,
              packageId: null,
              packageName: null,
              startDate: null,
              endDate: null,
              productName: null
            }];
          } else {
            // If packages exist, return multiple entries for each package
            return entry.packages.map(pkg => ({
              id: entry.id,
              name: entry.name,
              user_id: entry.user_id,
              email: entry.email,
              phone: entry.phone,
              packageId: pkg.id,
              packageName: pkg.name,
              startDate: pkg.start_date,
              endDate: pkg.end_date,
              productName: pkg.product.name
            }));
          }
        });
      };

    const processedData = processData(studentDummyDatadata);
    console.log("dummy data :", processedData)

    const columns = useMemo(() => [
        { field: "id", headerName: "ID", flex: 1, cellClassName: "name-column--cell" },
        { field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell" },
        { field: "user_id", headerName: "User Id", flex: 1, cellClassName: "name-column--cell" },
        { field: "email", headerName: "Email", flex: 1, cellClassName: "name-column--cell" },
        { field: "phone", headerName: "Phone Number", flex: 1, cellClassName: "name-column--cell" },
        { field: "packageId", headerName: "Package ID", flex: 1, cellClassName: "name-column--cell" },
        { field: "packageName", headerName: "Package Name", flex: 1, cellClassName: "name-column--cell" },
        { field: "startDate", headerName: "Start Date", flex: 1, cellClassName: "name-column--cell" },
        { field: "endDate", headerName: "End Date", flex: 1, cellClassName: "name-column--cell" },
        { field: "productName", headerName: "Product Name", flex: 1, cellClassName: "name-column--cell" }
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
                        rows={processedData}
                        columns={columns}
                    />
                </Box>
            </Box>

        </div>
    )
}

export default Students