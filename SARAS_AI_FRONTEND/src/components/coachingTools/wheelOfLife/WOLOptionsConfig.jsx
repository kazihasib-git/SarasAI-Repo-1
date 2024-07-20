import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import DynamicTable from '../../../components/CommonComponent/DynamicTable';
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import editIcon_White from '../../../assets/editIcon_White.png';
import CustomFormControl from '../../CustomFields/CustomFromControl';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import CustomTextField from '../../CustomFields/CustomTextField';
import star from '../../../assets/star.png';
import {
    addWOLOptionConfig,
    getWOLOptionConfig,
} from '../../../redux/features/coachingTools/wol/wolSlice';

const CustomButton = styled(Button)(({ theme, active }) => ({
    borderRadius: '50px',
    border: '1px solid #F56D3B',
    color: active ? '#fff' : '#F56D3B',
    backgroundColor: active ? '#F56D3B' : '#FFF',
    padding: '8px 16px',
    margin: '0 8px',
    '&:hover': {
        backgroundColor: '#F56D3B',
        color: '#fff',
        borderColor: '#F56D3B',
    },
}));

let scaleOptions = [];

// using for loop add 1 to 20 in scaleOptions
for (let i = 1; i <= 20; i++) {
    scaleOptions.push({ value: i, label: i });
}

const headers = ['Point', 'Text', 'Icon'];

const feedbackIcons = [
    { value: '😀', label: '😀' },
    { value: '😃', label: '😃' },
    { value: '😄', label: '😄' },
    { value: '😁', label: '😁' },
    { value: '😅', label: '😅' },
    { value: '😂', label: '😂' },
    { value: '😊', label: '😊' },
    { value: '😇', label: '😇' },
    { value: '🙂', label: '🙂' },
    { value: '😌', label: '😌' },
    { value: '😍', label: '😍' },
    { value: '😋', label: '😋' },
    { value: '🤨', label: '🤨' },
    { value: '🧐', label: '🧐' },
    { value: '🤓', label: '🤓' },
    { value: '😎', label: '😎' },
    { value: '🤩', label: '🤩' },
    { value: '🥳', label: '🥳' },
    { value: '😒', label: '😒' },
    { value: '😞', label: '😞' },
    { value: '😔', label: '😔' },
    { value: '😟', label: '😟' },
    { value: '😕', label: '😕' },
    { value: '🙁', label: '🙁' },
];

const WOLOptionsConfig = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [edit, setEdit] = useState(false);
    const { optionsConfigData } = useSelector((state) => state.wol);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            minScale: 0,
            maxScale: 0,
            details: [],
        },
    });
    const { fields, append } = useFieldArray({
        control,
        name: 'details',
    });

    useEffect(() => {
        // dispatch(getWOLOptionConfig());
    }, [dispatch]);

    useEffect(() => {
        if (optionsConfigData.data && optionsConfigData.data.length > 0) {
            const { minimum_scale, maximum_scale, get_config_details } =
                optionsConfigData.data[0];
            reset({
                minScale: minimum_scale,
                maxScale: maximum_scale,
                details: get_config_details.map((detail) => ({
                    point: detail.point,
                    text: detail.text,
                    icon: detail.icon,
                })),
            });
            setEdit(true);
        }
    }, [optionsConfigData, reset]);

    const handleEdit = () => {
        reset({
            minScale: 0,
            maxScale: 0,
            details: [],
        });
        setEdit(false);
    };

    const onHandleSubmit = (data) => {
        if (edit) {
            handleEdit();
        } else {
            setEdit(true);
            for (let i = data.minScale; i <= data.maxScale; i++) {
                append({ point: i, text: '', icon: '' });
            }
        }
    };

    const onFormSubmit = (data) => {
        const { minScale, maxScale, details } = data;
        const payload = {
            minimum_scale: minScale,
            maximum_scale: maxScale,
            details: details.map((detail, index) => ({
                point: minScale + index,
                text: detail.text,
                icon: detail.icon,
            })),
        };
        dispatch(addWOLOptionConfig(payload));
        setEdit(false);
    };

    return (
        <>
            <Header />
            <Sidebar />
            <Box
                display="flex"
                justifyContent="space-between"
                marginTop={3}
                alignItems="center"
            >
                <Box display="flex" alignItems="center" padding="16px">
                    <ArrowBackIosIcon
                        style={{ fontSize: '25px', marginBottom: '17px' }}
                        onClick={() => navigate('/wheel-of-life')}
                    />
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: '44px',
                            marginLeft: '16px',
                        }}
                    >
                        Wheel of Life Options Config
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

                <form noValidate onSubmit={handleSubmit(onHandleSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Controller
                                name="minScale"
                                control={control}
                                rules={{
                                    required: 'Minimum Scale is required',
                                }}
                                render={({ field }) => (
                                    <CustomFormControl
                                        label="Minimum Scale"
                                        value={field.value}
                                        onChange={field.onChange}
                                        errors={errors}
                                        options={scaleOptions}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Controller
                                name="maxScale"
                                control={control}
                                rules={{
                                    required: 'Maximum Scale is required',
                                }}
                                render={({ field }) => (
                                    <CustomFormControl
                                        label="Maximum Scale"
                                        value={field.value}
                                        onChange={field.onChange}
                                        errors={errors}
                                        options={scaleOptions}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <CustomButton
                                type="submit"
                                active={true}
                                variant="contained"
                                sx={{
                                    borderRadius: '50px',
                                    padding: '18px 30px',
                                    margin: '0 8px',
                                }}
                            >
                                {edit ? 'Edit' : 'Submit'}
                            </CustomButton>
                        </Grid>
                    </Grid>
                </form>
            </Container>

            {edit && (
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
                    <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
                        <TableContainer component={Paper}>
                            <Table
                                sx={{ minWidth: 650 }}
                                aria-label="simple table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Point</TableCell>
                                        <TableCell align="left">Text</TableCell>
                                        <TableCell align="left">Icon</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {field.point}{' '}
                                                {index === 0 && (
                                                    <img src={star} alt="str" />
                                                )}{' '}
                                                {index ===
                                                    fields.length - 1 && (
                                                    <img src={star} alt="str" />
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                <CustomTextField
                                                    label="Text"
                                                    name={`details[${index}].text`}
                                                    placeholder="Enter Text"
                                                    register={register}
                                                    validation={{
                                                        required:
                                                            index === 0 ||
                                                            index ===
                                                                fields.length -
                                                                    1
                                                                ? 'Text is required'
                                                                : false,
                                                    }}
                                                    errors={errors}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Controller
                                                    name={`details[${index}].icon`}
                                                    control={control}
                                                    rules={{
                                                        required:
                                                            index === 0 ||
                                                            index ===
                                                                fields.length -
                                                                    1
                                                                ? 'Icon is required'
                                                                : false,
                                                    }}
                                                    render={({ field }) => (
                                                        <CustomFormControl
                                                            label="Icon"
                                                            name={`details[${index}].icon`}
                                                            value={field.value}
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            errors={errors}
                                                            options={
                                                                feedbackIcons
                                                            }
                                                        />
                                                    )}
                                                />
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
                                sx={{
                                    borderRadius: '50px',
                                    padding: '18px 30px',
                                    margin: '0 8px',
                                }}
                            >
                                Submit
                            </CustomButton>
                        </Box>
                    </form>
                </Container>
            )}
        </>
    );
};

export default WOLOptionsConfig;
