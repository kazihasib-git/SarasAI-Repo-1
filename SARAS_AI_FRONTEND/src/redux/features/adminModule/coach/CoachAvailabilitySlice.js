import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../../../utils/baseURL';
import axiosInstance from '../../../services/httpService';

// Get Today Available Ta
export const getTodayCoachAvailability = createAsyncThunk(
    'coachAvailability/getTodayCoachAvailability',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/Coach-availability/get-today-available-coach`
        );
        return response.data;
    }
);

//get slots for Coach from date to end date
export const getCoachSlots = createAsyncThunk(
    'coachAvailability/getCoachSlots',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/admin/coach-slots/records`,
            data
        );
        return response.data;
    }
);

//for fetching sessions of Coach for calendar
export const fetchCoachScheduleById = createAsyncThunk(
    'coachAvailability/fetchCoachScheduleById',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/coachschedules/${id}`
        );
        return response.data;
    }
);

//for fetching slots of Coach for calendar
export const fetchCoachSlots = createAsyncThunk(
    'coachAvailability/fetchCoachSlots',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/coach-slots/${id}`
        );
        return response.data;
    }
);

// Create Slots for Coach
export const createCoachSlots = createAsyncThunk(
    'coachAvailability/createCoachSlots',
    async data => {
        console.log('Data being sent:', data);
        const response = await axiosInstance.post(
            `${baseUrl}/admin/coach-slots`,
            data
        );
        return response.data;
    }
);

// Get Schedule Session for Coach
export const getCoachScheduleSession = createAsyncThunk(
    'coachAvailability/getScheduleSession',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/admin/coachschedules/get-schedules-records`,
            data
        );
        return response.data;
    }
);
export const fetchCoachAvailableSlots = createAsyncThunk(
    'coachAvailability/fetchCoachAvailableSlots',
    async data => {
        // console.log("ID : ", id);
        const response = await axiosInstance.post(
            `${baseUrl}/admin/coach-slots/getTACoachSlotForADate`,
            data
        );
        return response.data;
    }
);

export const deleteCoachFutureSlots = createAsyncThunk(
    'coachAvailability/deleteCoachFutureSlots',
    async id => {
        const response = await axiosInstance.delete(
            `${baseUrl}/admin/coach-slots/${id}`
        );
        return response.data;
    }
);

// Reason for Coach Leave
export const reasonForCoachLeave = createAsyncThunk(
    'taAvialability/reasonForCoachLeave',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/admin/leave`,
            data
        );
        return response.data;
    }
);

// Get Coach Schdeuled Students
export const getCoachScheduledStudents = createAsyncThunk(
    'coachAvailability/getScheduledStudents',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/coachschedules/students/${id}`
        );
        return response.data;
    }
);

// Edit Coach Scheduled Students
export const editCoachScheduledStudents = createAsyncThunk(
    'coachAvailability/editScheduledStudents',
    async ({ Id, data }) => {
        const response = await axiosInstance.patch(
            `${baseUrl}/admin/coachschedules/update-students/${Id}`,
            data
        );
        return response.data;
    }
);

// Get Coach Schdeuled Batches
export const getCoachScheduledBatches = createAsyncThunk(
    'coachAvailability/getScheduledBatches',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/coachschedules/batches/${id}`
        );
        return response.data;
    }
);

// Edit Coach Scheduled Batches
export const editCoachScheduledBatches = createAsyncThunk(
    'coachAvailability/editScheduledBatches',
    async ({ Id, data }) => {
        const response = await axiosInstance.patch(
            `${baseUrl}/admin/coachschedules/update-batches/${Id}`,
            data
        );
        return response.data;
    }
);

const initialState = {
    todaysAvailableCoach: [],
    coachMarkLeaveOpen: false,
    scheduledCoachSlotsOpen: false,
    slotCoachData: [],
    scheduleCoachData: [],
    scheduledCoachSlotsData: [], // Ensure this is correctly named and initialized
    scheduledCoachSessionData: [], // Ensure this is correctly named and initialized
    availableCoachSlotsData: [],
    reasonForCoachLeaveData: [],
    platformData: [],
    coachScheduledStudents: [],
    coachScheduledBatches: [],

    scheduledCoachSessionOpen: false,
    cancelCoachSessionOpen: false,
    resheduleCoachSessionOpen: false,
    customResheduleSessionOpen: false,
    reasonForCoachLeaveOpen: false,
    deleteFutureSlotOpen: false,
    scheduleNewSession: false,
    createNewCoachSlotOpen: false,
    slotCoachEventData: null, // To Cancel Coach Session
    sessionCoachEventData: null,
    loading: false,
    error: null,
    schduldeCoachCancelData: null,
    deletingCoachFutureSlots: false,
    coachId: [],
    coachName: [],
    coachSessionEventData: [],
    coachMarkLeaveData: [],
    coachOpenEventData: false,

    coachEditScheduledStudents: false,
    coachEditScheduledBatches: false,
    meetingId: null,
};

