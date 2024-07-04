import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../utils/baseURL";


export const getSlots = createAsyncThunk(
    "taAvialability/getSlots",
    async (data) => {
        const response = await axios.post(`${baseUrl}/admin/coach-slots/records`, data);
        return response.data;
    }
);

const initialState = {
    markLeaveOpen: false,
    scheduledSlotsOpen: false,
    scheduledSlotsData: [], // Ensure this is correctly named and initialized
    scheduledSessionOpen: false,
    cancelSessionOpen: false,
    rescheduleSessionOpen: false,
    reasonForLeaveOpen: false,
    deleteFutureSlotOpen: false,
    scheduleNewSession: false,
    createNewSlotOpen: false,
    loading: false,
    error: null,
};

export const taAvailabilitySlice = createSlice({
    name: "taAvialability",
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
        closeScheduledSlots(state) {
            state.scheduledSlotsOpen = false;
        },
        openScheduledSession(state) {
            state.scheduledSessionOpen = true;
        },
        closeScheduledSession(state) {
            state.scheduledSessionOpen = false;
        },
        openCancelSession(state) {
            state.cancelSessionOpen = true;
        },
        closeCancelSession(state) {
            state.cancelSessionOpen = false;
        },
        openReasonForLeave(state) {
            state.reasonForLeaveOpen = true;
        },
        closeReasonForLeave(state) {
            state.reasonForLeaveOpen = false;
        },
        openRescheduleSession(state) {
            state.rescheduleSessionOpen = true;
        },
        closeRescheduleSession(state) {
            state.rescheduleSessionOpen = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getSlots.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.scheduledSlotsData = action.payload?.data;
        });
        builder.addCase(getSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
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
} = taAvailabilitySlice.actions;

export default taAvailabilitySlice.reducer;