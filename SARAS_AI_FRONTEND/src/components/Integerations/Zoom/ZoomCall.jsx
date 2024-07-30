import React, { useEffect } from 'react';
import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const ZoomCall = () => {
    useEffect(() => {
        ZoomMtg.init({
            leaveUrl: 'https://yourapp.com',
            isSupportAV: true,
            success: success => {
                console.log(success);
                ZoomMtg.join({
                    signature: 'your_signature', 
                    apiKey: 'your_api_key',
                    meetingNumber: 'your_meeting_number',
                    userName: 'Your Name',
                    passWord: 'your_meeting_password',
                    success: success => {
                        console.log(success);
                    },
                    error: error => {
                        console.log(error);
                    },
                });
            },
            error: error => {
                console.log(error);
            },
        });
    }, []);

    return <div>ZoomCall</div>;
};

export default ZoomCall;
