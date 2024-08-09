import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../services/httpService';
import { baseUrl } from '../../../utils/baseURL';

export const getPlatforms = createAsyncThunk('util/getPlatforms', async () => {
    try {
        const response = await axiosInstance.get(`${baseUrl}/platform-tools`);
        return response.data;
    } catch (error) {
        error.response ? error.response.data : 'An Error occurred';
    }
});

export const getTimezone = createAsyncThunk('util/getTimezone', async () => {
    const response = await axiosInstance.get(`${baseUrl}/timezones`);
    return response.data;
});

const initialState = {
    platforms: [],
    timezones: [],
    loading: false,
    error: null,
};

const utilSlice = createSlice({
    name: 'util',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            // Get Platforms
            .addCase(getPlatforms.pending, state => {
                state.loading = true;
            })
            .addCase(getPlatforms.fulfilled, (state, action) => {
                state.loading = false;
                state.platforms = action.payload;
            })
            .addCase(getPlatforms.rejected, (state, action) => {
                state.loading = false;
                state.platforms = [];
                state.error = action.error.message;
            })

            // Get Timezone
            .addCase(getTimezone.pending, state => {
                state.loading = true;
            })
            .addCase(getTimezone.fulfilled, (state, action) => {
                state.loading = false;
                state.timezones = action.payload;
            })
            .addCase(getTimezone.rejected, (state, action) => {
                state.loading = false;
                state.timezones = [];
                state.error = action.error.message;
            });
    },
});

export const {} = utilSlice.actions;

export default utilSlice.reducer;
