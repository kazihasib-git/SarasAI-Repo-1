import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../../../utils/baseURL';
import axiosInstance from '../../../services/httpService';



export const getAdminNotification = createAsyncThunk(
    'admin/getAdminNotification',
    async () => {
        try {
            const response = await axiosInstance.get(
                `${baseUrl}/admin/notification`
            );
            return response.data;
        } catch (error) {
            console.error('Error getting Admin notification:', error);
            return error.response ? error.response.data : error.message;
        }
    }
);


const initialState = {
    adminNotification: [],
    loading: false,
    error: null,
};

const adminNotificationSlice = createSlice({
    name: 'adminNotification',
    initialState,
    extraReducers: builder => {
        builder.addCase(getAdminNotification.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getAdminNotification.fulfilled, (state, action) => {
            state.loading = false;
            state.adminNotification = action.payload.data;
        });
        builder.addCase(getAdminNotification.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default adminNotificationSlice.reducer;