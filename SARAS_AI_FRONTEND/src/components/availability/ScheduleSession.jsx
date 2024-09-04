import React, { useEffect, useState } from 'react';
import {
    IconButton,
    Typography,
    Grid,
    Avatar,
    Box,
    Button,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReusableDialog from '../CustomFields/ReusableDialog';
import { useDispatch, useSelector } from 'react-redux';
import {
    changePlatform,
    closeSessionEvent,
    fetchTAScheduleById,
    openTaEditSchduledBatches,
    openTaEditScheduledStudents,
} from '../../redux/features/adminModule/ta/taAvialability';
import { formatDateTime } from '../../utils/dateFormatter';
import {
    closeCoachSessionEvent,
    openCoachEditSchduledBatches,
    openCoachEditScheduledStudents,
} from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import {
    openEditStudent,
    openEditBatch,
} from '../../redux/features/adminModule/ta/taScheduling';
import {
    openCoachEditBatch,
    openCoachEditStudent,
} from '../../redux/features/adminModule/coach/coachSchedule';

import editImg from '../../assets/editIcon_White.png';
import editImage from '../../assets/editIcon.png';
import { useNavigate } from 'react-router-dom';
import CustomFormControl from '../CustomFields/CustomFromControl';
import { getPlatforms } from '../../redux/features/utils/utilSlice';
import CustomPlatformForm from '../CustomFields/CustomPlatformForm';

const CustomButton = ({
    onClick,
    children,
    color = '#FFFFFF',
    backgroundColor = '#4E18A5',
    borderColor = '#FFFFFF',
    sx,
    ...props
}) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                backgroundColor: backgroundColor,
                color: color,
                fontWeight: '700',
                fontSize: '16px',
                borderRadius: '50px',
                padding: '10px 20px',
                border: `2px solid ${borderColor}`,
                '&:hover': {
                    backgroundColor: color,
                    color: backgroundColor,
                    borderColor: color,
                },
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

const ScheduleSession = ({ componentName }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [changeMode, setChangeMode] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState();
    const [copySuccess, setCopySuccess] = useState(false);

    const { platforms } = useSelector(state => state.util);

    useEffect(() => {
        dispatch(getPlatforms());
    }, [dispatch]);

    let sliceName,
        sessionDataState,
        closePopup,
        openPopupState,
        openEditBatches,
        openEditStudents,
        openStudentsPopup,
        openBatchesPopup;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taAvialability';
            sessionDataState = 'sessionEventData';
            closePopup = closeSessionEvent;
            openPopupState = 'openEventData';
            openEditBatches = openEditBatch;
            openEditStudents = openEditStudent;
            openStudentsPopup = openTaEditScheduledStudents;
            openBatchesPopup = openTaEditSchduledBatches;
            break;

        case 'COACHCALENDER':
            sliceName = 'coachAvailability';
            sessionDataState = 'coachSessionEventData'; // Assuming this is correct
            closePopup = closeCoachSessionEvent; // Assuming this is correct
            openPopupState = 'coachOpenEventData'; // Assuming this is correct
            openEditBatches = openCoachEditBatch;
            openEditStudents = openCoachEditStudent;
            openStudentsPopup = openCoachEditScheduledStudents;
            openBatchesPopup = openCoachEditSchduledBatches;
            break;

        default:
            sliceName = null;
            sessionDataState = null;
            closePopup = null;
            openPopupState = null;
            openEditBatches = null;
            openEditStudents = null;
            openStudentsPopup = null;
            openBatchesPopup = null;
            break;
    }

    const selectState = useSelector(state =>
        sliceName ? state[sliceName] : {}
    );
    const {
        [sessionDataState]: sessionData = {},
        [openPopupState]: open = false,
    } = selectState;

    const handleEditStudents = () => {
        dispatch(openStudentsPopup({ id: sessionData.id }));
    };

    const handleEditBatches = () => {
        dispatch(openBatchesPopup({ id: sessionData.id }));
    };

    const handleLinkCopy = () => {
        if (sessionData.platform_meet.host_meeting_url) {
            navigator.clipboard
                .writeText(sessionData.platform_meet.host_meeting_url)
                .then(() => {
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                })

                .catch(err => {
                    console.error('Failed to copy link: ', err);
                });
        } else {
            console.error('No meeting link .');
        }
    };

    const handleChangeMode = () => {
        setChangeMode(true);
    };

    const handlePlatformChange = event => {
        setSelectedPlatform(event.target.value);
    };

    const handleChangePlatform = sessionData => {
        const id = sessionData.id;
        const data = {
            admin_user_id: sessionData.admin_user_id,
            platform_id: selectedPlatform,
        };

        dispatch(changePlatform({ id, data })).then(() => {
            dispatch(fetchTAScheduleById(sessionData.admin_user_id));
        });
    };

    // const handleJoinCall = data => {

    //     window.open(sessionData.platform_meet.host_meeting_url, '_blank');
    // };
    
    const handleJoinCall = data => {
        const eventData = {
            ...sessionData,
            meetingName: sessionData.meetingName,

            platformName: sessionData.platform_tools.name,
        };
        window.open(sessionData.platform_meet.host_meeting_url, '_blank');
    };

    const content = (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
                {formatDateTime(sessionData)}
            </Typography>
            {changeMode ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <CustomPlatformForm
                        label="Change Mode"
                        name="platform"
                        placeholder="Select Platform"
                        value={
                            selectedPlatform
                                ? selectedPlatform
                                : sessionData.platform_tools.id
                        }
                        onChange={handlePlatformChange}
                        errors={''}
                        options={platforms}
                        sx={{ width: '100px' }} // Adjust the width as needed
                    />
                    <CustomButton
                        onClick={() => handleChangePlatform(sessionData)}
                        backgroundColor="#F56D3B"
                        color="white"
                        borderColor="#F56D3B"
                        style={{ textTransform: 'none' }}
                    >
                        Submit
                    </CustomButton>
                </Box>
            ) : (
                <>
                    <CustomButton
                        onClick={() => handleJoinCall(sessionData)}
                        backgroundColor="#FFFFFF"
                        borderColor="#F56D38"
                        color="#F56D38"
                        sx={{ mb: 2, mr: 2, textTransform: 'none' }}
                    >
                        Join with {sessionData.platform_tools.name}
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
                </>
            )}
            <Typography
                variant="body2"
                sx={{ mb: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
                {sessionData.platform_meet.host_meeting_url}
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
        <Box>
            <Grid item xs={12} display="flex" justifyContent="center">
                <Box
                    display="flex"
                    justifyContent="center"
                    gap={2}
                    sx={{ mb: 3 }}
                >
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
                        <img src={editImg} alt="edit" />
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
                        <img src={editImage} alt="edit" />
                        Edit Batches
                    </Button>
                </Box>
            </Grid>
        </Box>
    );

    return (
        <ReusableDialog
            open={open}
            handleClose={() => dispatch(closePopup())}
            title={`Session Name - ${sessionData.meetingName || 'No Title'}`}
            content={content}
            actions={actions}
        />
    );
};

export default ScheduleSession;
