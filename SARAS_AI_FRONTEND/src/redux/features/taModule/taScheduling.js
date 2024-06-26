import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../utils/baseURL";

/*
export const createTA = createAsyncThunk(
    "taModule/createTA",
    async (data) => {
        const response = await axios.post(`${baseUrl}/admin/manage_tas`, data);
        return response.data;
    }
);

*/

const initialState = {
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
        //Create TA
        /*
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
        */
    }
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