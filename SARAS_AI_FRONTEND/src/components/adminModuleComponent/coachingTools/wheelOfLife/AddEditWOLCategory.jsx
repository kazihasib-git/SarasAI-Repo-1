import React, { useEffect, useState } from 'react';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import { Box, Button, Grid, styled } from '@mui/material';
import CustomTextField from '../../../CustomFields/CustomTextField';
import { useDispatch, useSelector } from 'react-redux';

import {
    createWOLCategory,
    updateeWOLCategory,
    getWOLCategory,
    setAddEditWolCategory,
    setEditData,
    updateWOLCategory,
} from '../../../../redux/features/adminModule/coachingTools/wol/wolSlice';

const CustomButton = styled(Button)(({ theme, active }) => ({
    borderRadius: '50px',
    border: '1px solid #F56D3B',
    color: active ? '#fff' : '#F56D3B',
    backgroundColor: active ? '#F56D3B' : '#FFF',
    padding: '8px 16px',
    margin: '0 8px',
    '&:hover': {
        backgroundColor: '#F56D3B',
        color: '#fff',
        borderColor: '#F56D3B',
    },
}));

const AddEditWOLCategory = () => {
    const dispatch = useDispatch();
    const { openAddEditWolCategory, editData } = useSelector(
        state => state.wol
    );
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = async () => {
        if (editData) {
            //setCategoryName(editData.name);
            console.log('Edit');
            try {
                const updatedWOL = await dispatch(
                    updateWOLCategory({
                        id: editData.id,
                        data: { name: categoryName },
                    })
                ).unwrap();
            } catch (error) {
                console.log(error.message); //TODO: Show toast message
            }
        } else {
            try {
                const createdWOL = await dispatch(
                    createWOLCategory({ name: categoryName })
                ).unwrap();
            } catch (error) {
                console.log(error.message); //TODO: Show toast message
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
        console.log(editData);
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
