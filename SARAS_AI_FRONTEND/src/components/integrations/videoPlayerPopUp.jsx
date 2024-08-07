import React from 'react';
//import Vimeo from '@u-wave/react-vimeo';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const VideoPopup = ({ open, videoUrl, onClose }) => {
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
                <ReactPlayer
                    video={videoUrl}
                    playing
                    controls
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                />
                {/* <Vimeo
                    video={videoUrl}
                    autoplay
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                /> */}
            </DialogContent>
        </Dialog>
    );
};

export default VideoPopup;
