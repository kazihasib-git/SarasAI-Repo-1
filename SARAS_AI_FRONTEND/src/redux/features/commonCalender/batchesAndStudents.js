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
    name: '',
    id: null, // TaId / CoachId
    batches: [],
    selectedBatches: [],
    students: [],
    selectedStudents: [],
    loading: false,
    error: [],
};

const batchesAndStudents = createSlice({
    name: 'batchesAndStudents',
    initialState,
    reducers: {
        openBatchPopup: (state, action) => {
            state.openBatches = true;
            state.name = action.payload.name;
            state.id = action.payload.id;
            state.batches = action.payload.batches;
            state.selectedBatches = action.payload.selectedBatches;
            state.students = action.payload.students;
            state.selectedStudents = action.payload.selectedStudents;
        },
        closeBatchPopup: (state, action) => {
            state.openBatches = false;
            state.name = action.payload.name;
            state.id = action.payload.id;
            state.batches = action.payload.batches;
            state.selectedBatches = action.payload.selectedBatches;
            state.students = action.payload.students;
            state.selectedStudents = action.payload.selectedStudents;
        },
        openStudentsPopup: (state, action) => {
            state.openStudents = true;
            state.name = action.payload.name;
            state.id = action.payload.id;
            state.batches = action.payload.batches;
            state.selectedBatches = action.payload.selectedBatches;
            state.students = action.payload.students;
            state.selectedStudents = action.payload.selectedStudents;
        },
        closeStudentsPopup: (state, action) => {
            state.openStudents = false;
            state.name = action.payload.name;
            state.id = action.payload.id;
            state.batches = action.payload.batches;
            state.selectedBatches = action.payload.selectedBatches;
            state.students = action.payload.students;
            state.selectedStudents = action.payload.selectedStudents;
        },
        clearState: (state, action) => {
            state.openBatches = false;
            state.openStudents = false;
            state.name = '';
            state.id = null;
            state.batches = [];
            state.selectedStudents = [];
            state.students = [];
            state.selectedStudents = [];
        },
    },
    extraReducers: builder => {
        builder.addCase(getStudentsInBatches.pending, state => {
            state.loading = true;
        }),
            addCase(getStudentsInBatches.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedStudents = action.payload?.map(
                    student => student.student_id
                );
            }),
            addCase(getStudentsInBatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const {} = batchesAndStudents.actions;

export default batchesAndStudents.reducer;
