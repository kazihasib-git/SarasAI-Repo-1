import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';

export const getCoachScheduledSessions = createAsyncThunk(
    'coachScheduling/getCoachScheduledSessions',
    async ({ id, data }) => {
        const response = await axios.post(
            `${baseUrl}/admin/coachschedules/${id}`,
            data
        );
        return response.data;
    }
);

export const createCoachSchedule = createAsyncThunk(
    'coachScheduling/createCoachSchedule',
    async data => {
        const response = await axios.post(
            `${baseUrl}/admin/coachschedules`,
            data
        );
        return response.data;
    }
);

export const getTaAvailableSlotsFromDate = createAsyncThunk(
    'coachScheduling/getTaAvailableSlotsFromDate',
    async data => {
        const response = await axios.post(
            `${baseUrl}/admin/coach-slots/getTACoachSlotForADate`,
            data
        );
        return response.data;
    }
);

const initialState = {
    taAvailableSlots: [],
    taScheduledSessions: [],
    taSchedule: [],
    loading: false,
    error: null,
    studentBatchMapping: [],
    studentBatchMappingLoading: false,
    studentBatchMappingError: null,
    scheduleSessionOpen: false,
    students: [],
    batches: [],
    taID: null,
    taName: null,
    taTimezone: null,
};

const coachScheduling = createSlice({
    name: 'coachScheduling',
    initialState,
    reducers: {
        openCoachScheduleSession(state, action) {
            console.log('Open Action : ', action.payload);
            state.taID = action.payload.id;
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
        closeCoachScheduleSession(state, action) {
            console.log('Close Action : ', action.payload);
            state.taID = null;
            state.taName = null;
            state.taTimezone = null;
            state.students = [];
            state.batches = [];
            state.scheduleSessionOpen = false;
        },
        clearCoachAvailableSlots(state) {
            state.taAvailableSlots = [];
        },
    },
    extraReducers: builder => {
        // Get TA Scheduled Sessions
        builder.addCase(getCoachScheduledSessions.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getCoachScheduledSessions.fulfilled,
            (state, action) => {
                state.loading = false;
                state.taScheduledSessions = action.payload.data;
            }
        );
        builder.addCase(getCoachScheduledSessions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Create TA Schedule
        builder.addCase(createCoachSchedule.pending, state => {
            state.loading = true;
        });
        builder.addCase(createCoachSchedule.fulfilled, (state, action) => {
            state.loading = false;
            state.taScheduledSessions = action.payload.data;
        });
        builder.addCase(createCoachSchedule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
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
            }
        );
    },
});

export const { openCoachScheduleSession, closeCoachScheduleSession } =
    coachScheduling.actions;

export default coachScheduling.reducer;
