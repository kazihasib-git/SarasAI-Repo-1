import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddEdit.css';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Typography,
    Grid,
    DialogActions,
    Divider,
    TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AssignStudents from '../../AssignStudents';
import AssignBatches from '../../AssignBatches';
import CustomFormControl from '../../../CustomFields/CustomFromControl';
import CustomTextField from '../../../CustomFields/CustomTextField';
import {
    transformedTimeZones,
    genders,
    qualificationOptions,
    validateTimeZone,
} from '../../../CustomFields/FormOptions';
import CustomDateField from '../../../CustomFields/CustomDateField';
import {
    closeSuccessPopup,
    createTA,
    openAssignBatches,
    openAssignStudents,
    openSuccessPopup,
    updateTA,
    accessTaName,
} from '../../../../redux/features/adminModule/ta/taSlice';
import SubmitPopup from '../../SubmitPopup';
import dayjs from 'dayjs';
import AvatarInput from '../../../CustomFields/AvatarInput';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { getTimezone } from '../../../../redux/features/utils/utilSlice';
import CustomTimeZoneForm from '../../../CustomFields/CustomTimeZoneForm';
import { dateFormatter } from '../../../../utils/dateFormatter';
import CustomDateOfBirth from '../../../CustomFields/CustomDateOfBirth';

