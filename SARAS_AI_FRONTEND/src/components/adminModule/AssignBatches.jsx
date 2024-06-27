import React, { useState } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    Grid,
    Divider
} from '@mui/material'

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

import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { closeAssignBatches, closeCreateTa, openAssignBatches, openSuccessPopup } from '../../redux/features/taModule/taSlice';
import CustomTextField from '../CustomFields/CustomTextField';
import DynamicTable from '../CommonComponent/DynamicTable';
import ReusableDialog from '../CustomFields/ReusableDialog';


const students = [
    { id: 1, name: 'Manish', term: 'Term 1', batch: 'Batch 1' },
    { id: 2, name: 'Amit', term: 'Term 2', batch: 'Batch 2' },
    { id: 3, name: 'Rohit', term: 'Term 3', batch: 'Batch 3' },
    { id: 4, name: 'Abhi', term: 'Term 4', batch: 'Batch 4' },
]

const AssignBatches = () => {
    const dispatch = useDispatch();
    const { assignBatchOpen } = useSelector((state) => state.taModule);
    const [selectedBatch, setSelectedBatch] = useState('')
    const [selectedStudents, setSelectedStudents] = useState([])

    const batchOptions = ['batch 1', 'batch 2', 'batch 3', 'batch 4', 'batch 5'];

    const handleSelectStudent = (id) => {
        setSelectedStudents((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        )
    }

    const handleSubmit = () => {
        dispatch(closeCreateTa())
        dispatch(openSuccessPopup())
    }

    const headers = ['S. No.', 'Student Name', 'Academic Term', 'Batch', 'Select'];

    const actionButtons = [
        {
            type: "checkbox",
            //   onClick: (id) => {
            //     handleEditTaClick(id);
            //   },
        },
    ];

    const content = (
        <>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                    <CustomTextField
                        select
                        label="Batch"
                        value={selectedBatch}
                        onChange={(e) => setSelectedBatch(e.target.value)}
                    >
                        {batchOptions.map((batch) => (
                            <MenuItem key={batch} value={batch}>{batch}</MenuItem>
                        ))}
                    </CustomTextField>
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ mt: 2, mb: 4, border: '1px solid #C2C2E7' }} />
                </Grid>
                <Grid item xs={12}>
                    <CustomTextField
                        label="Search By Batches"
                    />
                </Grid>
            </Grid>

            <DynamicTable
                headers={headers}
                initialData={students}
                actionButtons={actionButtons}
            />

            <Typography
                variant='subtitle1'
                gutterBottom
                sx={{ mt: 2, textAlign: 'center' }}
            >
                {selectedStudents.length} Student(s) Selected
            </Typography>
        </>
    )

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            backgroundColor='#F56D3B'
            borderColor='#F56D3B'
            color='#FFFFFF'
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={assignBatchOpen}
            handleClose={() => dispatch(closeAssignBatches())}
            title="Assign Batches to TA Name"
            content={content}
            actions={actions}
        />
    );
}

export default AssignBatches