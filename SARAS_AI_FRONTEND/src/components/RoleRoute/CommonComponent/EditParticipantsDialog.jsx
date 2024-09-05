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
import { 
    closeParticipantsDialog, 
    openEditParticipantsDialog, 
    openSelectStudents, 
    openSelectBatches, 
    openParticipantsDialog,
    closeEditParticipantsDialog
} from '../../../redux/features/commonCalender/commonCalender';
import { useDispatch, useSelector } from 'react-redux';
import { updateCoachScheduledCall } from '../../../redux/features/coachModule/coachmenuprofileSilce';
import { updateTaScheduledCall } from '../../../redux/features/taModule/tamenuSlice';
import { timezoneIdToName } from '../../../utils/timezoneIdToName';
import { batch } from 'react-redux';
const EditParticipantsDialog = ({ openEdit, onCloseEdit , role }) => {
    const {timezones} = useSelector(state => state.util) ; 
    console.log('componentName::' , role) ; 
    const { participantsData } = useSelector(state => state.commonCalender);
    console.log('participantsData.students' , participantsData.students) ; 
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
    }





    
    useEffect(() => {
        transformData();
    }, [participantsData.students]);

    // const handleOpenEditParticipantsDialog = () => {
    //     console.log('handleOpenEditParticipantsDialog', true)
    //     dispatch(openEditParticipantsDialog());
    // };

    const handleAssignStudents = () => {
        dispatch(openSelectStudents({ participantsData }));
    };

    const handleAssignBatches = () => {
        dispatch(openSelectBatches({ participantsData }));
    };


    let sliceName, updateSessionApi, getSessionApi;

    switch (role) {

        case 'TA':
            sliceName = 'taMenu';
            updateSessionApi = updateTaScheduledCall;
            break;

        case 'Coach':
            sliceName = 'coachMenu';
            updateSessionApi = updateCoachScheduledCall;
            break;

        default:
            sliceName = null;
            updateSessionApi = null;
            break;
    }

    const handleSubmit = () => {
console.log('participantsData' , participantsData) ; 



           const studentId = participantsData.students.map(student => student.id);
           const batchId = participantsData.batch.map(batch => batch.id);

        const data = {
            meeting_name: participantsData.meeting_name,
            duration: participantsData.duration,
            schedule_date: participantsData.date,
            start_time: participantsData.start_time,
            end_time: participantsData.end_time,
            message: participantsData.message,
            platform_id: participantsData.platform_id,
            timezone_id: participantsData.timezone_id,
            event_status: 'scheduled',
            studentId: studentId,
            students:participantsData.students , 
            batchId: batchId,
            host_email_id: participantsData.host_email_id,
            meeting_type: participantsData.meeting_type,
        };

        dispatch(updateSessionApi({ id: participantsData.id, data }))
            .then(() => {
                // const data = {
                //     date: sessionData.date, //formatDate(sessionData.date),
                //     timezone_name: timezoneIdToName(timezone, timezones)
                // };
                // dispatch(getSessionApi(data));
                dispatch(closeEditParticipantsDialog(participantsData));
            })
            .catch(error => {
                console.error('Error updating TA scheduled call:', error);
                // Handle error (e.g., show error message to user)
            });
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
                <Typography style={{fontFamily:'SemiBold' , color:'#1A1E3D' , fontSize:'24px'}}  variant="h6" marginTop={4}>
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
                    sx = {{gap:'10px'}}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ marginTop: 'auto', paddingTop: '20px' }}
                >
                    <Button
                        style={{fontFamily:'Bold'}}
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
                        Assign Students
                    </Button>
                    <Button
                       style={{fontFamily:'Bold'}}
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
                        
                        Assign Batches
                         
                        </Button>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ marginTop: 'auto', paddingTop: '20px' }}
                >
                    <Button
                        style={{fontFamily:'Bold'}}
                        onClick={()=>handleSubmit()}
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
        
                        Update
                    
                        </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default EditParticipantsDialog;