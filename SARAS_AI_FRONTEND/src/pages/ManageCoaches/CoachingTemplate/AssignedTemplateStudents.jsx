import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
const headers = ['Sr. No.', 'Student Name', 'Enrollment Id'];
import AssignStudentsToTemplate from './AssignStudentsToTemplate';
import TemplateStudentsDataTable from './TemplateStudentsDataTable';
import AssignBatchesToTemplate from './AssignBatchesToTemplate';

const actionButtons = [
    {
        type: 'switch',
    },
    {
        type: 'delete',
        onClick: id => console.log(`Edit clicked for id ${id}`),
    },
];

const AssignedTemplateStudents = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [templateAssignedStudentData, setTemplateAssignedData] = useState([]);

    const {
        coachTemplates,
        assignStudentsToTemplate,
        assignBatchesToTemplate,
    } = useSelector(state => state.coachTemplate);

    useEffect(() => {
        const selectedTemplate = coachTemplates.find(
            item => item.id === Number(id)
        );

        const assignedStudents = selectedTemplate.student;

        if (assignedStudents && assignedStudents.length > 0) {
            const transformData = assignedStudents.map(item => {
                const studentName = item ? item.name : 'Unknown Student';
                const enrollmentId = item ? item.enrollment_id : 'Unknown Id';
                const isActive = item.is_active === 1;

                return {
                    id: item.id,
                    student_name: studentName,
                    enrollment_id: enrollmentId,
                    is_active: isActive,
                };
            });
            setTemplateAssignedData(transformData);
        }
    }, [coachTemplates]);

    return (
        <>
            <Header />
            <Sidebar />
            <TemplateStudentsDataTable
                headers={headers}
                initialData={templateAssignedStudentData}
                title="Assigned Students"
                //actionButtons={actionButtons}
                ta_id={id}
                dispatch={dispatch}
                componentName={'ASSIGNEDTEMPLATESTUDENT'}
                template_id={id}
            />
            {assignStudentsToTemplate && (
                <AssignStudentsToTemplate
                    componentname={'CoachTemplate'}
                    assignedStudents={templateAssignedStudentData}
                />
            )}
            {assignBatchesToTemplate && (
                <AssignBatchesToTemplate
                    componentname={'CoachTemplate'}
                    assignedStudents={templateAssignedStudentData}
                />
            )}
        </>
    );
};

export default AssignedTemplateStudents;
