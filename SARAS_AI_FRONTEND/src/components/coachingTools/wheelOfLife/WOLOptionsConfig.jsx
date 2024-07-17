import React, { useState } from 'react'

import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import DynamicTable from '../../../components/CommonComponent/DynamicTable';
import { Box, Button, Container, Grid, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from 'react-router-dom';
import editIcon_White from '../../../assets/editIcon_White.png'
import CustomFormControl from '../../CustomFields/CustomFromControl';
import { Controller, useForm } from 'react-hook-form';
import CustomTextField from '../../CustomFields/CustomTextField';

const CustomButton = styled(Button)(({ theme, active }) => ({
    borderRadius: "50px",
    border: "1px solid #F56D3B",
    color: active ? "#fff" : "#F56D3B",
    backgroundColor: active ? "#F56D3B" : "#FFF",
    padding: "8px 16px", // Add padding for horizontal and vertical spacing
    margin: "0 8px",
    "&:hover": {
        backgroundColor: "#F56D3B",
        color: "#fff",
        borderColor: "#F56D3B",
    },
}));

let scaleOptions = []

// using for loop add 1 to 100 in scaleOptions
for (let i = 1; i <= 100; i++) {
    scaleOptions.push({ value: i, label: i })
}

console.log("scaleOptions", scaleOptions)

const headers = ['Point', 'Text', 'Icon']

const WOLOptionsConfig = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [edit, setEdit] = useState(false);
    const { register, handleSubmit, control, formState: { errors }, } = useForm();

    const onSubmit = (data) => {
        console.log("data", data);

        const minScale = data.minScale
        const maxScale = data.maxScale
        const scale = maxScale - minScale + 1;
        const newOptions = [];
        setEdit(true);

    }

    return (
        <>
            <Header />
            <Sidebar />
            <Box display="flex" justifyContent="space-between" marginTop={3} alignItems="center">
                <Box display="flex" alignItems="center" padding="16px">
                    <ArrowBackIosIcon
                        style={{ fontSize: "25px", marginBottom: "17px" }}
                        onClick={() => navigate('')}
                    />
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: "44px",
                            marginLeft: "16px",
                        }}
                    >
                        Wheel of Life Options Config
                    </Typography>
                </Box>
                <Box className='inputBtnContainer' sx={{ marginRight: '20px', paddingBottom: "16px" }}>
                    <button className='buttonContainer' onClick={''}>
                        <img src={editIcon_White} backgroundColor='white' alt="" />
                        <Typography
                            component="small"
                            sx={{ fontSize: "16px", fontWeight: 700, marginLeft: "5px" }}
                        >
                            Edit
                        </Typography>
                    </button>
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
                    maxWidth: 'md', // Sets the max-width to medium breakpoint
                    width: '100%',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        color: '#1A1E3D',
                        fontSize: '16px',
                        fontWeight: 500,
                        marginBottom: '20px',
                    }}
                    component="h4"
                    gutterBottom
                >
                    Options Scale
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ width: '100%' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={4} sm={4}>
                            <Controller
                                name='minScale'
                                control={control}
                                rules={{ required: 'Minimum Scale is required' }}
                                render={({ field }) => (
                                    <CustomFormControl
                                        label="Minimum Scale"
                                        name="minScale"
                                        value={field.value}
                                        onChange={field.onChange}
                                        errors={errors}
                                        options={scaleOptions}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} sm={4}>
                            <Controller
                                name='maxScale'
                                control={control}
                                rules={{ required: 'Maximum Scale is required' }}
                                render={({ field }) => (
                                    <CustomFormControl
                                        label="Maximum Scale"
                                        name="maxScale"
                                        value={field.value}
                                        onChange={field.onChange}
                                        errors={errors}
                                        options={scaleOptions}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} sm={4} display="flex" >
                            <CustomButton
                                type="submit"
                                active={true}
                                variant="contained"
                                sx={{ borderRadius: "50px", padding: "18px 30px", margin: "0 8px" }}
                            >
                                Submit
                            </CustomButton>
                        </Grid>
                    </Grid>
                </form>

                {edit && (
                      <Container
                      sx={{
                          mt: 2,
                          mb: 2,
                          backgroundColor: 'white',
                          borderRadius: 2,
                          minHeight: 160,
                          padding: 2,
                          maxWidth: 'md', // Sets the max-width to medium breakpoint
                          width: '100%',
                      }}
                  >
                      <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }} aria-label="simple table">
                              <TableHead>
                                  <TableRow>
                                      <TableCell>Point</TableCell>
                                      <TableCell align="right">Text</TableCell>
                                      <TableCell align="right">Icon</TableCell>
                                  </TableRow>
                              </TableHead>
                              <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            1
                                        </TableCell>
                                        <TableCell align="right">
                                            <CustomTextField
                                                label="Text"
                                                name="text"
                                                placeholder="Enter Text"
                                                register={register}
                                                validation={{ required: 'Text is required' }}
                                                errors={errors}
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell align="right">Otto</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            2
                                        </TableCell>
                                        <TableCell align="right">Jacob</TableCell>
                                        <TableCell align="right">Thornton</TableCell>
                                    </TableRow>
                              </TableBody>
                          </Table>
                      </TableContainer>
                  </Container>
                )}
            </Container>
        </>
    );
}

export default WOLOptionsConfig;