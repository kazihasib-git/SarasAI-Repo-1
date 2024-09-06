import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomButton from '../CustomFields/CustomButton';
import { Divider, Grid, MenuItem, Typography } from '@mui/material';
import PopUpTable from '../CommonComponent/PopUpTable';
import CustomTextField from '../CustomFields/CustomTextField';
import { closeStudentsPopup } from '../../redux/features/commonCalender/batchesAndStudents';
import { openScheduleSession } from '../../redux/features/adminModule/ta/taScheduling';
import { openCoachScheduleSession } from '../../redux/features/adminModule/coach/coachSchedule';
import { toast } from 'react-toastify';
import { MESSAGE_CONSTANTS } from '../../constants/messageConstants';

const headers = ['S. No.', 'Student Name', 'Program', 'Batch', 'Select'];

const studentsConfig = {
    TASCHEDULE: {
        openSchedulingPopup: openScheduleSession,
    },
    COACHSCHEDULE: {
        openSchedulingPopup: openCoachScheduleSession,
    },
};

const SelectStudents = ({ id, name, componentName, timezone }) => {
    const dispatch = useDispatch();

    const [selectedTerm, setSelectedTerm] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [searchName, setSearchName] = useState('');
    const [selectStudents, setSelectStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);

    const {
        userId,
        userName,
        openStudents,
        students,
        selectedStudents,
        timezoneId,
    } = useSelector(state => state.batchesAndStudents);

    const { openSchedulingPopup } = studentsConfig[componentName];

    useEffect(() => {
        if (students) {
            // Transform and filter the data
            const transformedData = students
                .filter(item => item.is_active === 1)
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
    }, [students, selectedTerm, selectedBatch, searchName]);

    const batchOptions =
        students && Array.isArray(students)
            ? [
                  ...new Set(
                      students
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
        students && Array.isArray(students)
            ? [
                  ...new Set(
                      students
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
        if (selectedStudents?.length > 0) {
            setSelectStudents(selectedStudents.map(student => student));
        }
    }, [selectedStudents]);

    const handleSelectStudent = id => {
        setSelectStudents(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const validate = () => {
        if (selectStudents.length === 0) {
            toast.error(MESSAGE_CONSTANTS.SELECT_ATLEAST_ONE_STUDENT);
            return false; // Return false if validation fails
        }
        return true; // Return true if validation passes
    };

    const handleSubmit = () => {
        if (!validate()) return;

        dispatch(
            openSchedulingPopup({
                id: userId,
                name: userName,
                student: selectStudents.map(id => ({ id })),
                timezoneId: timezone ? timezone.id : timezoneId,
            })
        );

        dispatch(closeStudentsPopup({ selectedStudents: selectStudents }));

        // dispatch(closeDialogAction());
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
                selectedBox={selectStudents}
            />
            <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mt: 2, textAlign: 'center' }}
            >
                {selectStudents.length} Student(s) Selected
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
            }}
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={openStudents}
            handleClose={() =>
                dispatch(
                    closeStudentsPopup({ selectedStudents: selectStudents })
                )
            }
            title={`Assign Students to Session`}
            content={content}
            actions={actions}
        />
    );
};

export default SelectStudents;
