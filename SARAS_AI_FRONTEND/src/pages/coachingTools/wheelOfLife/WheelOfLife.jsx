import React from 'react'
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import DynamicTable from '../../../components/CommonComponent/DynamicTable';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenWolCategories } from '../../../redux/features/coachingTools/wol/wolSlice';
import WOLCategories from '../../../components/coachingTools/wheelOfLife/WOLCategories';
import { useNavigate } from 'react-router-dom';

const headers = ['S. No.', 'Student Name', 'Batch', 'Attempted On', 'View Report'];

const dummyData = [
    { studentName: 'John Doe', batch: 'Batch 1', attemptedOn: '12/12/2021' },
    { studentName: 'Jane Doe', batch: 'Batch 2', attemptedOn: '12/12/2021' },
    { studentName: 'John Doe', batch: 'Batch 1', attemptedOn: '12/12/2021' },
    { studentName: 'Jane Doe', batch: 'Batch 2', attemptedOn: '12/12/2021' },
    { studentName: 'John Doe', batch: 'Batch 1', attemptedOn: '12/12/2021' },
    { studentName: 'Jane Doe', batch: 'Batch 2', attemptedOn: '12/12/2021' },
    { studentName: 'John Doe', batch: 'Batch 1', attemptedOn: '12/12/2021' },
    { studentName: 'Jane Doe', batch: 'Batch 2', attemptedOn: '12/12/2021' },
    { studentName: 'John Doe', batch: 'Batch 1', attemptedOn: '12/12/2021' },
    { studentName: 'Jane Doe', batch: 'Batch 2', attemptedOn: '12/12/2021' }
];

const WheelOfLife = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const actionButtons = [
        {
            type: 'view',
            onClick: (id) => {
                console.log('View Report', id)
            }
        }
    ]
    
    const handleWOLCategories = () => {
        console.log('WOL Categories')
        navigate('/wolCategories')
    }

    const handleWOLInstructions = () => {
        navigate('/wolInstructions')
    }

    return (
        <>
            <Header />
            <Sidebar />
            <>
                <Box display="flex" justifyContent="space-between" marginTop={3} alignItems={"center"}>
                    <p style={{ fontSize: "44px",fontWeight: 200, justifyContent: "center" }}>
                        Wheel Of Life
                    </p>
                    <Box className='inputBtnContainer' paddingBottom="16px">
                        <button className='buttonContainer' onClick={handleWOLCategories} > WOL Categories </button>
                        <button className='buttonContainer' onClick={handleWOLInstructions}>WOL Instructions</button>
                        <button className='buttonContainer' onClick={() => navigate('/wolQuestions') }>WOL Questions</button>
                        <button className='buttonContainer' onClick={() => navigate('/wolOptionsConfig') } >WOL Options Config</button>
                        <button className='buttonContainer' onClick={() => navigate('/wolTestConfig') }>WOL Test Config</button>
                    </Box>
                </Box>
                {dummyData.length > 0 ? (
                    <DynamicTable
                        headers={headers}
                        initialData={dummyData}
                        actionButtons={actionButtons}
                    //componentName={"WOL"}
                    />
                ) : (
                    <div>
                        <p>No Data Available</p>
                    </div>
                )}
            </>
        </>
    )
}

export default WheelOfLife