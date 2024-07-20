import React, { useEffect, useState } from "react";
import Header from "../../../components/Header/Header";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  addWOLTestConfig,
  getWOLCategory,
} from "../../../redux/features/coachingTools/wol/wolSlice";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import CustomFormControl from "../../CustomFields/CustomFromControl";
import { Controller, useForm } from "react-hook-form";

const CustomButton = styled(Button)(({ theme, active }) => ({
  borderRadius: "50px",
  border: "1px solid #F56D3B",
  color: active ? "#fff" : "#F56D3B",
  backgroundColor: active ? "#F56D3B" : "#FFF",
  padding: "8px 16px",
  margin: "0 8px",
  "&:hover": {
    backgroundColor: "#F56D3B",
    color: "#fff",
    borderColor: "#F56D3B",
  },
}));

const WOLTestConfig = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wolCategoryData } = useSelector((state) => state.wol);
  const [edit, setEdit] = useState(false);
  const [selectedNumberOfWolCategories, setSelectedNumberOfWolCategories] =
    useState();
  const [numberOfWolCategoriesOptions, setNumberOfWolCategoriesOptions] =
    useState([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    console.log("calling api....");
    dispatch(getWOLCategory());
  }, [dispatch]);

  useEffect(() => {
    if (wolCategoryData.data && wolCategoryData.data.length > 0) {
      const numberOfWolCategories = Array.from(
        { length: wolCategoryData.data.length },
        (_, i) => ({
          value: i + 1,
          label: i + 1,
        }),
      );
      setNumberOfWolCategoriesOptions(numberOfWolCategories);
    }
  }, [wolCategoryData]);

  const WOLCategoriesOptions =
    wolCategoryData.data && wolCategoryData.data.length > 0
      ? wolCategoryData.data.map((item) => ({
          value: item.id,
          label: item.name,
        }))
      : [];

  // 1 to 10 options in a dropdown
  const numberOfQuestions = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: i + 1,
  }));

  console.log("WOLCategoriesOptions", WOLCategoriesOptions);

  const onSubmit = (data) => {
    console.log(data);
    setEdit(true);
    setSelectedNumberOfWolCategories(data["Number of WOL Categories"]);
    dispatch(getWOLCategory());
  };

  const onFormSubmit = (formData) => {
    console.log("onFormSubmit", formData);

    const data = {
      number_of_categories: selectedNumberOfWolCategories,
      categories: Array.from(
        { length: selectedNumberOfWolCategories },
        (_, i) => ({
          wol_category_id: formData[`category_name_${i}`],
          number_of_questions: formData[`no_of_questions_${i}`],
        }),
      ),
    };

    dispatch(addWOLTestConfig(data));
    // .then(() => {
    //     navigate('/WOLTestConfigSelectQuestions');
    // });

    navigate("/WOLTestConfigSelectQuestions");
  };

  return (
    <>
      <Header />
      <Sidebar />
      <Box
        display="flex"
        justifyContent="space-between"
        marginTop={3}
        alignItems="center"
      >
        <Box display="flex" alignItems="center" padding="16px">
          <ArrowBackIosIcon
            style={{ fontSize: "25px", marginBottom: "17px" }}
            onClick={() => navigate("/wheel-of-life")}
          />
          <Typography
            variant="h1"
            sx={{ fontSize: "44px", marginLeft: "16px" }}
          >
            Wheel of Life Test Config
          </Typography>
        </Box>
      </Box>
      <Container
        sx={{
          mt: 2,
          mb: 2,
          backgroundColor: "white",
          borderRadius: 2,
          minHeight: 160,
          padding: 2,
          maxWidth: "md",
          width: "100%",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2}>
            {numberOfWolCategoriesOptions && (
              <Grid item xs={12} md={4}>
                <Controller
                  name="Number of WOL Categories"
                  control={control}
                  rules={{ required: "Number of WOL Categories is required" }}
                  render={({ field }) => (
                    <CustomFormControl
                      label="Number of WOL Categories"
                      name="Number of WOL Categories"
                      {...field}
                      errors={errors}
                      options={numberOfWolCategoriesOptions}
                    />
                  )}
                />
              </Grid>
            )}
            <Grid item xs={12} md={4}>
              <CustomButton type="submit" active={true} variant="contained">
                Submit
              </CustomButton>
            </Grid>
          </Grid>
        </form>
      </Container>

      {edit && (
        <Container
          sx={{
            mt: 2,
            mb: 2,
            backgroundColor: "white",
            borderRadius: 2,
            minHeight: 160,
            padding: 2,
            maxWidth: "md",
            width: "100%",
          }}
        >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>S. No.</TableCell>
                  <TableCell align="left">Wheel of Life Category</TableCell>
                  <TableCell align="left">No. of Questions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: selectedNumberOfWolCategories }).map(
                  (_, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell align="left">
                        <Controller
                          name={`category_name_${index}`}
                          control={control}
                          rules={{ required: "Category name is required" }}
                          render={({ field }) => (
                            <CustomFormControl
                              label="Category Name"
                              name={`category_name_${index}`}
                              {...field}
                              errors={errors}
                              options={WOLCategoriesOptions}
                            />
                          )}
                        />
                      </TableCell>
                      <TableCell align="left">
                        <Controller
                          name={`no_of_questions_${index}`}
                          control={control}
                          rules={{
                            required: "Number of questions is required",
                          }}
                          render={({ field }) => (
                            <CustomFormControl
                              label="No. of Questions"
                              name={`no_of_questions_${index}`}
                              {...field}
                              errors={errors}
                              options={numberOfQuestions}
                            />
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" mt={2}>
            <CustomButton
              onClick={handleSubmit(onFormSubmit)}
              active={true}
              variant="contained"
              sx={{
                borderRadius: "50px",
                padding: "18px 30px",
                margin: "0 8px",
              }}
            >
              Submit
            </CustomButton>
          </Box>
        </Container>
      )}
    </>
  );
};

export default WOLTestConfig;
