import { Button, Divider, Grid, MenuItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTaMenuAssignedStudents } from '../../../../redux/features/taModule/tamenuSlice';
import { getCoachMenuAssignedStudents } from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import {
    closeEditParticipantsDialog,
    closeSelectStudents,
    openEditParticipantsDialog,
    openEditSession,
    openParticipantsDialog,
    openScheduleNewSession,
} from '../../../../redux/features/commonCalender/commonCalender';
import CustomTextField from '../../../CustomFields/CustomTextField';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import PopUpTable from '../../../CommonComponent/PopUpTable';
import CustomButton from '../../../CustomFields/CustomButton';

const name = String(localStorage.getItem('name') || 'Name');

const headers = ['S. No.', 'Student Name', 'Program', 'Batch', 'Select'];

const SelectStudents = ({ componentName }) => {
    const dispatch = useDispatch();
    const [selectedTerm, setSelectedTerm] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [searchName, setSearchName] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);

    let sliceName, getStudentsApi, studentDataState;

    switch (componentName) {
        case 'TAMENU':
            sliceName = 'taMenu';
            getStudentsApi = getTaMenuAssignedStudents;
            studentDataState = 'assignedTaStudents';
            break;

        case 'COACHMENU':
            sliceName = 'coachMenu';
            getStudentsApi = getCoachMenuAssignedStudents;
            studentDataState = 'assignedCoachStudents';
            break;

        default:
            sliceName = null;
            getStudentsApi = null;
            studentDataState = null;
            break;
    }

    const stateSelector = useSelector(state => state[sliceName]);

    const {
        students,
        batches,
        selectStudentPopup,
        preSelectedStudents,
        sessionData,
        participantsData,
    } = useSelector(state => state.commonCalender);

    console.log(
        { sessionData: sessionData },
        { participantsData: participantsData }
    );
    const { [studentDataState]: studentsData } = stateSelector || {};

    useEffect(() => {
        dispatch(getStudentsApi());
    }, [dispatch]);

    useEffect(() => {
        if (studentsData && studentsData.length > 0) {
            const transformedData = studentsData
                // filter(item =>item.student.batches.some(batch => batch.is_active === 1)).
                .map((stu, index) => ({
                    'S. No.': index + 1,
                    'Student Name': stu.student.name,
                    Program:
                        stu.student.packages
                            .map(pack => pack.name)
                            .join(', ') || 'N/A',
                    Batch:
                        stu.student.batches
                            .map(batch => batch.batch_name)
                            .join(', ') || 'N/A',
                    Select: stu.is_active ? 'Active' : 'Inactive',
                    is_active: stu.is_active,
                    id: stu.student.id,
                }));

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
    }, [studentsData, selectedTerm, selectedBatch, searchName]);

    // useEffect(() => {
    //     const transformedPreSelectedStudents = preSelectedStudents.map(
    //         student => student.id
    //     );
    //     setSelectedStudents(transformedPreSelectedStudents);
    // }, [preSelectedStudents]);

    const batchOptions =
        studentsData && Array.isArray(studentsData)
            ? [
                  ...new Set(
                      studentsData
                          //   .filter(
                          //       student =>
                          //           !selectedTerm ||
                          //           student.student.academic_term === selectedTerm
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
        studentsData && Array.isArray(studentsData)
            ? [
                  ...new Set(
                      studentsData
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
        const getMatchingStudentIds = batchesToMatch => {
            const assignedBatchIds = studentsData.flatMap(stu =>
                stu.student.batches.map(batch => batch.batch_id)
            );

            const matchingBatchIds = batchesToMatch
                .filter(batch => assignedBatchIds.includes(batch.id))
                .map(batch => batch.id);

            return studentsData
                .filter(stu =>
                    stu.student.batches.some(batch =>
                        matchingBatchIds.includes(batch.batch_id)
                    )
                )
                .map(stu => stu.student.id);
        };

        let updatedSelectedStudents = [];

        if (participantsData && participantsData?.students?.length > 0) {
            updatedSelectedStudents = participantsData.students.map(
                student => student.id
            );
        }

        if (students && students.length > 0) {
            updatedSelectedStudents = students.map(student => student.id);
        }

        if (sessionData?.students?.length > 0) {
            updatedSelectedStudents = sessionData.students.map(
                student => student.id
            );
        }

        if (batches && batches.length > 0) {
            updatedSelectedStudents = [
                ...new Set([
                    ...updatedSelectedStudents,
                    ...getMatchingStudentIds(batches),
                ]),
            ];
        }

        if (sessionData?.batch?.length > 0) {
            updatedSelectedStudents = [
                ...new Set([
                    ...updatedSelectedStudents,
                    ...getMatchingStudentIds(sessionData.batch),
                ]),
            ];
        }

        setSelectedStudents(updatedSelectedStudents);
    }, [students, batches, sessionData, participantsData]);

    const handleSelectStudents = id => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        const data = {
            studentId: selectedStudents
                ? selectedStudents.map(id => ({ id }))
                : [],
        };

        if (participantsData) {
            const updatedparticipantsData = {
                ...participantsData,
                students: participantsData?.students?.filter(participant =>
                    selectedStudents.includes(participant.id)
                ),
            };
            dispatch(openEditParticipantsDialog(updatedparticipantsData));
        } else if (sessionData) {
            const updatedSessionData = {
                ...sessionData,
                students: selectedStudents
                    ? selectedStudents.map(id => ({ id }))
                    : [],
            };
            dispatch(openEditSession({ sessionData: updatedSessionData }));
        } else {
            dispatch(openScheduleNewSession(data));
        }
        dispatch(closeSelectStudents());
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
                onRowClick={handleSelectStudents}
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
                textTransform: 'none',
                fontFamily: 'Bold',
            }}
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={selectStudentPopup}
            handleClose={() => dispatch(closeSelectStudents())}
            title={`Assign Students to '${name}'`}
            content={content}
            actions={actions}
        />
    );
};

export default SelectStudents;
