import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTaMenuAssignedStudents } from '../../../../redux/features/taModule/tamenuSlice'
import { getCoachMenuAssignedStudents } from '../../../../redux/features/coachModule/coachmenuprofileSilce'
import { closeEditStudents } from '../../../../redux/features/commonCalender/commonCalender'
import ReusableDialog from '../../../CustomFields/ReusableDialog'
import { Divider, Grid, MenuItem } from '@mui/material'
import CustomTextField from '../../../CustomFields/CustomTextField'
import PopUpTable from '../../../CommonComponent/PopUpTable'

const EditBatchesSessionLink = () => {
    const dispatch = useDispatch()

    const [selectedTerm, setSelectedTerm] = useState([])
    const [selectedBatch, setSelectedBatch] = useState('');
    const [searchName, setSearchName] = useState('')
    const [selectedStudents, setSelectedStudents] = useState([])
    const [filteredStudents, setFilteredStudents] = useState([]);

    let sliceName, getStudentsApi, studentDataState;

    switch ( componentName ) {
        case 'TAMENU':
            sliceName = 'taMenu'
            getStudentsApi = getTaMenuAssignedStudents;
            studentDataState = 'assignedTaStudents';
            break;
        
        case 'COACHMENU':
            sliceName = 'coachMenu'
            getStudentsApi = getCoachMenuAssignedStudents;
            studentDataState = 'assignedCoachStudents';
            break;
    
        default:
            sliceName = null;
            getStudentsApi = null;
            studentDataState = null;
            break;
    }

    const stateSelector = useSelector((state) => state[sliceName])

    const { [studentDataState]: studentsData } = stateSelector

    const { editStudents } = useSelector((state) => state.commonCalender)

    useEffect(() => {
        dispatch(getStudentsApi())
    }, [dispatch])

    useEffect(() => {
        const transformedSelectedStudents = editStudents.map((student) => student.id);
        setSelectedStudents(transformedSelectedStudents);
    },[editStudents])

    useEffect(() => {
        if (studentsData && studentsData.length > 0) {
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

    useEffect(() => {
        
    },[])

    const handleSelectStudents = id => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
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
               textTransform: 'none' 
            }}
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
          open={openEditStudentsPopup}
          handleClose={() => dispatch(closeEditStudents())}
          title={`Assign Students`}
          content={content}
          actions={actions}
        />
    )   
}

export default EditBatchesSessionLink