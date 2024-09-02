import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../../../utils/baseURL';
import axiosInstance from '../../../services/httpService';
import { toast } from 'react-toastify';

export const showTASchedule = createAsyncThunk(
    'coachScheduling/showTaSchedule',
    async rejectWithValue => {
        try{
            const response = await axiosInstance.get(
                `${baseUrl}/admin/taschedules`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message);
            }else{
                return rejectWithValue('An Error Occurred While Fetching Coach Schedule')
            }
        }
    }
);

export const getTAScheduledSessions = createAsyncThunk(
    'coachScheduling/getTAScheduledSessions',
    async ({ id, data }, { rejectWithValue }) => {
        try{
            const response = await axiosInstance.post(
                `${baseUrl}/admin/taschedules/${id}`,
                data
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message);
            }else {
                return rejectWithValue('An Error Occurred While Fetching Coach Schedules')
            }
        }
    }
);

export const createCoachSchedule = createAsyncThunk(
    'coachScheduling/createCoachSchedule',
    async (data , { rejectWithValue }) => {
        try{
            const response = await axiosInstance.post(
                `${baseUrl}/admin/coachschedules`,
                data
            );
            return response.data;
        }catch(error){
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue('An Error Occurred While Creating the Schedule');
            }
        }
    }
);

export const getCoachAvailableSlotsFromDate = createAsyncThunk(
    'coachScheduling/getCoachAvailableSlotsFromDate',
    async (data, { rejectWithValue }) => {
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
                return rejectWithValue('An Error Occurred While Fetching Coach Available From Date')
            }    
        } 
    }
);

// Reschedule Session
export const rescheduleCoachSession = createAsyncThunk(
    'coachAvailability/rescheduleCoachSession',
    async ({ id, data }, { rejectWithValue }) => {
        try{
            const response = await axiosInstance.put(
                `${baseUrl}/admin/coachschedules/reschedule/${id}`,
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
export const cancelCoachScheduledSession = createAsyncThunk(
    'coachAvailability/cancelCoachScheduledSession',
    async (id , { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${baseUrl}/admin/taschedules/cancel/${id}`
            );
            return response.data;
        }catch (error) {
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message);
            }else{
                return rejectWithValue('An Error Occurred While Cancel Scheduled Sessions')
            }
        }
    }
);

const initialState = {
    coachAvailableSlots: [],
    coachScheduledSessions: [],

    loading: false,
    error: null,
    studentBatchMapping: [],
    studentBatchMappingLoading: false,
    studentBatchMappingError: null,
    scheduleCoachSessionOpen: false,
    students: [],
    batches: [],
    openCoachEditBatch: false,
    openCoachEditStudent: false,
    coachID: null,
    coachName: null,
    coachTimezone: null,
};

const coachScheduling = createSlice({
    name: 'coachScheduling',
    initialState,
    reducers: {
        openCoachScheduleSession(state, action) {
            console.log('Open Action  coach : ', action.payload);
            state.coachID = action.payload.id;
            state.coachName = action.payload.name;
            state.coachTimezone = action.payload.timezone;
            if (action.payload.student) {
                state.students = action.payload.student;
            }
            if (action.payload.batches) {
                state.batches = action.payload.batches;
            }
            state.scheduleCoachSessionOpen = true;
        },
        closeCoachScheduleSession(state, action) {
            console.log('Close Action : ', action.payload);
            state.coachID = null;
            state.coachName = null;
            state.coachTimezone = null;
            state.students = [];
            state.batches = [];
            state.scheduleCoachSessionOpen = false;
        },
        openCoachEditBatch(state, action) {
            state.openCoachEditBatch = true;
        },
        closeCoachEditBatch(state, action) {
            state.openCoachEditBatch = false;
        },
        openCoachEditStudent(state, action) {
            state.openCoachEditStudent = true;
        },
        closeCoachEditStudent(state, action) {
            state.openCoachEditStudent = false;
        },
        clearAvailableSlots(state) {
            state.coachAvailableSlots = [];
        },
    },
    extraReducers: builder => {

        // Get TA Scheduled Sessions
        builder.addCase(getTAScheduledSessions.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTAScheduledSessions.fulfilled, (state, action) => {
            state.loading = false;
            state.coachScheduledSessions = action.payload.data;
        });
        builder.addCase(getTAScheduledSessions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.coachAvailableSlots = []
        });

        // Create TA Schedule
        builder.addCase(createCoachSchedule.pending, state => {
            state.loading = true;
        });
        builder.addCase(createCoachSchedule.fulfilled, (state, action) => {
            state.loading = false;
            // state.coachScheduledSessions = action.payload.data;
            toast.success(action.payload.message || 'Coach Session Created Successfully')
        });
        builder.addCase(createCoachSchedule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(
                action.payload || 'Failed to create Coach Session. Please Try Again'
            )

        });

        // Get TA Available Slots From Date
        builder.addCase(getCoachAvailableSlotsFromDate.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getCoachAvailableSlotsFromDate.fulfilled,
            (state, action) => {
                state.loading = false;
                state.coachAvailableSlots = action.payload.data;
            }
        );
        builder.addCase(
            getCoachAvailableSlotsFromDate.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.coachAvailableSlots = [];
            }
        );

        // Cancel Scheduled Sessions
        builder.addCase(cancelCoachScheduledSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            cancelCoachScheduledSession.fulfilled,
            (state, action) => {
                state.loading = false;
                // state.coachScheduledSessions = action.payload.data;
                toast.success(action.payload.message || 'Session Cancelled Successfully')
            }
        );
        builder.addCase(
            cancelCoachScheduledSession.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(action.payload || 'Failed To Cancel Session')
            }
        );

        // Reschedule Session
        builder.addCase(rescheduleCoachSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(rescheduleCoachSession.fulfilled, (state, action) => {
            state.loading = false;
            state.coachScheduledSessions = action.payload.data;
            toast.success(action.payload.message || 'Session Rescheduled Successsfully')
        });
        builder.addCase(rescheduleCoachSession.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.payload || 'Failed To Rescheduled Session')
        });
    },
});

export const {
    openCoachScheduleSession,
    closeCoachScheduleSession,
    openCoachEditBatch,
    closeCoachEditBatch,
    openCoachEditStudent,
    closeCoachEditStudent,
} = coachScheduling.actions;

export default coachScheduling.reducer;
