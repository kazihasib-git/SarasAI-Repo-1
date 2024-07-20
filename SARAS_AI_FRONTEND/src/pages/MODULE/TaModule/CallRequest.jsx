// import React, { useState } from "react";
// import { Typography, Box, Button, Card, CardContent, Grid } from "@mui/material";
// import Header from "../../../components/Header/Header";
// import TaMenuSidebar from "./TeachingAssistantSidebar";
// import DenyDialog from "./DenyDialog"; // Import the DenyDialog component

// const CallRequest = () => {
//   const [open, setOpen] = useState(false);

//   const [callRequests, setCallRequests] = useState([

//     {
//       id: 2,
//       title: "Meeting Request By Aman",
//       for: "10 July, 2014 | 12:30 PM",
//       requestedBy: "Aman",
//       messages:
//         "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//     },
//     {
//       id: 3,
//       title: "Meeting Request By Aman",
//       for: "10 July, 2014 | 12:30 PM",
//       requestedBy: "Aman",
//       messages:
//         "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//     },
//     {
//         id: 5,
//         title: "Meeting Request By Raman",
//         for: "11 July, 2014 | 12:35 PM",
//         requestedBy: "Raman",
//         messages:
//           "Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industry.",
//       }
//   ]);
//   const [showFullMessages, setShowFullMessages] = useState({});

