import { ZoomMtg } from '@zoomus/websdk';
//import { ZoomMtg } from '@zoom/meetingsdk';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// import 'zoom-css/zoom.css';  // Import Zoom SDK CSS
const API_KEY = process.env.REACT_APP_ZOOM_API_KEY;

const zoomClient = ZoomMtg;

// Initialize Zoom SDK
zoomClient.preLoadWasm();
zoomClient.prepareWebSDK();

// Function to join a Zoom meeting
export const joinMeeting = (meetingId, userName, password) => {
    const meetingConfig = {
        apiKey: API_KEY,
        meetingNumber: meetingId,
        userName: userName,
        signature: generateSignature(meetingId, userName),  // Generate a Zoom signature
        passWord: password,
        leaveUrl: 'http://localhost:3000/',
        role: 0,  // 0 for participant, 1 for host
    };

    zoomClient.init({
        leaveUrl: 'http://localhost:3000/',
        isSupportAV: true,
        success: () => {
            zoomClient.join(meetingConfig);
        },
        error: (error) => {
            console.log('Error initializing Zoom SDK', error);
        },
    });
};
