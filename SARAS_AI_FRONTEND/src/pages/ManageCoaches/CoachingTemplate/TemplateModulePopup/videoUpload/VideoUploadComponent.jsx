// import React, { useState, useEffect } from 'react';
// import { Grid, Button, Typography, Box, LinearProgress } from '@mui/material';
// import * as tus from 'tus-js-client';
// import { styled } from '@mui/material/styles';
// const VIMEO_ACCESS_TOKEN = process.env.REACT_APP_VIMEO_ACCESS_TOKEN;

// const UploadBox = styled(Box)(({ theme }) => ({
//     border: '2px dashed #ccc',
//     borderRadius: '10px',
//     padding: '10px', // Reduced padding
//     textAlign: 'center',
//     color: '#888',
//     cursor: 'pointer',
//     marginTop: '10px',
//     '&:hover': {
//         borderColor: '#888',
//     },
// }));

// const VideoUploadComponent = () => {
//     const [file, setFile] = useState(null);
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [videoUrl, setVideoUrl] = useState('');

//     const handleFileChange = event => {
//         setFile(event.target.files[0]);
//     };

//     const uploadVideoToVimeo = async () => {
//         const folderId = '21774130';
//         const requestData = {
//             upload: {
//                 approach: 'tus',
//                 size: file?.size?.toString(),
//             },
//             name: 'Your Video Name',
//             description: 'Your Video Description',
//         };
//         try {
//             const response = await fetch('https://api.vimeo.com/me/videos', {
//                 method: 'POST',
//                 headers: {
//                     Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}`,
//                     Accept: 'application/vnd.vimeo.*+json;version=3.4',
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestData),
//             });

//             if (response.status === 401) {
//                 console.error('Unauthorized: Check your Vimeo access token.');
//                 throw new Error('Unauthorized: Check your Vimeo access token.');
//             }

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 console.error('Failed to upload video:', errorData);
//                 throw new Error('Failed to upload video. Please try again.');
//             }

//             const vimeoResultData = await response.json();
//             const uploadLink = vimeoResultData?.upload?.upload_link;
//             const videoUri = vimeoResultData?.uri;

//             if (uploadLink) {
//                 const upload = new tus.Upload(file, {
//                     endpoint: `https://api.vimeo.com/me/videos`,
//                     uploadUrl: uploadLink,
//                     retryDelays: [0, 3000, 5000, 10000, 20000],
//                     metadata: {
//                         filename: file.name,
//                         filetype: file.type,
//                     },
//                     onError: function (error) {
//                         console.error(error);
//                         setError('Upload failed. Please try again.');
//                     },
//                     onProgress: function (bytesUploaded, bytesTotal) {
//                         const percentage = (bytesUploaded / bytesTotal) * 100;
//                         setUploadProgress(percentage);
//                     },
//                     onSuccess: async function () {
//                         const moveResponse = await fetch(
//                             `https://api.vimeo.com/me/projects/${folderId}/videos/${videoUri.split('/')[2]}`,
//                             {
//                                 method: 'PUT',
//                                 headers: {
//                                     Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}`,
//                                     Accept: 'application/vnd.vimeo.*+json;version=3.4',
//                                     'Content-Type': 'application/json',
//                                 },
//                             }
//                         );

//                         if (!moveResponse.ok) {
//                             throw new Error('Failed to move video to project.');
//                         }

//                         setVideoUrl(vimeoResultData.link);
//                     },
//                 });

//                 upload.start();
//             }
//         } catch (error) {
//             console.error(error);
//             setError(error.message);
//         }
//     };

//     useEffect(() => {
//         if (file) {
//             uploadVideoToVimeo();
//         }
//     }, [file]);

//     return (
//         <Grid item xs={12} sm={6} md={6} style={{ width: '80%' }}>
//             <UploadBox>
//                 <Typography>Drag and Drop the file</Typography>
//                 <Typography>Or</Typography>
//                 <input
//                     type="file"
//                     accept="video/*"
//                     style={{ display: 'none' }}
//                     id="upload-button"
//                     onChange={handleFileChange}
//                 />
//                 <label htmlFor="upload-button">
//                     <Button
//                         variant="text"
//                         sx={{ color: '#F56D3B' }}
//                         component="span"
//                     >
//                         Browse File
//                     </Button>
//                 </label>
//             </UploadBox>
//             {file && (
//                 <div>
//                     <Typography>{file.name}</Typography>
//                     <Button
//                         onClick={uploadVideoToVimeo}
//                         variant="contained"
//                         color="primary"
//                     >
//                         Upload
//                     </Button>
//                     {uploadProgress > 0 && uploadProgress < 100 && (
//                         <LinearProgress
//                             variant="determinate"
//                             value={uploadProgress}
//                         />
//                     )}
//                 </div>
//             )}
//         </Grid>
//     );
// };

// export default VideoUploadComponent;

import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography, Box, LinearProgress } from '@mui/material';
import * as tus from 'tus-js-client';
import { styled } from '@mui/material/styles';

const VIMEO_ACCESS_TOKEN = process.env.REACT_APP_VIMEO_ACCESS_TOKEN;

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

const VideoUploadComponent = ({ onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');

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
                throw new Error('Failed to upload video.');
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
                    onError: error => {
                        setError('Upload failed. Please try again.');
                    },
                    onProgress: (bytesUploaded, bytesTotal) => {
                        const percentage = (bytesUploaded / bytesTotal) * 100;
                        setUploadProgress(percentage);
                    },
                    onSuccess: async () => {
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

                        setUploadProgress(100);
                        onUploadComplete(vimeoResultData.link);
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
        <Grid item xs={12} sm={6} md={6} style={{ width: '80%' }}>
            <UploadBox>
                <Typography>Drag and Drop the file</Typography>
                <Typography>Or</Typography>
                <input
                    type="file"
                    accept="video/*"
                    style={{ display: 'none' }}
                    id="upload-button"
                    onChange={handleFileChange}
                />
                <label htmlFor="upload-button">
                    <Button
                        variant="text"
                        sx={{ color: '#F56D3B' }}
                        component="span"
                    >
                        Browse File
                    </Button>
                </label>
            </UploadBox>
            {file && (
                <div>
                    <Typography>{file.name}</Typography>
                    <Button
                        onClick={uploadVideoToVimeo}
                        variant="contained"
                        color="primary"
                    >
                        Upload
                    </Button>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <LinearProgress
                            variant="determinate"
                            value={uploadProgress}
                        />
                    )}
                </div>
            )}
            {error && <Typography color="error">{error}</Typography>}
        </Grid>
    );
};

export default VideoUploadComponent;
