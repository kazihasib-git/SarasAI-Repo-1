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

import CloseIcon from '@mui/icons-material/Close';


const students = [
    { id: 1, name: 'Manish', term: 'Term 1', batch: 'Batch 1' },
    { id: 2, name: 'Amit', term: 'Term 2', batch: 'Batch 2' },
    { id: 3, name: 'Rohit', term: 'Term 3', batch: 'Batch 3' },
    { id: 4, name: 'Abhi', term: 'Term 4', batch: 'Batch 4' },
]

const AssignBatches = ({ open, handleClose }) => {
    const [selectedBatch, setSelectedBatch] = useState('')
    const [selectedStudents, setSelectedStudents] = useState([])

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
                Assign Batches
            </DialogTitle>
            <DialogContent sx={{ m: 0, p: 2 }}>
                <Typography
                    variant='body1'
                    sx={{ fontFamily: 'Nohemi', fontWeight: '400', fontSize: '16px', color: '#5F6383', textAlign: 'center', mb: 2 }}
                >
                    Let's assign students.
                </Typography>
                <Grid container spacing={2} justifyContent="center">
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
                            label="Search By Batches"
                            fullWidth
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '50px' } }}
                            InputLabelProps={{ style: { margin: 0 } }}
                        />
                    </Grid>
                </Grid>
                <TableContainer component={Paper} sx={{ mt: 3, backgroundColor: '#F1F1FB', border: '1px solid #E0E0F3' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
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
                <Typography
                    variant='subtitle1'
                    gutterBottom
                    sx={{ mt: 2, textAlign: 'center' }}
                >
                    {selectedStudents.length} Student(s) Selected
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ backgroundColor: '#F56D3B', borderRadius: '50px', color: '#FFFFFF', '&:hover': { backgroundColor: '#D4522A' } }}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AssignBatches