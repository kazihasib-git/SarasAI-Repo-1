import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import Header from '../../../Header/Header';
import Sidebar from '../../../Sidebar/Sidebar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import editIcon_White from '../../../../assets/editIcon_White.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    addQuestionToCategory,
    getWolQuestionCategoryWise,
    getWolTestConfig,
    getWolTestConfigCategoryWise,
    handleIdToSubmitSelectedQuestions,
    handleOpenSelectCategoryQuestions
} from '../../../../redux/features/adminModule/coachingTools/wol/wolSlice';

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

const WOLTestConfigSelectQuestions = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [totalQuestions, setTotalQuestions] = useState(0);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const { wolCategoryData, wolTestConfig, wolTestConfigCategoryWise } =
        useSelector(state => state.wol);

    const [category, setCategory] = useState([]);

    useEffect(() => {
        dispatch(getWolTestConfigCategoryWise());
    }, [dispatch]);

    useEffect(() => {
        if (wolTestConfigCategoryWise.data) {
            setTotalQuestions(wolTestConfigCategoryWise.data.total_questions);
            setSelectedQuestions(
                wolTestConfigCategoryWise.data.selected_questions
            );
            setCategory(wolTestConfigCategoryWise.data.questions);
        } else {
            setCategory();
        }
    }, [wolTestConfigCategoryWise.data]);

    const handleSelectQuestions = (cat_id, id , total_ques) => {

        const categoryInfo = {cat_id ,total_ques} ; 
        console.log("CategoryInfo  ::>", categoryInfo)
        dispatch(getWolQuestionCategoryWise(cat_id));
        dispatch(handleIdToSubmitSelectedQuestions(id));
        dispatch(handleOpenSelectCategoryQuestions(categoryInfo)) ; 
        navigate('/WolselectQuestions');
    };


    
    const handleSubmit = e => {
        e.preventDefault();
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
                    <p
                        style={{
                            fontSize: '40px',
                            fontWeight: 200,
                            justifyContent: 'center',
                            fontFamily: 'ExtraLight',
                        }}
                    >
                        Wheel Of Life Test Config
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
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ marginBottom: '20px' }}
                >
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#1A1E3D',
                                fontSize: '24px',
                                fontWeight: 500,
                                fontFamily: 'Medium',
                            }}
                            component="h4"
                            gutterBottom
                        >
                            Total Questions: {totalQuestions}
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: '#1A1E3D',
                                fontSize: '24px',
                                fontWeight: 500,
                                fontFamily: 'Medium',
                            }}
                            component="h4"
                            gutterBottom
                        >
                            Selected Questions: {selectedQuestions}
                        </Typography>
                    </Box>

                    <CustomButton
                        type="submit"
                        active={true}
                        variant="contained"
                        onClick={() => navigate('/WOLTestConfig')}
                        sx={{
                            borderRadius: '50px',
                            padding: '14px 30px',
                            margin: '0 8px',
                            textTransform: 'none',
                        }}
                    >
                        <img
                            src={editIcon_White}
                            backgroundColor="white"
                            alt="edit icon"
                        />
                        Edit Config
                    </CustomButton>
                </Box>

                <TableContainer sx={{ padding: 2 }} component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontFamily: 'Medium' }}>
                                    S. No.
                                </TableCell>
                                <TableCell style={{ fontFamily: 'Medium' }}>
                                    Wheel Of Life Category
                                </TableCell>
                                <TableCell style={{ fontFamily: 'Medium' }}>
                                    No. of Questions
                                </TableCell>
                                <TableCell style={{ fontFamily: 'Medium' }}>
                                    Action
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {category.map((category, index) => (
                                <TableRow
                                    key={category.id}
                                    sx={{
                                        '&:last-child td, &:last-child th': {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        style={{ fontFamily: 'Regular' }}
                                    >
                                        {index + 1}
                                    </TableCell>
                                    <TableCell
                                        style={{ fontFamily: 'Regular' }}
                                    >
                                        {category.wol_category_name}
                                    </TableCell>
                                    <TableCell
                                        style={{ fontFamily: 'Regular' }}
                                    >
                                        {category.selected_question_count}/
                                        {category.number_of_questions_for_total}
                                    </TableCell>
                                    <TableCell
                                        style={{ fontFamily: 'Regular' }}
                                    >
                                        <CustomButton
                                            variant="contained"
                                            sx={{
                                                borderRadius: '50px',
                                                padding: '8px 16px',
                                                margin: '0 8px',
                                                textTransform: 'none',
                                                fontFamily: 'Regular',
                                                backgroundColor: '#FEEBE3',
                                            }}
                                            onClick={() =>
                                                handleSelectQuestions(
                                                    category.wol_category_id,
                                                    category.id,
                                                    category.number_of_questions_for_total
                                                )
                                            }
                                        >
                                            Select Questions
                                        </CustomButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* <Box display="flex" mt={2}>
                    <CustomButton
                        type="submit"
                        active={true}
                        variant="contained"
                        sx={{
                            borderRadius: '50px',
                            padding: '18px 30px',
                            margin: '0 8px',
                        }}
                    >
                        Submit
                    </CustomButton>
                </Box> */}
            </Box>
        </>
    );
};

export default WOLTestConfigSelectQuestions;
