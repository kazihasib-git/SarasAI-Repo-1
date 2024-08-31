import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Radio,
    styled,
    Typography,
} from '@mui/material';
import Header from '../../../Header/Header';
import Sidebar from '../../../Sidebar/Sidebar';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import editIcon_White from '../../../../assets/editIcon_White.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { set } from 'date-fns';
import {
    addQuestionToCategory,
    getWolTestConfigCategoryWise,
    handleIdToSubmitSelectedQuestions,
    selectedQuestionsList,
    handleOpenSelectCategoryQuestions
} from '../../../../redux/features/adminModule/coachingTools/wol/wolSlice';
import { toast } from 'react-toastify';

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

const WOLSelectQuestions = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        wolQuestionCategoryWise,
        categoryIdToSubmitSelectedQuestions,
        selectedQuestionsListData,
        categoryInfo
    } = useSelector(state => state.wol);
    
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categoryId, setCategoryId] = useState();


    console.log('categoryInfo' , categoryInfo)

    function stripHtml(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || '';
    }

    useEffect(() => {
        if (
            wolQuestionCategoryWise.data &&
            wolQuestionCategoryWise.data.length > 0
        ) {
            console.log(
                'Wol Question Category Wise',
                wolQuestionCategoryWise.data
            );
            const transformedData = wolQuestionCategoryWise.data.map(data => ({
                ...data,
                question: stripHtml(data.question),
            }));
            setQuestions(transformedData);
            setTotalQuestions(wolQuestionCategoryWise.data.length);
            setSelectedCategory(
                wolQuestionCategoryWise.data[0].wol_category_name
            );
            setCategoryId(wolQuestionCategoryWise.data[0].id);
        }
    }, [wolQuestionCategoryWise.data]);

    useEffect(() => {
        dispatch(selectedQuestionsList(categoryIdToSubmitSelectedQuestions));
    }, [dispatch]);

    console.log('selectedQuestionsListData', selectedQuestionsListData);
    
     useEffect(() => {
        if (
            selectedQuestionsListData.data &&
            selectedQuestionsListData.data.length > 0
        ) {
            setSelectedQuestions(
                selectedQuestionsListData.data.map(
                    question => question.wol_question_id
                )
            );
        }
    }, [selectedQuestionsListData]);

    const handleSelectQuestion = (questionId) => {
        setSelectedQuestions((prevSelected) => {
            if (prevSelected.includes(questionId)) {
                return prevSelected.filter(id => id !== questionId);
            } else {
                if (prevSelected.length >= categoryInfo.total_ques) {
                    toast.error("You can only select a maximum of 5 questions.");
                    return prevSelected;
                }
                return [...prevSelected, questionId];
            }
        });
    };
    

    const handleSubmit = () => {
        const selectedQuestionsOfCategory = questions.filter(question =>
            selectedQuestions.includes(question.id)
        );

        const data = {
            wol_test_category_id: categoryIdToSubmitSelectedQuestions,
            wol_questions_id: selectedQuestionsOfCategory.map(
                question => question.id
            ),
        };
        dispatch(addQuestionToCategory(data)).then(() => {
            dispatch(getWolTestConfigCategoryWise());
            dispatch(handleIdToSubmitSelectedQuestions(''));
        });
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
                        <Box display="flex" alignItems="center" padding="16px">
                            <ArrowBackIosIcon
                                style={{
                                    fontSize: '25px',
                                    marginBottom: '17px',
                                    marginRight: '10px',
                                    cursor: 'pointer',
                                }}
                                onClick={() =>
                                    navigate('/WOLTestConfigSelectQuestions')
                                }
                            />
                            <p
                                style={{
                                    fontSize: '20px',
                                    fontWeight: 500,
                                    justifyContent: 'center',
                                    fontFamily: 'Medium',
                                }}
                            >
                                Total Questions: {totalQuestions}
                            </p>
                        </Box>

                        <Typography
                            variant="h6"
                            sx={{
                                color: '#1A1E3D',
                                fontSize: '16px',
                                fontWeight: 500,
                                fontFamily: 'Medium',
                            }}
                            component="h4"
                            gutterBottom
                        >
                            Wheel of life category: {selectedCategory}
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: '#1A1E3D',
                                fontSize: '16px',
                                fontWeight: 500,
                                fontFamily: 'Medium',
                            }}
                            component="h4"
                            gutterBottom
                        >
                            Selected Questions: {selectedQuestions.length}/
                            {categoryInfo.total_ques}
                        </Typography>
                    </Box>

                    <CustomButton
                        type="submit"
                        active={true}
                        onClick={() => navigate('/WOLTestConfig')}
                        variant="contained"
                        sx={{
                            borderRadius: '50px',
                            padding: '14px 30px',
                            margin: '0 8px',
                            textTransform: 'none',
                            fontFamily: 'Bold',
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

                {questions.slice(0, totalQuestions).map((question, index) => (
                    <Box
                        key={question.id}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={2}
                        p={2}
                        border="1px solid #E0E0E0"
                        borderRadius="8px"
                    >
                        <Box flex="1">
                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#1A1E3D',
                                    fontWeight: 500,
                                    mb: 1,
                                    fontFamily: 'Medium',
                                }}
                            >
                                Q{index + 1}: {question.question}
                            </Typography>
                        </Box>
                        <Box>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectedQuestions.includes(
                                            question.id
                                        )}
                                        onChange={() =>
                                            handleSelectQuestion(question.id)
                                        }
                                    />
                                }
                                label=""
                            />
                        </Box>
                    </Box>
                ))}

                <Box display="flex" mt={2}>
                    <CustomButton
                        variant="contained"
                        active={true}
                        sx={{
                            borderRadius: '50px',
                            padding: '8px 16px',
                            margin: '0 8px',
                            textTransform: 'none',
                            fontFamily: 'Bold',
                            textTransform: 'none',
                        }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </CustomButton>
                </Box>
            </Box>
        </>
    );
};

export default WOLSelectQuestions;
