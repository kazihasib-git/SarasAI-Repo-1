import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../../../utils/baseURL';
import axiosInstance from '../../../services/httpService';
import { toast } from 'react-toastify';

// Get Today Available Ta
export const getTodayTaAvailability = createAsyncThunk(
    'taAvialability/getTodayTaAvailability',
    async rejectWithValue => {
        try{
            const response = await axiosInstance.get(
                `${baseUrl}/admin/TA-availability/get-today-available-ta`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else {
                return rejectWithValue('An Error Occurred While Fetching TA Availability')
            }
        }
    }
);

//get slots for ta from date to end date
export const getSlots = createAsyncThunk(
    'taAvialability/getSlots',
    async (data , { rejectWithValue })=> {
        try{
            const response = await axiosInstance.post(
                `${baseUrl}/admin/coach-slots/records`,
                data
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else {
                return rejectWithValue('An Error Occurred While Fetching Slots')
            }
        }
    }
);

//for fetching sessions of ta for calendar
export const fetchTAScheduleById = createAsyncThunk(
    'taAvialability/fetchTAScheduleById',
    async (id , { rejectWithValue }) => {
        try{
            const response = await axiosInstance.get(
                `${baseUrl}/admin/taschedules/${id}`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else {
                return rejectWithValue('An Error Occurred While Fetching Schedules For TA')
            }
        }
    }
);

//for fetching slots of ta for calendar
export const fetchTaSlots = createAsyncThunk(
    'taAvialability/fetchTaSlots',
    async (id, { rejectWithValue })=> {
        try{
            const response = await axiosInstance.get(
                `${baseUrl}/admin/coach-slots/${id}`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else {
                return rejectWithValue('An Error Occurred While Fetching Ta Slots')
            }
        }
    }
);

// Create Slots for TA
export const createSlots = createAsyncThunk(
    'taAvialability/createSlots',
    async (data , { rejectWithValue })=> {
        try{
            const response = await axiosInstance.post(
                `${baseUrl}/admin/coach-slots`,
                data
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else {
                return rejectWithValue('An Error Occurred While Creating Slots')
            }
        }
    }
);

// Get Schedule Session for TA by slots
export const getScheduleSession = createAsyncThunk(
    'taAvialability/getScheduleSession',
    async (data , { rejectWithValue }) => {
        try{
            const response = await axiosInstance.post(
                `${baseUrl}/admin/taschedules/get-schedules-records`,
                data
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else {
                return rejectWithValue('An Error Occurred While Fetching Session')
            }
        }
    }
);

// Get Available Slots
export const fetchAvailableSlots = createAsyncThunk(
    'taAvialability/fetchAvailableSlots',
    async ( data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/coach-slots/getTACoachSlotForADate`,
                data
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else {
                return rejectWithValue('An Error Occurred While Fetching Available SLots')
            }
        }
    }
);

// Delete Future Slots
export const deleteTaFutureSlots = createAsyncThunk(
    'taAvialability/deleteTaFutureSlots',
    async (id, { rejectWithValue }) => {
        try{
            const response = await axiosInstance.delete(
                `${baseUrl}/admin/coach-slots/${id}`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else {
                return rejectWithValue('An Error Occurred While Deleting Future Slots')
            }
        }
    }
);

// Reason for Leave
export const reasonForLeave = createAsyncThunk(
    'taAvialability/reasonForLeave',
    async (data , { rejectWithValue }) => {
        try{
            const response = await axiosInstance.post(
                `${baseUrl}/admin/leave`,
                data
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else {
                return rejectWithValue('An Error Occurred While Providing Reason For Leave')
            }
        }
    }
);

export const changePlatform = createAsyncThunk(
    'taAvialability/changePlatform',
    async ({ id, data }, { rejectWithValue }) => {
        try{
            const response = await axiosInstance.patch(
                `${baseUrl}/admin/taschedules/change-platform/${id}`,
                data
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else {
                return rejectWithValue('An Error Occurred While Changing Platform')
            }
        }
    }
);

// Get TA Schdeuled Students
export const getTAScheduledStudents = createAsyncThunk(
    'taAvialability/getScheduledStudents',
    async (id, { rejectWithValue }) => {
        try{
            const response = await axiosInstance.get(
                `${baseUrl}/admin/taschedules/students/${id}`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else {
                return rejectWithValue('An Error Occurred While Fetching Students Of Session')
            }
        }
    }
);

// Edit TA Scheduled Students
export const editTASchdeuledStudents = createAsyncThunk(
    'taAvialability/editTAScheduledStudents',
    async ({ Id, data }, { rejectWithValue }) => {
        try{
            const response = await axiosInstance.patch(
                `${baseUrl}/admin/taschedules/update-students/${Id}`,
                data
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else {
                return rejectWithValue('An Error Occurred While Editing Students')
            }
        }  
    }
);

// Get Ta Schdeuled Batches
export const getTAScheduledBatches = createAsyncThunk(
    'taAvialability/getScheduledBatches',
    async (id, { rejectWithValue }) => {
        try{
            const response = await axiosInstance.get(
                `${baseUrl}/admin/taschedules/batches/${id}`
            );
            return response.data;
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else {
                return rejectWithValue('An Error Occurred While Fetching Session Batches')
            }
        }
    }
);

// Edit TA Schdeuled Batches
export const editTASchdeuledBatches = createAsyncThunk(
    'taAvialability/editScheduledBatches',
    async ({ Id, data }, { rejectWithValue }) => {
        try{
            const response = await axiosInstance.patch(
                `${baseUrl}/admin/taschedules/update-batches/${Id}`,
                data
            );
            return response.data;   
        }catch(error){
            if(error.response && error.response.data){
                return rejectWithValue(error.response.data.message)
            }else {
                return rejectWithValue('An Error Occurred While Editing Session Batches')
            }
        }
    }
);

const initialState = {
    todaysAvailableTa: [],

    markLeaveData: [],
    slotData: [],
    scheduleData: [],
    scheduledSlotsData: [],
    scheduledSessionData: [],
    availableSlotsData: [],
    reasonForLeaveData: [],
    platformData: [],
    taScheduledStudents: [],
    taScheduledBatches: [],

    scheduleNewSession: false,
    createNewSlotOpen: false,
    deleteFutureSlotOpen: false,

    markLeaveOpen: false,
    scheduledSlotsOpen: false,
    scheduledSessionOpen: false,
    cancelSessionOpen: false,
    resheduleSessionOpen: false,
    customResheduleSessionOpen: false,
    reasonForLeaveOpen: false,

    slotEventData: null,
    sessionEventData: null,

    loading: false,
    error: null,
    schduldeCancelData: null,
    deletingCoachFutureSlots: false,
    taId: [],
    taName: [],
    sessionEventData: [],
    openEventData: false,
    taEditScheduledStudents: false,
    taEditScheduledBatches: false,
    meetingId: null,
};

export const taAvailabilitySlice = createSlice({
    name: 'taAvialability',
    initialState,
    reducers: {
        openCreateNewSlots(state) {
            state.createNewSlotOpen = true;
        },
        closeCreateNewSlots(state) {
            state.createNewSlotOpen = false;
        },
        openMarkLeave(state) {
            state.markLeaveOpen = true;
        },
        closeMarkLeave(state) {
            state.markLeaveOpen = false;
        },
        openScheduledSlots(state, action) {
            console.log('OPENSCHEDULE SLOTS : ', action.payload);
            state.scheduledSlotsOpen = true;
            state.markLeaveData = action.payload;
        },
        closeScheduledSlots(state) {
            state.scheduledSlotsOpen = false;
            state.markLeaveData = [];
        },
        openScheduledSession(state, action) {
            // console.log("Open Action slotEventData : ", action.payload)
            state.scheduledSessionOpen = true;
            state.slotEventData = action.payload;
        },
        closeScheduledSession(state) {
            state.scheduledSessionOpen = false;
        },
        openCancelSession(state, action) {
            state.cancelSessionOpen = true;
            console.log('ACTION : ', action.payload);
            state.schduldeCancelData = action.payload;
        },
        closeCancelSession(state) {
            state.cancelSessionOpen = false;
        },
        openReasonForLeave(state, action) {
            state.reasonForLeaveOpen = true;
            state.markLeaveData = action.payload;
        },
        closeReasonForLeave(state) {
            state.reasonForLeaveOpen = false;
            state.markLeaveData = [];
        },
        openRescheduleSession(state, action) {
            console.log('Open Action sessionEventData : ', action.payload);
            state.resheduleSessionOpen = true;
            state.sessionEventData = action.payload;
        },
        closeRescheduleSession(state) {
            state.resheduleSessionOpen = false;
        },

        openStudentsRescheduleSession(state) {
            state.customResheduleSessionOpen = true;
        },
        closeStudentsRescheduleSession(state) {
            state.customResheduleSessionOpen = false;
        },

        openDeleteTaSlots(state, action) {
            console.log('Payload :', action.payload);
            state.deletingCoachFutureSlots = true;
            state.taId = action.payload.id;
            state.taName = action.payload.name;
        },
        closeDeleteTaSlots(state, action) {
            state.deletingCoachFutureSlots = false;
            state.taId = [];
            state.taName = [];
        },
        openSessionEvent(state, action) {
            state.sessionEventData = action.payload;
            state.openEventData = true;
        },
        closeSessionEvent(state, action) {
            state.sessionEventData = [];
            state.openEventData = false;
        },
        openTaEditScheduledStudents(state, action) {
            console.log('Action :', action.payload);
            state.taEditScheduledStudents = true;
            state.meetingId = action.payload.id;
        },
        closeTaEditScheduledStudents(state, action) {
            state.taEditScheduledStudents = false;
            state.meetingId = null;
        },
        openTaEditSchduledBatches(state, action) {
            state.taEditScheduledBatches = true;
            state.meetingId = action.payload.id;
        },
        closeTaEditScheduledBatches(state, action) {
            state.taEditScheduledBatches = false;
            state.meetingId = null;
        },
    },
    extraReducers: builder => {
        //for sessions ta for calendar
        builder.addCase(fetchTAScheduleById.pending, state => {
            state.loading = true;
        });
        builder.addCase(fetchTAScheduleById.fulfilled, (state, action) => {
            state.loading = false;
            state.scheduleData = action.payload.data;
        });
        builder.addCase(fetchTAScheduleById.rejected, (state, action) => {
            state.loading = false;
            state.scheduleData = [];
            state.error = action.error.message;
        });

        //for slots of ta for calendar
        builder.addCase(fetchTaSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(fetchTaSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.slotData = action.payload.data; // Update state with fetched data
        });
        builder.addCase(fetchTaSlots.rejected, (state, action) => {
            state.loading = false;
            state.slotData = [];
            state.error = action.error.message;
        });

        // Get Today Available Ta
        builder.addCase(getTodayTaAvailability.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTodayTaAvailability.fulfilled, (state, action) => {
            state.loading = false;
            state.todaysAvailableTa = action.payload?.data;
        });
        builder.addCase(getTodayTaAvailability.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.todaysAvailableTa = []
        });

        // Get Slots
        builder.addCase(getSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(getSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.scheduledSlotsData = action.payload?.data;
        });
        builder.addCase(getSlots.rejected, (state, action) => {
            state.loading = false;
            state.scheduledSlotsData = [];
            state.error = action.error.message;
        });

        // Create Slots
        builder.addCase(createSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(createSlots.fulfilled, (state, action) => {
            state.loading = false;
            toast.success(action.payload.message || 'Slot Created Successfully')
        });
        builder.addCase(createSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.payload || 'Failed To Create Slot')
        });

        // Get Schedule Session
        builder.addCase(getScheduleSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(getScheduleSession.fulfilled, (state, action) => {
            state.loading = false;
            state.scheduledSessionData = action.payload?.data;
        });
        builder.addCase(getScheduleSession.rejected, (state, action) => {
            state.loading = false;
            state.scheduledSessionData = [];
            state.error = action.error.message;
        });

        // Get Available Slots
        builder.addCase(fetchAvailableSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(fetchAvailableSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.availableSlotsData = action.payload?.data;
        });
        builder.addCase(fetchAvailableSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.availableSlotsData = [];
        });

        // Delete Future Slots
        builder.addCase(deleteTaFutureSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteTaFutureSlots.fulfilled, (state, action) => {
            state.loading = false;
            toast.success(action.payload.message || 'All Future Slots Deleted Successfully')
        });
        builder.addCase(deleteTaFutureSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.payload || 'Failed To Delete All Future Slots')
        });

        // Reason for Leave
        builder.addCase(reasonForLeave.pending, state => {
            state.loading = true;
        });
        builder.addCase(reasonForLeave.fulfilled, (state, action) => {
            state.loading = false;
            state.reasonForLeaveData = action.payload.data;
            toast.success(action.payload.message || 'Marked Leave Successfully')
        });
        builder.addCase(reasonForLeave.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.payload || 'Failed To Mark Leave')
        });

        // Change Platform
        builder.addCase(changePlatform.pending, state => {
            state.loading = true;
        });
        builder.addCase(changePlatform.fulfilled, (state, action) => {
            state.loading = false;
            state.platformData = action.payload;
            toast.success(action.payload.message || 'Platform Changes Successfully')
        });
        builder.addCase(changePlatform.rejected, (state, action) => {
            state.loading = false;
            state.platformData = [];
            state.error = action.error.message;
            toast.error(action.payload || 'Failed To Change Platform')
        });

        // Get Ta Scheduled Students
        builder.addCase(getTAScheduledStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTAScheduledStudents.fulfilled, (state, action) => {
            state.loading = false;
            state.taScheduledStudents = action.payload.data;
        });
        builder.addCase(getTAScheduledStudents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taScheduledStudents = [];
        });

        // Edit TA Scheduled Students
        builder.addCase(editTASchdeuledStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(editTASchdeuledStudents.fulfilled, (state, action) => {
            state.loading = false;
            // toast.success(action.payload.message || 'Students Updated Successfully')
        });
        builder.addCase(editTASchdeuledStudents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.payload || 'Failed To Update Students')
        });

        // Get TA Scheduled Batches
        builder.addCase(getTAScheduledBatches.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTAScheduledBatches.fulfilled, (state, action) => {
            state.loading = false;
            state.taScheduledBatches = action.payload.data;
        });
        builder.addCase(getTAScheduledBatches.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taScheduledBatches = [];
        });

        // Edit TA Scheduled Batches
        builder.addCase(editTASchdeuledBatches.pending, state => {
            state.loading = true;
        });
        builder.addCase(editTASchdeuledBatches.fulfilled, (state, action) => {
            state.loading = false;
            toast.success(action.payload.message || 'Batches Updated Successfully')
        });
        builder.addCase(editTASchdeuledBatches.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.payload || 'Failed To Update Batches')
        });
    },
});

export const {
    openMarkLeave,
    closeMarkLeave,
    openScheduledSlots,
    closeScheduledSlots,
    openCreateNewSlots,
    closeCreateNewSlots,
    openScheduledSession,
    closeScheduledSession,
    openCancelSession,
    closeCancelSession,
    openReasonForLeave,
    closeReasonForLeave,
    openRescheduleSession,
    closeRescheduleSession,
    openStudentsRescheduleSession,
    closeStudentsRescheduleSession,
    openDeleteTaSlots,
    closeDeleteTaSlots,
    openSessionEvent,
    closeSessionEvent,
    openTaEditScheduledStudents,
    closeTaEditScheduledStudents,
    openTaEditSchduledBatches,
    closeTaEditScheduledBatches,
} = taAvailabilitySlice.actions;

export default taAvailabilitySlice.reducer;
