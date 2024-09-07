import React, { useState } from 'react';
import Vimeo from '@u-wave/react-vimeo';
import ReactPlayer from 'react-player';
import { Dialog, DialogContent, IconButton, CircularProgress, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const VideoPopup = ({ open, videoUrl, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleReady = () => {
        setLoading(false); // Stop loading when the video is ready
    };

    const handleError = (err) => {
        setLoading(false); // Stop loading in case of an error
        setError('video uploading on vimeo in progress...');
        console.error("Vimeo player error:", err); // Log the error for debugging
    };
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                style: {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative', // Make sure to use relative positioning
                },
            }}
        >
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme => theme.palette.grey[500],
                    zIndex: 1, // Ensure the button is above the video
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent
                dividers={false}
                sx={{
                    position: 'relative',
                    height: '100%', // Make the DialogContent take up the entire height
                    width: '100%', // Make the DialogContent take up the entire width
                    padding: 0, // Remove padding to make the video fill the dialog
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {/* <ReactPlayer
                    video={videoUrl}
                    playing
                    controls
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                /> */}
                {loading && !error && (
                    <CircularProgress sx={{ position: 'absolute' }} /> // Show loading spinner
                )}
                
                {error && (
                    <Typography color="error" variant="h6" sx={{ textAlign: 'center' }}>
                        {error} {/* Display error message */}
                    </Typography>
                )}

                {!error && (
                    <Vimeo
                        key={videoUrl}  // Forces re-render when videoUrl changes
                        video={videoUrl}
                        autoplay
                        onReady={handleReady}
                        onError={handleError}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default VideoPopup;
