// import React, { useState } from 'react';
// import {
//     Button,
//     DialogContent,
//     DialogContentText,
//     Grid,
//     IconButton,
// } from '@mui/material';
// import ReusableDialog from '../../../components/CustomFields/ReusableDialog';

// import CustomTextField from '../../../components/CustomFields/CustomTextField';
// import { blue } from '@mui/material/colors';

// const CustomButton = ({
//     onClick,
//     children,
//     color = '#FFFFFF',
//     backgroundColor = '#4E18A5',
//     borderColor = '#FFFFFF',
//     sx,
//     ...props
// }) => {
//     return (
//         <Button
//             variant="contained"
//             onClick={onClick}
//             sx={{
//                 backgroundColor: backgroundColor,
//                 color: color,
//                 fontWeight: '700',
//                 fontSize: '16px',
//                 borderRadius: '50px',
//                 padding: '10px 20px',
//                 border: `2px solid ${borderColor}`,
//                 '&:hover': {
//                     backgroundColor: color,
//                     color: backgroundColor,
//                     borderColor: color,
//                 },
//                 ...sx,
//             }}
//             {...props}
//         >
//             {children}
//         </Button>
//     );
// };

// const DenyDialog = ({ open, handleClose, handleDenySubmit, denyRequestId }) => {
//     const [message, setMessage] = useState('');

//     const handleDenyDialogClose = () => {
//         setMessage('');
//         handleClose();
//     };

//     const handleSubmit = () => {
//         handleDenySubmit(denyRequestId, message);
//         handleDenyDialogClose();
//     };

//     const content = (
//         <>
//             <DialogContentText
//                 sx={{
//                     color: '#1A1E3D',
//                     textAlign: 'center',
//                 }}
//             >
//                 <h1>Are you sure you want to deny the call?</h1>
//             </DialogContentText>

//             <CustomTextField
//                 label="Message"
//                 fullWidth
//                 placeholder="Enter reason for denial"
//                 variant="outlined"
//                 multiline
//                 value={message}
//                 onChange={e => setMessage(e.target.value)}
//             />
//         </>
//     );

//     const actions = (
//         <>
//             <IconButton
//                 aria-label="close"
//                 onClick={handleClose}
//                 sx={{
//                     position: 'absolute',
//                     right: 8,
//                     top: 8,
//                     color: theme => theme.palette.grey[500],
//                 }}
//             ></IconButton>
//             <CustomButton
//                 onClick={handleSubmit}
//                 backgroundColor="#F56D3B"
//                 borderColor="#F56D3B"
//                 color="#FFFFFF"
//             >
//                 Submit
//             </CustomButton>
//         </>
//     );

//     return (
//         <ReusableDialog
//             open={open}
//             handleClose={handleDenyDialogClose}
//             content={content}
//             actions={actions}
//         />
//     );
// };

// export default DenyDialog;

import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    IconButton,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomTextField from '../../../components/CustomFields/CustomTextField';

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

const DenyDialog = ({ open, handleClose, handleDenySubmit, denyRequestId }) => {
    const [message, setMessage] = useState('');

    const handleDenyDialogClose = () => {
        setMessage('');
        handleClose();
    };

    const handleSubmit = () => {
        handleDenySubmit(denyRequestId, message);
        handleDenyDialogClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleDenyDialogClose}
            sx={{
                '& .MuiDialog-paper': {
                    width: '600px', // Set the width here
                    maxWidth: '600px', // Ensure maxWidth is also set
                },
                padding: '50px 0px 50px 0px',
                borderRadius: '10px',
                border: '2px solid #F56D38',
                color: '#FFFFFF',
            }}
        >
            <IconButton
                onClick={handleDenyDialogClose}
                sx={{
                    color: '#F56D3B',
                    position: 'absolute',
                    top: 10,
                    right: 10,
                }}
            >
                <CloseIcon />
            </IconButton>

            <DialogContent
                sx={{
                    marginTop: 2,
                    paddingTop: '0 !important', // Override padding-top
                }}
            >
                <DialogContentText
                    sx={{
                        color: '#1A1E3D',
                        fontWeight: '600',
                        fontSize: '24px',
                        marginBottom: 5,
                        marginLeft: 16,
                        marginTop: 4,
                        textAlign: 'center',
                        width: '300px',
                        fontFamily: 'Nohemi',
                    }}
                >
                    Are you sure you want to{' '}
                    <span style={{ fontWeight: '600' }}>
                        deny the call request
                    </span>
                    ?
                </DialogContentText>

                <CustomTextField
                    label="Message"
                    fullWidth
                    placeholder="Enter your message"
                    variant="outlined"
                    multiline
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                />
            </DialogContent>

            <DialogActions
                sx={{ p: 2, justifyContent: 'center', textTransform: 'none' }}
            >
                <CustomButton
                    onClick={handleSubmit}
                    backgroundColor="#F56D3B"
                    borderColor="#F56D3B"
                    color="#FFFFFF"
                    sx={{
                        textTransform: 'none',
                        fontFamily: 'Nohemi',
                        fontSize: '15px',
                    }}
                >
                    Submit
                </CustomButton>
            </DialogActions>
        </Dialog>
    );
};

export default DenyDialog;
