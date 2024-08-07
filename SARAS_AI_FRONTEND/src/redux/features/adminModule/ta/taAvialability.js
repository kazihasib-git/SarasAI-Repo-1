import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../../../utils/baseURL';
import axiosInstance from '../../../services/httpService';

// Get Today Available Ta
export const getTodayTaAvailability = createAsyncThunk(
    'taAvialability/getTodayTaAvailability',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/TA-availability/get-today-available-ta`
        );
        return response.data;
    }
);

//get slots for ta from date to end date
export const getSlots = createAsyncThunk(
    'taAvialability/getSlots',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/admin/coach-slots/records`,
            data
        );
        return response.data;
    }
);

//for fetching sessions of ta for calendar
export const fetchTAScheduleById = createAsyncThunk(
    'taAvialability/fetchTAScheduleById',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/taschedules/${id}`
        );
        return response.data;
    }
);

//for fetching slots of ta for calendar
export const fetchTaSlots = createAsyncThunk(
    'taAvialability/fetchTaSlots',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/coach-slots/${id}`
        );
        return response.data;
    }
);

// Create Slots for TA
export const createSlots = createAsyncThunk(
    'taAvialability/createSlots',
    async data => {
        console.log('Data being sent:', data);
        const response = await axiosInstance.post(
            `${baseUrl}/admin/coach-slots`,
            data
        );
        return response.data;
    }
);

// Get Schedule Session for TA
export const getScheduleSession = createAsyncThunk(
    'taAvialability/getScheduleSession',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/admin/taschedules/get-schedules-records`,
            data
        );
        return response.data;
    }
);

// Get Available Slots
export const fetchAvailableSlots = createAsyncThunk(
    'taAvialability/fetchAvailableSlots',
    async data => {
        // console.log("ID : ", id);
        const response = await axiosInstance.post(
            `${baseUrl}/admin/coach-slots/getTACoachSlotForADate`,
            data
        );
        return response.data;
    }
);

// Delete Future Slots
export const deleteTaFutureSlots = createAsyncThunk(
    'taAvialability/deleteTaFutureSlots',
    async id => {
        const response = await axiosInstance.delete(
            `${baseUrl}/admin/coach-slots/${id}`
        );
        return response.data;
    }
);

// Reason for Leave
export const reasonForLeave = createAsyncThunk(
    'taAvialability/reasonForLeave',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/admin/leave`,
            data
        );
        return response.data;
    }
);


export const changePlatform = createAsyncThunk(
    'taAvialability/changePlatform',
    async ({id, data}) => {
        console.log("ID and Data", id , data)
        const response = await axiosInstance.patch(
            `${baseUrl}/admin/taschedules/change-platform/${id}`, data
        )
        return response.data
    }
)

const initialState = {
    todaysAvailableTa: [],

    markLeaveData: [],
    slotData: [],
    scheduleData: [],
    scheduledSlotsData: [], // Ensure this is correctly named and initialized
    scheduledSessionData: [], // Ensure this is correctly named and initialized
    availableSlotsData: [],
    reasonForLeaveData: [],
    platformData : [],

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

    slotEventData: null, // To Cancel Session
    sessionEventData: null, // To Reschedule Session

    loading: false,
    error: null,
    schduldeCancelData: null,
    deletingCoachFutureSlots: false,
    taId: [],
    taName: [],
    sessionEventData: [],
    openEventData: false,
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
    },
    extraReducers: builder => {
        //for sessions ta for calendar
        builder.addCase(fetchTAScheduleById.pending, state => {
            state.loading = true;
        });
        builder.addCase(fetchTAScheduleById.fulfilled, (state, action) => {
            state.loading = false;
            state.scheduleData = action.payload;
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
            state.slotData = action.payload; // Update state with fetched data
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
            state.scheduledSlotsData = null;
            state.error = action.error.message;
        });

        // Create Slots
        builder.addCase(createSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(createSlots.fulfilled, (state, action) => {
            console.log("slot data ==================> " , action.payload?.data)  ;
            state.loading = false;
            state.slotData = action.payload?.data;
        });
        builder.addCase(createSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
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
            console.log('AVIAIAIAI : ', action.payload?.data);
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
        });
        builder.addCase(deleteTaFutureSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Reason for Leave
        builder.addCase(reasonForLeave.pending, state => {
            state.loading = true;
        });
        builder.addCase(reasonForLeave.fulfilled, (state, action) => {
            state.loading = false;
            state.reasonForLeaveData = action.payload.data;
        });
        builder.addCase(reasonForLeave.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Change Platform
        builder.addCase(changePlatform.pending, state => {
            state.loading = true;
        }) 
        builder.addCase(changePlatform.fulfilled, (state, action) => {
            state.loading = false;
            state.platformData = action.payload;
        })
        builder.addCase(changePlatform.rejected, (state, action) => {
            state.loading = false;
            state.platformData = [];
            state.error = action.error.message;
        })
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
} = taAvailabilitySlice.actions;

export default taAvailabilitySlice.reducer;
