import React from 'react';
import Vimeo from '@u-wave/react-vimeo';
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
                    height: '75vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 0, // Remove padding to make the video fill the dialog
                }}
            >
                <Vimeo
                    video={videoUrl}
                    autoplay
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                />
            </DialogContent>
        </Dialog>
    );
};

export default VideoPopup;
