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
    closeEditParticipantsDialog,
} from '../../../redux/features/commonCalender/commonCalender';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCoachMenuAssignedBatches,
    getCoachMenuAssignedStudents,
    getCoachScheduledCalls,
    updateCoachScheduledCall,
} from '../../../redux/features/coachModule/coachmenuprofileSilce';
import {
    getTaMenuAssignedBatches,
    getTaMenuAssignedStudents,
    getTaScheduledCalls,
    updateTaScheduledCall,
} from '../../../redux/features/taModule/tamenuSlice';
import { getTimezone } from '../../../redux/features/utils/utilSlice';
import {
    openBatchPopup,
    openStudentsPopup,
    updateSelectedBatches,
    updateSelectedStudents,
} from '../../../redux/features/commonCalender/batchesAndStudents';
import SelectBatches from '../../batches/SelectBatches';
import SelectStudents from '../../students/SelectStudents';
import { timezoneIdToName } from '../../../utils/timezoneIdToName';

const editParticipantsConfig = {
    TA: {
        sliceName: 'taMenu',
        updateSessionApi: updateTaScheduledCall,
        getSessionApi: getTaScheduledCalls,
        getStudentsApi: getTaMenuAssignedStudents,
        getStudentsState: 'assignedTaStudents',
        getBatchesApi: getTaMenuAssignedBatches,
        getBatchesState: 'assignedTaBatches',
    },
    Coach: {
        sliceName: 'coachMenu',
        updateSessionApi: updateCoachScheduledCall,
        getSessionApi: getCoachScheduledCalls,
        getStudentsApi: getCoachMenuAssignedStudents,
        getStudentsState: 'assignedCoachStudents',
        getBatchesApi: getCoachMenuAssignedBatches,
        getBatchesState: 'assignedCoachBatches',
    },
};

const EditParticipantsDialog = ({ openEdit, onCloseEdit, role, timezone }) => {
    const dispatch = useDispatch();
    const {
        sliceName,
        updateSessionApi,
        getSessionApi,
        getStudentsApi,
        getStudentsState,
        getBatchesApi,
        getBatchesState,
    } = editParticipantsConfig[role];
    const { timezones } = useSelector(state => state.util);
    const stateSelector = useSelector(state => state[sliceName]);
    const {
        [getStudentsState]: assignedStudents,
        [getBatchesState]: assignedBatches,
    } = stateSelector;

    const { selectedStudents, selectedBatches, openBatches, openStudents } =
        useSelector(state => state.batchesAndStudents);

    const { participantsData } = useSelector(state => state.commonCalender);

    const [data, setData] = useState([]);

    useEffect(() => {
        dispatch(getTimezone());
        dispatch(getStudentsApi());
        dispatch(getBatchesApi());
    }, [dispatch]);

    const transformData = () => {
        const transformedData = participantsData.students.map(item => ({
            id: item.id,
            name: item.name,
            program:
                item.packages.map(pack => pack.package_name).join(',') || 'N/A',
            batch: item.batches.map(batch => batch.name).join(', ') || 'N/A',
        }));
        setData(transformedData);

        dispatch(
            updateSelectedStudents({
                selectedStudents: participantsData.students.map(
                    student => student.id
                ),
            })
        );

        dispatch(
            updateSelectedBatches({
                selectedBatches: participantsData.batch.map(batch => batch.id),
            })
        );
    };

    useEffect(() => {
        if (participantsData?.students.length > 0) {
            transformData();
        } else {
            console.log('no data found !');
            setData([]);
        }
    }, [participantsData?.students]);

    const handleAssignStudents = () => {
        const data = {
            batches: assignedBatches,
            selectedBatches: selectedBatches?.length > 0 ? selectedBatches : [],
            students: assignedStudents,
            selectedStudents:
                selectedStudents?.length > 0 ? selectedStudents : [],
            timezoneId: timezone,
        };
        dispatch(openStudentsPopup(data));
        //dispatch(openSelectStudents({ participantsData }));
    };

    const handleAssignBatches = () => {
        const data = {
            batches: assignedBatches,
            selectedBatches: selectedBatches?.length > 0 ? selectedBatches : [],
            students: assignedStudents,
            selectedStudents:
                selectedStudents?.length > 0 ? selectedStudents : [],
            timezoneId: timezone,
        };
        dispatch(openBatchPopup(data));
        //dispatch(openSelectBatches({ participantsData }));
    };

    const handleSubmit = () => {
        const studentId = selectedStudents.map(student => student);
        const batchId = selectedBatches.map(batch => batch);

        const data = {
            meeting_name: participantsData.meeting_name,
            duration: participantsData.duration,
            schedule_date: participantsData.date,
            start_time: participantsData.start_time,
            end_time: participantsData.end_time,
            message: participantsData.message,
            platform_id: participantsData.platform_id,
            timezone_id: timezone, //participantsData.timezone,
            event_status: 'scheduled',
            studentId: studentId,
            batchId: batchId,
            host_email_id: participantsData.host_email_id,
            meeting_type: participantsData.meeting_type,
        };

        dispatch(updateSessionApi({ id: participantsData.id, data }))
            .unwrap() // Ensures the promise is unwrapped for proper chaining
            .then(() => {
                const sessionData = {
                    date: participantsData.date, //formatDate(participantsData.date), (if needed to format)
                    timezone_name: timezoneIdToName(timezone, timezones),
                };
                return dispatch(getSessionApi(sessionData)); // Ensure this dispatch runs after updateSessionApi resolves
            })
            .then(() => {
                // Close the edit participants dialog after both API calls succeed
                dispatch(closeEditParticipantsDialog(participantsData));
                dispatch(closeParticipantsDialog());
            })
            .catch(error => {
                console.error('Error updating TA scheduled call:', error);
                // Handle the error here (e.g., show error message to the user)
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
                <Typography
                    style={{
                        fontFamily: 'SemiBold',
                        color: '#1A1E3D',
                        fontSize: '24px',
                    }}
                    variant="h6"
                    marginTop={4}
                >
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
                                    paddingLeft: '8px', // Left gap
                                    paddingRight: '8px', // Right gap
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 0,
                                        height: '2px',
                                        backgroundColor: '#C2C2E7',
                                        left: '8px', // Gap from the left
                                        right: '8px', // Gap from the right
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
                                        paddingLeft: '8px', // Left gap for td
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
                    sx={{ gap: '10px' }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ marginTop: 'auto', paddingTop: '20px' }}
                >
                    <Button
                        style={{ fontFamily: 'Bold' }}
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
                        style={{ fontFamily: 'Bold' }}
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
                        style={{ fontFamily: 'Bold' }}
                        onClick={handleSubmit}
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
            {openStudents &&
                (role == 'Coach' ? (
                    <SelectStudents componentName={'COACHMENU'} />
                ) : (
                    <SelectStudents componentName={'TAMENU'} />
                ))}

            {openBatches &&
                (role == 'Coach' ? (
                    <SelectBatches componentName={'COACHMENU'} />
                ) : (
                    <SelectBatches componentName={'TAMENU'} />
                ))}
        </Dialog>
    );
};

export default EditParticipantsDialog;
