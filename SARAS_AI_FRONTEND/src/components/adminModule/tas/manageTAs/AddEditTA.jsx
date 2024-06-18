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

const AddEditTA = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [selectedImage, setSelectedImage] = useState(null);
    const [open, setOpen] = useState(false)
    const [assignStudent, setAssignStudent] = useState(false);
    const [assignBatch, setAssignBatch] = useState(false);
    const [edit, setEdit] = useState(true);
    const dispatch = useDispatch();

    const timeZones = moment.tz.names();

    const genders = ['male', 'female', 'other'];

    const qualificationOptions = [
        { value: 'highSchool', label: 'High School' },
        { value: 'bachelors', label: 'Bachelors' },
        { value: 'masters', label: 'Masters' },
        { value: 'phd', label: 'PhD' },
    ];

    const validateTimeZone = (value) => {
        if (!value) return 'Time Zone is required';
        if (!timeZones.includes(value)) return 'Invalid time zone selected';
        return true;
    };

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
        setAssignStudent(true)
    }

    const handleAssignBatches = () => {
        setAssignBatch(true)
    }

    const handleClose = () => {
        setOpen(false)
        setAssignStudent(false)
        setAssignBatch(false)
    }

    const onSubmit = (data) => {
        console.log("Data", data)
        setOpen(true);
    };

    return (
        <Box sx={{ bgcolor: '#f8f9fa', p: 3 }}>
            <DialogActions sx={{ p: 2 }}>
                <Grid container alignItems="center">
                    {edit ? (
                        <>
                            <Grid item xs>
                                <Typography variant="h4" sx={{ mb: 4 }}>Edit TA</Typography>
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
                            <Typography variant="h4" sx={{ mb: 4 }}>Create TA</Typography>
                        </Grid>
                    )}

                </Grid>
            </DialogActions>

            <Box sx={{ bgcolor: 'white', borderRadius: 2, p: 4, boxShadow: 3, maxWidth: 1400, mx: 'auto' }}>
                <Box display="flex " alignItems="center" mb={4}>
                    <Box position="relative" display="inline-flex" flexDirection="column">
                        <Avatar
                            src={selectedImage}
                            sx={{ width: 124, height: 124 }}
                        />
                        <input
                            type="file"
                            id="profilePicture"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="profilePicture" style={{ position: 'absolute', bottom: 4, right: -12 }}>
                            <IconButton component="span" style={{ backgroundColor: '#F56D3B', color: "white" }}>
                                <PhotoCamera />
                            </IconButton>
                        </label>
                    </Box>
                    <Box ml={4} >
                        <Typography variant="h5" sx={{ fontSize: '24px', fontWeight: '600', font: 'Nohemi', color: '#1A1E3D' }}>Name of the TA</Typography>
                        <Typography variant="body2" sx={{ fontSize: '16px', fontWeight: '400', mb: 4, color: '#5F6383', font: 'Nohemi' }}>
                            Short Description
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ mt: 2, mb: 4, border: '1px solid #C2C2E7' }} />

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={6}>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="TA Name"
                                name="taname"
                                placeholder="Enter TA Name"
                                fullWidth
                                {...register('taname', {
                                    required: 'Name is required',
                                    minLength: { value: 3, message: 'Name must be at least 3 characters long' },
                                    pattern: { value: /^[A-Za-z\s]+$/, message: 'Name must contain only letters and spaces' }
                                })}
                                error={!!errors.taname}
                                helperText={errors.taname?.message}
                                variant="outlined"
                                InputProps={{ style: { height: '60px', borderRadius: '50px', border: '1px solid #D0D0EC', padding: '18px 30px' } }}
                                InputLabelProps={{ style: { margin: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Username"
                                name="username"
                                placeholder="Enter Username"
                                fullWidth
                                {...register('username', {
                                    required: 'Username is required',
                                    minLength: { value: 3, message: 'Username must be at least 3 characters long' },
                                    maxLength: { value: 20, message: 'Username cannot exceed 20 characters' },
                                    pattern: { value: /^[A-Za-z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' }
                                })}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                variant="outlined"
                                InputProps={{ style: { height: '60px', borderRadius: '50px', border: '1px solid #D0D0EC', padding: '18px 30px' } }}
                                InputLabelProps={{ style: { margin: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                placeholder="Enter Password"
                                fullWidth
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: { value: 8, message: 'Password must be at least 8 characters long' },
                                    maxLength: { value: 20, message: 'Password cannot exceed 20 characters' },
                                    pattern: {
                                        value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
                                        message: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
                                    }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                variant="outlined"
                                InputProps={{ style: { height: '60px', borderRadius: '50px', border: '1px solid #D0D0EC', padding: '18px 30px' } }}
                                InputLabelProps={{ style: { margin: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Address"
                                name="address"
                                placeholder="Enter Address"
                                fullWidth
                                {...register('address', {
                                    required: 'Address is required',
                                    maxLength: { value: 200, message: 'Address must not exceed 200 characters' }
                                })}
                                error={!!errors.address}
                                helperText={errors.address?.message}
                                variant="outlined"
                                InputProps={{ style: { height: '60px', borderRadius: '50px', border: '1px solid #D0D0EC', padding: '18px 30px' } }}
                                InputLabelProps={{ style: { margin: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="PIN Code"
                                name="pinCode"
                                placeholder="Enter PIN Code"
                                fullWidth
                                {...register('pinCode', {
                                    required: 'PIN Code is required',
                                    pattern: { value: /^[a-zA-Z0-9-]*$/, message: 'PIN Code must be alphanumeric' },
                                    minLength: { value: 3, message: 'PIN Code must be at least 3 characters long' },
                                    maxLength: { value: 10, message: 'PIN Code cannot exceed 10 characters' }
                                })}
                                error={!!errors.pinCode}
                                helperText={errors.pinCode?.message}
                                variant="outlined"
                                InputProps={{ style: { height: '60px', borderRadius: '50px', border: '1px solid #D0D0EC', padding: '18px 30px' } }}
                                InputLabelProps={{ style: { margin: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel style={{ margin: 0 }}>Time Zone</InputLabel>
                                <Select
                                    label="Time Zone"
                                    name="timezone"
                                    {...register('timezone', { validate: validateTimeZone })}
                                    error={!!errors.timezone}
                                    style={{ borderRadius: '50px', height: '60px', borderRadius: '50px', border: '1px solid #D0D0EC', padding: '18px 30px' }}
                                >
                                    {timeZones.map((tz) => (
                                        <MenuItem key={tz} value={tz}>{tz}</MenuItem>
                                    ))}
                                </Select>
                                {errors.timezone && <Typography variant="body2" color="error">{errors.timezone.message}</Typography>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel style={{ margin: 0 }}>Gender</InputLabel>
                                <Select
                                    label="Gender"
                                    name="gender"
                                    {...register('gender', { required: 'Gender is required' })}
                                    error={!!errors.gender}
                                    style={{ borderRadius: '50px', height: '60px', borderRadius: '50px', border: '1px solid #D0D0EC', padding: '18px 30px' }}
                                >
                                    {genders.map((gender) => (
                                        <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                                    ))}
                                </Select>
                                {errors.gender && <Typography variant="body2" color="error">{errors.gender.message}</Typography>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                name="dateofBirth"
                                //label="Date of Birth"
                                type="date"
                                fullWidth
                                {...register('dateofBirth', { required: 'Date of birth is required' })}
                                error={!!errors.dateofBirth}
                                helperText={errors.dateofBirth?.message}
                                variant="outlined"
                                InputProps={{ style: { borderRadius: '50px', height: '60px', borderRadius: '50px', border: '1px solid #D0D0EC', padding: '18px 30px' } }}
                                InputLabelProps={{ style: { margin: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel style={{ margin: 0 }}>Highest Qualification</InputLabel>
                                <Select
                                    label="Highest Qualification"
                                    name="highetqualification"
                                    {...register('highetqualification', { required: 'Highest Qualification is required' })}
                                    error={!!errors.highetqualification}
                                    style={{ borderRadius: '50px', height: '60px', borderRadius: '50px', border: '1px solid #D0D0EC', padding: '18px 30px' }}
                                >
                                    {qualificationOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                    ))}
                                </Select>
                                {errors.highetqualification && <Typography variant="body2" color="error">{errors.highetqualification.message}</Typography>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="About Me"
                                name="aboutMe"
                                type="text"
                                placeholder="Enter About TA"
                                fullWidth
                                multiline
                                rows={4}
                                {...register('aboutMe', { required: 'About Me is required' })}
                                error={!!errors.aboutMe}
                                helperText={errors.aboutMe?.message}
                                variant="outlined"
                                InputProps={{ style: { borderRadius: '25px', padding: '25px 30px 18px 30px', border: '1px solid #D0D0EC' } }}
                                InputLabelProps={{ style: { margin: 0 } }}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" style={{ borderRadius: '50px', padding: '18px 30px', marginTop: 30, backgroundColor: '#F56D3B', height: "60px", width: "121px", fontSize: '16px', fontWeight: '700px', text: '#FFFFFF' }}>Submit</Button>
                </form>

                {/* Dialog for showing success message */}
                <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth="md"
                    fullWidth
                    sx={{
                        padding: '50px 0px 50px 0px',
                        borderRadius: '10px',
                        border: '2px solid #F56D38',
                        color: '#FFFFFF'
                    }}
                >
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            color: '#F56D3B',
                            position: 'absolute',
                            top: 10,
                            right: 10
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <DialogTitle
                        id="alert-dialog-title"
                        sx={{
                            m: 0,
                            p: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                font: 'Nohemi',
                                fontWeight: '600',
                                fontSize: '25px',
                                color: '#1A1E3D'
                            }}
                        >
                            'TA' successfully created.
                        </Typography>
                    </DialogTitle>

                    <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                        <Box display="flex" justifyContent="center" width="100%" gap={2}>
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
                        </Box>
                    </DialogActions>
                </Dialog>
                {assignStudent && <AssignStudents open={open} handleClose={handleClose} />}
                {assignBatch && <AssignBatches open={open} handleClose={handleClose} />}
            </Box>
        </Box>
    );
};

export default AddEditTA;
