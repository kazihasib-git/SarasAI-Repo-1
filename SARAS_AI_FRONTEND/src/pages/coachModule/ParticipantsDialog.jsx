import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    IconButton,
    Typography,
    Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ParticipantsDialog = ({ open, onClose, participantsData }) => {
    const [data, setData] = useState([]);
    const transformData = () => {
        const transformedData = participantsData.map((item, index) => ({
            id: item.id,
            name: item.name,
            //'Enrollment Id': item.enrollment_id,
            program:
                item.packages.map(pack => pack.package_name).join(',') || 'N/A',
            batch: item.batches.map(batch => batch.name).join(', ') || 'N/A',
        }));
        setData(transformedData);
    };

    useEffect(() => {
        transformData(participantsData);
    }, participantsData);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    width: '600px',
                    height: '500px',
                    borderRadius: '10px',
                },
            }}
        >
            <DialogTitle>
                <Typography variant="h6" marginTop={4}>
                    Participants
                </Typography>
                <IconButton
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        color: '#F56D3B',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'calc(100% - 60px)', // Adjust height to fit within the dialog
                    padding: '20px',
                }}
            >
                <Box
                    component="table"
                    sx={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        '& thead': {
                            borderBottom: '1px solid #C2C2E7',
                        },
                        '& tbody': {
                            '& tr': {
                                borderBottom: '1px solid #C2C2E7',
                            },
                        },
                        backgroundColor: '#E0E0F3',
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ padding: '8px' }}>S.No</th>
                            <th style={{ padding: '8px' }}>Student Name</th>
                            <th style={{ padding: '8px' }}>Program</th>
                            <th style={{ padding: '8px' }}>Batch</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 &&
                            data.map((participant, index) => (
                                <tr key={participant.id}>
                                    <td style={{ padding: '8px' }}>
                                        {index + 1}
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                        {participant.name}
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                        {participant.program}
                                    </td>
                                    <td style={{ padding: '8px' }}>
                                        {participant.batch}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ marginTop: 'auto', paddingTop: '20px' }}
                >
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            backgroundColor: '#F56D3B',
                            color: '#fff',
                            borderRadius: '50px',
                            textTransform: 'none',
                            padding: '10px 20px',
                            '&:hover': {
                                backgroundColor: '#F56D3B',
                                color: '#fff',
                            },
                            '&:focus': {
                                backgroundColor: '#F56D3B',
                                color: '#fff',
                            },
                        }}
                    >
                        Edit
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ParticipantsDialog;
