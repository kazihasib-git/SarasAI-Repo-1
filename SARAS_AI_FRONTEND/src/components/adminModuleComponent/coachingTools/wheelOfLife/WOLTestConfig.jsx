import React, { useEffect, useState } from 'react';
import Header from '../../../Header/Header';
import Sidebar from '../../../Sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import {
    addWOLTestConfig,
    getWOLCategory,
    getWolTestConfig,
} from '../../../../redux/features/adminModule/coachingTools/wol/wolSlice';
import {
    Box,
    Button,
    Grid,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import CustomFormControl from '../../../CustomFields/CustomFromControl';

const CustomButton = styled(Button)(({ theme, active }) => ({
    borderRadius: '50px',
    border: '1px solid #F56D3B',
    color: active ? '#fff' : '#F56D3B',
    backgroundColor: active ? '#F56D3B' : '#FFF',
    padding: '8px 16px',
    margin: '0 8px',
    '&:hover': {
        backgroundColor: '#F56D3B',
        color: '#fff',
        borderColor: '#F56D3B',
    },
}));

const SubmitButton = styled(CustomButton)(({ theme }) => ({
    backgroundColor: '#F56D3B',
    height: '50px',
    width: '110px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#FFFFFF',
    '&:hover': {
        backgroundColor: '#F56D3B',
    },
}));

const WOLTestConfig = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { wolCategoryData, wolTestConfig } = useSelector(state => state.wol);

    const [edit, setEdit] = useState(false);
    const [numberOfWolCategoriesOptions, setNumberOfWolCategoriesOptions] =
        useState([]);
    const [formValues, setFormValues] = useState({
        numberOfWolCategories: '',
        categories: [],
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(getWOLCategory());
        dispatch(getWolTestConfig());
    }, [dispatch]);

    useEffect(() => {
        if (wolTestConfig.data && wolTestConfig.data.length > 0) {
            const testConfig = wolTestConfig.data[0];
            setFormValues({
                numberOfWolCategories: testConfig.number_of_categories,
                categories: testConfig.test_categories.map(item => ({
                    category_name: item.wol_category_id,
                    no_of_questions: item.number_of_questions,
                })),
            });
            setEdit(true);
        }
    }, [wolTestConfig]);

    useEffect(() => {
        if (wolCategoryData.data && wolCategoryData.data.length > 0) {
            const numberOfWolCategories = Array.from(
                { length: wolCategoryData.data.length },
                (_, i) => ({
                    value: i + 1,
                    label: i + 1,
                })
            );
            setNumberOfWolCategoriesOptions(numberOfWolCategories);
        }
    }, [wolCategoryData]);

    // Generate options based on the wol_questions_count for each category
    const WOLCategoriesOptions =
        wolCategoryData.data?.map(item => ({
            value: item.id,
            label: item.name,
        })) || [];

    const getNumberOfQuestionsOptions = categoryId => {
        const category = wolCategoryData.data.find(
            cat => cat.id === categoryId
        );
        const maxQuestions = category?.wol_questions_count || 0;
        return Array.from({ length: maxQuestions }, (_, i) => ({
            value: i + 1,
            label: i + 1,
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (edit) {
            setEdit(false);
            setFormValues(prevValues => ({
                numberOfWolCategories: '',
                categories: [],
            }));
            return;
        }

        const newErrors = {};

        if (!formValues.numberOfWolCategories) {
            newErrors.numberOfWolCategories =
                'Number of WOL Categories is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setEdit(true);
        setErrors({});
    };

    const handleFormSubmit = e => {
        e.preventDefault();
        const newErrors = {};

        const categories = Array.from(
            { length: formValues.numberOfWolCategories },
            (_, i) => {
                const categoryName =
                    formValues.categories[i]?.category_name || '';
                const noOfQuestions =
                    formValues.categories[i]?.no_of_questions || '';

                if (!categoryName) {
                    newErrors[`category_name_${i}`] =
                        'Category name is required';
                }
                if (!noOfQuestions) {
                    newErrors[`no_of_questions_${i}`] =
                        'Number of questions is required';
                }

                return {
                    wol_category_id: categoryName,
                    number_of_questions: noOfQuestions,
                };
            }
        );

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const data = {
            number_of_categories: formValues.numberOfWolCategories,
            categories: categories,
        };

        dispatch(addWOLTestConfig(data));
        navigate('/WOLTestConfigSelectQuestions');
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
                        style={{
                            fontSize: '25px',
                            marginBottom: '17px',
                            marginRight: '10px',
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate('/wheel-of-life')}
                    />
                    <p style={{ fontSize: '40px', fontWeight: 200 }}>
                        Wheel Of Test Config
                    </p>
                </Box>
            </Box>
            <Box
                sx={{
                    mt: 2,
                    mb: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    minHeight: 160,
                    padding: 2,
                }}
            >
                <form onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        {numberOfWolCategoriesOptions.length > 0 && (
                            <Grid item xs={12} md={4}>
                                <CustomFormControl
                                    label="Number of WOL Categories"
                                    name="numberOfWolCategories"
                                    value={formValues.numberOfWolCategories}
                                    onChange={e =>
                                        setFormValues({
                                            ...formValues,
                                            numberOfWolCategories:
                                                e.target.value,
                                        })
                                    }
                                    errors={errors}
                                    options={numberOfWolCategoriesOptions}
                                    disabled={edit}
                                />
                                {errors.numberOfWolCategories && (
                                    <p style={{ color: 'red' }}>
                                        {errors.numberOfWolCategories}
                                    </p>
                                )}
                            </Grid>
                        )}
                        <Grid item xs={12} md={4}>
                            <CustomButton
                                type="submit"
                                active={true}
                                variant="contained"
                                sx={{
                                    borderRadius: '50px',
                                    padding: '18px 30px',
                                    margin: '0 8px',
                                    textTransform: 'none',
                                }}
                            >
                                {edit ? 'Update' : 'Submit'}
                            </CustomButton>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            {edit && (
                <form onSubmit={handleFormSubmit} noValidate>
                    <TableContainer sx={{ padding: 2 }} component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>S. No.</TableCell>
                                    <TableCell align="left">
                                        Wheel of Life Category
                                    </TableCell>
                                    <TableCell align="left">
                                        No. of Questions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.from(
                                    {
                                        length: formValues.numberOfWolCategories,
                                    },
                                    (_, index) => (
                                        <TableRow key={index}>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {index + 1}
                                            </TableCell>
                                            <TableCell align="left">
                                                <CustomFormControl
                                                    label="Category Name"
                                                    name={`category_name_${index}`}
                                                    value={
                                                        formValues.categories[
                                                            index
                                                        ]?.category_name || ''
                                                    }
                                                    onChange={e => {
                                                        const newCategories = [
                                                            ...formValues.categories,
                                                        ];
                                                        newCategories[index] = {
                                                            ...newCategories[
                                                                index
                                                            ],
                                                            category_name:
                                                                e.target.value,
                                                        };
                                                        setFormValues({
                                                            ...formValues,
                                                            categories:
                                                                newCategories,
                                                        });
                                                    }}
                                                    errors={errors}
                                                    options={
                                                        WOLCategoriesOptions
                                                    }
                                                />
                                                {errors[
                                                    `category_name_${index}`
                                                ] && (
                                                    <p style={{ color: 'red' }}>
                                                        {
                                                            errors[
                                                                `category_name_${index}`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell align="left">
                                                <CustomFormControl
                                                    label="No. of Questions"
                                                    name={`no_of_questions_${index}`}
                                                    value={
                                                        formValues.categories[
                                                            index
                                                        ]?.no_of_questions || ''
                                                    }
                                                    onChange={e => {
                                                        const newCategories = [
                                                            ...formValues.categories,
                                                        ];
                                                        newCategories[index] = {
                                                            ...newCategories[
                                                                index
                                                            ],
                                                            no_of_questions:
                                                                e.target.value,
                                                        };
                                                        setFormValues({
                                                            ...formValues,
                                                            categories:
                                                                newCategories,
                                                        });
                                                    }}
                                                    errors={errors}
                                                    options={getNumberOfQuestionsOptions(
                                                        formValues.categories[
                                                            index
                                                        ]?.category_name
                                                    )}
                                                />
                                                {errors[
                                                    `no_of_questions_${index}`
                                                ] && (
                                                    <p style={{ color: 'red' }}>
                                                        {
                                                            errors[
                                                                `no_of_questions_${index}`
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box display="flex" justifyContent="flex-start" mt={2}>
                        <SubmitButton
                            type="submit"
                            active={true}
                            variant="contained"
                            style={{ textTransform: 'none' }}
                        >
                            Submit
                        </SubmitButton>
                    </Box>
                </form>
            )}
        </>
    );
};

export default WOLTestConfig;
