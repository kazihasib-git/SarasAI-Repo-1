import { Box, InputBase, Button, Modal, Typography } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import { mockMappingDat } from '../../fakeData/mappingData';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState } from "react";
import { OnOffSwitch } from '../../components/Switch';
import editIcon from '../../assets/editIcon.png';
import DynamicTable from '../../components/CommonComponent/DynamicTable';

// const TaMapping = () => {
//   const [open, setOpen] = useState(false);
//   const [currentRow, setCurrentRow] = useState(null);
//   const [viewType, setViewType] = useState('');

//   const handleOpenModal = () => {
//     setIsModalOpen(true);
//   };


//   const handleOpen = (row, type) => {
//     setCurrentRow(row);
//     setViewType(type);
//     setOpen(true);
//   };

 

//   const handleEdit = (id) => {
//     console.log(`Edit TA with ID: ${id}`);
//     handleOpenModal();
//   };

//   const columns = [
//     { field: "id", headerName: "ID" },
//     {
//       field: "taName", headerName: "TA Name", flex: 1, cellClassName: "name-column--cell"
//     },
//     { field: "username", headerName: "User Name", flex: 1, cellClassName: "name-column--cell" },
//     {
//       field: "activeStudents",
//       headerName: "Active Students",
//       flex: 1,
//       cellClassName: "name-column--cell",
//       renderCell: (params) => (
//         <div>
//           {params.value} <Button sx={{ borderRadius: 20, border:1, borderColor: "#ff6f61", color: "#ff6f61", "&:hover": { backgroundColor: "#ff6f61", color: "#fff" } }} onClick={() => handleOpen(params.row, 'students')}>View</Button>
//         </div>
//       ),
//     },
//     {
//       field: "activeBatches",
//       headerName: "Active Batches",
//       flex: 1,
//       cellClassName: "name-column--cell",
//       renderCell: (params) => (
//         <div>
//           {params.value} <Button onClick={() => handleOpen(params.row, 'batches')}>View</Button>
//         </div>
//       ),
//     },
//     {
//       field: "actions",
//       headerName: "Actions",
//       flex: 1,
//       renderCell: (params) => (
//         <Box sx={{ display: 'flex', gap: '5px', marginTop: "10px" }}>
//           {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <OnOffSwitch />
//           </Box> */}
//           <Button sx={{
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             color: '#F56D3B',
//             backgroundColor: '#FEEBE3',
//             gap: '4px',
//             height: '30px',
//             width: '70px',
//             borderRadius: '15px',
//             padding: '5px',
//             '&:hover': {
//               backgroundColor: 'rgba(245, 235, 227, 0.8)',
//             }
//           }}
//             variant='text'
//             onClick={() => { handleEdit(params.row.id) }}
//           >
//             <img src={editIcon}
//               alt=""
//             />
//             <small>Edit</small>
//           </Button>
//         </Box>
//       ),
//     }
//   ];

//   return (
//     <>
//       <Box m="40px">
//         <Header />
//         <Sidebar />
//         <Box display={"flex"} justifyContent={"space-between"}>
//           <p style={{ fontSize: "40px",  justifyContent: "center", margin: 0, color:"#1A1E3D" }}>TA Mapping</p>
//           <Box display={"flex"}>
//             <Box
//               display={"flex"}
//               backgroundColor="#FFF"
//               borderRadius={"30px"}
//               width={"40vh"}
//               marginRight={"10px"}
//             >
//               <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search here ..." />
//             </Box>
//           </Box>
//         </Box>
//         <Box m="20px 0 0 0" height={"70vh"} sx={{
//           "& .MuiDataGrid-root": {
//             border: "none",
//           },
//           "& .MuiDataGrid-cell": {
//             borderBottom: "none"
//           },
//           "& .name-column--cell": {
//             color: "#5F6383"
//           },
//           "& .MuiDataGrid-columnHeader": {
//             backgroundColor: "#FFF",
//             borderBottom: "none",
//           },
//           "& .MuiDataGrid-columnHeaderTitle": {
//             color: "#1A1E3D",
//             fontWeight: "600",
//             fontSize: 16
//           },
//           "& .MuiDatGrid-virtualScroller": {
//             backgroundColor: "#FFF"
//           },
//           "& .MuiDataGrid-footerContainer": {
//             borderTop: "none",
//             backgroundColor: "#FFF"
//           },
//           "& .MuiDataGrid-virtualScrollerContent": {
//             backgroundColor: "#FFF"
//           },
//           "& .MuiDataGrid-columnHeader:focus .MuiDataGrid-cell:focus":{
//             outline:"none"
//           }
          
//         }}>
//           <DataGrid
//             rows={mockMappingDat}
//             columns={columns}
//           />
//         </Box>
//       </Box>

//     </>
//   );
// }


const headers = ["S. No.", "TA Name", "Username", "Active Students", "Active Batches", "Actions"];

const actionButtons = [
    {
        type: 'switch',
    },
    {
        type: 'delete',
        onClick: (id) => console.log(`Edit clicked for id ${id}`)
    }
];

const TaMapping = () => {
    return (
        <>
            <Header />
            <Sidebar />
            <Box display={"flex"} justifyContent={"space-between"} marginTop={3}>
                <p style={{ fontSize: "44px", justifyContent: "center", marginBottom: '20px' }}>TA Mapping</p>
            </Box>
            <DynamicTable
                headers={headers}
                initialData={mockMappingDat}
                actionButtons={actionButtons}
            />
        </>
    );
};

export default TaMapping;
