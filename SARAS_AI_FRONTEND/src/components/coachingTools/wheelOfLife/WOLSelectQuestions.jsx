import React, { useState } from 'react';
import { Box, Button, Container, FormControlLabel, Paper, Radio, RadioGroup, styled, Typography } from '@mui/material';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import editIcon_White from '../../../assets/editIcon_White.png';

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

const WOLSelectQuestions = () => {
    const [selectedQuestions, setSelectedQuestions] = useState([1, 2, 3]);
    const totalQuestions = 10;

    const handleSelectQuestion = (index) => {
        setSelectedQuestions(prevSelected => {
            if (prevSelected.includes(index)) {
                return prevSelected.filter(i => i !== index);
            } else {
                return [...prevSelected, index];
            }
        });
    };

    return (
        <>
            <Header />
            <Sidebar />
            <Box display="flex" justifyContent="space-between" marginTop={3} alignItems="center">
                <Box display="flex" alignItems="center" padding="16px">
                    <ArrowBackIosIcon
                        style={{ fontSize: "25px", marginBottom: "17px" }}
                        onClick={() => console.log('Go back')}
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
                            sx={{ color: '#1A1E3D', fontSize: '16px', fontWeight: 500 }}
                            component="h4"
                            gutterBottom
                        >
                            <ArrowBackIosIcon
                                style={{ fontSize: "25px", marginBottom: "17px" }}
                                onClick={() => console.log('Go back')}
                            />
                            Total Questions: {totalQuestions}
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{ color: '#1A1E3D', fontSize: '16px', fontWeight: 500 }}
                            component="h4"
                            gutterBottom
                        >
                            Wheel of life category :  Academics
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{ color: '#1A1E3D', fontSize: '16px', fontWeight: 500 }}
                            component="h4"
                            gutterBottom
                        >
                            Selected Questions: {selectedQuestions.length}/{totalQuestions}
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

                {[...Array(totalQuestions)].map((_, index) => (
                    <Box key={index} display="flex" alignItems="center" justifyContent="space-between" mb={2} p={2} border="1px solid #E0E0E0" borderRadius="8px">
                        <Box flex="1">
                            <Typography
                                variant="body1"
                                sx={{ color: '#1A1E3D', fontWeight: 500, mb: 1 }}
                            >
                                Q{index + 1}: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
                            </Typography>
                            <RadioGroup
                                aria-label={`question-${index + 1}`}
                                name={`question-${index + 1}`}
                            >
                                {[...Array(4)].map((_, i) => (
                                    <FormControlLabel
                                        key={i}
                                        value={`answer-${i}`}
                                        control={<Radio />}
                                        label={`Standard Dummy Text`}
                                    />
                                ))}
                            </RadioGroup>
                        </Box>
                        <Box>
                            <FormControlLabel
                                control={
                                    <Radio
                                        checked={selectedQuestions.includes(index)}
                                        onChange={() => handleSelectQuestion(index)}
                                    />
                                }
                                label=""
                            />
                        </Box>
                    </Box>
                ))}

                <Box display="flex" mt={2}>
                    <CustomButton
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: "50px", padding: "8px 16px", margin: "0 8px" }}
                        onClick={() => console.log('Submit')}
                    >
                        Submit
                    </CustomButton>
                </Box>
            </Container>
        </>
    );
}

export default WOLSelectQuestions;
