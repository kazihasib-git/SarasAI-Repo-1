import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Typography, Grid, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    closeAssignStudentsToTemplate,
    assignStudentsToTemplate,
    getStudentBatchMapping,
    getAllCoachTemplates
} from '../../../redux/features/adminModule/coach/coachTemplateSlice';
import CustomTextField from '../../../components/CustomFields/CustomTextField';
import ReusableDialog from '../../../components/CustomFields/ReusableDialog';
import CustomButton from '../../../components/CustomFields/CustomButton';
import PopUpTable from '../../../components/CommonComponent/PopUpTable';

const AssignStudentsToTemplate = ({ componentname, assignedStudents }) => {
    const dispatch = useDispatch();
    const [selectedTerm, setSelectedTerm] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [searchName, setSearchName] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);

    let stateModuleKey,
        nameKey,
        assignStudentOpenKey,
        assignMappingKey,
        closeDialogAction,
        openSuccessAction,
        getBatchMappingAction,
        postAssignAction;
    let schedulingState, nameKeyScheduling, idKeyScheduling;

    switch (componentname) {
        case 'CoachTemplate':
                stateModuleKey = 'coachTemplate';
                assignStudentOpenKey = 'assignStudentsToTemplate';
                assignMappingKey = 'studentBatchMapping';
                closeDialogAction = closeAssignStudentsToTemplate;
                // openSuccessAction = openSuccessPopup;
                getBatchMappingAction = getStudentBatchMapping;
                postAssignAction = assignStudentsToTemplate;
                schedulingState = useSelector(state => state.coachTemplate);
                idKeyScheduling = 'templateIdToAssignStudents';
                break;
        default:
            stateModuleKey = null;
            nameKey = null;
            assignStudentOpenKey = null;
            assignMappingKey = null;
            closeDialogAction = null;
            openSuccessAction = null;
            getBatchMappingAction = null;
            postAssignAction = null;
            schedulingState = null;
            nameKeyScheduling = null;
            idKeyScheduling = null;
            break;
    }

    const stateSelector = useSelector(state =>
        stateModuleKey ? state[stateModuleKey] : {}
    );
    const { [idKeyScheduling]: assignedId } =
        schedulingState || {};

    const {
        [assignStudentOpenKey]: assignStudentOpen,
        [assignMappingKey]: studentBatchMapping,
    } = stateSelector || {};

    useEffect(() => {
        if (stateModuleKey && assignStudentOpen) {
            dispatch(getBatchMappingAction());
        }
    }, [assignStudentOpen, dispatch, getBatchMappingAction]);

    useEffect(() => {
        if (assignStudentOpen) {
                const previouslyAssignedStudents = assignedStudents.map(
                    student => student.id
                );
                setSelectedStudents(previouslyAssignedStudents);
            }
    }, [assignedStudents]);

    useEffect(() => {
        if (studentBatchMapping && studentBatchMapping.length > 0) {
            const transformedData = studentBatchMapping.map(
                (student, index) => ({
                    'S. No.': index + 1,
                    'Student Name': student.student_name,
                    Program:
                        student.packages.map(pack => pack.name).join(', ') ||
                        'N/A',
                    Batch:
                        student.batches
                            .map(batch => batch.batch_name)
                            .join(', ') || 'N/A',
                    Select: student.is_active ? 1 : 0,
                    id: student.student_id,
                    is_active: student.is_active,
                })
            );

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
    }, [studentBatchMapping, selectedTerm, selectedBatch, searchName]);

    // Generate unique batch options and program options
    const batchOptions = studentBatchMapping
        ? [
              ...new Set(
                  studentBatchMapping
                      .filter(
                          student =>
                              !selectedTerm ||
                              student.packages
                                  .map(pack => pack.name)
                                  .includes(selectedTerm)
                      )
                      .flatMap(student =>
                          student.batches.map(batch => batch.batch_name)
                      )
              ),
          ]
        : [];

    const academicTermOptions = studentBatchMapping
        ? [
              ...new Set(
                  studentBatchMapping.flatMap(student =>
                      student.packages.map(pack => pack.name)
                  )
              ),
          ]
        : [];

    const handleSelectStudent = id => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        const data = {
            template_id: assignedId,
            users: selectedStudents.map(id => ({ 
                   assignable_id: id.toString(),
                   assignable_type: "Student"
            })),
        };
        dispatch(postAssignAction(data)).then(() => {
            dispatch(getAllCoachTemplates());
            dispatch(closeDialogAction());
        }); 
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

    return (
        <ReusableDialog
            open={assignStudentOpen}
            handleClose={() => dispatch(closeDialogAction())}
            title={`Assign Students to Template`}
            content={content}
            actions={actions}
        />
    );
};

export default AssignStudentsToTemplate;
