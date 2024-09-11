import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    IconButton,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { styled } from '@mui/material/styles';

// Styled components
const QuillContainer = styled('div')(() => ({
    position: 'relative',
    height: 'calc(100% - 80px)',
    '& .ql-container': {
        height: '100%',
        border: '1.95px solid #D0D0EC',
        borderBottomLeftRadius: '30px',
        borderBottomRightRadius: '30px',
        overflow: 'auto',
        '&.ql-snow.ql-focused': {
            borderColor: '#FF6D3B',
        },
    },
    '& .ql-toolbar': {
        borderColor: '#D0D0EC',
        borderTopLeftRadius: '30px',
        borderTopRightRadius: '30px',
        '&:hover': {
            borderColor: '#FF6D3B',
        },
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

const formats = [
    'bold',
    'italic',
    'underline',
    'list',
    'align',
    'link',
    'clean',
];

const SessionNotes = ({ open, onClose, onSave, selectedId }) => {
    const [editorContent, setEditorContent] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (selectedId && selectedId.session_meeting_notes) {
            setEditorContent(selectedId.session_meeting_notes);
        } else {
            setEditorContent('');
        }
    }, [selectedId]);

    const handleSave = () => {
        onSave(editorContent); // Pass the richtext format content
        setIsEditMode(false); // Switch back to view mode after saving
        onClose();
    };

    const handleEdit = () => {
        setIsEditMode(true);
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                onClose();
                setIsEditMode(false); // Reset edit mode on close
            }}
            PaperProps={{
                sx: {
                    width: { xs: '90%', sm: '500px' }, // Dynamic width based on screen size
                    height: isEditMode
                        ? { xs: '80vh', sm: '500px' }
                        : { xs: '70vh', sm: '400px' }, // Dynamic height
                    padding: '20px',
                    borderRadius: '20px',
                    position: 'absolute',
                    top: { xs: '10%', sm: '20%' }, // Top positioning for small and large screens
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    overflowY: 'auto', // Add overflow to handle smaller screens
                    transition: 'height 0.3s ease',
                },
            }}
        >
            <DialogTitle style={{ position: 'relative', textAlign: 'center' }}>
                <Typography variant="h6">Session Notes</Typography>
                <IconButton
                    onClick={() => {
                        onClose();
                        setIsEditMode(false);
                    }}
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
                    padding: 0,
                    height: '100%',
                }}
            >
                {isEditMode ? (
                    <QuillContainer>
                        <ReactQuill
                            modules={modules}
                            formats={formats}
                            value={editorContent}
                            onChange={setEditorContent}
                            placeholder="Edit your notes..."
                            style={{
                                height: 'calc(100% - 20px)',
                                width: '100%',
                            }}
                        />
                    </QuillContainer>
                ) : (
                    <div
                        style={{
                            padding: '10px',
                            border: '1.95px solid #D0D0EC',
                            borderRadius: '15px',
                            minHeight: '150px',
                            overflowY: 'auto',
                            marginBottom: '20px',
                        }}
                    >
                        <Typography
                            variant="body1"
                            style={{ whiteSpace: 'pre-wrap' }}
                        >
                            {/* Render richtext with dangerouslySetInnerHTML */}
                            <div
                                dangerouslySetInnerHTML={{
                                    __html:
                                        editorContent || 'No notes available.',
                                }}
                            />
                        </Typography>
                    </div>
                )}

                <Button
                    onClick={isEditMode ? handleSave : handleEdit}
                    variant="contained"
                    style={{
                        backgroundColor: '#F56D3B',
                        color: '#fff',
                        textTransform: 'none',
                        borderRadius: '50px',
                        alignSelf: 'center',
                        padding: '10px 30px',
                        marginTop: '20px',
                    }}
                >
                    {isEditMode ? 'Save' : 'Edit'}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default SessionNotes;
