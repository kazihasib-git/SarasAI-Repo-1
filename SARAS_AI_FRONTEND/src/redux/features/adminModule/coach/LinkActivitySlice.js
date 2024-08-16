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
export const uploadpdf = createAsyncThunk(
    'linkActivity/uploadpdf',
    async activityData => {
        console.log('actictyData', activityData);
        const response = await axiosInstance.post(
            `${baseUrl}/admin/upload-pdf`,
            activityData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        // const { activity_id, activity_type_id, link } = response.data;
        // return { activity_id, activity_type_id, link };

        return response.data;
    }
);

const linkActivitySlice = createSlice({
    name: 'linkActivity',
    initialState: {
        loading: false,
        success: false,
        upload_pdf_url: null,
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
                console.log('action>>>>>>>>>>>>>>>', action.payload);
                state.data = action.payload; // Store the response data
                state.upload_pdf_url=null;
            })
            .addCase(linkActivity.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })
            //upload pdf

            .addCase(uploadpdf.pending, state => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(uploadpdf.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                console.log('action>>>>>>>>>>>', action.payload.url);
                state.upload_pdf_url = action.payload.url; // Store the response data
            })
            .addCase(uploadpdf.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    },
});

export default linkActivitySlice.reducer;
