import React, { useState, useEffect } from 'react';
import { Upload } from 'tus-js-client';
import Vimeo from '@u-wave/react-vimeo';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Typography,
} from '@mui/material';
const VIMEO_ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN;

const VideoUploadDialog = ({ open, onClose }) => {
    const [file, setFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');

    const handleFileChange = event => {
        setFile(event.target.files[0]);
    };

    const uploadVideoToVimeo = async () => {
        const requestData = {
            upload: {
                approach: 'tus',
                size: file?.size?.toString(),
            },
            name: 'Your Video Name',
            description: 'Your Video Description',
        };

        try {
            const response = await fetch('https://api.vimeo.com/me/videos', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}`,
                    Accept: 'application/vnd.vimeo.*+json;version=3.4',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error('Failed to upload video. Please try again.');
            }

            const vimeoResultData = await response.json();
            const uploadLink = vimeoResultData?.upload?.upload_link;

            if (uploadLink) {
                const upload = new Upload(file, {
                    endpoint: uploadLink,
                    retryDelays: [0, 3000, 5000, 10000, 20000],
                    metadata: {
                        filename: file.name,
                        filetype: file.type,
                    },
                    onError: function (error) {
                        console.error(error);
                        setError('Upload failed. Please try again.');
                    },
                    onProgress: function (bytesUploaded, bytesTotal) {
                        const percentage = (bytesUploaded / bytesTotal) * 100;
                        setUploadProgress(percentage);
                    },
                    onSuccess: async function () {
                        setVideoUrl(vimeoResultData.link);
                    },
                });

                upload.start();
            }
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    useEffect(() => {
        if (file) {
            uploadVideoToVimeo();
        }
    }, [file]);

    return (
        <div className="App">
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>Upload Video</DialogTitle>
                <DialogContent>
                    {error && <Typography color="error">{error}</Typography>}
                    <input type="file" onChange={handleFileChange} />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <LinearProgress
                            variant="determinate"
                            value={uploadProgress}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default VideoUploadDialog;
