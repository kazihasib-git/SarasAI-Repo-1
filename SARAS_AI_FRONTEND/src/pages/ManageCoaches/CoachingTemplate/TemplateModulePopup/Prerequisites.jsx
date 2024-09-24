import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    FormControlLabel,
    Checkbox,
    Grid,
    Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CustomTimeField from '../../../../components/CustomFields/CustomTimeField';
import CustomDateField from '../../../../components/CustomFields/CustomDateField';
import { Controller, useForm } from 'react-hook-form';
import ReusableDialog from '../../../../components/CustomFields/ReusableDialog';
import {
    addPrerequisites,
    getAllCoachTemplateModules,
    getCoachTemplateModuleId,
    setSelectedModule,
} from '../../../../redux/features/adminModule/coach/coachTemplateSlice';
import CustomModuleFormControl from '../../../../components/CustomFields/CustomModuleFormControl';
import CustomActivityFormControl from '../../../../components/CustomFields/CustomActivityFormControl';
import { toast } from 'react-toastify';
import CustomFutureDateField from '../../../../components/CustomFields/CustomFutureDateField';

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
                fontSize: '14px',
                borderRadius: '50px',
                padding: '8px 16px',
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

const PrerequisitesPopup = ({
    open,
    prereqModuleData,
    prereqActivityData,
    handleClose,
}) => {
    const dispatch = useDispatch();
    const {
        control,
        handleSubmit,
        watch,
        register,
        reset,
        formState: { errors },
    } = useForm();

    const [activityDependence, setActivityDependence] = useState(false);
    const [moduleOptions, setModuleOptions] = useState([]);
    const [activityOptions, setActivityOptions] = useState([]);
    const [fromTime, setFromTime] = useState();

    const { coachTemplatesId } = useSelector(state => state.coachTemplate);

    useEffect(() => {
        if (prereqModuleData && prereqModuleData.template_id) {
            dispatch(getCoachTemplateModuleId(prereqModuleData.template_id));
        }
    }, [dispatch, prereqModuleData]);

    useEffect(() => {
        if (
            coachTemplatesId &&
            coachTemplatesId.modules &&
            coachTemplatesId.modules.length > 0
        ) {
            const options = coachTemplatesId.modules.map(module => ({
                value: module.id,
                label: module.module_name,
            }));
            setModuleOptions(options);
        }
    }, [coachTemplatesId]);

    useEffect(() => {
        const selectedModuleId = watch('module');
        if (
            selectedModuleId &&
            coachTemplatesId &&
            coachTemplatesId.modules &&
            coachTemplatesId.modules.length > 0
        ) {
            const selectedModule = coachTemplatesId.modules.find(
                mod => mod.id === selectedModuleId
            );

            if (selectedModule && selectedModuleId == prereqModuleData.id) {
                const options =
                    selectedModule.activities
                        ?.filter(
                            item => item.due_date < prereqActivityData.due_date
                        )
                        .filter(item => item.id != prereqActivityData.id)
                        .map(activity => ({
                            value: activity.id,
                            label: activity.activity_name,
                        })) || [];
                setActivityOptions(options);
            } else if (selectedModule) {
                const options =
                    selectedModule.activities?.map(activity => ({
                        value: activity.id,
                        label: activity.activity_name,
                    })) || [];
                setActivityOptions(options);
            }
        }
    }, [watch('module'), coachTemplatesId]);

    const validate = data => {
        let inputDate = new Date(data.lockUntil);
        if ((!data.lockUntil || isNaN(inputDate.getTime())) && !fromTime && !activityDependence) {
            toast.error(
                'Please select either Lock Until and Time, or Activity Dependence.'
            );
            return false;
        }

        if (activityDependence) {
            if (!data.module) {
                toast.error(
                    'Module is required when Activity Dependence is selected.'
                );
                return false;
            }
            if (!data.activity || data.activity.length === 0) {
                toast.error(
                    'At least one activity is required when Activity Dependence is selected.'
                );
                return false;
            }
        }

        if (data.lockUntil && !fromTime) {
            toast.error('From Time is required when Lock Until Date is set.');
            return false;
        }

        if (!data.lockUntil && fromTime) {
            toast.error('Lock Until Date is required when From Time is set.');
            return false;
        }

        return true;
    };

    const onSubmit = data => {
        if (!validate(data)) {
            return;
        }

        const prereqData = {
            module_id: prereqModuleData.id,
            activity_id: prereqActivityData.id,
            template_id: prereqModuleData.template_id,
            lock_until_date: data.lockUntil || null,
            time: fromTime || null,
            data:
                activityDependence && data.activity
                    ? data.activity.map(act => ({
                          prerequisite_activity_id: act,
                          prerequisite_module_id: data.module,
                      }))
                    : null,
        };
        dispatch(addPrerequisites(prereqData)).then(() => {
            dispatch(getCoachTemplateModuleId(prereqModuleData.template_id));
        });
        handleClosePopup();
    };

    const handleCheckboxChange = event => {
        setActivityDependence(event.target.checked);
    };

    const handleClosePopup = () => {
        reset(); // Reset form values
        setActivityDependence(false); // Reset checkbox state
        setFromTime(null); // Reset time state
        setModuleOptions([]); // Clear module options
        setActivityOptions([]); // Clear activity options
        handleClose(); // Close the popup
    };

    const content = (
        <Grid
            container
            spacing={1}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%',
            }}
        >
            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ margin: '10px 0px', width: '80%' }}
            >
                <Controller
                    name="lockUntil"
                    control={control}
                    render={({ field }) => (
                        <CustomFutureDateField
                            label="Lock Until"
                            fullWidth
                            {...field}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                <CustomTimeField
                    label="Time"
                    name="Time"
                    value={fromTime}
                    onChange={time => setFromTime(time)}
                    register={register}
                    errors={errors}
                />
            </Grid>
            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ margin: '10px 0px', width: '80%' }}
            >
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={activityDependence}
                            onChange={handleCheckboxChange}
                            sx={{
                                color: 'black',
                                '&.Mui-checked': {
                                    color: 'black',
                                },
                            }}
                        />
                    }
                    label="Activity Dependence"
                />
            </Grid>
            {activityDependence && (
                <>
                    <Grid
                        item
                        xs={12}
                        style={{ margin: '10px 0px', width: '80%' }}
                    >
                        <Controller
                            name="module"
                            control={control}
                            render={({ field }) => (
                                <CustomModuleFormControl
                                    label="Module"
                                    name="module"
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={moduleOptions}
                                    errors={errors}
                                />
                            )}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        style={{ margin: '10px 0px', width: '80%' }}
                    >
                        <Controller
                            name="activity"
                            control={control}
                            render={({ field }) => (
                                <CustomActivityFormControl
                                    label="Activity"
                                    name="activity"
                                    value={field.value}
                                    onChange={field.onChange}
                                    errors={errors}
                                    options={activityOptions}
                                />
                            )}
                        />
                    </Grid>
                </>
            )}
        </Grid>
    );

    const actions = (
        <>
            <CustomButton
                onClick={handleSubmit(onSubmit)}
                backgroundColor="#F56D3B"
                borderColor="#F56D3B"
                color="#FFFFFF"
                style={{
                    textTransform: 'none',
                }}
            >
                Submit
            </CustomButton>
        </>
    );

    return (
        <ReusableDialog
            open={open}
            handleClose={handleClosePopup}
            title="Prerequisites"
            content={content}
            actions={actions}
        />
    );
};

export default PrerequisitesPopup;
