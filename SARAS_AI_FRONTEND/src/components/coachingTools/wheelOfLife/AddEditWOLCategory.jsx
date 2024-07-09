import React, { useEffect, useState } from 'react'
import ReusableDialog from '../../CustomFields/ReusableDialog'
import { Button, Grid } from '@mui/material'
import CustomTextField from '../../CustomFields/CustomTextField'
import { useDispatch, useSelector } from 'react-redux'
import { setAddEditWolCategory } from '../../../redux/features/coachingTools/wol/wolSlice'

const AddEditWOLCategory = (editData) => {
    const dispatch = useDispatch();
    const { openAddEditWolCategory } = useSelector((state) => state.wol);
    const [categoryName, setCategoryName] = useState("")

    const handleSubmit = () => {
        console.log('Submit')
        if (editData) {
            setCategoryName(editData.categoryName);
            console.log('Edit')
        }
        console.log('Add')
    }

    useEffect(() => {
        console.log(editData)
        if (editData) {
            setCategoryName(editData.category)
        }
    }, [editData])

    const actions = editData ? (
        <Button
            onClick={handleSubmit}
            style={{
                backgroundColor: "#F56D3B",
                borderColor: "#F56D3B",
                color: "#FFFFFF",
            }}>
            Update
        </Button >
    ) : (
        <Button
            onClick={handleSubmit}
            style={{
                backgroundColor: "#F56D3B",
                borderColor: "#F56D3B",
                color: "#FFFFFF",
            }}
        >
            Submit
        </Button>
    )

    const content = (
        <Grid container spacing={2} justifyContent="center">
            <Grid item sm={6}>

                <CustomTextField
                    label="WOL Category"
                    placeholder="Enter WOL Category"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
            </Grid>
        </Grid>
    )

    return (
        <ReusableDialog
            open={openAddEditWolCategory}
            handleClose={() => dispatch(setAddEditWolCategory(false))}
            title={editData ? "Edit New WOL Category" : "Add New WOL Category"}
            content={content}
            actions={actions}
        />
    )
}

export default AddEditWOLCategory