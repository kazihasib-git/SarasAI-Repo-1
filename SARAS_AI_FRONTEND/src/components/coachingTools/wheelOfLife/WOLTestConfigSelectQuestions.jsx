import { Box, Button, Container, Paper, styled, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useState } from 'react'
import editIcon_White from '../../../assets/editIcon_White.png';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const CustomButton = styled(Button)(({ theme, active }) => ({
    borderRadius: "50px",
    border: "1px solid #F56D3B",
    color: active ? "#fff" : "#F56D3B",
    backgroundColor: active ? "#F56D3B" : "#FFF",
    padding: "8px 16px",
    margin: "0 8px",
    "&:hover": {
        backgroundColor: "#F56D3B",
        color: "#fff",
        borderColor: "#F56D3B",
    },
}));

const WOLTestConfigSelectQuestions = () => {
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    return (
        <>
            <Header />
            <Sidebar />
            <Box display="flex" justifyContent="space-between" marginTop={3} alignItems="center">
                <Box display="flex" alignItems="center" padding="16px">
                    <ArrowBackIosIcon
                        style={{ fontSize: "25px", marginBottom: "17px" }}
                        onClick={() => navigate('/wheel-of-life')}
                    />
                    <Typography
                        variant="h1"
                        sx={{ fontSize: "44px", marginLeft: "16px" }}
                    >
                        Wheel of Life Test Config
                    </Typography>
                </Box>
            </Box>
            <Container
                sx={{
                    mt: 2,
                    mb: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    minHeight: 160,
                    padding: 2,
                    maxWidth: 'md',
                    width: '100%',
                }}
            >
                <Box display="flex" alignItems="center" padding="16px">
                    <ArrowBackIosIcon
                        style={{ fontSize: "25px", marginBottom: "17px" }}
                        onClick={() => navigate('')}
                    />
                    <Typography
                        variant="h7"
                        sx={{ color: '#1A1E3D', fontSize: '16px', fontWeight: 500, marginBottom: '20px' }}
                        component="h4"
                        gutterBottom
                    >
                        Total Questions : 40
                    </Typography>
                </Box>


                <Typography
                    variant="h7"
                    sx={{ color: '#1A1E3D', fontSize: '16px', fontWeight: 500, marginBottom: '20px' }}
                    component="h4"
                    gutterBottom
                >
                    Selected Questions : {selectedQuestions.length}
                </Typography>

                <Box className='inputBtnContainer' sx={{ marginRight: '20px', paddingBottom: "16px" }}>
                    <CustomButton className='buttonContainer' onClick={''}>
                        <img src={editIcon_White} backgroundColor='white' alt="" />
                        <Typography
                            component="small"
                            sx={{ fontSize: "16px", fontWeight: 700, marginLeft: "5px" }}
                        >
                            Edit
                        </Typography>
                    </CustomButton>
                </Box>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableRow>S. No.</TableRow>
                                <TableCell>Wheel Of Life Category</TableCell>
                                <TableCell>No. of Questions</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* {rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>{row["WOL Category"]}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={row.is_active}
                                            onChange={handleChange}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => actionButtons[1].onClick(row.id)}
                                        >
                                            Select Questions
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))} */}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box display="flex" mt={2}>
                    <CustomButton
                        variant="contained"
                        color="primary"
                        onClick={''}
                    >
                        Submit
                    </CustomButton>
                </Box>
            </Container>
        </>
    )
}

export default WOLTestConfigSelectQuestions