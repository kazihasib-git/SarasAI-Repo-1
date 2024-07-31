import React, { useEffect, useState } from 'react';
import { ZoomMtg } from '@zoomus/websdk';
import {
    Container,
    Button,
    Typography,
    CircularProgress,
    Snackbar,
} from '@mui/material';
import { Alert } from '@mui/material';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const url = process.env.REACT_APP_FRONTEND_URL;
const signature = process.env.REACT_APP_ZOOM_SIGNATURE;
const apiKey = process.env.REACT_APP_ZOOM_API_KEY;

const ZoomCall = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const initZoom = () => {
            setLoading(true);
            ZoomMtg.init({
                leaveUrl: url,
                isSupportAV: true,
                success: () => {
                    ZoomMtg.join({
                        signature: signature,
                        apiKey: apiKey,
                        meetingNumber: 'your_meeting_number',
                        userName: 'Your Name',
                        userEmail: 'user@example.com',
                        passWord: 'your_meeting_password',
                        success: res => {
                            setLoading(false);
                            setSuccess('Joined the meeting successfully!');
                            console.log(res);
                        },
                        error: err => {
                            setLoading(false);
                            setError('Failed to join the meeting.');
                            console.log(err);
                        },
                    });
                },
                error: err => {
                    setLoading(false);
                    setError('Zoom SDK initialization failed.');
                    console.log(err);
                },
            });
        };

        initZoom();
    }, []);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Zoom Call Integration
            </Typography>
            {loading && <CircularProgress />}
            {success && (
                <Snackbar open={Boolean(success)} autoHideDuration={6000}>
                    <Alert severity="success">{success}</Alert>
                </Snackbar>
            )}
            {error && (
                <Snackbar open={Boolean(error)} autoHideDuration={6000}>
                    <Alert severity="error">{error}</Alert>
                </Snackbar>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={() => window.location.reload()}
            >
                Refresh
            </Button>
        </Container>
    );
};

export default ZoomCall;
