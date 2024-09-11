import React, { useEffect, useState } from 'react';
import Header from '../../../../components/Header/Header';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import {
    Box,
    Button,
    Container,
    Grid,
    IconButton,
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
import CustomFormControl from '../../../CustomFields/CustomFromControl';
import CustomTextField from '../../../CustomFields/CustomTextField';
import star from '../../../../assets/star.png';
import {
    addWOLOptionConfig,
    getWOLOptionConfig,
} from '../../../../redux/features/adminModule/coachingTools/wol/wolSlice';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { toast } from 'react-toastify';

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
    '.buttonText': {
        textTransform: 'capitalize', // Ensure only the first letter is capitalized
    },
}));

let scaleOptions = [];

// using for loop add 1 to 20 in scaleOptions
for (let i = 1; i <= 20; i++) {
    scaleOptions.push({ value: i, label: i });
}

const headers = ['Point', 'Text', 'Icon'];

const WOLOptionsConfig = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { optionsConfigData } = useSelector(state => state.wol);

    const [edit, setEdit] = useState(false);
    const [formValues, setFormValues] = useState({
        minScale: '',
        maxScale: '',
        details: [],
    });
    const [errors, setErrors] = useState({});
    const [submissionStatus, setSubmissionStatus] = useState('idle');

    const [minScale, setMinScale] = useState(0);
    const [maxScale, setMaxScale] = useState(0);

    useEffect(() => {
        dispatch(getWOLOptionConfig());
    }, [dispatch]);

    useEffect(() => {
        if (optionsConfigData.data && optionsConfigData.data.length > 0) {
            const { minimum_scale, maximum_scale, get_config_details } =
                optionsConfigData.data[0];
            setMaxScale(maximum_scale);
            setFormValues({
                minScale: minimum_scale,
                maxScale: maximum_scale,
                details: get_config_details.map(detail => ({
                    point: detail.point,
                    text: detail.text,
                    icon: detail.icon ? `${detail.icon}` : null,
                })),
            });
            setEdit(true);
        }
    }, [optionsConfigData, optionsConfigData.data]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleDetailChange = (e, index) => {
        const { name, value } = e.target;
        const updatedDetails = formValues.details.map((detail, i) =>
            i === index ? { ...detail, [name]: value } : detail
        );
        setFormValues({ ...formValues, details: updatedDetails });
    };

    const validate = () => {
        let tempErrors = {};
        if (!formValues.minScale)
            tempErrors.minScale = 'Minimum Scale is required';
        if (!formValues.maxScale)
            tempErrors.maxScale = 'Maximum Scale is required';
        if (Number(formValues.minScale) >= Number(formValues.maxScale))
            tempErrors.scaleRange = (
                <Typography variant="caption" color="error">
                    Maximum Scale must be greater than Minimum Scale
                </Typography>
            );

        formValues.details.forEach((detail, index) => {
            if (index === 0 || (index + 1) % maxScale === 0) {
                // Check if the point is a multiple of 5 starting from 1
                if (!detail.text) {
                    tempErrors[`detailText${index}`] = 'Text is required';
                }
                if (!detail.icon) {
                    tempErrors[`detailIcon${index}`] = 'Icon is required';
                }
            }
        });
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (edit) {
            setFormValues({ minScale: '', maxScale: '', details: [] });
            setEdit(false);
        } else {
            if (validate()) {
                const details = [];
                setMaxScale(formValues.maxScale);
                for (
                    let i = Number(formValues.minScale);
                    i <= Number(formValues.maxScale);
                    i++
                ) {
                    details.push({ point: i, text: '', icon: '' });
                }
                setFormValues({ ...formValues, details });
                setEdit(true);
            }
        }
    };

    const handleFormSubmit = e => {
        e.preventDefault();
        if (validate()) {
            const { minScale, maxScale, details } = formValues;

            const payload = {
                minimum_scale: minScale,
                maximum_scale: maxScale,
                details: details.map((detail, index) => ({
                    point: Number(minScale) + Number(index),
                    text: detail.text,
                    icon: detail.icon ? detail.icon.split(',')[1] : null,
                })),
            };

            setSubmissionStatus('pending');
            dispatch(addWOLOptionConfig(payload))
                .then(() => {
                    setSubmissionStatus('success');
                })
                .catch(error => {
                    setSubmissionStatus('error');

                    console.error('Error saving options configuration:', error);
                });
        }
    };

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const updatedDetails = formValues.details.map((detail, i) =>
                    i === index ? { ...detail, icon: reader.result } : detail
                );
                setFormValues({ ...formValues, details: updatedDetails });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = index => {
        const updatedDetails = formValues.details.map((detail, i) =>
            i === index ? { ...detail, icon: '' } : detail
        );
        setFormValues({ ...formValues, details: updatedDetails });
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
                        style={{
                            fontSize: '25px',
                            marginBottom: '17px',
                            fontWeight: 'normal',
                        }}
                        onClick={() => navigate('/wheel-of-life')}
                    />
                    <p
                        style={{
                            fontSize: '44px',
                            fontWeight: 200,
                            justifyContent: 'center',
                            fontFamily: 'ExtraLight',
                        }}
                    >
                        Wheel Of Life Options Config
                    </p>
                </Box>
            </Box>
            <Box
                sx={{
                    mt: 2,
                    mb: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    minHeight: 160,
                    padding: 2,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        color: '#1A1E3D',
                        fontSize: '16px',
                        fontWeight: 500,
                        fontFamily: 'Medium',
                        marginBottom: '20px',
                    }}
                    component="h4"
                    gutterBottom
                >
                    Options Scale
                </Typography>

                <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <CustomFormControl
                                label="Minimum Scale"
                                name="minScale"
                                value={formValues.minScale}
                                onChange={handleChange}
                                errors={errors}
                                options={scaleOptions}
                                disabled={edit} // Disable when edit is true
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <CustomFormControl
                                label="Maximum Scale"
                                name="maxScale"
                                value={formValues.maxScale}
                                onChange={handleChange}
                                errors={errors}
                                options={scaleOptions}
                                disabled={edit} // Disable when edit is true
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
                                    textTransform: 'none',
                                    fontFamily: 'Bold',
                                }}
                            >
                                <span className="buttonText">
                                    {edit ? 'Edit' : 'Submit'}
                                </span>
                            </CustomButton>
                        </Grid>
                    </Grid>
                    {errors.scaleRange && (
                        <Typography color="error">
                            {errors.scaleRange}
                        </Typography>
                    )}
                </form>
            </Box>
            {edit && (
                <Box
                    sx={{
                        mt: 4,
                        mb: 4,
                        backgroundColor: 'white',
                        borderRadius: 2,
                        minHeight: 160,
                        padding: 2,
                    }}
                >
                    <form onSubmit={handleFormSubmit}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {headers.map(header => (
                                            <TableCell
                                                key={header}
                                                style={{ fontFamily: 'Medium' }}
                                            >
                                                {header}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {formValues.details.map((detail, index) => (
                                        <TableRow key={index}>
                                            <TableCell
                                                style={{
                                                    fontFamily: 'Regular',
                                                }}
                                            >
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                >
                                                    {detail.point}
                                                    {(index === 0 ||
                                                        (index + 1) %
                                                            maxScale ===
                                                            0) && (
                                                        <img
                                                            src={star}
                                                            alt="star"
                                                            style={{
                                                                marginLeft:
                                                                    '5px',
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <CustomTextField
                                                    name="text"
                                                    value={detail.text}
                                                    onChange={e =>
                                                        handleDetailChange(
                                                            e,
                                                            index
                                                        )
                                                    }
                                                    error={
                                                        errors[
                                                            `detailText${index}`
                                                        ]
                                                    }
                                                    helperText={
                                                        errors[
                                                            `detailText${index}`
                                                        ]
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                >
                                                    <input
                                                        accept="image/*"
                                                        style={{
                                                            display: 'none',
                                                        }}
                                                        id={`icon-upload-${index}`}
                                                        type="file"
                                                        onChange={e =>
                                                            handleImageChange(
                                                                e,
                                                                index
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        htmlFor={`icon-upload-${index}`}
                                                    >
                                                        <IconButton
                                                            component="span"
                                                            color="primary"
                                                        >
                                                            <UploadFileIcon />
                                                        </IconButton>
                                                    </label>
                                                    {detail.icon && (
                                                        <IconButton
                                                            onClick={() =>
                                                                handleImageRemove(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={
                                                                    detail.icon
                                                                }
                                                                alt={`icon-${index}`}
                                                                style={{
                                                                    height: '32px',
                                                                    width: '32px',
                                                                    marginLeft:
                                                                        '10px',
                                                                }}
                                                            />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                                {errors[
                                                    `detailIcon${index}`
                                                ] && (
                                                    <Typography
                                                        color="error"
                                                        variant="caption"
                                                    >
                                                        {
                                                            errors[
                                                                `detailIcon${index}`
                                                            ]
                                                        }
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box mt={2}>
                            <CustomButton
                                type="submit"
                                active={true}
                                variant="contained"
                                color="primary"
                                sx={{
                                    borderRadius: '50px',
                                    padding: '10px 20px',
                                    margin: '0 8px',
                                    textTransform: 'none',
                                    fontFamily: 'Bold',
                                }}
                            >
                                Submit
                            </CustomButton>
                        </Box>
                    </form>
                </Box>
            )}

            {submissionStatus === 'pending' && (
                <Typography variant="body1" align="center" mt={2}>
                    Saving options configuration...
                </Typography>
            )}

            {submissionStatus === 'success' && (
                <Typography
                    variant="body1"
                    align="center"
                    mt={2}
                    color="success"
                ></Typography>
            )}

            {submissionStatus === 'error' && (
                <Typography variant="body1" align="center" mt={2} color="error">
                    Error saving options configuration. Please try again.
                </Typography>
            )}
        </>
    );
};

export default WOLOptionsConfig;
