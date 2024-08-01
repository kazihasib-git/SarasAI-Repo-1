import React, { useState } from 'react';
import CoachMenu from './CoachMenu';
import DynamicTable from '../../../components/CommonComponent/DynamicTable';
import AssessmentDialog from './AssessmentDialog';

const headers = [
    'S. No.',
    'Student Name',
    'Program',
    'Assessments Given ',
    'Assessments Attempted',
    'Action',
];

const dummyData = [
    {
        studentName: 'Aniket Sharma',
        program: 'B.S. in AI: Jan 2025',
        assessmentGiven: '4',
        assessmentsAttempted: '2',
    },
    {
        studentName: 'John Doe',
        program: 'Bs in AI: Spring 24-28',
        assessmentsGiven: '4',
        assessmentsAttempted: '2',
    },
    {
        studentName: 'John Doe',
        program: 'Bs in AI: Spring 24-28',
        assessmentsGiven: '4',
        assessmentsAttempted: '2',
    },
    {
        studentName: 'Jane Doe',
        program: 'Bs in AI: Spring 24-28',
        assessmentsGiven: '4',
        assessmentsAttempted: '2',
    },
    {
        studentName: 'John Doe',
        program: 'Bs in AI: Spring 24-28',
        assessmentsGiven: '4',
        assessmentsAttempted: '2',
    },
    {
        studentName: 'Jane Doe',
        program: 'Bs in AI: Spring 24-28',
        assessmentsGiven: '4',
        assessmentsAttempted: '2',
    },
    {
        studentName: 'John Doe',
        program: 'Bs in AI: Spring 24-28',
        assessmentsGiven: '4',
        assessmentsAttempted: '2',
    },
    {
        studentName: 'Jane Doe',
        program: 'Bs in AI: Spring 24-28',
        assessmentsGiven: '4',
        assessmentsAttempted: '2',
    },
    {
        studentName: 'John Doe',
        program: 'Bs in AI: Spring 24-28',
        assessmentsGiven: '4',
        assessmentsAttempted: '2',
    },
    {
        studentName: 'Jane Doe',
        program: 'Bs in AI: Spring 24-28',
        assessmentsGiven: '4',
        assessmentsAttempted: '2',
    },

    {
        studentName: 'John Doe',
        program: 'Bs in AI: Spring 24-28',
        assessmentsGiven: '4',
        assessmentsAttempted: '2',
    },
    {
        studentName: 'John Doe',
        program: 'Bs in AI: Spring 24-28',
        assessmentsGiven: '4',
        assessmentsAttempted: '2',
    },
    {
        studentName: 'John Doe',
        program: 'Bs in AI: Spring 24-28',
        assessmentsGiven: '4',
        assessmentsAttempted: '2',
    },
    {
        studentName: 'John Doe',
        program: 'Bs in AI: Spring 24-28',
        assessmentsGiven: '4',
        assessmentsAttempted: '2',
    },
    {
        studentName: 'John Doe',
        program: 'Bs in AI: Spring 24-28',
        assessmentsGiven: '4',
        assessmentsAttempted: '2',
    },
];

const CoachMenuAssessments = () => {
    const [assessmentData, setAssessmentData] = useState([]);
    const [assessmentModalOpen, setassessmentModalOpen] = useState(false);

    const actionButtons = [
        {
            type: 'view',
            onClick: id => {
                // Set dummy assessment data
                const dummyAssessmentData = [
                    { name: 'Assessment 1', status: 'Completed' },
                    { name: 'Assessment 2', status: 'Completed' },
                    { name: 'Assessment 3', status: 'In Progress' },
                    { name: 'Assessment 4', status: 'Not Attempted' },
                ];
                setAssessmentData(dummyAssessmentData);
                setassessmentModalOpen(true);
            },
        },
    ];

    return (
        <div>
            <CoachMenu />
            <>
                <p
                    style={{
                        fontSize: '44px',
                        fontWeight: 200,
                        justifyContent: 'center',
                    }}
                >
                    Assessments
                </p>
                {dummyData.length > 0 ? (
                    <DynamicTable
                        headers={headers}
                        initialData={dummyData}
                        actionButtons={actionButtons}
                        componentName={'ASSESSMENT'}
                    />
                ) : (
                    <div>
                        <p>No Data Available</p>
                    </div>
                )}
            </>
            <AssessmentDialog
                open={assessmentModalOpen} // Use modalOpen here
                onClose={() => setassessmentModalOpen(false)} // Close dialog
                assessments={assessmentData}
            />
        </div>
    );
};

export default CoachMenuAssessments;
