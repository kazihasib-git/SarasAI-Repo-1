import { Box, InputBase, Button, Modal, TextField, IconButton, Switch, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import { mockManageAvailable } from '../../fakeData/manageCoachData';
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState } from "react";
import { OnOffSwitch } from '../../components/Switch';
import editIcon from '../../assets/editIcon.png';
import { useNavigate } from 'react-router-dom';
const ManageCoaches = () => {
    // const theme = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        coachName: '',
        aboutMe: '',
        username: '',
        password: '',
        email: '',
        dateOfBirth: '',
        pinCode: '',
        gender: '',
        qualification: '',
    });
    
    const navigate = useNavigate()

    const handleAddCoach = () => {
        navigate('createcoach')
    }


    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitForm = (event) => {
        event.preventDefault();
        console.log(formValues);
        handleCloseModal();
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleToggle = (id) => {
        console.log(`Toggle TA with ID: ${id}`);
    };

    const handleEdit = (id) => {
        console.log(`Edit TA with ID: ${id}`);
        handleOpenModal();
    };
    const columns = [
        { field: "id", headerName: "ID" },
        {
            field: "coachName", headerName: "Coach Name", flex: 1, cellClassName: "name-column--cell"

        },
        { field: "username", headerName: "User Name", flex: 1, cellClassName: "name-column--cell" },
        { field: "location", headerName: "Location", flex: 1, cellClassName: "name-column--cell" },
        { field: "timeZone", headerName: "Time Zone", flex: 1, cellClassName: "name-column--cell" },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: '5px', marginTop: "10px" }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <OnOffSwitch />
                    </Box>
                    <Button sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#F56D3B',
                        backgroundColor: '#FEEBE3',
                        gap: '4px',
                        height: '30px',
                        width: '70px',
                        borderRadius: '15px',
                        padding: '5px',
                        '&:hover': {
                            backgroundColor: 'rgba(245, 235, 227, 0.8)',
                        }
                    }}
                        variant='text'
                        onClick={() => { handleEdit(params.row.id) }}
                    >
                        <img src={editIcon}
                            alt=""
                        />
                        <small>Edit</small>
                    </Button>

                    {/* <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip> */}
                </Box>
            ),
        }
    ];

    return (
        <>
            <Box m="40px">
                <Header />
                <Sidebar />
                <Box display={"flex"} justifyContent={"space-between"}>
                    <p style={{ fontSize: "22px", fontWeight: "700", justifyContent: "center", margin: 0 }}>Manage Coach</p>
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
                        <Button variant="contained" onClick={handleAddCoach} style={{ backgroundColor: "#F56D3B", borderRadius: "30px" }}> <i style={{ marginRight: "5px" }} className="bi bi-plus-circle"></i> Create Coach</Button>
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
                        rows={mockManageAvailable}
                        columns={columns}
                    />
                </Box>
            </Box>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="create-ta-modal"
                aria-describedby="create-ta-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: '#E8EAF6',
                        boxShadow: 24,
                        p: 4,
                        width: '60%', // Adjusted width for responsiveness
                        maxWidth: '500px',
                        borderRadius: '10px',
                        overflow: "auto",
                        maxHeight: "90vh",
                        '@media (max-width: 300px)': {
                            width: '95%', // Adjusted width for smaller screens
                        },
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box display="flex" alignItems="center">
                        <img src={formValues.profilePicture} alt="Profile" style={{ borderRadius: '50%', width: '50px', height: '50px', marginRight: '10px' }} />
                            <h2 id="create-ta-modal">{formValues.coachName}</h2>
                        </Box>
                        <Button style={{ fontSize: "34px", padding: "0" }} onClick={handleCloseModal}>&times;</Button>
                    </Box>
                    <form onSubmit={handleSubmitForm}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => handleInputChange({ target: { name: 'profilePicture', value: URL.createObjectURL(event.target.files[0]) } })}
                            style={{ display: 'none' }}
                            id="profilePictureInput"
                        />

                        <TextField
                            label="Coach Name"
                            name="coachName"
                            value={formValues.coachName}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{ style: { margin: 0 } }}
                        />
                        <TextField
                            label="About me"
                            name="aboutMe"
                            value={formValues.aboutMe}
                            onChange={handleInputChange}
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{ style: { margin: 0 } }}
                        />
                        <TextField
                            label="User Name"
                            name="username"
                            value={formValues.username}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{ style: { margin: 0 } }}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={formValues.password}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{ style: { margin: 0 } }}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={formValues.email}
                            onChange={handleInputChange}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{ style: { margin: 0 } }}
                        />
                        <Box display="flex" justifyContent="space-between">
                            <TextField
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                InputLabelProps={{ shrink: true, style: { margin: 0 } }}
                                value={formValues.dateOfBirth}
                                onChange={handleInputChange}
                                variant="outlined"
                                margin="normal"
                                sx={{ width: '48%' }}

                            />
                            <TextField
                                label="PIN Code"
                                name="pinCode"
                                value={formValues.pinCode}
                                onChange={handleInputChange}
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                sx={{ width: '48%' }}
                                InputLabelProps={{ style: { margin: 0 } }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <FormControl variant="outlined" margin="normal" sx={{ width: '48%' }}>
                                <InputLabel style={{ margin: 0 }}>Gender</InputLabel>
                                <Select
                                    label="Gender"
                                    name="gender"
                                    value={formValues.gender}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value=""><em>Select</em></MenuItem>
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="other">Other</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" margin="normal" sx={{ width: '48%' }}>
                                <InputLabel style={{ margin: 0 }}>Highest Qualification</InputLabel>
                                <Select
                                    label="Highest Qualification"
                                    name="qualification"
                                    value={formValues.qualification}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value=""><em>Select</em></MenuItem>
                                    <MenuItem value="highschool">High School</MenuItem>
                                    <MenuItem value="bachelor">Bachelor's</MenuItem>
                                    <MenuItem value="master">Master's</MenuItem>
                                    <MenuItem value="doctorate">Doctorate</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, p: 1.5 }}>Submit</Button>
                    </form>
                </Box>
            </Modal>
        </>
    )
}

export default ManageCoaches;