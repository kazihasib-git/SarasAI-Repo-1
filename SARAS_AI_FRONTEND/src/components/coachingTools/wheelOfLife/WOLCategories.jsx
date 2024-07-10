import React from 'react'
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import DynamicTable from '../../CommonComponent/DynamicTable';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setAddEditWolCategory } from '../../../redux/features/coachingTools/wol/wolSlice';
import AddEditWOLCategory from './AddEditWOLCategory';

const WOLCategories = () => {

    const dispatch = useDispatch();
    const { openAddEditWolCategory } = useSelector((state) => state.wol);

    const headers = ['S. No.', 'Wheel Of Life Category', 'Action'];

    const dummyData = [
        { category: 'Health' },
        { category: 'Wealth' },
        { category: 'Family' },
        { category: 'Friends' },
        { category: 'Romance' },
        { category: 'Personal Growth' },
        { category: 'Fun & Recreation' },
        { category: 'Physical Environment' },
    ];

    const actionButtons = [
        {
            type: 'edit',
            onClick: (id) => {
                console.log('Edit', id)
            }
        },
        {
            type: 'delete',
            onClick: (id) => {
                console.log('Delete', id)
            }
        }
    ]

    const handleAddNewWOLCategory = () => {
        console.log('Add New WOL Category')
        dispatch(setAddEditWolCategory(true))
    }

    console.log("openAddEditWolCategory", openAddEditWolCategory)

    return (
        <>
            <Header />
            <Sidebar />
            <>
                <Box display="flex" justifyContent="space-between" marginTop={3} alignItems={"center"}>
                    <p style={{ fontSize: "44px", justifyContent: "center" }}>
                        Wheel Of Life Categories
                    </p>
                    <div className='inputBtnContainer'>
                        <button className='buttonContainer'
                            onClick={handleAddNewWOLCategory} 
                        >
                            <i className="fas fa-plus"></i>
                            <span>Add New WOL Category</span>
                        </button>
                    </div>
                </Box>
                {dummyData.length > 0 ? (
                    <DynamicTable
                        headers={headers}
                        initialData={dummyData}
                        actionButtons={actionButtons}
                    />
                ) : (
                    <div>
                        <p>No Data Available</p>
                    </div>
                )}
                {openAddEditWolCategory && <AddEditWOLCategory editData={""} /> }
            </>
        </>
    )
}

export default WOLCategories