import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { baseUrl } from '../../../utils/baseURL';
import axios from 'axios';
const accessToken = localStorage.getItem('accessToken');

console.log('accessToken', accessToken);

// Get Ta Profile
export const getTaProfile = createAsyncThunk('taMenu/getProfile', async () => {
    try {
        const response = await axios.get(`${baseUrl}/ta/ta-profile`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(response.data, 'response.data');
        return response.data;
    } catch (error) {
        console.error('Error fetching TA profile:', error);
        throw error;
    }
});

// Update Ta Profile
export const updateTaProfile = createAsyncThunk(
    'taMenu/updateProfile',
    async data => {
        const response = await axios.put(`${baseUrl}/ta/ta-profile`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// Get Ta Slots
export const getTaSlots = createAsyncThunk('taMenu/getSlots', async () => {
    const response = await axios.get(`${baseUrl}/ta/calendar/slots`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    console.log(response.data, 'response.data');
    return response.data;
});

// Get Ta Sessions
export const getTaSessions = createAsyncThunk(
    'taMenu/getSessions',
    async () => {
        const response = await axios.get(`${baseUrl}/ta/calendar/sessions`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(response.data, 'response.data');
        return response.data;
    }
);

const initialState = {
    taProfileData: [], // TA Profile Data
    taSlots: [], // TA Slots
    taSessions: [], // TA Sessions
    loading: false,
    error: null,
};

export const taMenuSlice = createSlice({
    name: 'taMenu',
    initialState,
    reducers: {},
    extraReducers: builder => {
        // Get Ta Profile Data
        builder.addCase(getTaProfile.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.taProfileData = action.payload.data;
        });
        builder.addCase(getTaProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taProfileData = [];
        });

        // update Ta Profile Data
        builder.addCase(updateTaProfile.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateTaProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.taProfileData = action.payload.data;
        });
        builder.addCase(updateTaProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get Ta Slots
        builder.addCase(getTaSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.taSlots = action.payload.data;
        });
        builder.addCase(getTaSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get Ta Sessions
        builder.addCase(getTaSessions.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaSessions.fulfilled, (state, action) => {
            state.loading = false;
            state.taSessions = action.payload.data;
        });
        builder.addCase(getTaSessions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export default taMenuSlice.reducer;
