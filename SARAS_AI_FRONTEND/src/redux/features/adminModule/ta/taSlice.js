import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../../../utils/baseURL';
import axiosInstance from '../../../services/httpService';
import { toast } from 'react-toastify';

export const createTA = createAsyncThunk(
    'taModule/createTA',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/manage_tas`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue('An Error Occurred While Creating TA');
            }
        }
    }
);

export const getTA = createAsyncThunk(
    'taModule/getTA', 
    async rejectWithValue  => {
        try{
            const response = await axiosInstance.get(
                `${baseUrl}/admin/manage_tas`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else{
                return rejectWithValue('An Error Occurred While Fetching TAs')
            }
        }
    }
);

export const getTaById = createAsyncThunk(
    'taModule/getTaById',
    async (id, { rejectWithValue }) => {
        try{
            const response = await axiosInstance.get(
                `${baseUrl}/admin/manage_tas/${id}`
            );
            return response.data;
        }catch (error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message);
            }else {
                return rejectWithValue(
                    'An Error Occurred While Fetching Ta By Id'
                )
            }
        }
    }
)

export const updateTA = createAsyncThunk(
    'taModule/updateTA',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${baseUrl}/admin/manage_tas/${id}`,
                data
            );
            return response.data;
        } catch (error) {
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else{
                return rejectWithValue('An Error Occurred While Updating TA')
            }
        }
    }
);
export const activate_deactive_TA = createAsyncThunk(
    'taModule/activate_deactive_ta',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(
                `${baseUrl}/admin/manage_tas/active-deactive/${id}`,
               
            );
            return response.data;
        } catch (error) {
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else{
                return rejectWithValue('An Error Occurred While editing TA')
            }
        }
    }
);

export const deleteTA = createAsyncThunk(
    'taModule/deleteTA', 
    async (id, { rejectWithValue }) => {
        try{
            await axiosInstance.delete(`${baseUrl}/admin/manage_tas/${id}`);
            return id;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else{
                return rejectWithValue('An Error Occurred While Deleting TA')
            }
        }
    
});

