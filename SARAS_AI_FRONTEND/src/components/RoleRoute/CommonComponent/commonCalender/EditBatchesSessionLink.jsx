import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTaMenuAssignedBatches, getTaMenuAssignedStudents } from '../../../../redux/features/taModule/tamenuSlice'
import { getCoachMenuAssignedBatches, getCoachMenuAssignedStudents } from '../../../../redux/features/coachModule/coachmenuprofileSilce'
import { closeEditStudents } from '../../../../redux/features/commonCalender/commonCalender'
import ReusableDialog from '../../../CustomFields/ReusableDialog'
import { Divider, Grid, MenuItem, Typography } from '@mui/material'
import CustomTextField from '../../../CustomFields/CustomTextField'
import PopUpTable from '../../../CommonComponent/PopUpTable'
import { toast } from 'react-toastify'
import CustomButton from '../../../CustomFields/CustomButton'

const EditBatchesSessionLink = () => {
    const dispatch = useDispatch()

    const [selectedBatch, setSelectedBatch] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [filteredBatches, setFilteredBatches] = useState([]);

    let sliceName, 
        getBatchesApi,
        batchesDataState;

    switch ( componentName ) {
        case 'TAMENU':
            sliceName = 'taMenu'
            getBatchesApi = getTaMenuAssignedBatches;
            batchesDataState = 'assignedTaBatches';
            break;
        
        case 'COACHMENU':
            sliceName = 'coachMenu'
            getBatchesApi = getCoachMenuAssignedBatches;
            batchesDataState = 'assignedCoachBatches';
            break;
    
        default:
            sliceName = null;
            getBatchesApi = null;
            batchesDataState = null;
            break;
    }

    const stateSelector = useSelector((state) => state[sliceName])

    const { [batchesDataState]: batchesData } = stateSelector

    const { editBatches } = useSelector((state) => state.commonCalender)

    useEffect(() => {
        dispatch(getBatchesApi())
    }, [dispatch])

    console.log("batchess :", batchesData)
    useEffect(() => {
        if(batchesData && batchesData.length){
            const transformedData = batchesData;
            
            const filtered = transformedData.filter(batch => {
                const matchesBranch = selectedBranch ? batch.Branch = selectedBranch : true;
                const matchesQuery = searchQuery ? batch['Batch Name'].toLowerCase().includes(searchQuery.toLowerCase()) : true;
                return matchesBranch && matchesQuery;
            });
            setFilteredBatches(filtered);
        }else {
            setFilteredBatches();
        }
    },[batchesData, selectedBatch, searchQuery]);


    const batchOptions = assignedBatches ? [...new Set(batchesData)] : [];

    useEffect(() => {
    
    })

    const handleSelectBatch = id => {
        setSelectedBatch(prev => prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id])
    }

    const handleBranchChange = e => {
        const selectedBranchValue = e.target.value
        setSelectedBranch(selectedBranchValue);

        if(!selectedBranchValue){
            setFilteredBatches(

            )
        }
    }

    const validate = () => {
        if(selectedBatch.length === 0){
            toast.error('Please Select at Least One Batch')
            return false;
        }
        return true;
    }


    const handleSubmit = () => {
        if(!validate()) return;

        const Id = meetingId;
        const data = {
            batchId: selectedBatch.map(id => id)
        }
        dispatch().then(() => {
            dispatch();
        });
    }


    const content = (
        <>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 0 }}>
                <Grid item sm={6}>
                    <CustomTextField
                        select
                        label="Branch"
                        value={selectedBranch}
                        onChange={handleBranchChange}
                        onClear={() =>
                            handleBranchChange({ target: { value: '' } })
                        } // Clear functionality
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {batchOptions.map((branch, index) => (
                            <MenuItem key={index} value={branch}>
                                {branch}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ border: '1px solid #C2C2E7' }} />
                </Grid>
                <Grid item xs={12} mb={2}>
                    <CustomTextField
                        label="Search By Batch Name"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </Grid>
            </Grid>
            <PopUpTable
                headers={headers}
                initialData={filteredBatches}
                onRowClick={handleSelectBatch}
                selectedBox={selectedBatch}
            />
            <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mt: 2, textAlign: 'center' }}
            >
                {selectedBatch.length} batch(es) Selected
            </Typography>
        </>
    )

    const actions = (
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
    )

    return (
        <ReusableDialog
          open={openEditBatchesPopup}
          handleClose={() => dispatch()}
          title={`Assign Batches to Session`}
          content={content}
          actions={actions}
        />
    )   
}

export default EditBatchesSessionLink