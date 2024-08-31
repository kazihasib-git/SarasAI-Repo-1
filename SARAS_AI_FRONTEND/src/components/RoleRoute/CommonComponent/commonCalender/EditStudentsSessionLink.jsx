import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getTaMenuAssignedStudents, getTaMenuSessions, updateStudentsInTaSession } from '../../../../redux/features/taModule/tamenuSlice';
import { getCoachMenuAssignedStudents, getCoachMenuSessions, updateBatchesInCoachSession, updateStudentsInCoachSession } from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import { toast } from 'react-toastify';
import { closeEditStudents } from '../../../../redux/features/commonCalender/commonCalender';
import CustomButton from '../../../CustomFields/CustomButton';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import { Divider, Grid, MenuItem, Typography } from '@mui/material';
import CustomTextField from '../../../CustomFields/CustomTextField';
import PopUpTable from '../../../CommonComponent/PopUpTable';

const headers = ['S. No.', 'Student Name', 'Program', 'Batch', 'Select'];

const EditStudentsSessionLink = ({ componentName }) => {
  console.log(componentName)
  const dispatch = useDispatch();

  const [selectedTerm, setSelectedTerm] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [searchName, setSearchName] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  let sliceName,
    getAssignStudentsApi,
    assignedStudentsState,
    editStudentsApi,
    getSessionApi;

  switch (componentName) {
    case 'TAMENU':
      sliceName = 'taMenu';
      getAssignStudentsApi = getTaMenuAssignedStudents;
      assignedStudentsState = 'assignedTaStudents';
      editStudentsApi = updateStudentsInTaSession
      getSessionApi = getTaMenuSessions
      break;

    case 'COACHMENU':
      sliceName = 'coachMenu';
      getAssignStudentsApi = getCoachMenuAssignedStudents;
      assignedStudentsState = 'assignedCoachStudents';
      editStudentsApi = updateStudentsInCoachSession;
      getSessionApi = getCoachMenuSessions
      break;

    default:
      sliceName = null;
      getAssignStudentsApi = null;
      assignedStudentsState = null;
      editStudentsApi = null;
      getSessionApi = null;
      break;
  }

  const stateSelector = useSelector(state => state[sliceName]);

  const { [assignedStudentsState]: students } = stateSelector

  const { editStudents, meetingId, openEditStudentsPopup } = useSelector((state) => state.commonCalender)

  useEffect(() => {
    dispatch(getAssignStudentsApi())
  }, [dispatch])


  useEffect(() => {
    if (students && students.length > 0) {
      const transformedData = students.map((stu, index) => ({
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
      setFilteredStudents([]);
    }
  }, [students, selectedTerm, selectedBatch, searchName])

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
    if (editStudents) {
      setSelectedStudents(
        editStudents.map(student => student.student_id)
      );
    }
  }, [editStudents])

  const handleSelectStudent = (id) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const validate = () => {
    if (selectedStudents.length === 0) {
      toast.error('Please Select Atleast One Student');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const id = meetingId;
    const data = {
      studentId : selectedStudents.map(id => id),
    }
    dispatch(editStudentsApi({ id, data }))
      .then(() => {
        dispatch(closeEditStudents())
        dispatch(getSessionApi())
      })
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
        textTransform: 'none',
      }}
    >
      Submit
    </CustomButton>
  )

  return (
    <ReusableDialog
      open={openEditStudentsPopup}
      handleClose={() => dispatch(closeEditStudents())}
      title={`Assign Students to Session`}
      content={content}
      actions={actions}
    />
  )
}

export default EditStudentsSessionLink