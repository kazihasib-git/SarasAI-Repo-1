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

import CloseIcon from '@mui/icons-material/Close';

const AssignStudents = ({ open, handleClose }) => {
    const [selectedTerm, setSelectedTerm] = useState('')
    const [selectedBatch, setSelectedBatch] = useState('')
    const [selectedStudents, setSelectedStudents] = useState([]);

    const academicTermOptions = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const batchOptions = ['batch 1', 'batch 2', 'batch 3', 'batch 4', 'batch 5'];

    const handleSelectStudent = (id) => {
        setSelectedStudents((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        )
    }

    const handleSubmit = () => {
        console.log('selectedStudents', selectedStudents)
        handleClose()
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            sx={{ borderRadius: '10px', color: '#FFFFFF' }}
        >
            <IconButton
                onClick={handleClose}
                sx={{ color: '#F56D3B', position: 'absolute', top: 10, right: 10 }}
            >
                <CloseIcon />
            </IconButton>
            <DialogTitle
                sx={{
                    font: 'Nohemi',
                    fontWeight: '600',
                    fontSize: '24px',
                    color: '#1A1E3D',
                    textAlign: 'center',
                }}
            >
                Assign Students to 'TA NAME'
            </DialogTitle>
            <DialogContent sx={{ m: 2 }}>
                <Typography
                    variant='body1'
                    sx={{ font: 'Nohemi', fontWeight: '400', fontSize: '16px', color: '#5F6383', textAlign: 'center', mb: 2 }}
                >
                    Let's assign students to the TA.
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Academic Term"
                            value={selectedTerm}
                            onChange={(e) => setSelectedTerm(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '50px' } }}
                            InputLabelProps={{ style: { margin: 0 } }}
                        >
                            {academicTermOptions.map((term) => (
                                <MenuItem key={term} value={term}>{term}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Batch"
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '50px' } }}
                            InputLabelProps={{ style: { margin: 0 } }}
                        >
                            {batchOptions.map((batch) => (
                                <MenuItem key={batch} value={batch}>{batch}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider sx={{ mt: 2, mb: 4, border: '1px solid #C2C2E7' }} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Search By Student Name"
                            fullWidth
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '50px' } }}
                            InputLabelProps={{ style: { margin: 0 } }}
                        />
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ borderRadius: '10px', mt: 3, backgroundColor: '#F1F1FB', border: '1px solid #E0E0F3', boxShadow: 1 }}>
                    <Table>
                        <TableHead sx={{ fontWeight : '500' , fontSize : '14px', color : '#1A1E3D'}}>
                            <TableRow >
                                <TableCell>S.No.</TableCell>
                                <TableCell>Student Name</TableCell>
                                <TableCell>Academic Term</TableCell>
                                <TableCell>Batch</TableCell>
                                <TableCell>Select</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((student, index) => (
                                <TableRow key={student.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.term}</TableCell>
                                    <TableCell>{student.batch}</TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedStudents.includes(student.id)}
                                            onChange={() => handleSelectStudent(student.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Typography variant='subtitle1' gutterBottom sx={{ mt: 2, textAlign: 'center' }}>
                    {selectedStudents.length} Student Selected
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ backgroundColor: '#F56D3B', borderRadius : '50px', color: '#FFFFFF', '&:hover': { backgroundColor: '#D4522A' } }}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignStudents;