// //   const handleAddTa = () => {
// //     // Replace with navigation logic
// //     console.log("Navigating to create template");
// //   };

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleDenySubmit = () => {
//     // Add logic for deny action
//     console.log("Deny action submitted");
//     setOpen(false);
//   };

//   const handleApprove = (id) => {
//     setCallRequests(
//       callRequests.map((request) =>
//         request.id === id ? { ...request, approved: true } : request
//       )
//     );
//   };

//   const toggleShowFullMessage = (id) => {
//     setShowFullMessages((prevState) => ({
//       ...prevState,
//       [id]: !prevState[id],
//     }));
//   };

//   const truncateText = (text, limit) => {
//     if (text.length <= limit) return text;
//     return `${text.slice(0, limit)}...`;
//   };

//   return (
//     <div>
//       <Header />
//       <TaMenuSidebar />
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={2}
//       >
//         <Typography variant="h4" gutterBottom sx={{ fontFamily: "ExtraLight" }}>
//           Call Request
//         </Typography>

//           <div className="inputBtnContainer">
//           <button className="buttonContainer" variant="contained" color="warning" onClick={() => console.log("Create New Meeting button clicked")}>
//             <i className="bi bi-plus-circle"></i>
//             <span>Create New Meeting</span>
//           </button>
//         </div>
//       </Box>
//       <Grid container spacing={2}>
//         {callRequests.map((callRequest) => (
//           <Grid item key={callRequest.id} xs={12} sm={6} md={4}>
//             <Card sx={{ minHeight: "250px", backgroundColor: "white" }}>
//               <CardContent>
//                 <Typography gutterBottom sx={{ ml: 2 }}>
//                   {callRequest.title}
//                 </Typography>
//                 <Typography gutterBottom sx={{ ml: 2 }}>
//                   For: <span style={{ color: "#5F6383" }}>{callRequest.for}</span>
//                 </Typography>
//                 <Typography gutterBottom sx={{ ml: 2 }}>
//                   Requested By:{" "}
//                   <span style={{ color: "#5F6383" }}>
//                     {callRequest.requestedBy}
//                   </span>
//                 </Typography>
//                 <Typography gutterBottom sx={{ ml: 2 }}>
//                   Message:{" "}
//                   <span style={{ color: "#5F6383" }}>
//                     {showFullMessages[callRequest.id]
//                       ? callRequest.messages
//                       : truncateText(callRequest.messages, 50)}
//                   </span>
//                   {callRequest.messages.length > 50 && (
//                     <Button
//                       onClick={() => toggleShowFullMessage(callRequest.id)}
//                       sx={{ color: "#F56D3B", textTransform: "none" }}
//                     >
//                       {showFullMessages[callRequest.id] ? "less" : "more"}
//                     </Button>
//                   )}
//                 </Typography>
//                 {callRequest.approved ? (
//                   <Button
//                     sx={{
//                       height: 43,
//                       width: 112,
//                       borderRadius: 40,
//                       backgroundColor: "#19B420",
//                       color: "white",
//                       mt: 2,
//                       "&:hover": { backgroundColor: "#19B420" },
//                     }}
//                   >
//                     Approved
//                   </Button>
//                 ):(

//                   <Box display="flex" mt={2}>
//                     <Button
//                       onClick={() => handleApprove(callRequest.id)}
//                       sx={{
//                         height: 43,
//                         width: 112,
//                         borderRadius: 40,
//                         backgroundColor: "#F56D3B",
//                         color: "white",
//                         "&:hover": { backgroundColor: "#F56D3B" },
//                       }}
//                     >
//                       Approve
//                     </Button>
//                     <Button
//                       onClick={handleClickOpen} // Open the Deny dialog
//                       sx={{
//                         height: 43,
//                         width: 112,
//                         borderRadius: 40,
//                         backgroundColor: "#F56D3B",
//                         color: "white",
//                         ml: 1,
//                         "&:hover": { backgroundColor: "#F56D3B" },
//                       }}
//                     >
//                       Deny
//                     </Button>
//                   </Box>
//                 )}
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//       <DenyDialog
//         open={open}
//         handleClose={handleClose}
//         handleDenySubmit={handleDenySubmit}
//       />
//     </div>
//   );
// };

// export default CallRequest;

// import React, { useState } from "react";
// import { Typography, Box, Button, Card, CardContent, Grid, IconButton } from "@mui/material";
// import Header from "../../../components/Header/Header";
// import TaMenuSidebar from "./TeachingAssistantSidebar";
// import DenyDialog from "./DenyDialog"; // Import the DenyDialog component
// import CreateMeetingDialog from "../coachModule/CreateMeetingDialog";

// const CallRequest = () => {
//   const [openDenyDialog, setOpenDenyDialog] = useState(false);
//   //const [openCreateMeetingDialog, setOpenCreateMeetingDialog] = useState(false);

//   const [callRequests, setCallRequests] = useState([
//     {
//       id: 2,
//       title: "Meeting Request By Aman",
//       for: "10 July, 2014 | 12:30 PM",
//       requestedBy: "Aman",
//       messages:
//         "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//     },
//     {
//       id: 3,
//       title: "Meeting Request By Aman",
//       for: "10 July, 2014 | 12:30 PM",
//       requestedBy: "Aman",
//       messages:
//         "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
//     },
//     {
//       id: 5,
//       title: "Meeting Request By Raman",
//       for: "11 July, 2014 | 12:35 PM",
//       requestedBy: "Raman",
//       messages:
//         "Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industry.",
//     },
//   ]);
//   const [showFullMessages, setShowFullMessages] = useState({});

//   const handleClickOpenDenyDialog = () => {
//     setOpenDenyDialog(true);
//   };

//   const handleCloseDenyDialog = () => {
//     setOpenDenyDialog(false);
//   };

//   const handleDenySubmit = () => {
//     // Add logic for deny action
//     console.log("Deny action submitted");
//     setOpenDenyDialog(false);
//   };

//   const handleApprove = (id) => {
//     setCallRequests(
//       callRequests.map((request) =>
//         request.id === id ? { ...request, approved: true } : request
//       )
//     );
//   };

//   const toggleShowFullMessage = (id) => {
//     setShowFullMessages((prevState) => ({
//       ...prevState,
//       [id]: !prevState[id],
//     }));
//   };

//   const truncateText = (text, limit) => {
//     if (text.length <= limit) return text;
//     return `${text.slice(0, limit)}...`;
//   };

//   const handleDialogOpen = () => {
//     setDialogOpen(true);
//   };

//   const handleDialogClose = () => {
//     setDialogOpen(false);
//   };

//   const handleDialogSubmit = (data) => {
//     console.log(data); // Handle the submitted data
//     setDialogOpen(false);
//   };
//   return (
//     <div>
//       <Header />
//       <TaMenuSidebar />
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={2}
//       >
//         <Typography variant="h4" gutterBottom sx={{ fontFamily: "ExtraLight" }}>
//           Call Request
//         </Typography>

//         <div className="inputBtnContainer">
//           <button className="buttonContainer" variant="contained" color="warning" onClick={handleDialogOpen}>
//             <i className="bi bi-plus-circle"></i>
//             <span>Create New Meeting</span>
//           </button>
//         </div>
//       </Box>
//       <Grid container spacing={2}>
//         {callRequests.map((callRequest) => (
//           <Grid item key={callRequest.id} xs={12} sm={6} md={4}>
//             <Card sx={{ minHeight: "250px", backgroundColor: "white" }}>
//               <CardContent>
//                 <Typography gutterBottom sx={{ ml: 2 }}>
//                   {callRequest.title}
//                 </Typography>
//                 <Typography gutterBottom sx={{ ml: 2 }}>
//                   For: <span style={{ color: "#5F6383" }}>{callRequest.for}</span>
//                 </Typography>
//                 <Typography gutterBottom sx={{ ml: 2 }}>
//                   Requested By:{" "}
//                   <span style={{ color: "#5F6383" }}>
//                     {callRequest.requestedBy}
//                   </span>
//                 </Typography>
//                 <Typography gutterBottom sx={{ ml: 2 }}>
//                   Message:{" "}
//                   <span style={{ color: "#5F6383" }}>
//                     {showFullMessages[callRequest.id]
//                       ? callRequest.messages
//                       : truncateText(callRequest.messages, 50)}
//                   </span>
//                   {callRequest.messages.length > 50 && (
//                     <Button
//                       onClick={() => toggleShowFullMessage(callRequest.id)}
//                       sx={{ color: "#F56D3B", textTransform: "none" }}
//                     >
//                       {showFullMessages[callRequest.id] ? "less" : "more"}
//                     </Button>
//                   )}
//                 </Typography>
//                 {callRequest.approved ? (
//                   <Button
//                     sx={{
//                       height: 43,
//                       width: 112,
//                       borderRadius: 40,
//                       backgroundColor: "#19B420",
//                       color: "white",
//                       mt: 2,
//                       "&:hover": { backgroundColor: "#19B420" },
//                     }}
//                   >
//                     Approved
//                   </Button>
//                 ) : (
//                   <Box display="flex" mt={2}>
//                     <Button
//                       onClick={() => handleApprove(callRequest.id)}
//                       sx={{
//                         height: 43,
//                         width: 112,
//                         borderRadius: 40,
//                         backgroundColor: "#F56D3B",
//                         color: "white",
//                         "&:hover": { backgroundColor: "#F56D3B" },
//                       }}
//                     >
//                       Approve
//                     </Button>
//                     <Button
//                       onClick={handleClickOpenDenyDialog} // Open the Deny dialog
//                       sx={{
//                         height: 43,
//                         width: 112,
//                         borderRadius: 40,
//                         backgroundColor: "#F56D3B",
//                         color: "white",
//                         ml: 1,
//                         "&:hover": { backgroundColor: "#F56D3B" },
//                       }}
//                     >
//                       Deny
//                     </Button>
//                   </Box>
//                 )}
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//       <DenyDialog
//         open={openDenyDialog}
//         handleClose={handleCloseDenyDialog}
//         handleDenySubmit={handleDenySubmit}
//       />
//       <CreateMeetingDialog
//         open={handleDialogOpen}
//         handleClose={handleDialogClose}
//         onSubmit={handleDialogSubmit}
//       />
//     </div>
//   );
// };

// export default CallRequest;

import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import Header from "../../../components/Header/Header";
import TaMenuSidebar from "./TeachingAssistantSidebar";
import DenyDialog from "./DenyDialog"; // Import the DenyDialog component
import CreateMeetingDialog from "../coachModule/CreateMeetingDialog"; // Import the CreateMeetingDialog component

const CallRequest = () => {
  const [openDenyDialog, setOpenDenyDialog] = useState(false);
  const [openCreateMeetingDialog, setOpenCreateMeetingDialog] = useState(false);

  const [callRequests, setCallRequests] = useState([
    {
      id: 2,
      title: "Meeting Request By Aman",
      for: "10 July, 2014 | 12:30 PM",
      requestedBy: "Aman",
      messages:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      id: 3,
      title: "Meeting Request By Aman",
      for: "10 July, 2014 | 12:30 PM",
      requestedBy: "Aman",
      messages:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      id: 5,
      title: "Meeting Request By Raman",
      for: "11 July, 2014 | 12:35 PM",
      requestedBy: "Raman",
      messages:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industryLorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
  ]);
  const [showFullMessages, setShowFullMessages] = useState({});

  const handleClickOpenDenyDialog = () => {
    setOpenDenyDialog(true);
  };

  const handleCloseDenyDialog = () => {
    setOpenDenyDialog(false);
  };

  const handleDenySubmit = () => {
    // Add logic for deny action
    console.log("Deny action submitted");
    setOpenDenyDialog(false);
  };

  const handleApprove = (id) => {
    setCallRequests(
      callRequests.map((request) =>
        request.id === id ? { ...request, approved: true } : request,
      ),
    );
  };

  const toggleShowFullMessage = (id) => {
    setShowFullMessages((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    return `${text.slice(0, limit)}...`;
  };

  const handleCreateMeetingOpen = () => {
    setOpenCreateMeetingDialog(true);
  };

  const handleCreateMeetingClose = () => {
    setOpenCreateMeetingDialog(false);
  };

  const handleCreateMeetingSubmit = (data) => {
    console.log("Create meeting data:", data);
    setOpenCreateMeetingDialog(false);
  };

  return (
    <div>
      <Header />
      <TaMenuSidebar />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" gutterBottom sx={{ fontFamily: "ExtraLight" }}>
          Call Request
        </Typography>

        <div className="inputBtnContainer">
          <button
            className="buttonContainer"
            variant="contained"
            color="warning"
            onClick={handleCreateMeetingOpen}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Create New Meeting</span>
          </button>
        </div>
      </Box>
      <Grid container spacing={2}>
        {callRequests.map((callRequest) => (
          <Grid item key={callRequest.id} xs={12} sm={6} md={4}>
            <Card sx={{ minHeight: "250px", backgroundColor: "white" }}>
              <CardContent>
                <Typography gutterBottom sx={{ ml: 2 }}>
                  {callRequest.title}
                </Typography>
                <Typography gutterBottom sx={{ ml: 2 }}>
                  For:{" "}
                  <span style={{ color: "#5F6383" }}>{callRequest.for}</span>
                </Typography>
                <Typography gutterBottom sx={{ ml: 2 }}>
                  Requested By:{" "}
                  <span style={{ color: "#5F6383" }}>
                    {callRequest.requestedBy}
                  </span>
                </Typography>
                <Typography gutterBottom sx={{ ml: 2 }}>
                  Message:{" "}
                  <span style={{ color: "#5F6383" }}>
                    {showFullMessages[callRequest.id]
                      ? callRequest.messages
                      : truncateText(callRequest.messages, 50)}
                  </span>
                  {callRequest.messages.length > 50 && (
                    <Button
                      onClick={() => toggleShowFullMessage(callRequest.id)}
                      sx={{ color: "#F56D3B", textTransform: "none" }}
                    >
                      {showFullMessages[callRequest.id] ? "less" : "more"}
                    </Button>
                  )}
                </Typography>
                {callRequest.approved ? (
                  <Button
                    sx={{
                      height: 43,
                      width: 112,
                      borderRadius: 40,
                      backgroundColor: "#19B420",
                      color: "white",
                      mt: 2,
                      "&:hover": { backgroundColor: "#19B420" },
                    }}
                  >
                    Approved
                  </Button>
                ) : (
                  <Box display="flex" mt={2}>
                    <Button
                      onClick={() => handleApprove(callRequest.id)}
                      sx={{
                        height: 43,
                        width: 112,
                        borderRadius: 40,
                        backgroundColor: "#F56D3B",
                        color: "white",
                        "&:hover": { backgroundColor: "#F56D3B" },
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={handleClickOpenDenyDialog} // Open the Deny dialog
                      sx={{
                        height: 43,
                        width: 112,
                        borderRadius: 40,
                        backgroundColor: "#F56D3B",
                        color: "white",
                        ml: 1,
                        "&:hover": { backgroundColor: "#F56D3B" },
                      }}
                    >
                      Deny
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <DenyDialog
        open={openDenyDialog}
        handleClose={handleCloseDenyDialog}
        handleDenySubmit={handleDenySubmit}
      />
      <CreateMeetingDialog
        open={openCreateMeetingDialog}
        onClose={handleCreateMeetingClose}
        onSubmit={handleCreateMeetingSubmit}
      />
    </div>
  );
};

export default CallRequest;
