import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../../utils/baseURL';
import axiosInstance from '../../../services/httpService';

export const linkActivity = createAsyncThunk(
    'linkActivity/link',
    async activityData => {
        const response = await axiosInstance.post(
            `${baseUrl}/admin/coaching-templates/link-activity`,
            activityData
        );
        const { activity_id, activity_type_id, link } = response.data;
        return { activity_id, activity_type_id, link };
    }
);

const linkActivitySlice = createSlice({
    name: 'linkActivity',
    initialState: {
        loading: false,
        success: false,
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(linkActivity.pending, state => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(linkActivity.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.data = action.payload; // Store the response data
            })
            .addCase(linkActivity.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    },
});

export default linkActivitySlice.reducer;
