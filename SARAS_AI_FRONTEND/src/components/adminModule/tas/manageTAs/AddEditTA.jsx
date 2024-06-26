import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Grid,
  DialogActions,
  Divider,
  TextField,
} from "@mui/material";
import AssignStudents from "../../AssignStudents";
import AssignBatches from "../../AssignBatches";
import CustomFormControl from "../../../CustomFields/CustomFromControl";
import CustomTextField from "../../../CustomFields/CustomTextField";
import ReusableDialog from "../../../CustomFields/ReusableDialog";
import AvatarInput from "../../../CustomFields/AvatarInput";
import {
  timeZones,
  genders,
  qualificationOptions,
  validateTimeZone,
} from "../../../CustomFields/FormOptions";
import CustomDateField from "../../../CustomFields/CustomDateField";
import { createTA } from "../../../../redux/features/taModule/taSlice";

const AddEditTA = ({ data, edit }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [assignStudent, setAssignStudent] = useState(false);
  const [assignBatch, setAssignBatch] = useState(false);

  const dispatch = useDispatch();

  console.log("data to be edit", data)

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("username", data.username);
      setValue("password", data.password);
      setValue("address", data.address);
      setValue("pinCode", data.pinCode);
      setValue("timezone", data.timezone);
      setValue("gender", data.gender);
      setValue("date_of_birth", data.date_of_birth);
      setValue("highest_qualification", data.highest_qualification);
      setValue("aboutMe", data.aboutMe);
      setSelectedImage(data.avatar);
    }
  }, [data, setValue]);

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

  const onSubmit = (formData) => {
    console.log("Data", formData);
    setOpen(true);
    if (data) {
      dispatch(updateTA({ id: data.id, ...formData }));
      setEdit(false)
    } else {
      dispatch(createTA(formData));
    }
  };

  const nameValue = watch("name", "");
  const aboutMeValue = watch("aboutMe", "");

  const actions = (
    <>
      <Button
        variant="contained"
        onClick={handleAssignStudents}
        sx={{
          backgroundColor: "#F56D3B",
          color: "white",
          borderRadius: "50px",
          textTransform: "none",
          padding: "10px 20px",
          fontWeight: "700",
          fontSize: "16px",
          "&:hover": {
            backgroundColor: "#D4522A",
          },
        }}
      >
        Assign Students
      </Button>
      <Button
        variant="outlined"
        onClick={handleAssignBatches}
        sx={{
          backgroundColor: "white",
          color: "#F56D3B",
          border: "2px solid #F56D3B",
          borderRadius: "50px",
          textTransform: "none",
          fontWeight: "700",
          fontSize: "16px",
          padding: "10px 20px",
          "&:hover": {
            backgroundColor: "#F56D3B",
            color: "white",
          },
        }}
      >
        Assign Batches
      </Button>
    </>
  );

  return (
    <Box sx={{ p: 3 }}>
      <DialogActions>
        <Grid container alignItems="center">
          {edit ? (
            <>
              <Grid item xs>
                <Typography variant="h4" sx={{ mb: 4, font: "Nunito Sans" }}>Edit TA</Typography>
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

      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          p: 4,
          boxShadow: 3,
          mx: "auto",
        }}
      >
        <Box display="flex " alignItems="center" mb={4}>
          <AvatarInput
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
          <Box ml={4}>
            <Typography
              variant="h5"
              sx={{
                fontSize: "24px",
                fontWeight: "600",
                font: "Nunito Sans",
                color: "#1A1E3D",
              }}
            >
              {nameValue || "Name of the TA"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "16px",
                fontWeight: "400",
                mb: 4,
                color: "#5F6383",
                font: "Nunito Sans",
              }}
            >
              {aboutMeValue || "Short Description"}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mt: 2, mb: 4, border: "1px solid #C2C2E7" }} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6} md={4}>
              <CustomTextField
                label="TA Name"
                name="name"
                placeholder="Enter TA Name"
                register={register}
                validation={{
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters long",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Name must contain only letters and spaces",
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
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 20,
                    message: "Username cannot exceed 20 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z0-9_]+$/,
                    message:
                      "Username can only contain letters, numbers, and underscores",
                  },
                }}
                errors={errors}
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
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                  maxLength: {
                    value: 20,
                    message: "Password cannot exceed 20 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
                    message:
                      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
                  },
                }}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomTextField
                label="Address"
                name="address"
                placeholder="Enter Address"
                register={register}
                validation={{
                  required: "Address is required",
                  maxLength: {
                    value: 200,
                    message: "Address must not exceed 200 characters",
                  },
                }}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomTextField
                label="PIN Code"
                name="pinCode"
                type="number"
                placeholder="Enter PIN Code"
                register={register}
                validation={{
                  required: "PIN Code is required",
                  pattern: {
                    value: /^[a-zA-Z0-9-]*$/,
                    message: "PIN Code must be alphanumeric",
                  },
                  minLength: {
                    value: 3,
                    message: "PIN Code must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 10,
                    message: "PIN Code cannot exceed 10 characters",
                  },
                }}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormControl
                label="Time Zone"
                name="timezone"
                register={register}
                validation={{ validate: validateTimeZone }}
                errors={errors}
                options={timeZones}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CustomFormControl
                label="Gender"
                name="gender"
                register={register}
                validation={{ required: "Gender is required" }}
                errors={errors}
                options={genders}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="date_of_birth"
                control={control}
                rules={{ required: "Date of birth is required" }}
                render={({ field }) => (
                  <CustomTextField
                    id="date"
                    label="Date of Birth"
                    type="date"
                    defaultValue="DD-MM-YY"
                    {...field}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <CustomFormControl
                label="Highest Qualification"
                name="highest_qualification"
                register={register}
                validation={{ required: "Highest Qualification is required" }}
                errors={errors}
                options={qualificationOptions}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label="About Me"
                name="aboutMe"
                placeholder="Enter About TA"
                register={register}
                validation={{ required: "About Me is required" }}
                errors={errors}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            style={{
              borderRadius: "50px",
              padding: "18px 30px",
              marginTop: 30,
              backgroundColor: "#F56D3B",
              height: "60px",
              width: "121px",
              fontSize: "16px",
              fontWeight: "700px",
              text: "#FFFFFF",
            }}
          >
            Submit
          </Button>
        </form>

        <ReusableDialog
          open={open}
          handleClose={handleClose}
          title="'TA' successfully created."
          actions={actions}
        />

        {assignStudent && (
          <AssignStudents open={open} handleClose={handleClose} />
        )}
        {assignBatch && <AssignBatches open={open} handleClose={handleClose} />}
      </Box>
    </Box>
  );
};

export default AddEditTA;
