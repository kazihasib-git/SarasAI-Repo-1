import { Box, Button, Dialog, DialogActions, DialogTitle, IconButton, Typography } from '@mui/material'
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { closeCreateTa, closeEditTa, closeSuccessPopup, openAssignBatches, openAssignStudents, openSuccessPopup } from '../../redux/features/taModule/taSlice';
import ReusableDialog from '../CustomFields/ReusableDialog';
import { Navigate, useNavigate } from 'react-router-dom';

const CustomButton = ({ onClick, children, color = '#FFFFFF', backgroundColor = '#4E18A5', borderColor = '#FFFFFF', sx, ...props }) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                backgroundColor: backgroundColor,
                color: color,
                fontWeight: '700',
                fontSize: '16px',
                borderRadius: '50px',
                padding: "10px 20px",
                border: `2px solid ${borderColor}`,
                '&:hover': {
                    backgroundColor: color,
                    color: backgroundColor,
                    borderColor: color,
                },
                ...sx
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

const SubmitPopup = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { tas, successPopup, error, loading, ta_name } = useSelector((state) => state.taModule)
    
    console.log("TA_Name : ", ta_name)

    const handleAssignBatches = () => {
        dispatch(closeSuccessPopup())
        dispatch(openAssignBatches())
    }

    const handleAssignStudents = () => {
        dispatch(closeSuccessPopup())
        dispatch(openAssignStudents());
    }

    const handleCloseButton = () =>{
        dispatch(closeSuccessPopup())
        dispatch(closeCreateTa())
        dispatch(closeEditTa())
        navigate("/ta-mapping")
    } 

    const actions = (
        <>  
            <CustomButton
                onClick={handleAssignStudents}
                backgroundColor='#F56D3B'
                color='white'
                borderColor='#F56D3B'
            >
                Assign Students
            </CustomButton>
            <CustomButton
                onClick={handleAssignBatches}
                backgroundColor='white'
                color='#F56D3B'
                borderColor='#F56D3B'
            >
                Assign Batches
            </CustomButton>
        </>
    );

    return (
        <ReusableDialog
            open={successPopup}
            handleClose={() => handleCloseButton()}
            title={`${ta_name} successfully created.`}
            actions={actions}
        />
    )
}

export default SubmitPopup