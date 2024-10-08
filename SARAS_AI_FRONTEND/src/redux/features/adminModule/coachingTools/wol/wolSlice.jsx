import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../../../utils/baseURL';
import axiosInstance from '../../../../services/httpService';
import { toast } from 'react-toastify';

// To get all WOL Category data
export const getWOLCategory = createAsyncThunk(
    'wol/getWOLCategory',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/wol/wol-category`
        );
        return response.data;
    }
);

// To Create WOL Category
export const createWOLCategory = createAsyncThunk(
    'wol/createWOLCategory',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/wol/wol-category`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Creating WOL Category'
                );
            }
        }
    }
);

// To Update WOL Category
export const updateWOLCategory = createAsyncThunk(
    'wol/updateWOLCategory',
    async ({ id, data, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${baseUrl}/admin/wol/wol-category/${id}`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Creating WOL Category'
                );
            }
        }
    }
);

// To Delete WOL Category
export const deleteWOLCategory = createAsyncThunk(
    'wol/deleteWOLCategory',
    async ({ id, rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(
                `${baseUrl}/admin/wol/wol-category/${id}`
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Deleting WOL Category'
                );
            }
        }
    }
);

// To active deactive WOL Category
export const activeDeactiveWOLCategory = createAsyncThunk(
    'wol/activeDeactiveWOLCategory',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/wol/wol-category/${id}`
        );
        return response.data;
    }
);

// Get all life instruction data
export const getLifeInstruction = createAsyncThunk(
    'wol/getLifeInstruction',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/wol/wol-life-instruction`
        );
        return response.data;
    }
);

// edit instructions data
export const editLifeInstruction = createAsyncThunk(
    'wol/editLifeInstruction',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${baseUrl}/admin/wol/wol-life-instruction`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Creating WOL Category'
                );
            }
        }
    }
);

// Get WOL Questions
export const getWOLQuestions = createAsyncThunk(
    'wol/getWOLQuestions',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/wol/wol-question`
        );
        return response.data;
    }
);

// Create WOL Question
export const createWOLQuestion = createAsyncThunk(
    'wol/createWOLQuestion',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/wol/wol-question`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Geting TA Sessions for Leave by Slots'
                );
            }
        }
    }
);

// Update WOL Question
export const updateWOLQuestion = createAsyncThunk(
    'wol/updateWOLQuestion',
    async ({ id, data, rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${baseUrl}/admin/wol/wol-question/${id}`,
                data
            );

            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While updating WOL Category'
                );
            }
        }
    }
);

//Update active status
export const toggleWOLQuestionStatus = createAsyncThunk(
    'wol/toggleWOLQuestionStatus',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/wol/wol-question/${id}`
        );
        return response.data;
    }
);

// Get WOL Options Config
export const getWOLOptionConfig = createAsyncThunk(
    'wol/getWOLOptionConfig',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/wol/wol-option-config`
        );
        return response.data;
    }
);

// Add WOL Options Config
export const addWOLOptionConfig = createAsyncThunk(
    'wol/addWOLOptionConfig',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/wol/wol-option-config`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Adding WOL Option Config'
                );
            }
        }
    }
);

// Add WOL Test Config
export const addWOLTestConfig = createAsyncThunk(
    'wol/addWOLTestConfig',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/wol/wol-test-config`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Adding Wol Test Config'
                );
            }
        }
    }
);

// Get All Wol Test Config
export const getWolTestConfig = createAsyncThunk(
    'wol/getWolTestConfig',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/wol/wol-test-config`
        );
        return response.data;
    }
);

// Get Wol Question Category Wise
export const getWolQuestionCategoryWise = createAsyncThunk(
    'wol/getWolQuestionCategoryWise',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/wol/wol-question-category-wise/${id}`
        );
        return response.data;
    }
);

// Get Wol Test Config Category Wise questions count
export const getWolTestConfigCategoryWise = createAsyncThunk(
    'wol/getWolTestConfigCategoryWise',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/wol/wol-test-config-category-question-count`
        );
        return response.data;
    }
);

// Add question to category
export const addQuestionToCategory = createAsyncThunk(
    'wol/addQuestionToCategory',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/admin/wol/wol-test-config-add-question-to-category`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Adding Questions'
                );
            }
        }
    }
);

// Selected Questions list
export const selectedQuestionsList = createAsyncThunk(
    'wol/selectedQuestionsList',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/admin/wol/wol-test-config-selected-question-list/${id}`
        );
        return response.data;
    }
);

