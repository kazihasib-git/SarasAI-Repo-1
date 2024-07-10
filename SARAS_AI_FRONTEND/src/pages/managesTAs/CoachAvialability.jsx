import { Box, Button, InputBase, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { mockDataAvilable } from "../../fakeData/availableData";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
//import {DynamicTable} from '../../pages/managesTAs/TaAvaialablity';
import DynamicTable from '../../components/CommonComponent/DynamicTable';


const CoachAvialablity = () => {
    const theme = useTheme();
  
    const headers = [
        "S. No.",
        "Coach Name",
        "Username",
        "Current Availability",
        "Action",
      ];


    return (
        <>
            <Box m="40px">
                <Header />
                <Sidebar />
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} >
                    <p style={{ fontSize: "44px", justifyContent: "center",fontFamily: "ExtraLight"}}>Coach Availability</p>
                    <Box display={"flex"}>
                        <Box
                             display={"flex"}
                             backgroundColor="#FFF"
                             borderRadius={"30px"}
                             width={"20vw"}
                             height={"5vh"}
                             marginBottom={"15px"}
                             marginRight={"10px"}
                        >
                            <InputBase sx={{ ml: 2, flex: 1}} placeholder="Search here ..." />
                     
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
                    <DynamicTable
                        headers={headers}
                        initialData={mockDataAvilable}
                        
                        componentName={"Coach Avialability"}
                    />
                    {/* <DataGrid
                        rows={mockDataAvilable}
                        columns={columns}
                    /> */}
                </Box>
            </Box>
        </>
    )
}

export default CoachAvialablity;

