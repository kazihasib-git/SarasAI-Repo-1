import React, { act } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid } from '@mui/material';
import ReusableDialog from '../../../../components/CustomFields/ReusableDialog';
import CustomTextField from '../../../../components/CustomFields/CustomTextField';
import CustomFormControl from '../../../../components/CustomFields/CustomFromControl';
import CustomDateField from '../../../../components/CustomFields/CustomDateField';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import  { useState } from 'react';
import { linkActivity } from '../../../../redux/features/adminModule/coach/LinkActivitySlice';
import PDFUploadComponent from './Components/PDFUploadComponent';
import LinkActivityPopup from './LinkActivity';
import { getCoachTemplateModuleId } from '../../../../redux/features/adminModule/coach/coachTemplateSlice';

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
              fontSize: '14px', // Reduced font size
              borderRadius: '50px',
              padding: '8px 16px', // Reduced padding
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
const VideoPdfActivity = ({ handleClose, name, fileName ,activity_id, activity_type_id, activity_url, template_id }) => {
  const dispatch = useDispatch();
const {
  handleSubmit,
  control,
  reset,
  formState: { errors },
} = useForm();

const onSubmit = async data => {

  const payload = {
      activity_id: activity_id, // Ensure this value is correctly set
      activity_type_id: activity_type_id,
      link: activity_url, // Add other fields if needed
  };
  try {
      await dispatch(linkActivity(payload))
          .unwrap()
          .then(() => {
              // Refetch the data to update the table
              dispatch(getCoachTemplateModuleId(template_id));
          });
      handleClose();
  } catch (error) {
      console.error('Failed to link activity:', error);
  }
};
  const [showFileName, setShowFileName] = useState(true);

  const handleRemoveFileName = () => {
    setShowFileName(false);
  };

  return (
    <Grid container justifyContent="center">
      <Grid
        item
        xs={12}
        sm={6}
        md={6}
        style={{ margin: '10px 0', width: '80%' }}
      >
        <CustomFormControl
          label="Activity Type"
          name="activityType"
          value={name}
          options={[
            { value: name, label: name },
          ]}
          errors={errors}
        />
      </Grid>

      {showFileName ? (
        <Grid
          item
          xs={12}
          style={{
            margin: '10px 0',
            width: '80%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <button
            onClick={handleRemoveFileName}
            style={{
              background: '#F56D3B',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                color: 'white',
                fontSize: '16px',
                lineHeight: '16px',
              }}
            >
              &times;
            </span>
          </button>
          <p style={{ margin: 0 }}>{fileName.activity_url}</p>
        </Grid>
      ) : (
       
      
        <Grid 
        item 
        xs={12} 
        style={{ 
          marginTop: '20px', // Add margin for spacing from the previous item
          display: 'flex', 
          justifyContent: 'center' // Center horizontally
        }}
      >
        <PDFUploadComponent />
       
      </Grid>
      
   
      )}
       <CustomButton
                onClick={handleSubmit(onSubmit)}
                backgroundColor="#F56D3B"
                borderColor="#F56D3B"
                color="#FFFFFF"
                style={{ textTransform: 'none' }} // Inline style to transform text to lowercase
            >
                Submit
            </CustomButton>
    </Grid>
    
  );
};

// Component for Session Activity
const SessionActivity = ({ activity, name }) => {
    const {
        formState: { errors },
    } = useForm();

    return (
        <Grid container justifyContent="center">
            <Grid
                item
                xs={12}
                sm={6}
                md={6}
                style={{ margin: '10px 0', width: '80%' }}
            >
                <CustomFormControl
                    label="Activity Type"
                    name="activityType"
                    value={name}
                    options={[
                      { value: name , label: name },
                    ]}
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
    );
};

// Main Popup Component
const ViewActivityPopup = ({ open, onClose, activity, templateId }) => {
    console.log('............. Activity', activity);
    const activity_type = activity.activity_type;
    console.log("activitygid",activity.id);
    console.log("activitygid",activity.activity_type_id);
    console.log("activityurl",activity.activity_url)
    console.log('atcijdcidcdcdic', activity.activity_type?.type_name);
    const renderContent = () => {
        switch (activity.activity_type.id) {
            case 1:
            case 2:
            case 3:
                return (
                    <VideoPdfActivity
                        handleClose={onClose}
                        fileName={activity}
                        activity_id={activity.id}
                        template_id={templateId}
                        activity_type_id={activity.activity_type_id}
                        activity_url={activity.activity_url}
                        name={activity.activity_type?.type_name}
                    />
                );
            case 4:
            case 5:
            case 6:
            case 7:
                return (
                    <SessionActivity
                        details={activity}
                        name={activity.activity_type?.type_name}
                    />
                );
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
