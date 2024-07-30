import React, { useState } from 'react';
import VideoUploadAndPlayer from './VideoPlayer';

const Video = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = event => {
        setFile(event.target.files[0]);
    };

    return (
        <div className="App">
            <h1>Upload and Play Video on Vimeo</h1>
            <input type="file" onChange={handleFileChange} />
            {file && (
                <VideoUploadAndPlayer
                    file={file}
                    name="Your Video Name"
                    description="Your Video Description"
                    VIMEO_ACCESS_TOKEN="7d93a352d9b20c0a2141bf3269860df5"
                />
            )}
        </div>
    );
};

export default Video;
