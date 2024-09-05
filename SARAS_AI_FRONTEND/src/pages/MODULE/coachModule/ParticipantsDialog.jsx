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
import { closeParticipantsDialog, openEditParticipantsDialog, openSelectStudents } from '../../../redux/features/commonCalender/commonCalender';
import { useDispatch, useSelector } from 'react-redux';

const ParticipantsDialog = ({ open, onClose }) => {
    const { participantsData } = useSelector(state => state.commonCalender);
    const [data, setData] = useState([]);
    const dispatch = useDispatch();

    const transformData = () => {
        const transformedData = participantsData.students.map((item) => ({
            id: item.id,
            name: item.name,
            program: item.packages.map(pack => pack.package_name).join(',') || 'N/A',
            batch: item.batches.map(batch => batch.name).join(', ') || 'N/A',
        }));
        console.log('TransformedData', transformedData);
        setData(transformedData);
    };

    useEffect(() => {
        transformData();
    }, [participantsData.students]);

    const handleOpenEditParticipantsDialog = () => {
        dispatch(openEditParticipantsDialog(participantsData));
    };

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
                <Typography  style={{fontFamily:'SemiBold' , color:'#1A1E3D'}} variant="h6" marginTop={4}>
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
                    height: 'calc(100% - 60px)',
                    padding: '20px',
                }}
            >
 <Box
                    component="table"
                    sx={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        '& thead': {
                    '& tr': {
                        '& th': {
                        position: 'relative',
                        paddingLeft: '8px',  // Left gap
                        paddingRight: '8px', // Right gap
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            height: '2px',
                            backgroundColor: '#C2C2E7',
                            left: '8px',   // Gap from the left
                            right: '8px',  // Gap from the right
                        },
                        },
                    },
                    },
                    '& tbody': {
                    '& tr': {
                        position: 'relative',
                        '&:not(:last-child)': {
                        '& td': {
                            borderBottom: '1px solid #C2C2E7',
                            paddingLeft: '8px',  // Left gap for td
                            paddingRight: '8px', // Right gap for td
                        },
                        },
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
                        {data.length>0 && data.map((participant, index) => (
                            <tr key={participant.id}>
                                <td style={{ padding: '8px' }}>{index + 1}</td>
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
                        style={{fontFamily:'Bold' , fontSize:'16px'}}
                        onClick={()=>handleOpenEditParticipantsDialog()}
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