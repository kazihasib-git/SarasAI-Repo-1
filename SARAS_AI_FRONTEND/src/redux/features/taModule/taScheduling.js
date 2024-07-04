import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../utils/baseURL";

export const showTASchedule = createAsyncThunk(
    "taModule/showTaSchedule",
    async () => {
        const response = await axios.get(`${baseUrl}/admin/taschedules`);
        return response.data;
    }
);

const initialState = {
    taSchedule: [],
    loading: false,
    error: null,
    studentBatchMapping: [],
    studentBatchMappingLoading: false,
    studentBatchMappingError: null,
    scheduleSessionOpen: false,
    taID : null,
    taName : null,
};

const taScheduling = createSlice({
    name: "taScheduling",
    initialState,
    reducers: {
        openScheduleSession(state, action) {
            console.log("Open Action : ", action.payload)
            state.taID = action.payload.id;
            state.taName = action.payload.name;
            state.scheduleSessionOpen = true;
        },
        closeScheduleSession(state, action) {
            console.log("Close Action : ", action.payload)
            // state.taID = null;
            // state.taName = null;
            state.scheduleSessionOpen = false;
        },
    },
    extraReducers : (builder) => {
        builder.addCase(showTASchedule.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(showTASchedule.fulfilled, (state, action) => {
            state.loading = false;
            state.taSchedule = action.payload.data;
        });
        builder.addCase(showTASchedule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export const {
    openScheduleSession,
    closeScheduleSession,
} = taScheduling.actions

export default taScheduling.reducer

/*
export const createTA = createAsyncThunk(
    "taModule/createTA",
    async (data) => {
        const response = await axios.post(`${baseUrl}/admin/manage_tas`, data);
        return response.data;
    }
);


export const getTASlots = createAsyncThunk("taScheduling/getTASlots", async ({id , data}) => {
    const response = await axios.post(`${baseUrl}/admin/coach-slots/records`, data);;
    const res = response.data;
    return res.data;
});


const initialState = {
    taSlots : [],
    loading : false,
    error : null,
    //scheduleSessionOpen : false,
    markLeaveOpen : false,
    scheduledSlotsOpen : false,
    scheduledSessionOpen : false,
    cancelSessionOpen : false,
    resheduleSessionOpen : false,
    reasonForLeaveOpen : false,
    deleteFutureSlotOpen : false,
    scheduleNewSession : false,
    createNewSlotOpen : false,
}


export const taSchedulingSlice = createSlice({
    name: "taScheduling",
    initialState, 
    reducers: {
        openMarkLeave(state) {
            state.markLeaveOpen = true;
        },
        closeMarkLeave(state) {
            state.markLeaveOpen = false;
        },
        openScheduledSlots(state) {
            state.scheduledSlotsOpen = true;
        },
        closeScheduledSlots(state){
            state.scheduledSlotsOpen = false;
        },
        openScheduledSession(state){
            state.scheduledSessionOpen = true;
        },
        closeScheduledSession(state){
            state.scheduledSessionOpen = false;
        },
        openCancelSession(state){
            state.cancelSessionOpen = true;
        },
        closeCancelSession(state){
            state.cancelSessionOpen = false;
        },
        openReasonForLeave(state){
            state.reasonForLeaveOpen = true;
        },
        closeReasonForLeave(state){
            state.reasonForLeaveOpen = false;
        },
        openRescheduleSession(state){
            state.resheduleSessionOpen = true;
        },
        closeRescheduleSession(state){
            state.resheduleSessionOpen = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getTASlots.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getTASlots.fulfilled, (state, action) => {
            state.loading = false;
            state.taSlots = action.payload;
        });
        builder.addCase(getTASlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});

    //extraReducers: (builder) => {
        //Create TA
        
        builder.addCase(createTA.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createTA.fulfilled, (state, action) => {
            state.loading = false;
            state.tas = action.payload;
        });
        builder.addCase(createTA.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
        


export const {  
    openMarkLeave,
    closeMarkLeave,
    openScheduledSlots,
    closeScheduledSlots, 
    openScheduledSession,
    closeScheduledSession,
    openCancelSession,
    closeCancelSession,
    openReasonForLeave,
    closeReasonForLeave,
    openRescheduleSession,
    closeRescheduleSession,
} = taSchedulingSlice.actions;

export default taSchedulingSlice.reducer;
*/