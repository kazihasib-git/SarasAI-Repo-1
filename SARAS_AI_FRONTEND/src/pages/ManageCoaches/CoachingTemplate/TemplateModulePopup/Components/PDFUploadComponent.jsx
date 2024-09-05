import React, { useState } from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { uploadpdf } from '../../../../../redux/features/adminModule/coach/LinkActivitySlice';

const UploadBox = styled(Box)(({ theme }) => ({
    border: '2px dashed #ccc',
    borderRadius: '10px',
    padding: '10px',
    textAlign: 'center',
    color: '#888',
    cursor: 'pointer',
    marginTop: '10px',
    '&:hover': {
        borderColor: '#888',
    },
}));

const PDFUploadComponent = () => {
    const dispatch = useDispatch();
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = event => {
        event.preventDefault();

        // Extract file from either the input element or the drag event
        let file = event.target?.files?.[0] || event.dataTransfer?.files?.[0];

        if (file) {
            // Validate that the file is a PDF
            if (file.type !== 'application/pdf') {
                setError('Please upload a valid PDF file.');
                setFileName('');
                return;
            }

            // Clear error if the file is valid
            setError('');
            setFileName(file.name);
            console.log('File selected:', file);

            const formData = new FormData();
            formData.append('pdf_file', file);

            dispatch(uploadpdf(formData));
        }
    };

    return (
        <Grid item xs={12} sm={6} md={6} style={{ width: '80%' }}>
            <UploadBox
                onDrop={handleFileChange} // Handles file drop
                onDragOver={event => event.preventDefault()}
            >
                <Typography>Drag and Drop the file</Typography>
                <Typography>Or</Typography>
                <input
                    type="file"
                    style={{ display: 'none' }}
                    id="upload-button"
                    onChange={handleFileChange}
                    accept="application/pdf" // Restrict file types to PDF
                />
                <label htmlFor="upload-button">
                    <Button
                        variant="text"
                        sx={{ color: '#F56D3B' }}
                        component="span"
                        style={{ textTransform: 'none' }}
                    >
                        Browse File
                    </Button>
                </label>
                {fileName && (
                    <Typography variant="body2" style={{ marginTop: '10px' }}>
                        Selected file: {fileName}
                    </Typography>
                )}
                {error && (
                    <Typography
                        variant="body2"
                        color="error"
                        style={{ marginTop: '10px' }}
                    >
                        {error}
                    </Typography>
                )}
            </UploadBox>
        </Grid>
    );
};

export default PDFUploadComponent;
