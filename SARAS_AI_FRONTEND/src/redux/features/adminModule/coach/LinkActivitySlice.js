import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../../utils/baseURL';
import axiosInstance from '../../../services/httpService';
import { toast } from 'react-toastify';

export const linkActivity = createAsyncThunk(
    'linkActivity/link',
    async (activityData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/coaching-templates/link-activity`,
                activityData
            );
            const { activity_id, activity_type_id, link } = response.data;
            return { activity_id, activity_type_id, link };
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Linking activity'
                );
            }
        }
    }
);
export const uploadpdf = createAsyncThunk(
    'linkActivity/uploadpdf',
    async (activityData, { rejectWithValue }) => {
        try {
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
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue('An Error Occurred While Uploading PDF');
            }
        }
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
                state.data = action.payload; // Store the response data
                state.upload_pdf_url = null;
                toast.success(
                    action.payload.message ||
                        'link Activity has been successfully created.'
                );
            })
            .addCase(linkActivity.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
                toast.error(action.payload || 'Failed To LinkActivty');
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
                state.upload_pdf_url = action.payload.url; // Store the response data
                toast.success(
                    action.payload.message ||
                        'pdf has been successfully uploaded.'
                );
            })
            .addCase(uploadpdf.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
                toast.error(action.payload || 'Failed To upload pdf');
            });
    },
});

export default linkActivitySlice.reducer;
