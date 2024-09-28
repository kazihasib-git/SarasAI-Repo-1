import React, { useEffect, useState } from 'react';
import ReusableDialog from '../../../../components/CustomFields/ReusableDialog';
import {
    Button,
    Grid,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';
import CustomTextField from '../../../../components/CustomFields/CustomTextField';
import CustomFutureDateField from '../../../../components/CustomFields/CustomFutureDateField';
import { useDispatch, useSelector } from 'react-redux';
import { Controller } from 'react-hook-form';
import {
    createCoachTemplateActivity,
    getCoachTemplateModuleId,
    closeEditActivityPopup,
    updateEditActivity,
    getAllCoachTemplateModules,
    getAllCoachTemplates,
} from '../../../../redux/features/adminModule/coach/coachTemplateSlice';
import moment from 'moment';
import { toast } from 'react-toastify';

const CustomButton = ({
    onClick,
    children,
    color = '#FFFFFF',
    backgroundColor = '#4E18A5',
    borderColor = '#FFFFFF',
    sx,
    ...props
}) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                backgroundColor: backgroundColor,
                color: color,
                fontWeight: '700',
                fontSize: '16px',
                borderRadius: '50px',
                padding: '10px 20px',
                border: `2px solid ${borderColor}`,
                '&:hover': {
                    backgroundColor: color,
                    color: backgroundColor,
                    borderColor: color,
                },
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};
const AddEditActivity = () => {
    const dispatch = useDispatch();
    const {
        openEditActivityPopUp,
        editActivityData,
        coachTemplates,
        moduleID,
        selectedCoachTemplate,
    } = useSelector(state => state.coachTemplate);

    const [activityName, setActivityName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [points, setPoints] = useState('');
    const [afterDueDate, setAfterDueDate] = useState('');

    useEffect(() => {
        if (editActivityData) {
            setActivityName(editActivityData.activity_name || '');
            setDueDate(editActivityData.due_date || '');
            setPoints(editActivityData.points || '');
            setAfterDueDate(editActivityData.after_due_date || '');
        }
    }, [editActivityData]);

    const handleAfterDueDateChange = event => {
        setAfterDueDate(event.target.value);
    };

    const content = (
        <Grid
            container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%', // Ensure the container takes the full width
            }}
        >
            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ margin: '10px 0px', width: '80%' }}
            >
                <CustomTextField
                    label="Activity Name"
                    variant="outlined"
                    value={activityName}
                    onChange={e => setActivityName(e.target.value)}
                    placeholder="Enter Activity Name"
                    name="activityName"
                    fullWidth
                />
            </Grid>

            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ margin: '10px 0px', width: '80%' }}
            >
                <CustomFutureDateField
                    label="Due Date"
                    name="dueDate"
                    value={dueDate}
                    onChange={setDueDate}
                    disableFutureDates={false} // Adjust this as needed
                    sx={{ width: '100%' }}
                />
                
            </Grid>
            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ margin: '10px 0px', width: '80%' }}
            >
                <CustomTextField
                    label="Points"
                    variant="outlined"
                    value={points}
                    onChange={e => setPoints(e.target.value)}
                    placeholder="Enter Points"
                    name="points"
                    fullWidth
                />
            </Grid>
            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ margin: '10px 0px', width: '80%' }}
            >
                <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{ borderRadius: '50px' }}
                >
                    <InputLabel
                        id="after-due-date-label"
                        sx={{
                            color: 'black',
                            '&.Mui-focused': {
                                color: 'black',
                            },
                            margin: 0,
                        }}
                    >
                        After Due Date
                    </InputLabel>
                    <Select
                        labelId="after-due-date-label"
                        id="after-due-date"
                        value={afterDueDate}
                        onChange={handleAfterDueDateChange}
                        label="After Due Date"
                        sx={{
                            borderRadius: '50px',
                            border: '2px solid transparent', // Default border
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '50px',
                                '& fieldset': {
                                    border: '2px solid transparent', // Default border
                                },
                                '&:hover fieldset': {
                                    border: '2px solid #F56D38', // Border color on hover
                                },
                                '&.Mui-focused fieldset': {
                                    border: '2px solid #F56D38', // Border color when focused
                                },
                            },
                            '& .MuiInputBase-input': {
                                borderRadius: '50px',
                            },
                        }}
                    >
                        <MenuItem value={'Close Activity'}>
                            Close Activity
                        </MenuItem>
                        <MenuItem value={'No Points'}>No Points</MenuItem>
                        <MenuItem value={'No Effect'}>No Effect</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );

    const validate = data => {
        if (data.activity_name === '') {
            toast.error('Activity Name is required');
            return false;
        }
        let inputDate = new Date(data.due_date);
        if (!data.due_date || isNaN(inputDate.getTime())) {
            toast.error('Due Date is required');
            return false;
        }

        const today = moment().startOf('day');

        if (moment(inputDate).isBefore(today)) {
            // toast.error('The date must be today or a future date.');
            return;
        }

        if (data.points === '') {
            toast.error('Points are required');
            return false;
        }
        if (data.after_due_date === '') {
            toast.error('After Due Date is required');
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        const data = {
            module_id: moduleID?.id,
            activity_name: activityName,
            due_date: dueDate,
            points: points,
            after_due_date: afterDueDate,
        };

        if (!validate(data)) {
            return;
        }

        if (editActivityData) {
            // Update activity
            dispatch(
                updateEditActivity({
                    data: {
                        ...data,
                        activity_id: editActivityData.id,
                        module_id: editActivityData.module_id,
                    },
                })
            ).then(() => {
                dispatch(getCoachTemplateModuleId(selectedCoachTemplate));
            });
        } else {
            // Create new activity
            dispatch(createCoachTemplateActivity(data));
        }

        dispatch(getAllCoachTemplateModules(selectedCoachTemplate));
        dispatch(getAllCoachTemplates());
        dispatch(closeEditActivityPopup());
    };

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            backgroundColor="#F56D3B"
            borderColor="#F56D3B"
            color="#FFFFFF"
            style={{ textTransform: 'none' }}
        >
            Update
        </CustomButton>
    );

    return (
        <>
            <ReusableDialog
                open={openEditActivityPopUp}
                handleClose={() => dispatch(closeEditActivityPopup())}
                title="Edit Activity"
                content={content}
                actions={actions}
            />
        </>
    );
};

export default AddEditActivity;