const initialState = {
    wolCategoryData: [], // to store all WOL Category data
    instructionData: [], // to store all life instruction data
    wolQuestionsData: [], // to store all WOL Questions data
    wolTestConfig: [],
    wolQuestionCategoryWise: [], // to store WOL Question category wise data
    wolTestConfigCategoryWise: [], // to store WOL Test Config category wise questions count data
    addQuestionToCategoryData: [],
    selectedQuestionsListData: [],
    openAddEditWolCategory: false,
    editData: null, // to store WOL category edit data
    editwolQuestionData: null,
    optionsConfigData: [],
    categoryIdToSubmitSelectedQuestions: null,
    loading: false,
    error: null,
    categoryInfo: {},
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
        handleIdToSubmitSelectedQuestions: (state, action) => {
            state.categoryIdToSubmitSelectedQuestions = action.payload;
        },

        handleOpenSelectCategoryQuestions: (state, action) => {
            state.categoryInfo = action.payload;
        },
    },

    extraReducers: builder => {
        // getWOLCategory
        builder.addCase(getWOLCategory.pending, state => {
            state.loading = true;
        });
        builder.addCase(getWOLCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.wolCategoryData = action.payload.data;
        });
        builder.addCase(getWOLCategory.rejected, (state, action) => {
            state.loading = false;
            state.wolCategoryData = [];
            state.error = action.payload || action.error.message;
        });

        // createWOLCategory
        builder.addCase(createWOLCategory.pending, state => {
            state.loading = true;
        });
        builder.addCase(createWOLCategory.fulfilled, (state, action) => {
            state.loading = false;
            //state.instructionData = action.payload;
            toast.success(action.payload.message || 'WOL Created Successfully');
        });
        builder.addCase(createWOLCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(
                action.payload || 'Failed To Create WOL . Please Try Again'
            );
        });

        // getLifeInstruction
        builder.addCase(getLifeInstruction.pending, state => {
            state.loading = true;
        });
        builder.addCase(getLifeInstruction.fulfilled, (state, action) => {
            state.loading = false;
            state.instructionData = action.payload.data;
        });
        builder.addCase(getLifeInstruction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // editLifeInstruction
        builder.addCase(editLifeInstruction.pending, state => {
            state.loading = true;
        });
        builder.addCase(editLifeInstruction.fulfilled, (state, action) => {
            state.loading = false;
            state.instructionData = action.payload;
            toast.success(action.payload.message || 'Successfully Edited');
        });
        builder.addCase(editLifeInstruction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed to Edit');
        });

        //updateWOlcategory
        builder.addCase(updateWOLCategory.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateWOLCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.instructionData = action.payload;
            toast.success(action.payload.message || 'Successfully Updated');
        });
        builder.addCase(updateWOLCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed to Update WOL Category');
        });

        // getWOLQuestions
        builder.addCase(getWOLQuestions.pending, state => {
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
        builder.addCase(createWOLQuestion.pending, state => {
            state.loading = true;
        });
        builder.addCase(createWOLQuestion.fulfilled, (state, action) => {
            state.loading = false;
            state.wolQuestionsData = action.payload;
            toast.success(action.payload.message || 'successfully created.');
        });
        builder.addCase(createWOLQuestion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Create Question');
        });

        // updateWOLQuestion
        builder.addCase(updateWOLQuestion.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateWOLQuestion.fulfilled, (state, action) => {
            state.loading = false;
            state.wolQuestionsData = action.payload;
            toast.success(action.payload.message || 'successfully created.');
        });
        builder.addCase(updateWOLQuestion.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed To Update question');
        });

        // getWOLOptionConfig
        builder.addCase(getWOLOptionConfig.pending, state => {
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
        builder.addCase(addWOLOptionConfig.pending, state => {
            state.loading = true;
        });
        builder.addCase(addWOLOptionConfig.fulfilled, (state, action) => {
            state.loading = false;
            state.optionsConfigData = action.payload;
            toast.success(action.payload.message || 'Successfully created');
        });
        builder.addCase(addWOLOptionConfig.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed to Create WOL Option Config');
        });

        // addWOLTestConfig
        builder.addCase(addWOLTestConfig.pending, state => {
            state.loading = true;
        });
        builder.addCase(addWOLTestConfig.fulfilled, (state, action) => {
            state.loading = false;
            state.wolTestConfig = action.payload;
            toast.success(
                action.payload.message || 'WOL Test Config successfully created'
            );
        });
        builder.addCase(addWOLTestConfig.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(action.payload || 'Failed to Create WOL Test Config');
        });

        // getWolTestConfig
        builder.addCase(getWolTestConfig.pending, state => {
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

        // getWolQuestionCategoryWise
        builder.addCase(getWolQuestionCategoryWise.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getWolQuestionCategoryWise.fulfilled,
            (state, action) => {
                state.loading = false;
                state.wolQuestionCategoryWise = action.payload;
            }
        );
        builder.addCase(
            getWolQuestionCategoryWise.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            }
        );

        // getWolTestConfigCategoryWise
        builder.addCase(getWolTestConfigCategoryWise.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getWolTestConfigCategoryWise.fulfilled,
            (state, action) => {
                state.loading = false;
                state.wolTestConfigCategoryWise = action.payload;
            }
        );
        builder.addCase(
            getWolTestConfigCategoryWise.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            }
        );

        // toggleWOLQuestionStatus
        builder.addCase(toggleWOLQuestionStatus.pending, state => {
            state.loading = true;
        });
        builder.addCase(toggleWOLQuestionStatus.fulfilled, (state, action) => {
            state.loading = false;
            const updatedQuestion = action.payload;
            const index = state.wolQuestionsData.data.findIndex(
                q => q.id === updatedQuestion.id
            );
            if (index !== -1) {
                state.wolQuestionsData.data[index] = updatedQuestion;
            }
        });
        builder.addCase(toggleWOLQuestionStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });

        // addQuestionToCategory
        builder.addCase(addQuestionToCategory.pending, state => {
            state.loading = true;
        });
        builder.addCase(addQuestionToCategory.fulfilled, (state, action) => {
            state.loading = false;
            state.addQuestionToCategoryData = action.payload;
            toast.success(
                action.payload.message || 'Successfully Added Questions'
            );
        });
        builder.addCase(addQuestionToCategory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            state.addQuestionToCategoryData = [];
            toast.error(action.payload || 'Failed to ADD Questions');
        });

        // selectedQuestionsList
        builder.addCase(selectedQuestionsList.pending, state => {
            state.loading = true;
        });
        builder.addCase(selectedQuestionsList.fulfilled, (state, action) => {
            state.loading = false;
            state.selectedQuestionsListData = action.payload;
        });
        builder.addCase(selectedQuestionsList.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            state.selectedQuestionsListData = [];
        });
    },
});

export const {
    setAddEditWolCategory,
    setEditData,
    seteditwolQuestionData,
    handleIdToSubmitSelectedQuestions,
    handleOpenSelectCategoryQuestions,
} = wolSlice.actions;

export default wolSlice.reducer;
