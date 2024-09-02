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
import { closeParticipantsDialog, openEditParticipantsDialog, openSelectStudents, openSelectBatches } from '../../../redux/features/commonCalender/commonCalender';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
// const participantsData = [
//     { id: 1, name: 'Name Here', program: 'Program 1', batch: 'Batch 1' },
//     { id: 2, name: 'Name Here', program: 'Program 2', batch: 'Batch 2' },
//     { id: 3, name: 'Name Here', program: 'Program 3', batch: 'Batch 3' },
//     { id: 4, name: 'Name Here', program: 'Program 4', batch: 'Batch 4' },
// ];

const EditParticipantsDialog = ({ openEdit, onCloseEdit, participantsData }) => {

    const {selectedParticipants} = useSelector(state=>state.commonCalender) ; 

    const [data, setData] = useState([]);
    const transformData = () => {
        const transformedData = selectedParticipants.map((item, index) => ({
            id: item.id,
            name: item.name,
            //'Enrollment Id': item.enrollment_id,
            program:
                item.packages.map(pack => pack.package_name).join(',') || 'N/A',
            batch:
                item.batches.map(batch => batch.name).join(', ') ||
                'N/A',
        }));
        console.log('TransformedData', transformedData);
        setData(transformedData);
    }


    useEffect(() => {
        transformData(selectedParticipants);
    }, selectedParticipants);
    const dispatch = useDispatch();

    const handleOpenEditParticipantsDialog = participants => {
        console.log('handleOpenEditParticipantsDialog', true)
        dispatch(openEditParticipantsDialog(selectedParticipants));
    };

    const handleAssignStudents = () => {
        dispatch(openSelectStudents({ selectedParticipants }));
    };

    const handleAssignBatches = () => {
        dispatch(openSelectBatches({ selectedParticipants }));
    };

    return (
        <Dialog
            open={openEdit}
            onClose={onCloseEdit}
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
                    Edit Participants
                </Typography>
                <IconButton
                    onClick={onCloseEdit}
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
                        {data.length > 0 && data.map((participant, index) => (
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
                        variant="contained"
                        onClick={handleAssignStudents}
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
                        Edit Students
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleAssignBatches}
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
                            '&:hover': {
                                backgroundColor: '#F56D3B',
                                color: 'white',
                            },
                        }}
                    >
                        Edit Batches
                    </Button>
                </Box>
                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    style={{ marginTop: 'auto', paddingTop: '20px' }}
                >
                <Button
                        onClick={() =>
                            handleOpenEditParticipantsDialog(
                                selectedParticipants // Pass participants data
                            )
                        }
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
                        Submit
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default EditParticipantsDialog;
