import { Box, Button, Container, Typography, Paper } from '@mui/material'
import React, { useState } from 'react'
import Header from '../../Header/Header'
import Sidebar from '../../Sidebar/Sidebar'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom'

const WOLInstructions = () => {
    const [value, setValue] = useState();
    const [editData, setEditData] = useState(false)

    const handleEditWOLInstructions = () => {
        setEditData(true)
    }

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['link'], //, 'image', 'video'],
            ['clean'],
            [{ 'undo': 'undo' }, { 'redo': 'redo' }] // Add undo and redo buttons
        ],
        history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
        }
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ];


    return (
        <>
            <Header />
            <Sidebar />
            <Container maxWidth="md" sx={{ mt: 4, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {editData ? "Edit Instructions" : "Wheel of Life Instructions"}
                    </Typography>
                    {!editData && (
                        <Button variant="contained" color="primary" onClick={handleEditWOLInstructions}>
                            Edit
                        </Button>
                    )}
                </Box>
                {editData ? (
                    <>
                        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                            <ReactQuill
                                value={value}
                                onChange={setValue}
                                modules={modules}
                                formats={formats}
                            />
                        </Paper>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                            <Button variant="contained" color="primary">
                                Update
                            </Button>
                        </Box>

                    </>
                ) : (
                    <Typography variant="body1" gutterBottom>
                        1. Use the statement provided on each category to help you think through how satisfied you are in each of your areas of life.
                        2. Rate each statement on a scale from 1 to 10, where 1 means "Strongly Disagree" and 10 means "Strongly Agree".
                        3. After completing, visualize your ratings on the Wheel of Life chart to assess your current satisfaction in each area.
                        4. Reflect on the areas with lower scores and think about actionable steps you can take to improve them.
                    </Typography>
                )}
            </Container>
        </>
    )
}

export default WOLInstructions