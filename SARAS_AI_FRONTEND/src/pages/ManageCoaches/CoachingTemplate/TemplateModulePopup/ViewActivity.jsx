import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid } from '@mui/material';
import ReusableDialog from '../../../../components/CustomFields/ReusableDialog';
import CustomTextField from '../../../../components/CustomFields/CustomTextField';
import CustomFormControl from '../../../../components/CustomFields/CustomFromControl';
import CustomDateField from '../../../../components/CustomFields/CustomDateField';
import {Button} from '@mui/material';
import { useForm } from 'react-hook-form';


// Custom button component for consistent styling
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


// Component for Video/PDF/Link Activity
const VideoPdfActivity = ({ activity, name, fileName}) => {

    const {
        formState: { errors },
    } = useForm();

  return (
  <Grid container justifyContent="center">
    <Grid item xs={12} sm={6} md={6} style={{ margin: '10px 0', width: '80%' }}>
    <CustomFormControl
        label="Activity Type"
        name="activityType"
        value={name}
        options={[{ value: 'video', label: 'video'}, {value: 'pdf', label: 'pdf'}, {value: 'link', label:'link' }]}
        errors={errors}
    />
    </Grid>
    {/* <Grid item xs={12} style={{ margin: '10px 0', width: '80%' }}>
      <p>{fileName}</p>
    </Grid> */}
  </Grid>
)};

// Component for Session Activity
const SessionActivity = ({ activity, name }) => {

  const {
    formState: { errors },
  } = useForm();


  return(
  <Grid container justifyContent="center">
    <Grid item xs={12} sm={6} md={6} style={{ margin: '10px 0', width: '80%' }}>
        <CustomFormControl
            label="Activity Type"
            name="activityType"
            value={name}
            options={[{ value: 'Wheel of Life', label: 'test'}, {value:'Core Value', label: 'test'}, {value:'Belief', label: 'test'}, {value: 'Virtual meet', label: 'Virtual meet'}]}
            errors={errors}
        /> 
    </Grid>
    {/* <Grid item xs={12} sm={6} md={6} style={{ margin: '10px 0', width: '80%' }}>
      <CustomFormControl
        label="Coach"
        value={activity.details.coach}
        options={[{ value: 'Coach 1', label: 'Coach 1' }]}
      />
    </Grid>
    <Grid item xs={12} sm={6} md={6} style={{ margin: '10px 0', width: '80%' }}>
      <CustomDateField label="Date" value={activity.details.date} />
    </Grid>
    <Grid item xs={12} sm={6} md={6} style={{ margin: '10px 0', width: '80%' }}>
      <CustomTextField
        label="From Time"
        value={activity.details.fromTime}
        type="time"
      />
    </Grid>
    <Grid item xs={12} sm={6} md={6} style={{ margin: '10px 0', width: '80%' }}>
      <CustomTextField label="To Time" value={activity.details.toTime} type="time" />
    </Grid>
    <Grid item xs={12} sm={6} md={6} style={{ margin: '10px 0', width: '80%' }}>
      <CustomFormControl
        label="Time Zone"
        value={activity.details.timeZone}
        options={[{ value: 'GMT+5:30', label: 'GMT+5:30' }]}
      />
    </Grid> */}
  </Grid>
)};

// Main Popup Component
const ViewActivityPopup = ({ open, onClose, activity }) => {
   console.log('.............',activity);


  const renderContent = () => {
    switch (activity.id) { 
      case 1:
      case 2:
      case 3:
        return <VideoPdfActivity fileName={activity} name={activity.activity_type.type_name} />;
      case 4:
      case 5:
      case 6:
      case 7:
        return <SessionActivity details={activity} name={activity.type_name} />;
      default:
        return null;
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <ReusableDialog
      open={open}
      handleClose={handleClose}
      title="View Activity"
      content={renderContent()}
    />
  );
};

export default ViewActivityPopup;
