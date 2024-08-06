import CryptoJS from "crypto-js";
import { Buffer } from "buffer";
import { ZoomMtg } from '@zoomus/websdk';
import 'zoom-css/zoom.css';  // Import Zoom SDK CSS

// Configuration and environment variables
const url = process.env.REACT_APP_FRONTEND_URL;
const API_SECRET = process.env.REACT_APP_ZOOM_SIGNATURE; // This should be generated server-side
const API_KEY = process.env.REACT_APP_ZOOM_API_KEY;

// Function to generate the Zoom signature
// export function generateSignature(apiKey, apiSecret, meetingNumber, role) {
//     const timestamp = new Date().getTime() - 30000;
//     const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64');
//     const hash = CryptoJS.HmacSHA256(msg, apiSecret);
//     const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${CryptoJS.enc.Base64.stringify(hash)}`).toString('base64');
//     return signature;
// }

// Function to initialize Zoom SDK
export function initializeZoomSDK() {
    ZoomMtg.setZoomJSLib("https://source.zoom.us/2.13.0/lib", "/av");

    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    ZoomMtg.i18n.load("en-US");
    ZoomMtg.i18n.reload("en-US");
}

// Function to join a Zoom meeting
export function joinMeeting(data) {
    const zoomClient = ZoomMtg;
    //const signature = generateSignature(API_KEY, API_SECRET, data.meetingNumber, 0); // role 0 for attendee

    ZoomMtg.init({
        leaveUrl: url,
        isSupportAV: true,
        success: () => {
            ZoomMtg.join({
                //signature: signature,
                apiKey: API_KEY,
                meetingNumber: data.meetingNumber,
                userName: 'sandeep',
                userEmail: 'sandeeppatel@dynapt.co.in',
                passWord: data.platform_meet['h323_password'],
                success: () => {
                    console.log('Joined the meeting successfully!');
                },
                error: (err) => {
                    console.error('Join error:', err);
                },
            });
        },
        error: (err) => {
            console.error('Zoom SDK initialization failed:', err);
        },
    });
}