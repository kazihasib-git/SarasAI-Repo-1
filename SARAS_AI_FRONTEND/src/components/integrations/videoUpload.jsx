// import React, { useState, useEffect } from 'react';
// import { Upload } from 'tus-js-client';
// //import Vimeo from '@u-wave/react-vimeo';
// import {
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     LinearProgress,
//     Typography,
// } from '@mui/material';
// const VIMEO_ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN;

// // VIMEO_CLIENT_ID=34b3c9cb5fac58425122c4b84e79e2832e857b14
// // VIMEO_CLIENT_SECRET=DRGOd/6GfDDDUHu7hFakjCq0ka4vWz93J5Dgoy4epBP1x8OyVnkw6xGsl8KnDzEMIFcJ65425x20DRhGOCl36oL9f8jvun4l0LxygKDEMTEe4PM2ShJOJYmB2xwL0kpd
// // VIMEO_ACCESS_TOKEN=7d93a352d9b20c0a2141bf3269860df5

// const VideoUploadDialog = ({ open, onClose }) => {
//     const [file, setFile] = useState(null);
//     const [videoUrl, setVideoUrl] = useState('');
//     const [uploadProgress, setUploadProgress] = useState(0);
//     const [error, setError] = useState('');

//     const handleFileChange = event => {
//         setFile(event.target.files[0]);
//     };

//     const uploadVideoToVimeo = async () => {
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

//             if (!response.ok) {
//                 throw new Error('Failed to upload video. Please try again.');
//             }

//             const vimeoResultData = await response.json();
//             const uploadLink = vimeoResultData?.upload?.upload_link;

//             if (uploadLink) {
//                 const upload = new Upload(file, {
//                     endpoint: uploadLink,
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
//         <div className="App">
//             <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//                 <DialogTitle>Upload Video</DialogTitle>
//                 <DialogContent>
//                     {error && <Typography color="error">{error}</Typography>}
//                     <input type="file" onChange={handleFileChange} />
//                     {uploadProgress > 0 && uploadProgress < 100 && (
//                         <LinearProgress
//                             variant="determinate"
//                             value={uploadProgress}
//                         />
//                     )}
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={onClose} color="primary">
//                         Close
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// };

// export default VideoUploadDialog;

import React, { useState, useEffect } from 'react';
import { Upload } from 'tus-js-client';
//import Vimeo from '@u-wave/react-vimeo';
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
const VIMEO_ACCESS_TOKEN = process.env.REACT_APP_VIMEO_ACCESS_TOKEN;

// VIMEO_CLIENT_ID=34b3c9cb5fac58425122c4b84e79e2832e857b14
// VIMEO_CLIENT_SECRET=DRGOd/6GfDDDUHu7hFakjCq0ka4vWz93J5Dgoy4epBP1x8OyVnkw6xGsl8KnDzEMIFcJ65425x20DRhGOCl36oL9f8jvun4l0LxygKDEMTEe4PM2ShJOJYmB2xwL0kpd
// VIMEO_ACCESS_TOKEN=7d93a352d9b20c0a2141bf3269860df5

const VideoUploadDialog = ({ open, onClose }) => {
    const [file, setFile] = useState(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');

    const handleFileChange = event => {
        setFile(event.target.files[0]);
    };

    console.log("VIMEO_ACCESS_TOKEN", VIMEO_ACCESS_TOKEN)

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

            if (uploadLink) {
                const upload = new Upload(file, {
                    endpoint: uploadLink,
                    uploadUrl : uploadLink,
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
                        console.log("Link :", vimeoResultData.link)
                        setVideoUrl(vimeoResultData.link);
                        // TODO : NEED TO CALL BACKEND API FOR UPLOAD RECOREDED SESSION

                        // TODO : NEED TO TRACK THE STATUS OF VIDEO after uploading unitl it is uploaded succesfully show  show a box displaying that uploading in progress. 

                        
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
                <IconButton
                    onClick={onClose}
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
                    <Button onClick={onClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default VideoUploadDialog;
