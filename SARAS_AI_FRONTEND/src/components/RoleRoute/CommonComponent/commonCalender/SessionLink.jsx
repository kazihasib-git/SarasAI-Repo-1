import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    closeSessionPopup,
    openEditBatches,
    openEditStudents,
} from '../../../../redux/features/commonCalender/commonCalender';
import {
    Avatar,
    Box,
    Button,
    Grid,
    IconButton,
    Typography,
} from '@mui/material';
import { formatDateTime } from '../../../../utils/dateFormatter';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import editImg from '../../../../assets/editIcon.png';
import editImgWhite from '../../../../assets/editIcon_White.png';
import CustomButton from '../../../CustomFields/CustomButton';

const sessionLinkConfig = {
    TAMENU: {
        sliceName: 'taMenu',
        sessionDataState: 'taSessionEventData',
    },
    COACHMENU: {
        sliceName: 'coachMenu',
        sessionDataState: 'coachSessionEventData',
    },
};

const SessionLink = ({ componentName, timezone }) => {
    const dispatch = useDispatch();
    const { sessionEventData, openSession } = useSelector(
        state => state.commonCalender
    );
    const [copySuccess, setCopySuccess] = useState(false);

    const { sliceName, sessionDataState } = sessionLinkConfig[componentName];

    const handleEditBatches = () => {
        dispatch(openEditBatches({ id: sessionEventData.id }));
    };

    const handleChangeMode = () => {};

    const handleEditStudents = () => {
        dispatch(openEditStudents({ id: sessionEventData.id }));
    };

    const handleLinkCopy = () => {
        if (sessionEventData) {
            navigator.clipboard
                .writeText(sessionEventData.platform_meeting.host_meeting_url)
                .then(() => {
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                })
                .catch(err => {
                    console.error('Failed to copy link: ', err);
                });
        } else {
            console.error('No meeting link.');
        }
    };

    const handleJoinMeeting = data => {
        window.open(data.platform_meeting.host_meeting_url, '_blank');
    };

    const content = (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
                {formatDateTime(sessionEventData)}
            </Typography>
            <CustomButton
                onClick={() => handleJoinMeeting(sessionEventData)}
                backgroundColor="#FFFFFF"
                borderColor="#F56D38"
                color="#F56D38"
                sx={{ mb: 2, mr: 2 }}
                style={{ textTransform: 'none' }}
            >
                Join with {sessionEventData.platform_tools.name}
            </CustomButton>
            <CustomButton
                onClick={handleChangeMode}
                variant="text"
                backgroundColor="#FFFFFF"
                borderColor="transparent"
                color="#F56D38"
                sx={{ mb: 2, textTransform: 'none' }}
            >
                Change Mode
            </CustomButton>
            <Typography
                variant="body2"
                sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
                {sessionEventData.platform_meeting.host_meeting_url}
                <IconButton
                    size="small"
                    sx={{
                        borderRadius: '50%',
                        backgroundColor: '#F56D38',
                        border: '2px solid #F56D38',
                        '&:hover': {
                            borderColor: '#F56D38',
                            color: '#F56D38',
                        },
                        color: 'white',
                        ml: 1,
                    }}
                    onClick={handleLinkCopy}
                >
                    <ContentCopyIcon />
                </IconButton>
                {copySuccess && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'black' }}>
                        Copied!
                    </Typography>
                )}
            </Typography>
        </Box>
    );

    const actions = (
        <Box display="flex" justifyContent="center" gap={2} sx={{ mb: 3 }}>
            <Button
                variant="contained"
                onClick={handleEditStudents}
                sx={{
                    backgroundColor: '#F56D3B',
                    color: 'white',
                    height: '60px',
                    width: '201px',
                    borderRadius: '50px',
                    textTransform: 'none',
                    padding: '18px 30px',
                    fontWeight: '700',
                    fontSize: '16px',
                    '&:hover': {
                        backgroundColor: '#D4522A',
                    },
                }}
            >
                <img src={editImgWhite} alt="edit" />
                Edit Students
            </Button>
            <Button
                variant="outlined"
                onClick={handleEditBatches}
                sx={{
                    backgroundColor: 'white',
                    color: '#F56D3B',
                    height: '60px',
                    width: '194px',
                    border: '2px solid #F56D3B',
                    borderRadius: '50px',
                    textTransform: 'none',
                    fontWeight: '700',
                    fontSize: '16px',
                    padding: '18px 30px',
                }}
            >
                <img src={editImg} alt="edit" />
                Edit Batches
            </Button>
        </Box>
    );

    return (
        <ReusableDialog
            open={openSession}
            handleClose={() => dispatch(closeSessionPopup())}
            title={`Session Name -${sessionEventData.meetingName || 'No Title'}`}
            content={content}
            actions={actions}
        />
    );
};

export default SessionLink;
