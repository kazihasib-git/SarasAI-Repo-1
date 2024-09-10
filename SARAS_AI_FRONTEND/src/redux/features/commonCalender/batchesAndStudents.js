import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../services/httpService';
import { baseUrl } from '../../../utils/baseURL';

export const getStudentsInBatches = createAsyncThunk(
    'batchesAndStudents/getStudentsInBatches',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/get-students-in-batches`,
                data
            );
            return response.data;
        } catch (error) {
            if (error) {
                if (error.response && error.response.data) {
                    return rejectWithValue(error.response.data.message);
                } else {
                    return rejectWithValue('An Error Occurred While Login');
                }
            }
        }
    }
);

const initialState = {
    openBatches: false,
    openStudents: false,
    userName: '',
    userId: null, // TaId / CoachId
    batches: [],
    selectedBatches: [],
    students: [],
    selectedStudents: [],
    timezoneId: null,
    loading: false,
    error: [],
};

const batchesAndStudents = createSlice({
    name: 'batchesAndStudents',
    initialState,
    reducers: {
        openBatchPopup(state, action) {
            state.openBatches = true;
            state.userName = action.payload.name;
            state.userId = action.payload.id;
            state.batches = action.payload.batches;
            state.selectedBatches = action.payload.selectedBatches;
            state.students = action.payload.students;
            state.selectedStudents = action.payload.selectedStudents;
            state.timezoneId = action.payload.timezoneId;
        },
        closeBatchPopup(state, action) {
            state.openBatches = false;
            state.selectedBatches = action.payload?.selectedBatches;
        },
        openStudentsPopup(state, action) {
            state.openStudents = true;
            state.userName = action.payload.name;
            state.userId = action.payload.id;
            state.batches = action.payload.batches;
            state.selectedBatches = action.payload.selectedBatches;
            state.students = action.payload.students;
            state.selectedStudents = action.payload.selectedStudents;
            state.timezoneId = action.payload.timezoneId;
        },
        closeStudentsPopup(state, action) {
            state.openStudents = false;
            state.selectedStudents = action.payload?.selectedStudents;
        },
        updateSelectedStudents(state, action) {
            state.selectedStudents = action.payload.selectedStudents;
        },
        updateSelectedBatches(state, action) {
            state.selectedBatches = action.payload.selectedBatches;
        },
        clearState(state, action) {
            state.openBatches = false;
            state.openStudents = false;
            state.userName = '';
            state.userId = null;
            state.batches = [];
            state.selectedBatches = [];
            state.students = [];
            state.selectedStudents = [];
            state.timezoneId = null;
        },
    },
    extraReducers: builder => {
        builder.addCase(getStudentsInBatches.pending, state => {
            state.loading = true;
        }),
            builder.addCase(getStudentsInBatches.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedStudents = action.payload?.map(
                    student => student.student_id
                );
            }),
            builder.addCase(getStudentsInBatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const {
    openBatchPopup,
    closeBatchPopup,
    openStudentsPopup,
    closeStudentsPopup,
    updateSelectedStudents,
    updateSelectedBatches,
    clearState,
} = batchesAndStudents.actions;

export default batchesAndStudents.reducer;
