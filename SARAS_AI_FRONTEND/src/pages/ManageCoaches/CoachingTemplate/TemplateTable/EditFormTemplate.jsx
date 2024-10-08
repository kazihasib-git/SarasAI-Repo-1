import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button,
    Grid,
    IconButton,
} from '@mui/material';
import CustomTextField from '../../../../components/CustomFields/CustomTextField';
import CustomDateField from '../../../../components/CustomFields/CustomDateField';
import CloseIcon from '@mui/icons-material/Close';

function EditFormTemplate({ open, handleClose, handleSubmitForm }) {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = data => {
        handleSubmitForm(data);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit </DialogTitle>

            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: 'grey.500',
                }} // Adjust color as needed
            >
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Controller
                                name="activity_name"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        label="Activity Name"
                                        fullWidth
                                        variant="outlined"
                                        error={!!errors.activity_name}
                                        helperText={
                                            errors.activity_name
                                                ? 'Activity Name is required'
                                                : ''
                                        }
                                    />
                                )}
                                rules={{ required: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="due_date"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <CustomDateField
                                        {...field}
                                        label="Due Date"
                                        fullWidth
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        error={!!errors.due_date}
                                        helperText={
                                            errors.due_date
                                                ? 'Due Date is required'
                                                : ''
                                        }
                                    />
                                )}
                                rules={{ required: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="point"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Point"
                                        select
                                        fullWidth
                                        variant="outlined"
                                        error={!!errors.point}
                                        helperText={
                                            errors.point
                                                ? 'Point is required'
                                                : ''
                                        }
                                    >
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                    </TextField>
                                )}
                                rules={{ required: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="after_due_date"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <CustomDateField
                                        {...field}
                                        label="After Due Date"
                                        fullWidth
                                        variant="outlined"
                                        error={!!errors.after_due_date}
                                        helperText={
                                            errors.after_due_date
                                                ? 'This field is required'
                                                : ''
                                        }
                                    />
                                )}
                                rules={{ required: true }}
                            />
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            style={{ textTransform: 'none' }}
                        >
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default EditFormTemplate;