export const coachAvailabilitySlice = createSlice({
    name: 'coachAvailability',
    initialState,
    reducers: {
        openCoachMarkLeave(state) {
            state.coachMarkLeaveOpen = true;
        },
        closeCoachMarkLeave(state) {
            state.coachMarkLeaveOpen = false;
        },
        openCoachScheduledSlots(state, action) {
            state.scheduledCoachSlotsOpen = true;
            state.coachMarkLeaveData = action.payload;
        },
        closeCoachScheduledSlots(state) {
            state.scheduledCoachSlotsOpen = false;
            state.coachMarkLeaveData = [];
        },
        openCoachScheduledSession(state, action) {
            console.log('Open Action slotCoachEventData : ', action.payload);
            state.scheduledCoachSessionOpen = true;
            state.slotCoachEventData = action.payload;
        },
        closeCoachScheduledSession(state) {
            state.scheduledCoachSessionOpen = false;
        },
        openCoachCreateNewSlots(state) {
            state.createNewCoachSlotOpen = true;
        },
        closeCoachCreateNewSlots(state) {
            state.createNewCoachSlotOpen = false;
        },
        openCoachCancelSession(state, action) {
            state.cancelCoachSessionOpen = true;
            state.schduldeCoachCancelData = action.payload;
        },
        closeCoachCancelSession(state) {
            state.cancelCoachSessionOpen = false;
        },
        openCoachReasonForLeave(state, action) {
            state.reasonForCoachLeaveOpen = true;
            state.coachMarkLeaveData = action.payload;
        },
        closeCoachReasonForLeave(state) {
            state.reasonForCoachLeaveOpen = false;
            state.coachMarkLeaveData = [];
        },
        openCoachRescheduleSession(state, action) {
            console.log('Open Action sessionCoachEventData : ', action.payload);
            state.resheduleCoachSessionOpen = true;
            state.sessionCoachEventData = action.payload;
        },
        closeCoachRescheduleSession(state) {
            state.resheduleCoachSessionOpen = false;
        },

        openDeleteCoachSlots(state, action) {
            console.log('Payload :', action.payload);
            state.deletingCoachFutureSlots = true;
            state.coachId = action.payload.id;
            state.coachName = action.payload.name;
        },
        closeDeleteCoachSlots(state, action) {
            state.deletingCoachFutureSlots = false;
            state.coachId = [];
            state.coachName = [];
        },

        openCoachSessionEvent(state, action) {
            state.coachSessionEventData = action.payload;
            state.coachOpenEventData = true;
        },
        closeCoachSessionEvent(state, action) {
            state.coachSessionEventData = [];
            state.coachOpenEventData = false;
        },

        // don't know where to use
        // openStudentsRescheduleSession(state) {
        //   state.customResheduleSessionOpen = true;
        // },
        // closeStudentsRescheduleSession(state) {
        //   state.customResheduleSessionOpen = false;
        // },
        openCoachEditScheduledStudents(state, action) {
            console.log('Action :', action.payload);
            state.coachEditScheduledStudents = true;
            state.meetingId = action.payload.id;
        },
        closeCoachEditScheduledStudents(state, action) {
            state.coachEditScheduledStudents = false;
            state.meetingId = null;
        },
        openCoachEditSchduledBatches(state, action) {
            state.coachEditScheduledBatches = true;
            state.meetingId = action.payload.id;
        },
        closeCoachEditScheduledBatches(state, action) {
            state.coachEditScheduledBatches = false;
            state.meetingId = null;
        },
    },
    extraReducers: builder => {
        //for sessions Coach for calendar
        builder.addCase(fetchCoachScheduleById.pending, state => {
            state.loading = true;
        });
        builder.addCase(fetchCoachScheduleById.fulfilled, (state, action) => {
            state.loading = false;
            state.scheduleCoachData = action.payload.data;
        });
        builder.addCase(fetchCoachScheduleById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        //for slots of Coach for calendar
        builder.addCase(fetchCoachSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(fetchCoachSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.slotCoachData = action.payload.data; // Update state with fetched data
        });
        builder.addCase(fetchCoachSlots.rejected, (state, action) => {
            state.loading = false;
            state.slotCoachData = [];
            state.error = action.error.message;
        });

        // Get Today Available Ta
        builder.addCase(getTodayCoachAvailability.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getTodayCoachAvailability.fulfilled,
            (state, action) => {
                state.loading = false;
                state.todaysAvailableCoach = action.payload?.data;
            }
        );
        builder.addCase(getTodayCoachAvailability.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get Slots
        builder.addCase(getCoachSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.scheduledCoachSlotsData = action.payload?.data;
        });
        builder.addCase(getCoachSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Create Coach Slots
        builder.addCase(createCoachSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(createCoachSlots.fulfilled, (state, action) => {
            state.loading = false;
            // state.slotCoachEventData = action.payload?.data;
        });
        builder.addCase(createCoachSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        builder.addCase(getCoachScheduleSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachScheduleSession.fulfilled, (state, action) => {
            state.loading = false;
            state.scheduledCoachSessionData = action.payload?.data;
        });
        builder.addCase(getCoachScheduleSession.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.scheduledCoachSessionData = [];
        });

        builder.addCase(fetchCoachAvailableSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(fetchCoachAvailableSlots.fulfilled, (state, action) => {
            state.loading = false;
            console.log('availableCoachSlotsData : ', action.payload?.data);
            state.availableCoachSlotsData = action.payload?.data;
        });
        builder.addCase(fetchCoachAvailableSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.availableCoachSlotsData = [];
        });

        builder.addCase(deleteCoachFutureSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(deleteCoachFutureSlots.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(deleteCoachFutureSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Reason for Leave
        builder.addCase(reasonForCoachLeave.pending, state => {
            state.loading = true;
        });
        builder.addCase(reasonForCoachLeave.fulfilled, (state, action) => {
            state.loading = false;
            state.reasonForCoachLeaveData = action.payload.data;
        });
        builder.addCase(reasonForCoachLeave.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get Coach Scheduled Students
        builder.addCase(getCoachScheduledStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getCoachScheduledStudents.fulfilled,
            (state, action) => {
                state.loading = false;
                state.coachScheduledStudents = action.payload.data;
            }
        );
        builder.addCase(getCoachScheduledStudents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.coachScheduledStudents = [];
        });

        // Edit Coach Scheduled Students
        builder.addCase(editCoachScheduledStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            editCoachScheduledStudents.fulfilled,
            (state, action) => {
                state.loading = false;
                // TODO :
            }
        );
        builder.addCase(
            editCoachScheduledStudents.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }
        );

        // Get Coach Scheduled Batches
        builder.addCase(getCoachScheduledBatches.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachScheduledBatches.fulfilled, (state, action) => {
            state.loading = false;
            state.coachScheduledBatches = action.payload.data;
        });
        builder.addCase(getCoachScheduledBatches.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.coachScheduledBatches = [];
        });

        // Edit Coach Scheduled Batches
        builder.addCase(editCoachScheduledBatches.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            editCoachScheduledBatches.fulfilled,
            (state, action) => {
                state.loading = false;
                // TODO :
            }
        );
        builder.addCase(editCoachScheduledBatches.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export const {
    openCoachMarkLeave,
    closeCoachMarkLeave,
    openCoachScheduledSlots,
    closeCoachScheduledSlots,
    openCoachCreateNewSlots,
    closeCoachCreateNewSlots,
    openCoachScheduledSession,
    closeCoachScheduledSession,
    openCoachCancelSession,
    closeCoachCancelSession,
    openCoachReasonForLeave,
    closeCoachReasonForLeave,
    openCoachRescheduleSession,
    closeCoachRescheduleSession,
    openDeleteCoachSlots,
    closeDeleteCoachSlots,
    openCoachSessionEvent,
    closeCoachSessionEvent,
    openCoachEditSchduledBatches,
    closeCoachEditScheduledBatches,
    openCoachEditScheduledStudents,
    closeCoachEditScheduledStudents,
    // openStudentsRescheduleSession,
    // closeStudentsRescheduleSession
} = coachAvailabilitySlice.actions;

export default coachAvailabilitySlice.reducer;
