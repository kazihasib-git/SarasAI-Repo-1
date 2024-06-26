import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment-timezone';
import { useDispatch } from 'react-redux';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Button,
    IconButton,
    Typography,
    Avatar,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { PhotoCamera } from '@mui/icons-material';
import AssignStudents from '../../AssignStudents';
import AssignBatches from '../../AssignBatches';
import SubmitPopup from '../../SubmitPopup';
import CustomTextField from '../../../CustomFields/CustomTextField';
import CustomFormControl from '../../../CustomFields/CustomFromControl';
import CustomDateField from '../../../CustomFields/CustomDateField';
import { timeZones, genders, qualificationOptions, validateTimeZone } from '../../../CustomFields/FormOptions';
import ReusableDialog from '../../../CustomFields/ReusableDialog';



function AddEditCoach() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [selectedImage, setSelectedImage] = useState(null);
    const [open, setOpen] = useState(false);
    const [assignStudent, setAssignStudent] = useState(false);
    const [assignBatch, setAssignBatch] = useState(false);
    const [edit, setEdit] = useState(false);
    const dispatch = useDispatch();
    const [dateOfBirth, setDateOfBirth] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setSelectedImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleAssignStudents = () => {
        setAssignStudent(true);
    };

    const handleAssignBatches = () => {
        setAssignBatch(true);
    };

    const handleClose = () => {
        setOpen(false);
        setAssignStudent(false);
        setAssignBatch(false);
    };

    const onSubmit = (data) => {
        console.log("Data", data);
        setOpen(true);
    };
    const actions = (
        <>
          <Button
            variant="contained"
            onClick={handleAssignStudents}
            sx={{
              backgroundColor: '#F56D3B',
              color: 'white',
              borderRadius: '50px',
              textTransform: 'none',
              padding: '10px 20px',
              fontWeight: '700',
              fontSize: '16px',
              '&:hover': {
                backgroundColor: '#D4522A'
              }
            }}
          >
            Assign Students
          </Button>
          <Button
            variant="outlined"
            onClick={handleAssignBatches}
            sx={{
              backgroundColor: 'white',
              color: '#F56D3B',
              border: '2px solid #F56D3B',
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: '700',
              fontSize: '16px',
              padding: '10px 20px',
              '&:hover': {
                backgroundColor: '#F56D3B',
                color: 'white'
              }
            }}
          >
            Assign Batches
          </Button>
        </>
      );

    return (
        <Box sx={{ bgcolor: '#f8f9fa', p: 3 }}>
            <DialogActions sx={{ p: 2 }}>
                <Grid container alignItems="center">
                    {edit ? (
                        <>
                            <Grid item xs>
                                <Typography variant="h4" sx={{ mb: 4 }}>Edit Coach</Typography>
                            </Grid>
                            <Grid item>
                                <Box display="flex" justifyContent="center" gap={2}>
                                    <Button
                                        variant="contained"
                                        onClick={handleAssignStudents}
                                        sx={{
                                            backgroundColor: '#F56D3B',
                                            color: 'white',
                                            height: '60px',
                                            width: '201px',
                                            borderRadius: '50px',
                                            textTransform: 'none',
                                            padding: '18px 30px',
                                            fontWeight: '700',
                                            fontSize: '16px',
                                            '&:hover': {
                                                //backgroundColor: '#D4522A'
                                            }
                                        }}
                                    >
                                        Assign Students
                                    </Button>
                                    <Button
                                        variant="outlined"
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
                                                //backgroundColor: '#F56D3B',
                                                //color: 'white'
                                            }
                                        }}
                                    >
                                        Assign Batches
                                    </Button>
                                </Box>
                            </Grid>
                        </>
                    ) : (
                        <Grid item xs>
                            <Typography variant="h4" sx={{ mb: 4 }}>Create Coach</Typography>
                        </Grid>
                    )}
                </Grid>
            </DialogActions>

            <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 4, boxShadow: 3, maxWidth: 1400, mx: 'auto' }}>
                <Box display="flex " alignItems="center" mb={4}>
                    <Box position="relative" display="inline-flex" flexDirection="column">
                        <Avatar
                            src={selectedImage}
                            sx={{ width: 124, height: 124 }} />
                        <input
                            type="file"
                            id="profilePicture"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileChange} />
                        <label htmlFor="profilePicture" style={{ position: 'absolute', bottom: 4, right: -12 }}>
                            <IconButton component="span" style={{ backgroundColor: '#F56D3B', color: "white" }}>
                                <PhotoCamera />
                            </IconButton>
                        </label>
                    </Box>
                    <Box ml={4}>
                        <Typography variant="h5" sx={{ fontSize: '24px', fontWeight: '600', font: 'Nohemi', color: '#1A1E3D' }}>Name of the Coach</Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: '400', mb: 4, color: '#5F6383', font: 'Nohemi' }}>
                            Short Description
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mt: 2, mb: 4, border: '1px solid #C2C2E7' }} />

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomTextField
                                label="Coach Name"
                                name="coachname"
                                placeholder="Enter Coach Name"

                                register={register}
                                validation={{
                                required: 'Username is required',
                                minLength: { value: 3, message: 'Username must be at least 3 characters long' },
                                maxLength: { value: 20, message: 'Username cannot exceed 20 characters' },
                                pattern: { value: /^[A-Za-z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
                                }}
                                errors={errors}
                                error={!!errors.coachname}
                                helperText={errors.coachname?.message} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomTextField
                                label="Username"
                                name="username"
                                placeholder="Enter Username"
                                register={register}
                                validation={{
                                required: 'Username is required',
                                minLength: { value: 3, message: 'Username must be at least 3 characters long' },
                                maxLength: { value: 20, message: 'Username cannot exceed 20 characters' },
                                pattern: { value: /^[A-Za-z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
                                }}
                                errors={errors}
                                helperText={errors.username?.message}
                                 />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomTextField
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Enter Password"
                                register={register}
                                validation={{
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Password must be at least 8 characters long' },
                                maxLength: { value: 20, message: 'Password cannot exceed 20 characters' },
                                pattern: {
                                    value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
                                    message: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
                                }
                                }}
                                errors={errors}
                                helperText={errors.password?.message}
                                 />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomTextField
                                label="Address"
                                name="address"
                                register={register}
                                validation={{
                                required: 'Address is required',
                                maxLength: { value: 200, message: 'Address must not exceed 200 characters' }
                                }}
                                errors={errors}
                                helperText={errors.address?.message}
                                 />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomTextField
                                label="PIN Code"
                                name="pinCode"
                                placeholder="Enter PIN Code"
                                register={register}
                                validation={{
                                required: 'PIN Code is required',
                                pattern: { value: /^[a-zA-Z0-9-]*$/, message: 'PIN Code must be alphanumeric' },
                                minLength: { value: 3, message: 'PIN Code must be at least 3 characters long' },
                                maxLength: { value: 10, message: 'PIN Code cannot exceed 10 characters' }
                                }}
                                errors={errors}
                                helperText={errors.pinCode?.message}
                                 />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomFormControl
                                label="Time Zone"
                                name="timezone"
                                register={register}
                                validation={{ validate: validateTimeZone }}
                                errors={errors}
                                options={timeZones} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomFormControl
                                label="Gender"
                                name="gender"
                                register={register}
                                validation={{ required: 'Gender is required' }}
                                errors={errors}
                                options={genders} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomDateField
                                label="Date Of Birth"
                                value={dateOfBirth}
                                onChange={setDateOfBirth}
                                name="dateOfBirth"
                                register={register}
                                validation={{ required: 'Date of birth is required' }}
                                errors={errors}
                                sx={{ width: '100%' }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <CustomFormControl
                                label="Highest Qualification"
                                name="highetqualification"
                                register={register}
                                validation={{ required: 'Highest Qualification is required' }}
                                errors={errors}
                                options={qualificationOptions} />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomTextField
                                label="About Me"
                                name="aboutMe"
                                type="text"
                                placeholder="Enter About Coach"
                                multiline
                                rows={4}
                                register={register}
                                validation={{ required: 'About Me is required' }}
                                errors={errors}
                                helperText={errors.aboutMe?.message}
                                multiline
                                rows={4}
                                />
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" style={{ borderRadius: '50px', padding: '18px 30px', marginTop: 30, backgroundColor: '#F56D3B', height: "60px", width: "121px", fontSize: '16px', fontWeight: '700px', text: '#FFFFFF' }}>Submit</Button>
                </form>
                <ReusableDialog
                open={open}
                handleClose={handleClose}
                title="'Coach' successfully created."
                actions={actions}
                />

                {assignStudent && <AssignStudents open={open} handleClose={handleClose} />}
                {assignBatch && <AssignBatches open={open} handleClose={handleClose} />}
            </Box>
        </Box>
    );
}

export default AddEditCoach;
