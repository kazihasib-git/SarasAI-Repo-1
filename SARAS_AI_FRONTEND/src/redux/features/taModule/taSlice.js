import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../utils/baseURL";

export const createTA = createAsyncThunk(
    "taModule/createTA",
    async (data) => {
        const response = await axios.post(`${baseUrl}/admin/manage_tas`, data);
        return response.data;
    }
);

export const getTA = createAsyncThunk(
    "taModule/getTA",
    async () => {
        const response = await axios.get(`${baseUrl}/admin/manage_tas`);
        return response.data;
    }
);

export const updateTA = createAsyncThunk(
    "taModule/updateTA",
    async ({ id, data }) => {
        const response = await axios.put(`${baseUrl}/admin/manage_tas/${id}}`, data);
        return response.data;
    }
)

export const deleteTA = createAsyncThunk(
    "taModule/deleteTA",
    async (id) => {
        await axios.delete(`${baseUrl}/admin/manage_tas/${id}}`);
        return id;
    }
)

export const taSlice = createSlice({
    name: "taModule",
    initialState: {
        tas: [],
        loading: false,
        error: null,
    },
    reducers: {
        activateTa(state, action) {
            const index = state.tas.findIndex((ta) => ta.id === action.payload.id);
            if (index !== -1) {
                state.tas[index].active = true;
            }
        },
        deactivateTa(state, action) {
            const index = state.tas.findIndex((ta) => ta.id === action.payload.id);
            if (index !== -1) {
                state.tas[index].active = false;
            }
        },
    },
    extraReducers: (builder) => {
        //Create TA
        builder.addCase(createTA.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createTA.fulfilled, (state, action) => {
            state.loading = false;
            state.tas = action.payload;
        });
        builder.addCase(createTA.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        //Get All TA
        builder.addCase(getTA.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getTA.fulfilled, (state, action) => {
            state.loading = false;
            state.tas = action.payload;
        });
        builder.addCase(getTA.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        //Update TA
        builder.addCase(updateTA.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(updateTA.fulfilled, (state, action) => {
            const index = state.tas.findIndex((ta) => ta.id === action.payload.id);
            state.tas[index] = action.payload;
        })
        builder.addCase(updateTA.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })

        //Delete TA
        builder.addCase(deleteTA.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteTA.fulfilled, (state, action) => {
            state.tas = state.tas.filter((ta) => ta.id !== action.payload);
        })
        builder.addCase(deleteTA.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
});


export const { activateTa, deactivateTa } = taSlice.actions;

export default taSlice.reducer;