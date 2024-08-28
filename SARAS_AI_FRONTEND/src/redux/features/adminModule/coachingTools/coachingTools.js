import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../../services/httpService';
import { baseUrl } from '../../../../utils/baseURL';

export const getAllCoachingTools =  createAsyncThunk(
    'coachingTools/getAllCoachingTools',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/coaching-tool`
        );
        return response.data;
    }
)
const initialState = {
    coachingTools : [],
    loading : false,
    error : null,
}

const coachingTools = createSlice({
  name: 'coachingTools',
  initialState,
  reducers: {},
  extraReducers : ( builder ) => {
    builder 
        .addCase(getAllCoachingTools.pending, state => {
            state.loading = true;
        })
        .addCase(getAllCoachingTools.fulfilled, (state, action) => {
            state.loading = false;
            state.coachingTools = action.payload.data;
        })
        .addCase(getAllCoachingTools.rejected, (state, action) => {
            state.loading = false;
            state.coachingTools = [];
            state.error = action.payload || action.error.message;
        })
  }
});

export const {} = coachingTools.actions

export default coachingTools.reducer