import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../../utils/baseURL';

// To get all WOL Category data
export const getWOLCategory = createAsyncThunk(
    'wol/getWOLCategory',
    async () => {
        const response = await axios.get(`${baseUrl}/admin/wol/wol-category`);
        return response.data;
    },
);

// To Create WOL Category
export const createWOLCategory = createAsyncThunk(
    'wol/createWOLCategory',
    async (data) => {
        console.log(data);
        const response = await axios.post(
            `${baseUrl}/admin/wol/wol-category`,
            data,
        );
        return response.data;
    },
);

// To Update WOL Category
export const updateeWOLCategory = createAsyncThunk(
    'wol/updateWOLCategory',
    async ({ id, data }) => {
        const response = await axios.put(
            `${baseUrl}/admin/wol/wol-category/${id}`,
            data,
        );
        return response.data;
    },
);

// To Delete WOL Category
export const deleteWOLCategory = createAsyncThunk(
    'wol/deleteWOLCategory',
    async (id) => {
        const response = await axios.delete(
            `${baseUrl}/admin/wol/wol-category/${id}`,
        );
        return response.data;
    },
);

// To active deactive WOL Category
export const activeDeactiveWOLCategory = createAsyncThunk(
    'wol/activeDeactiveWOLCategory',
    async (id) => {
        console.log('in activeDeactiveWOLCategory', id);
        const response = await axios.get(
            `${baseUrl}/admin/wol/wol-category/${id}`,
        );
        return response.data;
    },
);

// Get all life instruction data
export const getLifeInstruction = createAsyncThunk(
    'wol/getLifeInstruction',
    async () => {
        const response = await axios.get(
            `${baseUrl}/admin/wol/wol-life-instruction`,
        );
        return response.data;
    },
);

// edit instructions data
export const editLifeInstruction = createAsyncThunk(
    'wol/editLifeInstruction',
    async (data) => {
        const response = await axios.put(
            `${baseUrl}/admin/wol/wol-life-instruction`,
            data,
        );
        return response.data;
    },
);

// Get WOL Questions
export const getWOLQuestions = createAsyncThunk(
    'wol/getWOLQuestions',
    async () => {
        const response = await axios.get(`${baseUrl}/admin/wol/wol-question`);
        return response.data;
    },
);

// Create WOL Question
export const createWOLQuestion = createAsyncThunk(
    'wol/createWOLQuestion',
    async (data) => {
        const response = await axios.post(
            `${baseUrl}/admin/wol/wol-question`,
            data,
        );
        return response.data;
    },
);

// Update WOL Question
export const updateWOLQuestion = createAsyncThunk(
    'wol/updateWOLQuestion',
    async ({ id, data }) => {
        const response = await axios.put(
            `${baseUrl}/admin/wol/wol-question/${id}`,
            data,
        );
        return response.data;
    },
);

// Get WOL Options Config
export const getWOLOptionConfig = createAsyncThunk(
    'wol/getWOLOptionConfig',
    async () => {
        const response = await axios.get(
            `${baseUrl}/admin/wol/wol-option-config`,
        );
        return response.data;
    },
);

// Add WOL Options Config
export const addWOLOptionConfig = createAsyncThunk(
    'wol/addWOLOptionConfig',
    async (data) => {
        const response = await axios.post(
            `${baseUrl}/admin/wol/wol-option-config`,
            data,
        );
        return response.data;
    },
);

// Add WOL Test Config
export const addWOLTestConfig = createAsyncThunk(
    'wol/addWOLTestConfig',
    async (data) => {
        const response = await axios.post(
            `${baseUrl}/admin/wol/wol-test-config`,
            data,
        );
        return response.data;
    },
);

// Get All Wol Test Config
export const getWolTestConfig = createAsyncThunk(
    'wol/getWolTestConfig',
    async () => {
        const response = await axios.get(
            `${baseUrl}/admin/wol/wol-test-config`,
        );
        return response.data;
    },
);

const initialState = {
    wolCategoryData: [], // to store all WOL Category data
    instructionData: '', // to store all life instruction data
    wolQuestionsData: [], // to store all WOL Questions data
    wolTestConfig: [],
    openAddEditWolCategory: false,
    editData: null, // to store WOL category edit data
    editwolQuestionData: null,
    optionsConfigData: [],
    loading: false,
    error: null,
};

const wolSlice = createSlice({
    name: 'wol',
    initialState,
    reducers: {
        setAddEditWolCategory: (state, action) => {
            state.openAddEditWolCategory = action.payload;
        },
        setEditData: (state, action) => {
            state.editData = action.payload;
        },
        seteditwolQuestionData: (state, action) => {
            state.editwolQuestionData = action.payload;
        },
    },

    extraReducers: (builder) => {
        // getWOLCategory
        builder.addCase(getWOLCategory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getWOLCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.wolCategoryData = action.payload;
        });
        builder.addCase(getWOLCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // createWOLCategory
        builder.addCase(createWOLCategory.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createWOLCategory.fulfilled, (state, action) => {
            state.loading = false;
            //state.instructionData = action.payload;
        });
        builder.addCase(createWOLCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // getLifeInstruction
        builder.addCase(getLifeInstruction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getLifeInstruction.fulfilled, (state, action) => {
            state.loading = false;
            state.instructionData = action.payload;
        });
        builder.addCase(getLifeInstruction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // editLifeInstruction
        builder.addCase(editLifeInstruction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(editLifeInstruction.fulfilled, (state, action) => {
            state.loading = false;
            state.instructionData = action.payload;
        });
        builder.addCase(editLifeInstruction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // getWOLQuestions
        builder.addCase(getWOLQuestions.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getWOLQuestions.fulfilled, (state, action) => {
            state.loading = false;
            state.wolQuestionsData = action.payload;
        });
        builder.addCase(getWOLQuestions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // createWOLQuestion
        builder.addCase(createWOLQuestion.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createWOLQuestion.fulfilled, (state, action) => {
            state.loading = false;
            state.wolQuestionsData = action.payload;
        });
        builder.addCase(createWOLQuestion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // updateWOLQuestion
        builder.addCase(updateWOLQuestion.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateWOLQuestion.fulfilled, (state, action) => {
            state.loading = false;
            state.wolQuestionsData = action.payload;
        });
        builder.addCase(updateWOLQuestion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // getWOLOptionConfig
        builder.addCase(getWOLOptionConfig.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getWOLOptionConfig.fulfilled, (state, action) => {
            state.loading = false;
            state.optionsConfigData = action.payload;
        });
        builder.addCase(getWOLOptionConfig.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // addWOLOptionConfig
        builder.addCase(addWOLOptionConfig.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addWOLOptionConfig.fulfilled, (state, action) => {
            state.loading = false;
            state.optionsConfigData = action.payload;
        });
        builder.addCase(addWOLOptionConfig.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // addWOLTestConfig
        builder.addCase(addWOLTestConfig.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(addWOLTestConfig.fulfilled, (state, action) => {
            state.loading = false;
            state.wolTestConfig = action.payload;
        });
        builder.addCase(addWOLTestConfig.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // getWolTestConfig
        builder.addCase(getWolTestConfig.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getWolTestConfig.fulfilled, (state, action) => {
            state.loading = false;
            state.wolTestConfig = action.payload;
        });
        builder.addCase(getWolTestConfig.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });
    },
});

export const { setAddEditWolCategory, setEditData, seteditwolQuestionData } =
    wolSlice.actions;

export default wolSlice.reducer;
