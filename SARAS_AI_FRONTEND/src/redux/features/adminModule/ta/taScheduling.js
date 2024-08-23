import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../../../utils/baseURL';
import axiosInstance from '../../../services/httpService';
import { toast } from 'react-toastify';

// Show TA Schedule
export const showTASchedule = createAsyncThunk(
    'taScheduling/showTaSchedule',
    async rejectWithValue => {
        try{
            const response = await axiosInstance.get(
                `${baseUrl}/admin/taschedules`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message);
            }else {
                return rejectWithValue('An Error Occurred While Feching TA Schedule')
            }
        }
    }
);

// Get TA Scheduled Sessions
export const getTAScheduledSessions = createAsyncThunk(
    'taScheduling/getTAScheduledSessions',
    async ({ id, data },{ rejectWithValue }) => {
        try{
            const response = await axiosInstance.post(
                `${baseUrl}/admin/taschedules/${id}`,
                data
            );
            return response.data;
        }catch(error){
            if(error.response  && error.response.data){
                return rejectWithValue(error.response.data.message);
            }else{
                return rejectWithValue('An Error Occurred While Fetching TA Scheduled Sessions');
            }
        }
    }
);

// Create TA Schedule
export const createTASchedule = createAsyncThunk(
    'taScheduling/createTASchedule',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/taschedules`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue('An Error Occurred While Creating the Schedule');
            }
        }
    }
);

// Get TA Available Slots From Date
export const getTaAvailableSlotsFromDate = createAsyncThunk(
    'taScheduling/getTaAvailableSlotsFromDate',
    async (data , { rejectWithValue }) => {
        try{
            const response = await axiosInstance.post(
                `${baseUrl}/admin/coach-slots/getTACoachSlotForADate`,
                data
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message);
            }else{
                return rejectWithValue('An Error Occurred While Fetching TA Available From Date')
            }        
        }
    }
);

// Reschedule Session
export const rescheduleSession = createAsyncThunk(
    'taScheduling/rescheduleSession',
    async ({ id, data }, { rejectWithValue }) => {
        try{
            const response = await axiosInstance.put(
                `${baseUrl}/admin/taschedules/reschedule/${id}`,
                data
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message);
            }else{
                return rejectWithValue('An Error Occurred While Rescheduling Session')
            }
        }
    }
);

// Cancel Scheduled Sessions
export const cancelScheduledSession = createAsyncThunk(
    'taScheduling/cancelScheduledSession',
    async (id, { rejectWithValue }) => {
        try{
            const response = await axiosInstance.put(
                `${baseUrl}/admin/taschedules/cancel/${id}`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message);
            }else{
                return rejectWithValue('An Error Occurred While Cancel Scheduled Sessions')
            }
        }
    }
);

const initialState = {
    taAvailableSlots: [], // TA Available Slots
    taScheduledSessions: [], // TA Scheduled Sessions
    taSchedule: [], // TA Schedule
    studentBatchMapping: [], // Student Batch Mapping
    students: [], // Students
    batches: [], // Batches
    openEditBatch: false,
    openEditStudent: false,
    loading: false,
    error: null,

    studentBatchMappingLoading: false,
    studentBatchMappingError: null,
    scheduleSessionOpen: false,
    taID: null,
    taName: null,
    taTimezone: null,
};

const taScheduling = createSlice({
    name: 'taScheduling',
    initialState,
    reducers: {
        openScheduleSession(state, action) {
            console.log('Open Action : ', action.payload);
            state.taID =
                action.payload.id !== undefined
                    ? action.payload.id
                    : action.payload.ta_id;

            state.taName = action.payload.name;
            state.taTimezone = action.payload.timezone;
            if (action.payload.student) {
                state.students = action.payload.student;
            }
            if (action.payload.batches) {
                state.batches = action.payload.batches;
            }
            state.scheduleSessionOpen = true;
        },
        closeScheduleSession(state, action) {
            console.log('Close Action : ', action.payload);
            state.taID = null;
            state.taName = null;
            state.taTimezone = null;
            state.students = [];
            state.batches = [];
            //state.openEditBatch = false;
            state.scheduleSessionOpen = false;
        },
        openEditBatch(state, action) {
            state.openEditBatch = true;
            if (action.payload) {
                // state.batches = action.payload.batches
            }
        },
        closeEditBatch(state, action) {
            state.openEditBatch = false;
        },
        openEditStudent(state, action) {
            state.openEditStudent = true;
            if (action.payload) {
                // state.students = action.payload.student;
                // state.batches = action.payload.batches
            }
        },
        closeEditStudent(state, action) {
            state.openEditStudent = false;
            if (action.payload) {
                state.students = action.payload.student;
                state.batches = action.payload.batches;
            }
        },
        clearAvailableSlots(state) {
            state.taAvailableSlots = [];
        },
    },
    extraReducers: builder => {
        
        // Show TA Schedule
        builder.addCase(showTASchedule.pending, state => {
            state.loading = true;
        });
        builder.addCase(showTASchedule.fulfilled, (state, action) => {
            state.loading = false;
            state.taSchedule = action.payload.data;
        });
        builder.addCase(showTASchedule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taSchedule = [];
        });

        // Get TA Scheduled Sessions
        builder.addCase(getTAScheduledSessions.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTAScheduledSessions.fulfilled, (state, action) => {
            state.loading = false;
            state.taScheduledSessions = action.payload.data;
        });
        builder.addCase(getTAScheduledSessions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taScheduledSessions = [];
        });

        // Handle TA Schedule actions in the slice
        builder.addCase(createTASchedule.pending, state => {
            state.loading = true;
        });
        builder.addCase(createTASchedule.fulfilled, (state, action) => {
            state.loading = false;
            // state.taScheduledSessions = action.payload.data;
            toast.success(
                action.payload.message || 'TA Session Created Successfully'
            );
        });
        builder.addCase(createTASchedule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(
                action.payload ||
                    'Failed to create TA Session. Please Try Again.'
            );
        });

        // Get TA Available Slots From Date
        builder.addCase(getTaAvailableSlotsFromDate.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getTaAvailableSlotsFromDate.fulfilled,
            (state, action) => {
                state.loading = false;
                state.taAvailableSlots = action.payload.data;
            }
        );
        builder.addCase(
            getTaAvailableSlotsFromDate.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.taAvailableSlots = [];
            }
        );

        // Cancel Scheduled Sessions
        builder.addCase(cancelScheduledSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(cancelScheduledSession.fulfilled, (state, action) => {
            state.loading = false;
            // state.taScheduledSessions = action.payload.data;
            toast.success(action.payload.message || 'Session Cancelled Successfully')
        });
        builder.addCase(cancelScheduledSession.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.payload || 'Failed To Cancel Session');
        });

        // Reschedule Session
        builder.addCase(rescheduleSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(rescheduleSession.fulfilled, (state, action) => {
            state.loading = false;
            state.taScheduledSessions = action.payload.data;
            toast.success(action.payload.message || 'Session Rescheduled Successfully')
        });
        builder.addCase(rescheduleSession.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.payload || 'Failed To Rescheduled Session')
        });
    },
});

export const {
    openScheduleSession,
    closeScheduleSession,
    openEditBatch,
    closeEditBatch,
    openEditStudent,
    closeEditStudent,
} = taScheduling.actions;

export default taScheduling.reducer;
