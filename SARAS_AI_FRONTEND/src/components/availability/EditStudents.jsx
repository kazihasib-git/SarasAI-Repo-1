import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Typography, Grid, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAssignStudents } from '../../redux/features/adminModule/ta/taSlice';
import CustomTextField from '../CustomFields/CustomTextField';
import ReusableDialog from '../CustomFields/ReusableDialog';
import PopUpTable from '../CommonComponent/PopUpTable';
import {
    closeEditStudent,
    openScheduleSession,
} from '../../redux/features/adminModule/ta/taScheduling';

import { closeCoachEditStudent } from '../../redux/features/adminModule/coach/coachSchedule';

import { getCoachAssignStudents } from '../../redux/features/adminModule/coach/coachSlice';
import { useParams } from 'react-router-dom';
import CustomButton from '../CustomFields/CustomButton';

const EditStudents = ({ componentname }) => {
    console.log('Component Name :', componentname);
    const dispatch = useDispatch();
    const { id, name } = useParams();

    const [selectedTerm, setSelectedTerm] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [searchName, setSearchName] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState('');

    let sliceName,
        stateModuleKey,
        nameKey,
        assignStudentOpenKey,
        closeDialogAction,
        getAssignStudentAction,
        editStudentKey,
        selectedStudentKey;

    let schedulingState, nameKeyScheduling, idKeyScheduling;

    switch (componentname) {
        case 'COACHSCHEDULE':
            sliceName = 'coachModule'
            stateModuleKey = 'coachModule';
            nameKey = 'coach_name';
            assignStudentOpenKey = 'openCoachEditStudent';
            editStudentKey = 'assignedStudents';
            selectedStudentKey = 'student';
            closeDialogAction = closeCoachEditStudent;
            getAssignStudentAction = getCoachAssignStudents;
            schedulingState = useSelector(state => state.coachScheduling);
            nameKeyScheduling = 'coachName';
            idKeyScheduling = 'coachID';
            break;

        case 'TASCHEDULE':
            sliceName = 'taModule'
            stateModuleKey = 'taModule';
            nameKey = 'ta_name';
            assignStudentOpenKey = 'openEditStudent';
            editStudentKey = 'assignedStudents';
            selectedStudentKey = 'student';
            closeDialogAction = closeEditStudent;
            getAssignStudentAction = getAssignStudents;
            schedulingState = useSelector(state => state.taScheduling);
            nameKeyScheduling = 'taName';
            idKeyScheduling = 'taID';
            break;

        default:
            sliceName = null;
            stateModuleKey = null;
            nameKey = null;
            assignStudentOpenKey = null;
            editStudentKey = null;
            selectedStudentKey = null;
            closeDialogAction = null;
            getAssignStudentAction = null;
            schedulingState = null;
            nameKeyScheduling = null;
            idKeyScheduling = null;
            break;
    }

    const stateSelector = useSelector((state) => state[sliceName])

    // const stateSelector = useSelector(state =>
    //     stateModuleKey ? state[stateModuleKey] : {}
    // );

    const {
        [nameKeyScheduling]: assignedName,
        [idKeyScheduling]: assignedId,
        [assignStudentOpenKey]: assignStudentOpen,
        [selectedStudentKey]: selectedStudent,
    } = schedulingState || {};

    const {
        [nameKey]: assignedTAName,
        taID,
        coachID,
        [editStudentKey]: assignedStudents,
    } = stateSelector || {};

    useEffect(() => {
        const userAdminId = assignedId || id;
        if (stateModuleKey && assignStudentOpen) {
            dispatch(getAssignStudentAction(userAdminId));
        }
    }, [
        dispatch,
        stateModuleKey,
        assignStudentOpen,
        assignedId,
        getAssignStudentAction,
    ]);

    useEffect(() => {
        if (assignedStudents) {
            // Transform and filter the data
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
        console.log('Selected Student inside use Effect : ', selectedStudent);
        if (selectedStudent) {
            setSelectedStudents(selectedStudent.map(student => student.id));
        }
    }, [selectedStudent]);

    console.log('already selected students: ', selectedStudent);

    const handleSelectStudent = id => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        const id =
            componentname === 'ADDITCOACH'
                ? coachID || assignedId
                : taID || assignedId;

        const data = {
            [componentname === 'ADDITCOACH' ? 'Coach_id' : 'ta_id']: id,
            name: assignedName,
            student: selectedStudents
                ? selectedStudents.map(id => ({ id }))
                : [],
        };

        console.log('SUBMIT DATA :', data);
        dispatch(
            openScheduleSession({
                id,
                name: assignedName,
                student: selectedStudents.map(id => ({ id })),
            })
        );

        dispatch(closeDialogAction());
    };

    const headers = ['S. No.', 'Student Name', 'Program', 'Batch', 'Select'];

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

    const assignedTA = assignedTAName || assignedName || name;

    return (
        <ReusableDialog
            open={assignStudentOpen}
            handleClose={() => dispatch(closeDialogAction())}
            title={`Assign Students to '${assignedTA}'`}
            content={content}
            actions={actions}
        />
    );
};

export default EditStudents;
