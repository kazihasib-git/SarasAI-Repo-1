import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { baseUrl } from '../../../utils/baseURL';
import axios from 'axios';
import axiosInstance from '../../services/httpService';
const accessToken = localStorage.getItem('accessToken');

// Get Ta Profile
export const getTaMenuProfile = createAsyncThunk(
    'taMenu/getProfile',
    async () => {
        const response = await axiosInstance.get(`${baseUrl}/ta/ta-profile`);
        return response.data;
    }
);

// Update Ta Profile
export const updateTaMenuProfile = createAsyncThunk(
    'taMenu/updateProfile',
    async data => {
        const response = await axiosInstance.put(
            `${baseUrl}/ta/ta-profile`,
            data
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// Get Ta Slots
export const getTaMenuSlots = createAsyncThunk('taMenu/getSlots', async () => {
    const response = await axiosInstance.get(`${baseUrl}/ta/calendar/slots`);
    console.log(response.data, 'response.data');
    return response.data;
});

// Create TA Slots
export const createTaMenuSlots = createAsyncThunk(
    'taMenu/createTaSlot',
    async () => {
        const response = await axiosInstance.post(
            `${baseUrl}/ta/calendar/create-slots`,
            data
        );
        return response.data;
    }
);

// Get TA Slots by Date
export const getTaMenuSlotsByDate = createAsyncThunk(
    'taMenu/createTaSlotByDate',
    async () => {
        const response = await axiosInstance.post(
            `${baseUrl}//coach/calendar/slots-by-date`,
            data
        );
        return response.data;
    }
);

// Get Ta Sessions
export const getTaMenuSessions = createAsyncThunk(
    'taMenu/getSessions',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/ta/calendar/sessions`
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// Create TA Sessions
export const createTaMenuSessions = createAsyncThunk(
    'taMenu/createTaMenuSessions',
    async () => {
        const response = await axiosInstance.post(
            `${baseUrl}/ta/calendar/create-sessions`,
            data
        );
        return response.data;
    }
);

const initialState = {
    taProfileData: [], // TA Profile Data
    taSlots: [], // TA Slots
    taSlotsByDate: [], // TA Slots by Date
    taSessions: [], // TA Sessions

    createTaSlotsPopup: false,
    createTaSessionPopup: false,
    createTaLeavePop: false,

    loading: false,
    error: null,
};

export const taMenuSlice = createSlice({
    name: 'taMenu',
    initialState,
    reducers: {
        openCreateSlotsPopup: (state, action) => {
            state.createTaSlotsPopup = action.payload;
            state.createTaSessionPopup = false;
        },
        closeCreateSlotsPopup: (state, action) => {
            state.createTaSlotsPopup = false;
        },
    },
    extraReducers: builder => {
        // Get Ta Profile Data
        builder.addCase(getTaMenuProfile.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.taProfileData = action.payload.data;
        });
        builder.addCase(getTaMenuProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taProfileData = [];
        });

        // update Ta Profile Data
        builder.addCase(updateTaMenuProfile.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateTaMenuProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.taProfileData = action.payload.data;
        });
        builder.addCase(updateTaMenuProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get Ta Slots
        builder.addCase(getTaMenuSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.taSlots = action.payload.data;
        });
        builder.addCase(getTaMenuSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get Ta Slots By Date
        builder.addCase(getTaMenuSlotsByDate.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuSlotsByDate.fulfilled, state => {
            state.loading = false;
            state.taSlotsByDate = action.payload.data;
        });
        builder.addCase(getTaMenuSlotsByDate.rejected, state => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Create Ta Slots
        builder.addCase(createTaMenuSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(createTaMenuSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.taSlots = action.payload.data;
        });
        builder.addCase(createTaMenuSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get Ta Sessions
        builder.addCase(getTaMenuSessions.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuSessions.fulfilled, (state, action) => {
            state.loading = false;
            state.taSessions = action.payload.data;
        });
        builder.addCase(getTaMenuSessions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Create TA Sessions
        builder.addCase(createTaMenuSessions.pending, state => {
            state.loading = true;
        });
        builder.addCase(createTaMenuSessions.fulfilled, (state, action) => {
            state.loading = false;
            state.taSessions = action.payload.data;
        });
        builder.addCase(createTaMenuSessions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export default taMenuSlice.reducer;
