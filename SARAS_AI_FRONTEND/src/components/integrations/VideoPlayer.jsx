// src/components/VideoUploadAndPlayer.js
import React, { useState, useEffect } from 'react';
import { Upload } from 'tus-js-client';
import Vimeo from '@u-wave/react-vimeo';
import VideoPopup from './videoPlayerPopUp';

const VideoUploadAndPlayer = ({
    file,
    name,
    description,
    VIMEO_ACCESS_TOKEN,
}) => {
    const [videoUrl, setVideoUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    console.log(videoUrl);

    const uploadVideoToVimeo = async () => {
        const requestData = {
            upload: {
                approach: 'tus',
                size: file?.size?.toString(),
            },
            name: name,
            description: description,
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
                throw new Error(`Failed to upload video. Please try again.`);
            }

            const vimeoResultData = await response.json();
            const uploadLink = vimeoResultData?.upload?.upload_link;

            if (uploadLink) {
                const upload = new Upload(file, {
                    endpoint: 'https://api.vimeo.com/me/videos',
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
                        console.log('success');
                        setTimeout(() => {
                            setVideoUrl(`${vimeoResultData?.player_embed_url}`);
                            setOpen(true);
                        }, 60000);
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
        <div className="video-upload-and-player">
            {error && <p className="error">{error}</p>}
            {uploadProgress > 0 && uploadProgress < 100 && (
                <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>
            )}
            <VideoPopup open={open} onClose={handleClose} videoUrl={videoUrl} />
        </div>
    );
};

export default VideoUploadAndPlayer;
