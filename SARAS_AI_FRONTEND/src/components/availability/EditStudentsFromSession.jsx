import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAssignStudents, getStudentBatchMapping } from '../../redux/features/adminModule/ta/taSlice'

const EditStudentsFromSession = ({ componentName }) => {
    const dispatch = useDispatch()
    const {id, name} = useParams()

    const [selectedTerm, setSelectedTerm] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [searchName, setSearchName] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);

    let sliceName,
        assignedStudentsApi,
        assignedStudentsState;

    switch (componentName) {
        case 'TASCHEDULE' : 
            sliceName = 'taModule';
            assignedStudentsApi = getAssignStudents
            assignedStudentsState = 'assignedStudents'
            break;
        case 'COACHSCHEDULE' :
            sliceName = 'coachModule';
            assignedStudentsApi = ''
            assignedStudentsState = ''
            break;
        
        default :
            sliceName = null;
            assignedStudentsApi = null;
            assignedStudentsState = null;
            break;
    }

    const stateSelector = useSelector((state) => state[sliceName])

    const {
        [assignedStudentsState] : assignedStudents
    } = stateSelector;

    useEffect(() => {
        dispatch(assignedStudentsApi(id))
    }, [dispatch])

    useEffect(() => {
        if(assignedStudents && assignedStudents.length > 0){
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
    }, [assignedStudents, selectedTerm, selectedBatch, searchName])

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
        
    }, [])

    const handleSelectStudent = id => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    return (
        <div>EditStudentsFromSession</div>
    )
}

export default EditStudentsFromSession