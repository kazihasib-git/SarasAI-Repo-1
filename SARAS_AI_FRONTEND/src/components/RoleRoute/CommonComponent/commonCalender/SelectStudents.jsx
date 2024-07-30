import { Button, Divider, Grid, MenuItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTaMenuAssignedStudents } from '../../../../redux/features/teachingAssistant/tamenuSlice';
import { getCoachMenuAssignedStudents } from '../../../../redux/features/coach/coachmenuprofileSilce';
import {
    closeSelectStudents,
    openScheduleNewSession,
} from '../../../../redux/features/commonCalender/commonCalender';
import CustomTextField from '../../../CustomFields/CustomTextField';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import PopUpTable from '../../../CommonComponent/PopUpTable';

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

const headers = ['S. No.', 'Student Name', 'Program', 'Batch', 'Select'];

const SelectStudents = ({ componentName }) => {
    console.log('componentName ', componentName);

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
    const { students, selectStudentPopup } = useSelector(
        state => state.commonCalender
    );

    const { [studentDataState]: studentsData } = stateSelector || {};

    useEffect(() => {
        dispatch(getStudentsApi());
    }, [dispatch]);

    console.log('Students Data : ', studentsData);

    useEffect(() => {
        if (studentsData && studentDataState.length > 0) {
            const transformedData = studentsData.map((stu, index) => ({
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

            // TODO : ADD FILTER

            setFilteredStudents(transformedData);
        }
    }, [studentsData, selectedTerm, selectedBatch, searchName]);

    const batchOptions =
        studentsData && Array.isArray(studentsData)
            ? [
                  ...new Set(
                      studentsData
                          .filter(
                              student =>
                                  !selectedTerm ||
                                  student.student.academic_term === selectedTerm
                          )
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
                      studentsData.flatMap(student =>
                          student.student.packages.map(pack => pack.name)
                      )
                  ),
              ]
            : [];

    console.log('Students : ', students, 'selectedStudents', selectedStudents);

    useEffect(() => {
        if (students) {
            setSelectedStudents(students.map(student => student.id));
        }
    }, [students]);

    const handleSelectStudents = id => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        const data = {
            students: selectedStudents
                ? selectedStudents.map(id => ({ id }))
                : [],
        };

        dispatch(openScheduleNewSession(data));
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
            }}
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={selectStudentPopup}
            handleClose={() => dispatch(closeSelectStudents())}
            title={`Assign Students`}
            content={content}
            actions={actions}
        />
    );
};

export default SelectStudents;