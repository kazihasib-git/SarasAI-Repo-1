import React, { useState } from 'react';
import { Avatar, IconButton, Box } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { toast } from 'react-toastify';

const AvatarInput = ({ selectedImage, setSelectedImage, disabled }) => {
    const handleFileChange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        if (file.type !== 'image/jpeg' && 
            file.type !== 'image/png' && 
            file.type !== 'image/jpg') {
            toast.error('Please upload a valid image file.');
            return;
        }

        reader.onloadend = () => {
            setSelectedImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box position="relative" display="inline-flex" flexDirection="column">
            <Avatar src={selectedImage} sx={{ width: 124, height: 124 }} />
            <input
                type="file"
                id="profilePicture"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
                disabled={disabled}
            />
            {!disabled && (
                <label
                    htmlFor="profilePicture"
                    style={{ position: 'absolute', bottom: 4, right: -12 }}
                >
                    <IconButton
                        component="span"
                        style={{ backgroundColor: '#F56D3B', color: 'white' }}
                    >
                        <PhotoCamera />
                    </IconButton>
                </label>
            )}
        </Box>
    );
};

export default AvatarInput;
