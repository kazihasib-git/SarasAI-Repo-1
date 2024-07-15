import React from 'react'
import { useEffect, useState } from "react";
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Box, Button, Container,InputLabel,TextField,styled,MenuItem } from '@mui/material'
import CustomFormControl from '../../CustomFields/CustomFromControl';
import ReactQuill from 'react-quill'
import { useDispatch, useSelector } from 'react-redux';
import {seteditwolQuestionData ,getWOLCategory } from '../../../redux/features/coachingTools/wol/wolSlice';


const AddEditWOLQuestions = () => {
    const [questionValue, setQuestionValue] = useState("");
    const [categories, setCategories] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { editwolQuestionData, wolCategoryData } = useSelector((state) => state.wol);


    const { control, handleSubmit, formState: { errors } } = useForm(
        {
            defaultValues: {
                category: editwolQuestionData ? editwolQuestionData.wol_category_id: "",
            }
        }
    );

    useEffect(() => {
        dispatch(getWOLCategory());
        const convertedCategories = wolCategoryData.data.map(category => ({
          value: category.id.toString(),
          label: category.name
        }));
        setCategories(convertedCategories);
      }, []);


      const QuillContainer = styled('div')(({ theme }) => ({
        position: 'relative',
        '& .ql-container': {
            borderColor: '#D0D0EC',
            borderBottomLeftRadius: '30px',
            borderBottomRightRadius: '30px',
            '&.ql-container.ql-snow.ql-focused': {
                borderColor: '#FF6D3B', // Change border color on focus
            },
        },
        '& .ql-toolbar': {
            borderColor: '#D0D0EC',
            borderTopLeftRadius: '30px',
            borderTopRightRadius: '30px',
            color: '#D0D0EC',
            '&:hover': {
                borderColor: '##FF6D3B',
            },
            '& .ql-formats button': {
                color: '#D0D0EC',
            },
            '& .ql-picker': {
                color: '#D0D0EC',
            },
        },
        '& .ql-toolbar.ql-snow': {
            borderBottom: 'none',
        }
    }));
    

    const StyledLabel = styled(InputLabel)(({ theme }) => ({
        position: 'absolute',
        top: '-25px',
        left: '20px',
        backgroundColor: 'white',
        padding: '0 8px',
        color: '#1A1E3D',
        fontSize: '14px',
        fontWeight: 500,
        zIndex: 1,
    }));


    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link'],
            ['clean']
        ]
    };

    const formats = [
        'bold', 'italic', 'underline',
        'align', 'link'
    ];

    const onSubmit = async (data) => {
        console.log(data)
        if (editwolQuestionData) {
            //setCategoryName(editData.name);
            console.log('Edit')
            try {
                //const updatedWOL = await dispatch(updateWOLQuestion({ id: editwolQuestionData.id, data: { question: questionValue.question, wol_category_id: data.category } })).unwrap();
            } catch (error) {
                console.log(error.message) //TODO: Show toast message
            }
        }
        else {
            try {
                //const createdWOL = await dispatch(createWOLQuestion({ question: questionValue.question, wol_category_id: data.category })).unwrap();
            } catch (error) {
                console.log(error.message) //TODO: Show toast message
            }
        }
        //await dispatch(getWOLQuestions());
        dispatch(seteditwolQuestionData(null))
        navigate('/coaching-tools/wheel-of-life/questions')
    }


    

    
    useEffect(() => {
        if (editwolQuestionData) {
            setQuestionValue({
            category: editwolQuestionData.wol_category_id,
            question: editwolQuestionData.question
        })
        }
    }
    , [editwolQuestionData]);

    
    return (
       <>
            <Header />
            <Sidebar />
            <Box display="flex" justifyContent="space-between" marginTop={3} alignItems={"center"}>
                <Box display="flex" alignItems="center" padding="16px">
                <ArrowBackIosIcon
                        style={{ fontSize: "25px", marginBottom: "16px", marginRight:"10px", cursor: "pointer"}}
                        onClick={() => navigate(-1)}
                    />
                    <p style={{ fontSize: "40px",fontWeight: 200 , justifyContent: "center" }}>
                        {editwolQuestionData ? "Edit Question" : "Add Question"}
                    </p>
                </Box>
            </Box>
            <Container
                sx={{ 
                    backgroundColor: 'white', 
                    borderRadius: 2,
                    padding :2
                }}
            >

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Box sx={{ marginBottom: 2 ,width : '40%'}}>
                <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                    <CustomFormControl
                        label="Wheel of Life Category"
                        name="category"
                        value={field.value}
                        onChange={field.onChange}
                        errors={errors}
                        options={categories}
                    />
                    )}
                />
                </Box>

                <Box sx={{marginTop: '50px', position: 'relative' , padding :'2px' }}>
                    <StyledLabel>
                        Question
                    </StyledLabel>
                    <QuillContainer>
                        <ReactQuill
                            theme="snow"
                            value={questionValue.question}
                            onChange={(e) => setQuestionValue({ ...questionValue, question: e  })}
                            modules={modules}
                            formats={formats}
                            style={{ height: '100px', backgroundColor: 'transparent' }}
                            placeholder='Enter Your Question'
                        />
                        
                    </QuillContainer>
                </Box>

                <Box className='inputBtnContainer' sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 8 }}>
                    {editwolQuestionData ?
                    (<button className='buttonContainer' onClick={() => setQuestionValue({})}> Update </button> ) :
                    (<button className='buttonContainer' onClick={() => setQuestionValue({})}> Submit </button> )
                    }
                </Box>
            </form>
            </Container>
       </>
    )
}

export default AddEditWOLQuestions