export const getStudentBatchMapping = createAsyncThunk(
    'taModule/getStudentBatchMapping',
    async rejectWithValue => {
        try{
            const response = await axiosInstance.get(
                `${baseUrl}/admin/student-batch-mapping/getAllStudentWithBatches`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else{
                return rejectWithValue('An Error Occurred While Fetching Students');
            }
        }
    }
);

export const getBatchMapping = createAsyncThunk(
    'taModule/getBatchMapping',
    async rejectWithValue => {
        try{
            const response = await axiosInstance.get(`${baseUrl}/admin/batches`);
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else{
                return rejectWithValue('An Error Occurred While Fetching Batches')
            }
        } 
    }
);

export const showTAMapping = createAsyncThunk(
    'taModule/showTAMapping',
    async rejectWithValue => {
        try{
            const response = await axiosInstance.get(
                `${baseUrl}/admin/TAMapping/TAswithActiveStudentnBatches`
            );
            return response.data;

        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else{
                return rejectWithValue('An Error Occurred While Fetching Ta Mapping')
            }
        }
    }
);

export const getAssignStudents = createAsyncThunk(
    'taModule/getAssignStudents',
    async (id ,{ rejectWithValue }) => {
        try{
            const response = await axiosInstance.get(
                `${baseUrl}/admin/TAMapping/${id}/AssignStudents`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else{
                return rejectWithValue('An Error Occurred While Fetching Assigned Students To TA')
            }
        }
    }
);

export const getAssignBatches = createAsyncThunk(
    'taModule/getAssignBatches',
    async (id, { rejectWithValue }) => {
        try{

        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else{
                return rejectWithValue('An Error Occurred While Fetch Assigned Batches To TA')
            }
        }
        const response = await axiosInstance.get(
            `${baseUrl}/admin/TAMapping/${id}/AssignBatches`
        );
        return response.data;
    }
);

export const toggleAssignStudentStatus = createAsyncThunk(
    'taModule/toggleAssignStudentStatus',
    async ({ id, studentId }, { rejectWithValue }) => {
        try{
            const response = await axiosInstance.put(
                `${baseUrl}/admin/TAMapping/${id}/ActiveDeactiveAssignStudent`,
                { student_id: studentId }
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else{
                return rejectWithValue('An Error Occurred')
            }
        }
        
    }
);

export const toggleAssignBatchStatus = createAsyncThunk(
    'taModule/toggleAssignBatchStatus',
    async ({ id, batchId }) => {
        const response = await axiosInstance.put(
            `${baseUrl}/admin/TAMapping/${id}/ActiveDeactiveAssignBatch`,
            { batch_id: batchId }
        );
        return response.data;
    }
);

export const postAssignStudents = createAsyncThunk(
    'taModule/postAssignStudents',
    async ({ id, data }) => {
        const response = await axiosInstance.post(
            `${baseUrl}/admin/TAMapping/AssignStudents`,
            data
        );
        return response.data;
    }
);

export const postAssignBatches = createAsyncThunk(
    'taModule/postAssignBatches',
    async ({ id, data }) => {
        const response = await axiosInstance.post(
            `${baseUrl}/admin/TAMapping/AssignBatches`,
            data
        );
        return response.data;
    }
);

export const deleteAssignedStudent = createAsyncThunk(
    'taModule/deleteAssignedStudent',
    async (id, { rejectWithValue }) => {
        try{
            const response = await axiosInstance.delete(
                `${baseUrl}/admin/TAMapping/${id.id}/deleteStudent`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else{
                return rejectWithValue('An Error Occurred While Deleting Assigned Student')
            }
        }
    }
);

export const deleteAssignedBatch = createAsyncThunk(
    'taModule/deleteAssignedBatch',
    async (id, { rejectWithValue }) => {
        try{
            const response = await axiosInstance.delete(
                `${baseUrl}/admin/TAMapping/${id.id}/deleteBatch`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else{
                return rejectWithValue('An Error Occurred While Deleting Assigned Batch To TA')
            }
        }
        
    }
);

export const deleteTaMapping = createAsyncThunk(
    'taModule/deleteTaMapping',
    async (id , { rejectWithValue }) => {
        try{
            const response = await axiosInstance.delete(
                `${baseUrl}/admin/TAMapping/${id}/deleteMapping`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else{
                return rejectWithValue('An Error Occurred While Deleting TA Mapping')
            }
        }
    }
);

export const showTaCourseMapping = createAsyncThunk(
    'taModule/showTaCourseMapping',
    async rejectWithValue => {
        try{
            const response = await axiosInstance.get(
                `${baseUrl}/admin/ta-course/getAllTasWithCourses`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else{
                return rejectWithValue('An Error Occurred While Fetching Courses')
            }
        }
    }
);

export const getAllCoursesWithTas = createAsyncThunk(
    'taModule/getAllCoursesWithTas',
    async rejectWithValue => {
        try{
            const response = await axiosInstance.get(
                `${baseUrl}/admin/ta-course/getAllCoursesWithTas`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else{
                return rejectWithValue('An Error Occurred While Fetching Ta Courses')
            }
        }
    }
);

export const assignCourseToTa = createAsyncThunk(
    'taModule/assignCourseToTa',
    async (data , { rejectWithValue }) => {
        try{
            const response = await axiosInstance.post(
                `${baseUrl}/admin/ta-course`,
                data    
            );
            return response.data;   
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else {
                return rejectWithValue('An Error Occurred While Assigning Course')
            }
        }
    }
);

const initialState = {
    tas: [],
    taData : [],
    studentBatchMapping: [],
    batchMapping: [],
    taMapping: null,
    assignedStudents: [],
    assignedBatches: [],
    loading: false,
    error: null,
    createTAOpen: false,
    editTAOpen: false,
    selectedTA: null,
    successPopup: false,
    assignStudentOpen: false,
    assignBatchOpen: false,
    ta_name: null,
    taID: null,
    taCourseMappingData: [],
};

export const taSlice = createSlice({
    name: 'taModule',
    initialState,
    reducers: {
        accessTaName(state, action) {
            state.ta_name = action.payload.name;
            state.taID = action.payload.id;
        },
        setSelectedTA(state, action) {
            state.selectedTA = action.payload;
        },
        openCreateTa(state) {
            state.createTAOpen = true;
        },
        closeCreateTa(state) {
            state.createTAOpen = false;
        },
        openEditTa(state) {
            state.editTAOpen = true;
        },
        closeEditTa(state) {
            state.editTAOpen = false;
        },

        openSuccessPopup(state) {
            state.successPopup = true;
        },
        closeSuccessPopup(state) {
            state.successPopup = false;
        },
        openAssignStudents(state) {
            state.assignStudentOpen = true;
        },
        closeAssignStudents(state) {
            state.assignStudentOpen = false;
        },
        openAssignBatches(state) {
            state.assignBatchOpen = true;
        },
        closeAssignBatches(state) {
            state.assignBatchOpen = false;
        },

        handleSelectedStudents(state, action) {
            state.selectedStudents = action.payload;
        },
        handleSelectedBatches(state, action) {
            state.selectedBatches = action.payload;
        },
    },
    extraReducers: builder => {
        // Create TA
        builder.addCase(createTA.pending, state => {
            state.loading = true;
        });
        builder.addCase(createTA.fulfilled, (state, action) => {
            state.loading = false;
            toast.success(action.payload.message || 'TA Created Successfully');
            state.tas = [...state.tas, action.payload];
        });
        builder.addCase(createTA.rejected, (state, action) => {
            state.loading = false;
            toast.error(
                action.payload || 'Failed To Create TA. Please try again.'
            );
            state.error = action.payload || action.error.message;
        });

        // Get All TA
        builder.addCase(getTA.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTA.fulfilled, (state, action) => {
            state.loading = false;
            state.tas = action.payload;
        });
        builder.addCase(getTA.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        builder.addCase(getTaById.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaById.fulfilled, (state, action) => {
            state.loading = false;
            state.taData = action.payload;
        })
        builder.addCase(getTaById.rejected, (state, action) => {
            state.loading = false;
            state.taData = [];
            state.error = action.payload || action.error.message;
        })

        // Update TA
        builder.addCase(updateTA.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateTA.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.tas.findIndex(
                ta => ta.id === action.payload.id
            );
            if (index !== -1) {
                state.tas[index] = action.payload;
            }
            toast.success(action.payload.message || 'TA Updated Successfully');
        });
        builder.addCase(updateTA.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Update TA. Please Try Again')
        });
        
        //activate deactivate Ta
        builder.addCase(activate_deactive_TA.pending, state => {
            state.loading = true;
        });
        builder.addCase(activate_deactive_TA.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.tas.findIndex(
                ta => ta.id === action.payload.id
            );
            if (index !== -1) {
                state.tas[index] = action.payload;
            }
            toast.success(action.payload.message || 'TA edited Successfully');
        });
        builder.addCase(activate_deactive_TA.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Edit TA. Please Try Again')
        });

        // Delete TA
        builder.addCase(deleteTA.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteTA.fulfilled, (state, action) => {
            state.loading = false;
            state.tas = state.tas.filter(ta => ta.id !== action.payload);
            toast.success(action.payload.message || 'TA Deleted Successfully')
        });
        builder.addCase(deleteTA.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Delete TA')
        });

        // Get Student-Batch Mapping
        builder.addCase(getStudentBatchMapping.pending, state => {
            state.loading = true;
        });
        builder.addCase(getStudentBatchMapping.fulfilled, (state, action) => {
            state.loading = false;
            state.studentBatchMapping = action.payload;
        });
        builder.addCase(getStudentBatchMapping.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // get batch mapping
        builder.addCase(getBatchMapping.pending, state => {
            state.loading = true;
        });
        builder.addCase(getBatchMapping.fulfilled, (state, action) => {
            state.loading = false;
            state.batchMapping = action.payload.batches;
        });
        builder.addCase(getBatchMapping.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // Show TA Mapping
        builder.addCase(showTAMapping.pending, state => {
            state.loading = true;
        });
        builder.addCase(showTAMapping.fulfilled, (state, action) => {
            state.loading = false;
            state.taMapping = action.payload.data;
        });
        builder.addCase(showTAMapping.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // Get Assigned Students
        builder.addCase(getAssignStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(getAssignStudents.fulfilled, (state, action) => {
            state.loading = false;
            state.assignedStudents = action.payload.data;
        });
        builder.addCase(getAssignStudents.rejected, (state, action) => {
            state.loading = false;
            state.assignedStudents = [];
            state.error = action.payload || action.error.message;
        });

        // Get Assigned Batches
        builder.addCase(getAssignBatches.pending, state => {
            state.loading = true;
        });
        builder.addCase(getAssignBatches.fulfilled, (state, action) => {
            state.loading = false;
            state.assignedBatches = action.payload.data;
        });
        builder.addCase(getAssignBatches.rejected, (state, action) => {
            state.loading = false;
            state.assignedBatches = [];
            state.error = action.payload || action.error.message;
        });

        // Toggle Assign Student Status
        builder.addCase(toggleAssignStudentStatus.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            toggleAssignStudentStatus.fulfilled,
            (state, action) => {
                state.loading = false;
                const updatedStudents = state.assignedStudents.map(student =>
                    student.id === action.payload.id
                        ? { ...student, is_active: action.payload.is_active }
                        : student
                );
                state.assignedStudents = updatedStudents;
                toast.success(action.payload.message || 'Status Updated Successfully')
            }
        );
        builder.addCase(toggleAssignStudentStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Update Status')
        });

        // Toggle Assign Batch Status
        builder.addCase(toggleAssignBatchStatus.pending, state => {
            state.loading = true;
        });
        builder.addCase(toggleAssignBatchStatus.fulfilled, (state, action) => {
            state.loading = false;
            const updatedBatches = state.assignedBatches.map(batch =>
                batch.id === action.payload.id
                    ? { ...batch, is_active: action.payload.is_active }
                    : batch
            );
            state.assignedBatches = updatedBatches;
            toast.success(action.payload.message || 'Status Updated Successfully')
        });
        builder.addCase(toggleAssignBatchStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Update Status')
        });

        // Post Assign Students
        builder.addCase(postAssignStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(postAssignStudents.fulfilled, (state, action) => {
            state.loading = false;
            state.assignedStudents = action.payload;
            toast.success(action.payload.message || 'Students Assigned To TA Successfully')
        });
        builder.addCase(postAssignStudents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Assign Students To TA')
        });

        // Post Assign Batches
        builder.addCase(postAssignBatches.pending, state => {
            state.loading = true;
        });
        builder.addCase(postAssignBatches.fulfilled, (state, action) => {
            state.loading = false;
            state.assignedBatches = action.payload;
            toast.success(action.payload.message || 'Batches Assigned To TA Successfully')
        });
        builder.addCase(postAssignBatches.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Assign Batches To TA')
        });

        // delete assigned student
        builder.addCase(deleteAssignedStudent.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteAssignedStudent.fulfilled, (state, action) => {
            state.loading = false;
            // state.assignedStudents = action.payload;
            toast.success(action.payload.message || 'Deleted Assigned Student Successfully')
        });
        builder.addCase(deleteAssignedStudent.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Delete Assigned Student')
        });

        // delete Ta Mapping
        builder.addCase(deleteTaMapping.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteTaMapping.fulfilled, (state, action) => {
            state.loading = false;
            toast.success(action.payload.message || 'Mapping Deleted Successfully')
        });
        builder.addCase(deleteTaMapping.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Delete Mapping')
        });

        // delete assigned Batches
        builder.addCase(deleteAssignedBatch.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteAssignedBatch.fulfilled, (state, action) => {
            state.loading = false;
            toast.success(action.payload.message || 'Assigned Batch Deleted Successfully')
            // state.assignedStudents = action.payload;
        });
        builder.addCase(deleteAssignedBatch.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Delete Assigned Batch')
        });
        builder.addCase(showTaCourseMapping.pending, state => {
            state.loading = true;
        });
        builder.addCase(showTaCourseMapping.fulfilled, (state, action) => {
            state.loading = false;
            state.taCourseMappingData = action.payload.tas;
        });
        builder.addCase(showTaCourseMapping.rejected, (state, action) => {
            state.loading = false;
            state.taCourseMappingData = [];
            state.error = action.payload || action.error.message;
        });

        builder.addCase(getAllCoursesWithTas.pending, state => {
            state.loading = true;
        });
        builder.addCase(getAllCoursesWithTas.fulfilled, (state, action) => {
            state.loading = false;
            state.allCoursesWithTas = action.payload.courses;
        });
        builder.addCase(getAllCoursesWithTas.rejected, (state, action) => {
            state.loading = false;
            state.allCoursesWithTas = [];
            state.error = action.payload || action.error.message;
        });
        

        builder.addCase(assignCourseToTa.pending, state => {
            state.loading = true;
        });
        builder.addCase(assignCourseToTa.fulfilled, (state, action) => {
            state.loading = false;
            toast.success(action.payload.message || 'Courses Assigned To Ta Successfully')
        });
        builder.addCase(assignCourseToTa.rejected, (state, action) => {
            state.loading = false;
            console.error('Error assigning course to TA:', action.error);
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Assign Courses To Ta. Server Error.');
        });

    },
});

export const {
    openCreateTa,
    closeCreateTa,
    openEditTa,
    closeEditTa,
    setSelectedTA,
    openSuccessPopup,
    accessTaName,
    closeSuccessPopup,
    openAssignStudents,
    closeAssignStudents,
    openAssignBatches,
    closeAssignBatches,
} = taSlice.actions;

export default taSlice.reducer;
