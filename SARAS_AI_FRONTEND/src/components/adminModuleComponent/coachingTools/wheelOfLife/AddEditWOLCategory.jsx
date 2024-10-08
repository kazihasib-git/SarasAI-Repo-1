import React, { useEffect, useState } from 'react';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import { Box, Button, Grid, styled } from '@mui/material';
import CustomTextField from '../../../CustomFields/CustomTextField';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    createWOLCategory,
    updateeWOLCategory,
    getWOLCategory,
    setAddEditWolCategory,
    setEditData,
    updateWOLCategory,
} from '../../../../redux/features/adminModule/coachingTools/wol/wolSlice';
import CustomButton from '../../../CustomFields/CustomButton';

const AddEditWOLCategory = () => {
    const dispatch = useDispatch();
    const { openAddEditWolCategory, editData } = useSelector(
        state => state.wol
    );
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = async () => {
        if (editData) {
            try {
                const updatedWOL = await dispatch(
                    updateWOLCategory({
                        id: editData.id,
                        data: { name: categoryName },
                    })
                ).unwrap();
            } catch (error) {
                console.error(error.message);
            }
        } else {
            try {
                if (categoryName) {
                    const createdWOL = await dispatch(
                        createWOLCategory({ name: categoryName })
                    ).unwrap();
                } else {
                    toast.error('Please enter category');
                    return;
                }
                // toast.success('Category created successfully');
            } catch (error) {
                return; // Prevent further execution if API fails
            }
        }
        dispatch(getWOLCategory()).then(() => {
            dispatch(setAddEditWolCategory(false));
            dispatch(setEditData(null));
        });
    };

    const handlepopupClose = () => {
        dispatch(setAddEditWolCategory(false));
        dispatch(setEditData(null));
    };

    useEffect(() => {
        if (editData) {
            setCategoryName(editData.name);
        }
    }, [editData]);

    const actions = editData ? (
        <CustomButton
            onClick={handleSubmit}
            style={{
                backgroundColor: '#F56D3B',
                borderColor: '#F56D3B',
                color: '#FFFFFF',
                textTransform: 'none',
            }}
        >
            Update
        </CustomButton>
    ) : (
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
    );

    const content = (
        <Box display="flex" justifyContent="center" m={4}>
            <Grid container spacing={3} justifyContent="center">
                <Grid item sm={6} display="flex" justifyContent="center">
                    <CustomTextField
                        label="WOL Category"
                        placeholder="Enter WOL Category"
                        value={categoryName}
                        onChange={e => setCategoryName(e.target.value)}
                    />
                </Grid>
            </Grid>
        </Box>
    );

    return (
        <ReusableDialog
            open={openAddEditWolCategory}
            handleClose={handlepopupClose}
            title={editData ? 'Edit New WOL Category' : 'Add New WOL Category'}
            content={content}
            actions={actions}
        />
    );
};

export default AddEditWOLCategory;
