import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    Select,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Paper,
    Divider
} from '@mui/material';

const students = [
    { id: 1, name: 'Manish', term: 'Term 1', batch: 'Batch 1' },
    { id: 1, name: 'Amit', term: 'Term 2', batch: 'Batch 2' },
    { id: 1, name: 'Rohit', term: 'Term 3', batch: 'Batch 3' },
    { id: 1, name: 'Abhi', term: 'Term 4', batch: 'Batch 4' },
]

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
import { closeAssignStudents, closeCreateTa, openSuccessPopup } from '../../redux/features/taModule/taSlice';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomTextField from '../CustomFields/CustomTextField';
import DynamicTable from '../CommonComponent/DynamicTable';
import PopUpTable from '../CommonComponent/PopUpTable';

const AssignStudents = () => {
    const dispatch = useDispatch();
    const [selectedTerm, setSelectedTerm] = useState('')
    const [selectedBatch, setSelectedBatch] = useState('')
    const [selectedStudents, setSelectedStudents] = useState([]);
    const { assignStudentOpen } = useSelector((state) => state.taModule);

    const academicTermOptions = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const batchOptions = ['batch 1', 'batch 2', 'batch 3', 'batch 4', 'batch 5'];

    const handleSelectStudent = (id) => {
        setSelectedStudents((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        )
    }

    const handleSubmit = () => {
        dispatch(closeCreateTa())
        dispatch(openSuccessPopup());
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
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <CustomTextField
                        select
                        label="Academic Term"
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                    >
                        {academicTermOptions.map((term) => (
                            <MenuItem key={term} value={term}>{term}</MenuItem>
                        ))}
                    </CustomTextField>
                </Grid>
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
                        label="Search By Student Name"
                    />
                </Grid>
            </Grid>

            <PopUpTable
                headers={headers}
                initialData={students}
                actionButtons={actionButtons}
            />

            <Typography variant='subtitle1' gutterBottom sx={{ mt: 2, textAlign: 'center' }}>
                {selectedStudents.length} Student Selected
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
            open={assignStudentOpen}
            handleClose={() => dispatch(closeAssignStudents())}
            title="Assign Students to TA Name"
            content={content}
            actions={actions}
        />
    );
};

export default AssignStudents;