const AddEditTA = ({ data }) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            gender: '',
            time_zone: '',
            highest_qualification: '',
            date_of_birth: null,
        },
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [editableDescription, setEditableDescription] = useState('');
    const [editableAboutMe, setEditableAboutMe] = useState('');

    const dispatch = useDispatch();
    const { successPopup, assignStudentOpen, assignBatchOpen } = useSelector(
        state => state.taModule
    );
    const { timezones } = useSelector(state => state.util);

    useEffect(() => {
        dispatch(getTimezone());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            populateForm(data);
        }
    }, [data]);

    const populateForm = data => {
        const formattedDate = moment(data.date_of_birth).format('YYYY-MM-DD');
        setDateOfBirth(formattedDate);
        dispatch(accessTaName(data));

        if (data.profile_picture) {
            const blobUrl = base64ToBlobUrl(data.profile_picture);
            setSelectedImage(blobUrl);
        }

        const formValues = {
            name: data.name,
            username: data.username,
            password: data.password,
            location: data.location,
            address: data.address,
            pincode: data.pincode,
            phone: data.phone,
            time_zone: data.time_zone,
            gender: data.gender,
            email: data.email,
            date_of_birth: formattedDate,
            highest_qualification: data.highest_qualification,
            about_me: data.about_me,
            description: data.description
        };

        Object.entries(formValues).forEach(([key, value]) => setValue(key, value));
    };

    const base64ToBlobUrl = base64Data => {
        const byteCharacters = atob(base64Data);
        const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
    };

    const handleAssignStudents = () => {
        dispatch(openAssignStudents());
    };

    const handleAssignBatches = () => {
        dispatch(openAssignBatches());
    };

    const handleDescriptionChange = event => {
        setEditableDescription(event.target.value);
    };

    const handleAboutMeChange = event => {
        setEditableAboutMe(event.target.value);
    };

    const handleSaveDescription = () => {
        setIsEditingDescription(false);
        setValue('about_me', editableDescription);
    };

    const onSubmit = async formData => {
        const { email, time_zone, ...updatedFormData } = formData;

        // updatedFormData.date_of_birth = dateOfBirth;

        if (selectedImage) {
            const base64Data = selectedImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
            updatedFormData.profile_picture = base64Data;
        }
            updatedFormData.description = editableDescription;
        try {
            if (data) {
                const updateRes = await dispatch(updateTA({ id: data.id, data: updatedFormData })).unwrap();
                dispatch(openSuccessPopup());
                dispatch(accessTaName(updateRes));
            } else {
                updatedFormData.email = email;
                updatedFormData.time_zone = 'Asia/Kolkata';
                const createRes = await dispatch(
                    createTA(updatedFormData)
                ).unwrap();
                dispatch(openSuccessPopup());
                dispatch(accessTaName(createRes.ta));
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }

    };

    const nameValue = watch('name', '');

    const handleDateChange = (date, field) => {
        const formattedDate = date ? moment(date).format('YYYY-MM-DD') : '';
        setDateOfBirth(formattedDate);
        field.onChange(formattedDate);
    };

    return (
        <Box m={'20px'}>
            <DialogActions>
                <Grid container alignItems="center">
                    {data ? (
                        <>
                            <Grid item xs>
                                <Typography variant="h4" sx={{ mb: 4 }}>
                                    Edit TA
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Box display="flex" justifyContent="center" gap={2}>
                                    <Button
                                        variant="contained"
                                        onClick={handleAssignStudents}
                                        sx={{
                                            backgroundColor: 'white',
                                            color: '#F56D3B',
                                            height: '60px',
                                            width: '220px',
                                            border: '2px solid #F56D3B',
                                            borderRadius: '50px',
                                            textTransform: 'none',
                                            fontWeight: '700',
                                            fontSize: '16px',
                                            padding: '18px 30px',
                                            '&:hover': {
                                                backgroundColor: '#F56D3B',
                                                color: 'white',
                                            },
                                        }}
                                    >
                                        Assign Students
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleAssignBatches}
                                        sx={{
                                            backgroundColor: 'white',
                                            color: '#F56D3B',
                                            height: '60px',
                                            width: '194px',
                                            border: '2px solid #F56D3B',
                                            borderRadius: '50px',
                                            textTransform: 'none',
                                            fontWeight: '700',
                                            fontSize: '16px',
                                            padding: '18px 30px',
                                            '&:hover': {
                                                backgroundColor: '#F56D3B',
                                                color: 'white',
                                            },
                                        }}
                                    >
                                        Assign Batches
                                    </Button>
                                </Box>
                            </Grid>
                        </>
                    ) : (
                        <Grid item xs>
                            <Typography variant="h4" sx={{ mb: 4 }}>
                                Create TA
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </DialogActions>

            <Box
                sx={{
                    bgcolor: 'white',
                    borderRadius: 2,
                    p: 4,
                    boxShadow: 3,
                    mx: 'auto',
                }}
            >
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Box mb={4}>
                        <Box display="flex" alignItems="center" mb={2}>
                            <AvatarInput
                                name="x_picture"
                                selectedImage={selectedImage}
                                setSelectedImage={setSelectedImage}
                            />
                            <Box ml={4} display="flex" flexDirection="column">
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: '24px',
                                            fontWeight: '600',
                                            font: 'Nunito Sans',
                                            color: '#1A1E3D',
                                        }}
                                    >
                                        {nameValue || 'Name of the TA'}
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        onClick={() => setIsEditingDescription(!isEditingDescription)}
                                        sx={{
                                            backgroundColor: '#F56D3B',
                                            color: 'white',
                                            borderRadius: '20px',
                                            textTransform: 'none',
                                            height: '32px',
                                            minWidth: 'auto',
                                            padding: '0 16px',
                                        }}
                                    >
                                        <EditIcon />
                                        Edit
                                    </Button>
                                </Box>

                                {isEditingDescription ? (
                                    <Box mt={2}>
                                        <CustomTextField
                                            fullWidth
                                            multiline
                                            rows={2}
                                            value={editableDescription}
                                            onChange={handleDescriptionChange}
                                            placeholder="Add a brief description..."
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={handleSaveDescription}
                                            sx={{
                                                mt: 2,
                                                backgroundColor: '#F56D3B',
                                                color: 'white',
                                                borderRadius: '20px',
                                                textTransform: 'none',
                                                height: '32px',
                                                minWidth: 'auto',
                                                padding: '0 16px',
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </Box>
                                ) : (
                                    <Typography variant="body1" sx={{ mt: 2 }}>
                                        {editableDescription || 'Short Description'}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>




                    <Divider
                        sx={{ mt: 2, mb: 4, border: '1px solid #C2C2E7' }}
                    />

                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={6} md={4}>
                            {/* TA name */}
                            <CustomTextField
                                label="TA Name"
                                name="name"
                                placeholder="Enter TA Name"
                                register={register}
                                validation={{
                                    required: 'Name is required',
                                    minLength: {
                                        value: 3,
                                        message:
                                            'Name must be at least 3 characters long',
                                    },
                                    pattern: {
                                        value: /^[A-Za-z\s]+$/,
                                        message:
                                            'Name must contain only letters and spaces',
                                    },
                                }}
                                errors={errors}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <CustomTextField
                                label="Username"
                                name="username"
                                placeholder="Enter Username"
                                register={register}
                                validation={{
                                    required: 'Username is required',
                                    minLength: {
                                        value: 3,
                                        message:
                                            'Username must be at least 3 characters long',
                                    },
                                    maxLength: {
                                        value: 20,
                                        message:
                                            'Username cannot exceed 20 characters',
                                    },
                                    pattern: {
                                        // value: /^[A-Za-z0-9_]+$/,
                                        message:
                                            'Username can only contain letters, numbers, and underscores',
                                    },
                                }}
                                errors={errors}
                            />
                        </Grid>

                        {!data && (
                            <Grid item xs={12} sm={6} md={4}>
                                <CustomTextField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter Password"
                                    register={register}
                                    validation={{
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message:
                                                'Password must be at least 8 characters long',
                                        },
                                        maxLength: {
                                            value: 20,
                                            message:
                                                'Password cannot exceed 20 characters',
                                        },
                                        pattern: {
                                            value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
                                            message:
                                                'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
                                        },
                                    }}
                                    errors={errors}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6} md={4}>
                            <CustomTextField
                                label="Address"
                                name="address"
                                placeholder="Enter Address"
                                register={register}
                                validation={{
                                    required: 'Address is required',
                                    maxLength: {
                                        value: 200,
                                        message:
                                            'Address must not exceed 200 characters',
                                    },
                                }}
                                errors={errors}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomTextField
                                label="Location"
                                name="location"
                                placeholder="Enter Location"
                                register={register}
                                validation={{
                                    required: 'Location is required',
                                    maxLength: {
                                        value: 200,
                                        message:
                                            'Location must not exceed 200 characters',
                                    },
                                }}
                                errors={errors}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomTextField
                                label="PIN Code"
                                name="pincode"
                                type="number"
                                placeholder="Enter PIN Code"
                                register={register}
                                validation={{
                                    required: 'PIN Code is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9-]*$/,
                                        message:
                                            'PIN Code must be alphanumeric',
                                    },
                                    minLength: {
                                        value: 3,
                                        message:
                                            'PIN Code must be at least 3 characters long',
                                    },
                                    maxLength: {
                                        value: 10,
                                        message:
                                            'PIN Code cannot exceed 10 characters',
                                    },
                                }}
                                errors={errors}
                            />
                        </Grid>
                        {/* {console.log("DATA : ", data)} */}

                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="time_zone"
                                control={control}
                                rules={{ required: 'TimeZone is required' }}
                                render={({ field }) => {
                                    return (
                                        <CustomTimeZoneForm
                                            label="Time Zone"
                                            name="time_zone"
                                            value={field.value}
                                            onChange={field.onChange}
                                            errors={errors}
                                            options={timezones}
                                        />
                                    );
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                control={control}
                                name="date_of_birth"
                                render={({ field }) => (
                                    <CustomDateOfBirth
                                        label="Date of Birth"
                                        name="date_of_birth"
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={!!errors.date_of_birth}
                                        helperText={errors.date_of_birth?.message}
                                        sx={{ width: '100%' }} // Ensure full width
                                    />
                                )}
                                rules={{
                                    required: 'Date of Birth is required',
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="gender"
                                control={control}
                                rules={{ required: 'Gender is required' }}
                                render={({ field }) => (
                                    <CustomFormControl
                                        label="Gender"
                                        name="gender"
                                        value={field.value}
                                        onChange={field.onChange}
                                        errors={errors}
                                        options={genders}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="highest_qualification"
                                control={control}
                                rules={{
                                    required:
                                        'Highest Qualification is required',
                                }}
                                render={({ field }) => (
                                    <>
                                        {/* {console.log("DATA highest_qualification : ", field.value)} */}
                                        <CustomFormControl
                                            label="Highest Qualification"
                                            name="highest_qualification"
                                            value={field.value}
                                            onChange={field.onChange}
                                            errors={errors}
                                            options={qualificationOptions}
                                        />
                                    </>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <CustomTextField
                                label="Email Address"
                                name="email"
                                placeholder="Enter Email Address"
                                register={register}
                                validation={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Invalid email address',
                                    },
                                }}
                                errors={errors}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{ required: 'Phone number is required' }}
                                render={({ field }) => (
                                    <PhoneInput
                                        {...field}
                                        country={'in'}
                                        // containerStyle={{ width: "100%" }}

                                        inputStyle={{
                                            width: '100%',
                                            borderRadius: '50px',
                                            borderColor: errors.phone
                                                ? 'red'
                                                : '#D0D0EC',
                                            outline: 'none',
                                            height: '60px',
                                            // boxShadow: errors.phone ? "0 0 0 2px red" : "none",
                                        }}
                                        buttonStyle={{
                                            borderRadius: '50px 0 0 50px',
                                            borderColor: errors.phone
                                                ? 'red'
                                                : '#D0D0EC',
                                            height: '60px',
                                            outline: 'none',
                                            paddingLeft: '10px',
                                            // boxShadow: errors.phone ? "0 0 0 2px red" : "none",
                                        }}
                                        onFocus={e =>
                                            (e.target.style.borderColor =
                                                errors.phone
                                                    ? 'red'
                                                    : '#D0D0EC')
                                        }
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.phone && (
                                <Typography
                                    variant="body2"
                                    color="error"
                                    sx={{ fontSize: '0.75rem' }}
                                >
                                    {errors.phone.message}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                        <CustomTextField
                                label="About Me"
                                name="about_me"
                                placeholder="Enter About TA"
                                register={register}
                                validation={{
                                    required: 'About Me is required',
                                }}
                                errors={errors}
                                multiline
                                rows={4}
                                value={editableAboutMe}
                                onChange={handleAboutMeChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        style={{
                            borderRadius: '50px',
                            padding: '18px 30px',
                            marginTop: 30,
                            backgroundColor: '#F56D3B',
                            height: '60px',
                            width: '121px',
                            fontSize: '16px',
                            fontWeight: '700px',
                            text: '#FFFFFF',
                            textTransform: 'none',
                        }}
                    >
                        Submit
                    </Button>
                </form>

                {/* <ReusableDialog
          open={successPopup}
          handleClose={() => dispatch(closeSuccessPopup())}
          title= {`${taName} successfully created.`}
          actions={actions}
        /> */}
                {successPopup && <SubmitPopup componentname={'ADDEDITTA'} />}
                {assignStudentOpen && (
                    <AssignStudents componentname={'ADDEDITTA'} />
                )}
                {assignBatchOpen && (
                    <AssignBatches componentname={'ADDEDITTA'} />
                )}
            </Box>
        </Box>
    );
};

export default AddEditTA;
