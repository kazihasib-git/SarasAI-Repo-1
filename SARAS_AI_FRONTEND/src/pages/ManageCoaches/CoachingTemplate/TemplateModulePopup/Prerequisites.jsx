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
    console.log('Pre Req Data :', prereqModuleData, prereqActivityData);

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
    // const [moduleData, setModuleData] = useState([]);
    const [moduleOptions, setModuleOptions] = useState([]);
    const [activityOptions, setActivityOptions] = useState([]);
    const [fromTime, setFromTime] = useState();

    const { coachTemplatesId } = useSelector(state => state.coachTemplate);

    useEffect(() => {
        if (prereqModuleData && prereqModuleData.id) {
            dispatch(getCoachTemplateModuleId(prereqModuleData.id));
    const { coachTemplatesId } = useSelector((state) => state.coachTemplate)
    
    useEffect(() => {   
        if(prereqModuleData && prereqModuleData.template_id){
            dispatch(getCoachTemplateModuleId(prereqModuleData.template_id));
        }
    }, [dispatch, prereqModuleData]);

    useEffect(() => {
        console.log('COACH TEMPLATE DATTA :', coachTemplatesId);
        if (
            coachTemplatesId &&
            coachTemplatesId.modules &&
            coachTemplatesId.modules.length > 0
        ) {
            console.log('MODULE DATA :', coachTemplatesId);
            const options = coachTemplatesId.modules.map(module => ({
                value: module.id,
                label: module.module_name,
            }));
            setModuleOptions(options);
        }
    }, [coachTemplatesId]);

    useEffect(() => {
        const selectedModuleId = watch('module');
        console.log('Selected Module Id :', selectedModuleId);
        if (
            selectedModuleId &&
            coachTemplatesId &&
            coachTemplatesId.modules &&
            coachTemplatesId.modules.length > 0
        ) {
            const selectedModule = coachTemplatesId.modules.find(
                mod => mod.id === selectedModuleId
            );
            console.log('Selected Module :', selectedModule);
            if (selectedModule) {
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
        if (activityDependence) {
            if (!data.module) {
                toast.error('Module is required.');
                return false;
            }
            if (!data.activity || data.activity.length === 0) {
                toast.error('At least one activity is required.');
                return false;
            }
        }

        if (!data.lockUntil) {
            toast.error('Lock Until Date is required.');
            return false;
        }

        if (!fromTime) {
            toast.error('From Time is required.');
            return false;
        }

        return true;
    };

    const onSubmit = data => {
        if (!validate(data)) {
            return; // Prevent further execution if validation fails
        }

        const prereqData = {
            module_id: prereqModuleData.id,
            activity_id: prereqActivityData.id,
            template_id: prereqModuleData.template_id,
            lock_until_date: data.lockUntil,
            time: fromTime,
            data:
                data &&
                data.activity &&
                data.activity.map(act => ({
                    prerequisite_activity_id: act,
                    prerequisite_module_id: data.module,
                })),
        };
        dispatch(addPrerequisites(prereqData)).then(() => {
            dispatch(getCoachTemplateModuleId(prereqModuleData.id));
        });
        console.log('prereq formdata: -->', prereqData);
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
                        <CustomDateField
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
                    validation={{
                        required: 'From Time is required',
                    }}
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
                                    onChange={e => {
                                        field.onChange(e);
                                        // handleCoachChange(e); // Uncomment if you have a handleCoachChange function
                                    }}
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
                                    onChange={e => {
                                        field.onChange(e);
                                        // handleCoachChange(e); // Uncomment if you have a handleCoachChange function
                                    }}
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
