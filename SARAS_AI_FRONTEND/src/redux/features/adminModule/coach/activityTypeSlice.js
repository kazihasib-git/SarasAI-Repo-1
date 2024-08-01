import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { baseUrl } from '../../../../utils/baseURL';
import axiosInstance from '../../../services/httpService';

export const getActivityType = createAsyncThunk(
    'activityType/getActivityType',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/coaching-templates/activity-type`
        );
        return response.data;
    }
);

const initialState = {
    typeList: [],
    loading: false,
    error: null,
};

const activityTypeSlice = createSlice({
    name: 'activityType',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getActivityType.pending, state => {
                state.loading = true;
            })
            .addCase(getActivityType.fulfilled, (state, action) => {
                state.loading = false;
                state.typeList = action?.payload?.data;
            })
            .addCase(getActivityType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const {} = activityTypeSlice.actions;

export default activityTypeSlice.reducer;
