import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeSessionPopup } from '../../../../redux/features/commonCalender/commonCalender';
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

const SessionLink = ({ componentName }) => {
    const dispatch = useDispatch();

    const { sessionEventData, openSession } = useSelector(
        state => state.commonCalender
    );

    let sliceName, sessionDataState;

    switch (componentName) {
        case 'TAMENU':
            sliceName = 'taMenu';
            sessionDataState = 'sessionEventData';
            break;

        case 'COACHMENU':
            sliceName = 'coachMenu';
            sessionDataState = 'coachSessionEventData';
            break;

        default:
            sliceName = null;
            sessionDataState = null;
            break;
    }

    const handleEditBatches = () => {};

    const handleEditStudents = () => {};

    const content = (
        <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
                {formatDateTime(sessionEventData)}
            </Typography>
            <CustomButton
                onClick={() => {}}
                backgroundColor="#FFFFFF"
                borderColor="#F56D38"
                color="#F56D38"
                sx={{ mb: 2, mr: 2 }}
            >
                Join with Zoom
            </CustomButton>
            <CustomButton
                onClick={() => {}}
                variant="text"
                backgroundColor="#FFFFFF"
                borderColor="transparent"
                color="#F56D38"
                sx={{ mb: 2 }}
            >
                Change Mode
            </CustomButton>
            <Typography variant="body2" sx={{ mb: 2 }}>
                {sessionEventData.meetingLink}
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
                >
                    <ContentCopyIcon />
                </IconButton>
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
            title={`${sessionEventData.title || 'No Title'}`}
            content={content}
            actions={actions}
        />
    );
};

export default SessionLink;
