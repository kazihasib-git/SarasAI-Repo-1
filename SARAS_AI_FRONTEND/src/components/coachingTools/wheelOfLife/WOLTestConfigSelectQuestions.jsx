import React, { useState } from 'react';
import { Box, Button, Container, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import editIcon_White from '../../../assets/editIcon_White.png';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate()
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
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: "20px" }}>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{ color: '#1A1E3D', fontSize: '24px', fontWeight: 500 }}
                            component="h4"
                            gutterBottom
                        >
                            Total Questions: 40
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{ color: '#1A1E3D', fontSize: '24px', fontWeight: 500 }}
                            component="h4"
                            gutterBottom
                        >
                            Selected Questions: {selectedQuestions.length}
                        </Typography>
                    </Box>

                    <CustomButton type="submit"
                        active={true}
                        variant="contained"
                        sx={{ borderRadius: "50px", padding: "18px 30px", margin: "0 8px" }}>
                        <img src={editIcon_White} backgroundColor='white' alt="edit icon" />
                        Edit Config
                    </CustomButton>
                </Box>

                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>S. No.</TableCell>
                                <TableCell>Wheel Of Life Category</TableCell>
                                <TableCell>No. of Questions</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[{ id: 1, category: "Academics" }, { id: 2, category: "Health" }, { id: 3, category: "Family" }, { id: 4, category: "Career" }].map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>0/10</TableCell>
                                    <TableCell>
                                        <CustomButton
                                            variant="contained"
                                            active={true}
                                            onClick={() => { navigate('/WolselectQuestions') }}
                                        >
                                            Select Questions
                                        </CustomButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box display="flex" mt={2}>
                    <CustomButton
                        type="submit"
                        active={true}
                        variant="contained"
                        sx={{ borderRadius: "50px", padding: "18px 30px", margin: "0 8px" }}
                    >
                        Submit
                    </CustomButton>
                </Box>
            </Container>
        </>
    );
};

export default WOLTestConfigSelectQuestions;
