import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './InternshipDetails.module.scss';
import { useStateContext } from '../../context/StateContext';
import Loader from '../common/Loader';
import { useDropzone } from 'react-dropzone';
import { API_URL } from '../../constants';
import * as tus from 'tus-js-client';
import { useRouter } from 'next/router';
import { userService } from '../../services/userService.js';

const Video = ({
    title,
    description,
    callBack,
    video,
    acceptedFileFormats,
    setLoading,
}) => {
    const { updateAdditionalStep, state, showToast } = useStateContext();
    const router = useRouter();
    // const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState({ path: null });
    const [uploadMessage, setUploadMessage] = useState('');
    const [progress, setProgress] = useState(null);
    const [uploadStarted, setUploadStarted] = useState(false);
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length > 0) {
            if (acceptedFiles?.[0]?.size > 500000000) {
                showToast(true, 'The file size must not exceed 500MB.');
                return;
            }
            setSelectedFile(acceptedFiles[0]);
        }
    }, []);
    const onDropRejected = useCallback((rejectedFiles, reason, _) => {
        if (rejectedFiles?.length > 1) {
            showToast(true, 'Only single video is allowed to upload');
            return;
        }
        if (rejectedFiles.length == 1) {
            showToast(true, 'File type is not allowed');
            return;
        }
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedFileFormats,
        maxFiles: 1,
        onDropRejected,
    });
    const uploadToVimeo = async file => {
        setLoading(true);
        setUploadMessage('uploading your video, please wait...');
        const VIMEO_ACCESS_TOKEN = 'f8603360556480fa1347a26e1c067924';
        const formData = new FormData();
        formData.append('file_data', file);
        const folderId = '21774130'; // Replace with your folder ID
        const requestData = {
            upload: {
                approach: 'tus',
                size: file?.size?.toString(),
            },
            name: state?.internship?.name, // TODO
            description: `InternShip video - ${state?.internship?.name}`, //TODO
        };
        try {
            // Step 1: Upload video file to Vimeo
            const response = await fetch('https://api.vimeo.com/me/videos', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}`,
                    Accept: 'application/vnd.vimeo.*+json;version=3.4',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error(`Failed to upload video. Please try again.`);
            }

            const vimeoResultData = await response.json();
            const uploadLink = vimeoResultData?.upload?.upload_link;
            const videoUri = vimeoResultData?.uri; // Capture the video URI

            // Step 2: If upload to Vimeo is successful, initiate tus upload
            if (uploadLink) {
                const upload = new tus.Upload(file, {
                    endPoint: `https://api.vimeo.com/me/videos`,
                    uploadUrl: uploadLink,
                    retryDelays: [0, 3000, 5000, 10000, 20000],
                    metadata: {
                        filename: file.name,
                        filetype: file.type,
                    },
                    onError: function (error) {
                        setUploadMessage(`Upload failed. Please try again.`);
                        showToast(true, 'Upload failed. Please try again.');
                        setLoading(false);
                    },
                    onProgress: function (bytesUploaded, bytesTotal) {
                        if (!uploadStarted) {
                            setUploadStarted(true);
                        }
                        const percentage = (
                            (bytesUploaded / bytesTotal) *
                            100
                        ).toFixed(2);
                        setProgress(percentage);
                        setUploadMessage(
                            `Hang tight! ${percentage}% of your file has been uploaded (${bytesUploaded} of ${bytesTotal} bytes)`
                        );
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

                        callBack(vimeoResultData?.link);
                        setUploadStarted(false);
                        setLoading(false);
                    },
                });
                upload.start();
            } else {
                throw new Error(`Failed to upload video. Please try again.`);
            }
            return vimeoResultData?.link;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };
    const uploadCv = async file => {
        const formdata = new FormData();
        formdata.append('file', file);
        setLoading(true);
        const response = await fetch(
            `${API_URL}internship/upload-resume/${state?.internship?.phone}`,
            {
                method: 'POST',
                body: formdata,
            }
        );
        if (response?.ok) {
            let data = await response?.json();
            callBack(data.url);
        }
        setLoading(false);
    };
    useEffect(() => {
        handleSubmit();
    }, [selectedFile?.path]);

    const handleSubmit = async () => {
        if (!selectedFile?.path) {
            return;
        }
        try {
            video && (await uploadToVimeo(selectedFile));
            !video && (await uploadCv(selectedFile));
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div
        // className={`flex ${styles.formContainer}`}
        >
            {/* <div className={styles.formContainerBody}> */}
            {/* <h2 className={`${styles.formHeadingUpload} Nohemi_B`}>
          Please record and upload a video sharing why you wish to pursue a
          degree in Artificial Intelligence with Saras AI Institute.
        </h2>
        <h1 className={`${styles.descriptionText} Sora_R`}>
          Duration of the video should not exceed 3 minutes i.e. 180 seconds.
        </h1> */}
            <div
                {...getRootProps()}
                className={`${styles.uploadVideo} flex justify-center items-center flex-col`}
            >
                <input {...getInputProps()} />
                <img
                    className="w-8 h-8"
                    src={'../assets/images/uploadicon.svg'}
                />
                {
                    <p className=" text-base font-normal leading-18 tracking-tighter text-left Sora_R mt-1">
                        {title}
                    </p>
                }
                {
                    <p className=" text-[#E57549] font-normal leading-18 tracking-tighter text-left Sora_R mt-2">
                        {description}
                    </p>
                }
                {selectedFile?.name && (
                    <p className=" text-base font-normal leading-18 tracking-tighter text-left Sora_R mt-1">
                        {selectedFile.name}
                    </p>
                )}
            </div>

            {uploadStarted && (
                <div className="w-full bg-gray-200 rounded-full dark:bg-white-700 h-10 mt-5 overflow-hidden flex">
                    {progress && (
                        <div
                            className="bg-[#E57549] text-xs font-medium text-white-100 my-auto transition-width duration-1000 ease-out text-center h-9 p-0.5 leading-none rounded-full flex items-center justify-center Sora_R"
                            style={{
                                width: progress ? `${progress}%` : '0%',
                                color: 'white',
                            }}
                        >
                            {progress}%
                        </div>
                    )}
                </div>
            )}

            {/* <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          {loading ? (
            <Loader />
          ) : (
            <div className="flex justify-center sm:justify-end flex-grow">
              <button
                className={`${styles.submitButtonLast} Sora_SB`}
                type="submit"
                onClick={handleSubmit}
              >
                <img
                  src="../assets/images/upRightArrow.svg"
                  alt="Submit "
                  className="w-auto"
                  style={{ filter: "invert(1)" }}
                />
                Finish Application Process
              </button>
            </div>
          )}
        </div> */}
            <div className="flex mt-4 justify-center primary-txt Sora_SB">
                {uploadMessage}
            </div>
            {/* </div> */}
        </div>
    );
};

export default Video;
