import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    getAssignStudents,
    getStudentBatchMapping,
} from '../../redux/features/adminModule/ta/taSlice';
import {
    closeTaEditScheduledStudents,
    editTASchdeuledStudents,
    getTAScheduledBatches,
    getTAScheduledStudents,
} from '../../redux/features/adminModule/ta/taAvialability';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomButton from '../CustomFields/CustomButton';
import { Divider, Grid, MenuItem, Typography } from '@mui/material';
import CustomTextField from '../CustomFields/CustomTextField';
import PopUpTable from '../CommonComponent/PopUpTable';
import {
    closeCoachEditScheduledStudents,
    editCoachScheduledStudents,
    getCoachScheduledStudents,
} from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import { getCoachAssignStudents } from '../../redux/features/adminModule/coach/coachSlice';

const headers = ['S. No.', 'Student Name', 'Program', 'Batch', 'Select'];

const EditStudentsFromSession = ({ componentName }) => {
    const dispatch = useDispatch();
    const { id, name } = useParams();

    const [selectedTerm, setSelectedTerm] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [searchName, setSearchName] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);

    let openPopState,
        closePopupActions,
        sliceName,
        availabilitySliceName,
        scheduledStudentsApi,
        scheduledStudentsState,
        editScheduledStudentsApi,
        assignedStudentsApi,
        assignedStudentsState,
        meetingIdState;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taModule';
            availabilitySliceName = 'taAvialability';
            openPopState = 'taEditScheduledStudents';
            closePopupActions = closeTaEditScheduledStudents;
            scheduledStudentsApi = getTAScheduledStudents;
            scheduledStudentsState = 'taScheduledStudents';
            editScheduledStudentsApi = editTASchdeuledStudents;
            assignedStudentsApi = getAssignStudents;
            assignedStudentsState = 'assignedStudents';
            meetingIdState = 'meetingId';
            break;

        case 'COACHCALENDER':
            sliceName = 'coachModule';
            availabilitySliceName = 'coachAvailability';
            openPopState = 'coachEditScheduledStudents';
            closePopupActions = closeCoachEditScheduledStudents;
            scheduledStudentsApi = getCoachScheduledStudents;
            scheduledStudentsState = 'coachScheduledStudents';
            editScheduledStudentsApi = editCoachScheduledStudents;
            assignedStudentsApi = getCoachAssignStudents;
            assignedStudentsState = 'assignedStudents';
            meetingIdState = 'meetingId';
            break;

        default:
            sliceName = null;
            availabilitySliceName = null;
            openPopState = null;
            closePopupActions = null;
            scheduledStudentsApi = null;
            scheduledStudentsState = null;
            editScheduledStudentsApi = null;
            assignedStudentsApi = null;
            assignedStudentsState = null;
            meetingIdState = null;
            break;
    }

    const stateSelector = useSelector(state => state[sliceName]);
    const availabilityStateSelector = useSelector(
        state => state[availabilitySliceName]
    );

    const { [assignedStudentsState]: assignedStudents } = stateSelector;

    const {
        [scheduledStudentsState]: scheduledStudents,
        [openPopState]: open,
        [meetingIdState]: meetingId,
    } = availabilityStateSelector;

    useEffect(() => {
        dispatch(assignedStudentsApi(id)).then(() => {
            dispatch(scheduledStudentsApi(meetingId));
        });
    }, [dispatch]);

    useEffect(() => {
        if (assignedStudents && assignedStudents.length > 0) {
            const transformedData = assignedStudents.map((stu, index) => ({
                'S. No.': index + 1,
                'Student Name': stu.student.name,
                Program:
                    stu.student.packages.map(pack => pack.name).join(', ') ||
                    'N/A',
                Batch:
                    stu.student.batches
                        .map(batch => batch.batch_name)
                        .join(', ') || 'N/A',
                Select: stu.is_active ? 'Active' : 'Inactive',
                is_active: stu.is_active,
                id: stu.student.id,
            }));

            // Filter the students based on selected package and batch
            const filtered = transformedData.filter(student => {
                const matchesTerm = selectedTerm
                    ? student.Program.includes(selectedTerm)
                    : true;

                const matchesBatch = selectedBatch
                    ? student.Batch.includes(selectedBatch)
                    : true;

                const matchesName = searchName
                    ? student['Student Name']
                          .toLowerCase()
                          .includes(searchName.toLowerCase())
                    : true;

                return matchesTerm && matchesBatch && matchesName;
            });

            setFilteredStudents(filtered);
        } else {
            setFilteredStudents();
        }
    }, [assignedStudents, selectedTerm, selectedBatch, searchName]);

    const batchOptions =
        assignedStudents && Array.isArray(assignedStudents)
            ? [
                  ...new Set(
                      assignedStudents
                          //   .filter(
                          //       student =>
                          //           !selectedTerm ||
                          //           student.student.packages.some(
                          //               pack => pack.name === selectedTerm
                          //           )
                          //   )
                          .flatMap(student =>
                              student.student.batches.map(
                                  batch => batch.batch_name
                              )
                          )
                  ),
              ]
            : [];

    const academicTermOptions =
        assignedStudents && Array.isArray(assignedStudents)
            ? [
                  ...new Set(
                      assignedStudents
                          .filter(
                              student =>
                                  !selectedBatch ||
                                  student.student.batches.some(
                                      batch =>
                                          batch.batch_name === selectedBatch
                                  )
                          )
                          .flatMap(student =>
                              student.student.packages.map(pack => pack.name)
                          )
                  ),
              ]
            : [];

    useEffect(() => {
        if (scheduledStudents) {
            setSelectedStudents(
                scheduledStudents.map(student => student.student_id)
            );
        }
    }, [scheduledStudents]);

    const handleSelectStudent = id => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        const Id = meetingId;
        const data = {
            admin_user_id: Number(id),
            studentId: selectedStudents.map(id => id),
        };
        dispatch(editScheduledStudentsApi({ Id, data })).then(() => {
            dispatch(closePopupActions());
        });
    };

    const content = (
        <>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 0 }}>
                <Grid item sm={6}>
                    <CustomTextField
                        select
                        label="Program"
                        value={selectedTerm}
                        onChange={e => setSelectedTerm(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {academicTermOptions.map(term => (
                            <MenuItem key={term} value={term}>
                                {term}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CustomTextField
                        select
                        label="Batch"
                        value={selectedBatch}
                        onChange={e => setSelectedBatch(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {batchOptions.map(batch => (
                            <MenuItem key={batch} value={batch}>
                                {batch}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ border: '1px solid #C2C2E7' }} />
                </Grid>
                <Grid item xs={12} marginBottom={2}>
                    <CustomTextField
                        label="Search By Student Name"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                    />
                </Grid>
            </Grid>
            <PopUpTable
                headers={headers}
                initialData={filteredStudents}
                onRowClick={handleSelectStudent}
                selectedBox={selectedStudents}
            />
            <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mt: 2, textAlign: 'center' }}
            >
                {selectedStudents.length} Student(s) Selected
            </Typography>
        </>
    );

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            style={{
                backgroundColor: '#F56D3B',
                borderColor: '#F56D3B',
                color: '#FFFFFF',
            }}
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={open}
            handleClose={() => dispatch(closePopupActions())}
            title={`Assign Students to the Session`}
            content={content}
            actions={actions}
        />
    );
};

export default EditStudentsFromSession;
