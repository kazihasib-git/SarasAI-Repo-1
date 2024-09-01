import React, { useState, useEffect } from 'react';
import * as tus from 'tus-js-client';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';

import { uploadSessionRecording as uploadCoachSessionRecording } from '../../redux/features/coachModule/coachmenuprofileSilce';
import {
    getTaCallRecords,
    uploadSessionRecording as uploadTASessionRecording,
} from '../../redux/features/taModule/tamenuSlice';

const VIMEO_ACCESS_TOKEN = process.env.REACT_APP_VIMEO_ACCESS_TOKEN;

const VideoUploadDialog = ({ open, onClose, role, selectedId }) => {
    const [file, setFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    //const selectedCallId = useSelector(state => state.taMenu.selectedCall);

    const handleFileChange = event => {
        setFile(event.target.files[0]);
    };

    const uploadVideoToVimeo = async () => {
        const folderId = '21774130';
        const requestData = {
            upload: {
                approach: 'tus',
                size: file?.size?.toString(),
            },
            name: 'nwe Video',
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

            if (response.status === 401) {
                console.error('Unauthorized: Check your Vimeo access token.');
                throw new Error('Unauthorized: Check your Vimeo access token.');
            }

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to upload video:', errorData);
                throw new Error('Failed to upload video. Please try again.');
            }

            const vimeoResultData = await response.json();
            const uploadLink = vimeoResultData?.upload?.upload_link;
            const videoUri = vimeoResultData?.uri;

            if (uploadLink) {
                const upload = new tus.Upload(file, {
                    endpoint: `https://api.vimeo.com/me/videos`,
                    uploadUrl: uploadLink,
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
                        const moveResponse = await fetch(
                            `https://api.vimeo.com/me/projects/${folderId}/videos/${videoUri.split('/')[2]}`,
                            {
                                method: 'PUT',
                                headers: {
                                    Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}`,
                                    Accept: 'application/vnd.vimeo.*+json;version=3.4',
                                    'Content-Type': 'application/json',
                                },
                            }
                        );

                        if (!moveResponse.ok) {
                            throw new Error('Failed to move video to project.');
                        }

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
    
    useEffect(() => {
        if (videoUrl && selectedId) {

            const sessionUrl = async () => {
                try {
                    if (role === 'COACH') {
                        await dispatch(
                            uploadCoachSessionRecording({
                                id: selectedId,
                                session_recording_url: videoUrl,
                            })
                        ).unwrap();
                    } else if (role === 'TA') {
                        await dispatch(
                            uploadTASessionRecording({
                                id: selectedId,
                                session_recording_url: videoUrl,
                            })
                        )
                            .unwrap()
                            .then(() => {
                                dispatch(getTaCallRecords());
                            });
                    }

                    setUploadProgress(100);
                    //onClose();
                } catch {
                    setError('Update failed. Please try again.');
                }
            };

            sessionUrl();
        }
    }, [videoUrl, role, selectedId, dispatch, onClose]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Upload Video</DialogTitle>
            <IconButton
                onClick={() => {
                    onClose();

                    //setFile(null);
                    setVideoUrl('');
                    setUploadProgress(0);
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
                <Button
                    onClick={() => {
                        onClose();
                        setFile(null);
                        setVideoUrl('');
                        setUploadProgress(0);
                    }}
                    sx={{
                        backgroundColor: '#F56D3B',
                        color: 'white',
                        textTransform: 'none',
                        borderRadius: '50px',
                        '&:hover': {
                            backgroundColor: '#F56D3B', // Ensure the hover color remains the same
                        },
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VideoUploadDialog;
