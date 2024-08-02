import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { styled } from '@mui/material/styles';

// Styled components
const QuillContainer = styled('div')(({ theme }) => ({
    position: 'relative',
    height: 'calc(100% - 80px)', // Reduce height to show the border
    // overflow: 'hidden',
    '& .ql-container': {
        height: '100%',
        border: '1.95px solid #D0D0EC',
        borderBottomLeftRadius: '30px',
        borderBottomRightRadius: '30px',
        overflow: 'auto', // Allow scrolling within Quill editor
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
            borderColor: '#FF6D3B', // Change border color on hover
        },
        '& .ql-formats button': {
            color: '#D0D0EC',
        },
        '& .ql-picker': {
            color: '#D0D0EC',
        },
        '&::after': {
            content: '""',
            display: 'block',
            borderBottom: '2px solid #E1E1F4',
            marginTop: '5px', // Space between toolbar and border
        },
    },
    '& .ql-toolbar.ql-snow': {
        borderBottom: 'none',
    },
}));

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }],
        ['link'],
        ['clean'],
    ],
};

const formats = ['bold', 'italic', 'underline', 'align', 'link'];

const SessionNotes = ({ open, onClose }) => {
    const [editorContent, setEditorContent] = useState('');

    useEffect(() => {
        if (open) {
            setEditorContent('');
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    width: '500px',
                    height: '366px',
                    padding: '20px 30px 20px 30px', // Adjust padding to avoid clipping
                    borderRadius: '10px',
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translate(-50%, 0)', // Center the dialog horizontally
                    '@media (max-width: 600px)': {
                        width: '90%',
                        left: '5%',
                        transform: 'translate(0, 0)', // Adjust the position for smaller screens
                    },
                },
            }}
        >
            <DialogTitle>
                <h4>Session Notes</h4>
                <IconButton
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        color: '#F56D3B',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%', // Full height of the dialog
                    padding: 0,
                }}
            >
                <QuillContainer
                    style={{
                        marginBottom: '20px', // Space between text field and button
                    }}
                >
                    <ReactQuill
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        value={editorContent}
                        onChange={setEditorContent}
                        placeholder="Enter your notes here..."
                        style={{
                            height: 'calc(100% - 20px)', // Reduce height to show border
                            width: '100%',
                        }}
                    />
                </QuillContainer>
                <Button
                    onClick={onClose}
                    style={{
                        backgroundColor: '#F56D3B',
                        color: '#fff',
                        textTransform: 'none',
                        borderRadius: '50px',
                        border: '2px solid #F56D3B',
                        alignSelf: 'center', // Center the button
                        marginTop: '30px', // Space between text field and button
                    }}
                >
                    Save
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default SessionNotes;
