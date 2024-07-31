import React, { useState } from 'react';
import { ZoomMtg } from '@zoomus/websdk';
import axios from 'axios';

const ZoomComponent = () => {
    const [meetingNumber, setMeetingNumber] = useState('');
    const [meetingPassword, setMeetingPassword] = useState('');
    const [signature, setSignature] = useState('');

    const handleStartMeeting = async () => {
        // Request meeting details from your backend
        const response = await axios.post('/api/zoom/create-meeting', {
            topic: 'Test Meeting',
            start_time: new Date().toISOString(),
        });

        const { id, password } = response.data;
        setMeetingNumber(id);
        setMeetingPassword(password);
        generateSignature(id);
    };

    const generateSignature = async meetingNumber => {
        const response = await axios.get(
            `/api/zoom/generate-signature?meetingNumber=${meetingNumber}`
        );
        setSignature(response.data.signature);
    };

    const joinMeeting = () => {
        ZoomMtg.init({
            leaveUrl: 'http://www.yourdomain.com',
            isSupportAV: true,
            success: () => {
                ZoomMtg.join({
                    signature: signature,
                    meetingNumber: meetingNumber,
                    userName: 'Your Name',
                    apiKey: 'YOUR_ZOOM_API_KEY',
                    userEmail: 'user@example.com',
                    passWord: meetingPassword,
                    success: res => {
                        console.log('Join meeting success');
                    },
                    error: res => {
                        console.log(res);
                    },
                });
            },
            error: res => {
                console.log(res);
            },
        });
    };

    return (
        <div>
            <button onClick={handleStartMeeting}>Start Meeting</button>
            <button onClick={joinMeeting}>Join Meeting</button>
        </div>
    );
};

export default ZoomComponent;
