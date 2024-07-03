import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AddEdit.css";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Grid,
  DialogActions,
  Divider,
} from "@mui/material";
import AssignStudents from "../../AssignStudents";
import AssignBatches from "../../AssignBatches";
import CustomFormControl from "../../../CustomFields/CustomFromControl";
import CustomTextField from "../../../CustomFields/CustomTextField";
import {
  transformedTimeZones,
  genders,
  qualificationOptions,
  validateTimeZone,
} from "../../../CustomFields/FormOptions";
import CustomDateField from "../../../CustomFields/CustomDateField";
import {
  closeSuccessPopup,
  createTA,
  openAssignBatches,
  openAssignStudents,
  openSuccessPopup,
  updateTA,
  accessTaName,
} from "../../../../redux/features/taModule/taSlice";
import SubmitPopup from "../../SubmitPopup";
import dayjs from "dayjs";
import AvatarInput from "../../../CustomFields/AvatarInput";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const AddEditTA = ({ data }) => {

  const { register, handleSubmit, control, setValue, watch, formState: { errors }, } = useForm({
    defaultValues: {
      gender: "",
      time_zone: "",
      highest_qualification: "",
      date_of_birth: null,
    },
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [taName, setTAName] = useState();
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useDispatch();
  const { tas, successPopup, assignStudentOpen, assignBatchOpen } = useSelector((state) => state.taModule);

  console.log("data to be edit", data);

  useEffect(() => {
    if (data) {
      const formattedDate = dayjs(dateOfBirth).format("YYYY-MM-DD HH:mm:ss");
      console.log("DATE birth : ", data.date_of_birth);

      //convert base64 image to blob
      if (data.profile_picture) {
        const byteCharacters = atob(data.profile_picture);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        const blobUrl = URL.createObjectURL(blob);

        console.log('blobUrl', blobUrl);
        setSelectedImage(blobUrl);
    }


      setValue("name", data.name);
      // setValue("short_description", data.short_description);
      setValue("username", data.username);
      setValue("password", data.password);
      setValue("location", data.location);
      setValue("address", data.address);
      setValue("pincode", data.pincode);
      setValue("time_zone", data.time_zone);
      setValue("gender", data.gender);
      setValue("email", data.email);
      setValue("date_of_birth", data.date_of_birth);
      setValue("highest_qualification", data.highest_qualification);
      setValue("about_me", data.about_me);
      setPhoneNumber(data.phone)
    }
  }, [data, setValue, setSelectedImage]);

  const handleAssignStudents = () => {
    // dispatch(closeSuccessPopup());
    dispatch(openAssignStudents());
  };

  const handleAssignBatches = () => {
    //dispatch(closeSuccessPopup());
    dispatch(openAssignBatches());
  };

  // const handleClose = () => {
  //   dispatch(closeSuccessPopup());
  // };

  const onSubmit = async (formData) => {
    console.log("Data", formData);
    setTAName(formData.name);
    const formattedDate = dayjs(dateOfBirth).format("YYYY-MM-DD HH:mm:ss");
    formData.date_of_birth = formattedDate;
    formData.phone = phoneNumber;
    const base64Data = selectedImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    formData.profile_picture = base64Data;

    // //convert selected image to base64
    // if (selectedImage instanceof Blob || selectedImage instanceof File) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     console.log("reader.result", reader.result);
    //     formData.profile_picture = reader.result;
    //   };
    //   reader.readAsDataURL(selectedImage);  // This line ensures the reader reads the Blob/File
    // } else {
    //   console.log("Selected Image", selectedImage);
    //   formData.profile_picture = selectedImage;
    // }


    if (data) {
      console.log("editing Id", data.id, "editing Data", formData);
      const updateRes = await dispatch(
        updateTA({ id: data.id, data: formData })
      ).unwrap();
      // console.log("Updated : ", updateRes);
      // console.log("Updated Name: ", updateRes.username);
      dispatch(openSuccessPopup());
      dispatch(accessTaName(updateRes.username));
    } else {
      const createRes = await dispatch(createTA(formData)).unwrap();
      console.log("Created : ", createRes);
      console.log("Created Name: ", createRes.ta);
      dispatch(openSuccessPopup());
      dispatch(accessTaName(createRes.ta));
    }
  };

  const nameValue = watch("name", "");
  const aboutMeValue = watch("about_me", "");

  console.log("selected Image", selectedImage)

  return (
    <Box sx={{ p: 3 }}>
      <DialogActions>
        <Grid container alignItems="center">
          {data ? (
            <>
              <Grid item xs>
                <Typography variant="h4" sx={{ mb: 4, font: "Nunito Sans" }}>
                  Edit TA
                </Typography>
              </Grid>
              <Grid item>
                <Box display="flex" justifyContent="center" gap={2}>
                  <Button
                    variant="contained"
                    onClick={handleAssignStudents}
                    sx={{
                      backgroundColor: "#F56D3B",
                      color: "white",
                      height: "60px",
                      width: "201px",
                      borderRadius: "50px",
                      textTransform: "none",
                      padding: "18px 30px",
                      fontWeight: "700",
                      fontSize: "16px",
                      "&:hover": {
                        //backgroundColor: '#D4522A'
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
                      height: "60px",
                      width: "194px",
                      border: "2px solid #F56D3B",
                      borderRadius: "50px",
                      textTransform: "none",
                      fontWeight: "700",
                      fontSize: "16px",
                      padding: "18px 30px",
                      "&:hover": {
                        //backgroundColor: '#F56D3B',
                        //color: 'white'
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
          bgcolor: "white",
          borderRadius: 2,
          p: 4,
          boxShadow: 3,
          mx: "auto",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box display="flex " alignItems="center" mb={4}>
            <AvatarInput
              name="profile_picture"
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
              {/* <CustomTextField
                label="Short Description"
                name="short_description"
                placeholder="Enter About TA"
                register={register}
                validation={{ required: "About Me is required" }}
                errors={errors}
                multiline
                rows={2}
                sx={{ width: "400px" }}
              /> */}
            </Box>
          </Box>
          <Divider sx={{ mt: 2, mb: 4, border: "1px solid #C2C2E7" }} />


          <Grid container spacing={6}>
            <Grid item xs={12} sm={6} md={4}>
              {/* TA name */}
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
                    // value: /^[A-Za-z0-9_]+$/,
                    message:
                      "Username can only contain letters, numbers, and underscores",
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
            )}

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
                label="Location"
                name="location"
                placeholder="Enter Location"
                register={register}
                validation={{
                  required: "Location is required",
                  maxLength: {
                    value: 200,
                    message: "Location must not exceed 200 characters",
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
            {/* {console.log("DATA : ", data)} */}

            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="time_zone"
                control={control}
                rules={{ required: "Time Zone is required" }}
                render={({ field }) => (
                  <CustomFormControl
                    label="Time Zone"
                    name="time_zone"
                    value={field.value}
                    onChange={field.onChange}
                    errors={errors}
                    options={transformedTimeZones}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Gender is required" }}
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
              <CustomDateField
                label="Date Of Birth"
                value={data ? data.date_of_birth : dateOfBirth}
                onChange={setDateOfBirth}
                name="dateOfBirth"
                register={register}
                validation={{ required: "Date of birth is required" }}
                errors={errors}
                sx={{ width: "100%" }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Controller
                name="highest_qualification"
                control={control}
                rules={{ required: "Highest Qualification is required" }}
                render={({ field }) => (
                  <>
                    {console.log("DATA highest_qualification : ", field.value)}
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
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                }}
                errors={errors}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <PhoneInput
                name='phone'
                country={"in"}
                value={phoneNumber}
                onChange={(phone) => setPhoneNumber(phone)}
                containerStyle={{ width: "100%" }}
                inputStyle={{
                  width: "100%",
                  borderRadius: "50px",
                  borderColor: "#D0D0EC",
                  height: "60px",
                }}
                buttonStyle={{
                  borderRadius: "50px 0 0 50px",
                  height: "60px",
                  paddingLeft: "10px",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label="About Me"
                name="about_me"
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

        {/* <ReusableDialog
          open={successPopup}
          handleClose={() => dispatch(closeSuccessPopup())}
          title= {`${taName} successfully created.`}
          actions={actions}
        /> */}
        {successPopup && <SubmitPopup />}
        {assignStudentOpen && <AssignStudents />}
        {assignBatchOpen && <AssignBatches />}
      </Box>
    </Box>
  );
};

export default AddEditTA;
