import React, { useEffect, useState } from 'react'
import ReusableDialog from '../../CustomFields/ReusableDialog'
import { Button, Grid } from '@mui/material'
import CustomTextField from '../../CustomFields/CustomTextField'
import { useDispatch, useSelector } from 'react-redux'
import { setAddEditWolCategory,setEditData } from '../../../redux/features/coachingTools/wol/wolSlice'
import {createWOLCategory , updateeWOLCategory , getWOLCategory} from '../../../redux/features/coachingTools/wol/wolSlice';

const AddEditWOLCategory = () => {
    const dispatch = useDispatch();
    const { openAddEditWolCategory, editData } = useSelector((state) => state.wol);
    const [categoryName, setCategoryName] = useState("")

    const handleSubmit = async () => {
        if (editData) {
            //setCategoryName(editData.name);
            console.log('Edit')
            try {
                const updatedWOL = await dispatch(updateeWOLCategory({ id: editData.id, data:{ name: categoryName }})).unwrap();
            } catch (error) {
                console.log(error.message) //TODO: Show toast message
            }
        }
        else {
            try {
                const createdWOL = await dispatch(createWOLCategory({ name: categoryName })).unwrap();
            } catch (error) {
                console.log(error.message) //TODO: Show toast message
            }
        }
        await dispatch(getWOLCategory());
        dispatch(setEditData(null))
        dispatch(setAddEditWolCategory(false))
    }

    const handlepopupClose = () => {
        dispatch(setAddEditWolCategory(false))
        dispatch(setEditData(null))
    }

    useEffect(() => {
        console.log(editData)
        if (editData) {
            setCategoryName(editData.name)
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
            handleClose={handlepopupClose}
            title={editData ? "Edit New WOL Category" : "Add New WOL Category"}
            content={content}
            actions={actions}
        />
    )
}

export default AddEditWOLCategory