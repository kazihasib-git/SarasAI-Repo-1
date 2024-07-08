import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../../utils/baseURL";

export const createCoach = createAsyncThunk(
  "coachModule/createCoach",
  async (data) => {
    const response = await axios.post(`${baseUrl}/admin/manage_coaches`, data);
    return response.data;
  }
);

export const getCoach = createAsyncThunk("coachModule/getCoach", async () => {
  const response = await axios.get(`${baseUrl}/admin/manage_coaches`);
  return response.data;
});

export const updateCoach = createAsyncThunk(
  "coachModule/updateCoach",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${baseUrl}/admin/manage_coaches/${id}`,
        data
      );
      console.log("API Response: ", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "API Error: ",
        error.response ? error.response.data : error.message
      );
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const deleteCoach = createAsyncThunk(
  "coachModule/deleteCoach",
  async (id) => {
    await axios.delete(`${baseUrl}/admin/manage_coaches/${id}`);
    return id;
  }
);
export const showCAMapping = createAsyncThunk(
  "coachModule/showCAMapping",
  async () => {
    const response = await axios.get(`${baseUrl}/admin/CAMapping/CAswithActiveStudentnBatches`);
    return response.data;
  }
);

const initialState = {
  coaches: [],
  studentBatchMapping: null,
  batchMapping: null,
  coachMapping: null,
  coachSchedule: null,
  assignedStudents: [],
  assignedBatches: [],
  loading: false,
  error: null,
  createCoachOpen: false,
  editCoachOpen: false,
  selectedCoach: null,
  successPopup: false,
  assignStudentOpen: false,
  assignBatchOpen: false,
  coach_name: null,
  coachID: null,
};

export const coachSlice= createSlice({
  name: "coachModule",
  initialState,
  reducers: {
    accessCoachName(state, action) {
    //   console.log("ACTION : ", action);
    //   console.log("ACTION PAYLOAD : ", action.payload);
      state.coach_name = action.payload.name;
      state.coachID = action.payload.id;
    },
    setSelectedCoach(state, action) {
    //   console.log("ACTION : ", action);
      state.selectedCoach = action.payload;
    },
    openCreateCoach(state) {
      state.createCoachOpen = true;
    },
    closeCreateCoach(state) {
      state.createCoachOpen = false;
    },
    openEditCoach(state) {
      state.editCoachOpen = true;
    },
    closeEditCoach(state) {
      state.editCoachOpen = false;
    },

    openSuccessPopup(state) {
      state.successPopup = true;
    },
    closeSuccessPopup(state) {
      state.successPopup = false;
    },
    openAssignStudents(state) {
      state.assignStudentOpen = true;
    },
    closeAssignStudents(state) {
      state.assignStudentOpen = false;
    },
    openAssignBatches(state) {
      state.assignBatchOpen = true;
    },
    closeAssignBatches(state) {
      state.assignBatchOpen = false;
    },
  },
  extraReducers: (builder) => {
    // Create COACH
    builder.addCase(createCoach.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createCoach.fulfilled, (state, action) => {
      state.loading = false;
      state.coaches = [...state.coaches, action.payload];
    });
    builder.addCase(createCoach.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });

    // Get All COACH
    builder.addCase(getCoach.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCoach.fulfilled, (state, action) => {
      state.loading = false;
      state.coaches = action.payload;
    });
    builder.addCase(getCoach.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });

    // Update Coach
    builder.addCase(updateCoach.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCoach.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.coaches.findIndex((coach) => coach.id === action.payload.id);
      if (index !== -1) {
        state.coaches[index] = action.payload;
      }
    });
    builder.addCase(updateCoach.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });

    // Delete Coach
    builder.addCase(deleteCoach.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteCoach.fulfilled, (state, action) => {
      state.loading = false;
      state.coaches = state.coaches.filter((coach) => coach.id !== action.payload);
    });
    builder.addCase(deleteCoach.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });
     // Show CA Mapping
     builder.addCase(showCAMapping.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(showCAMapping.fulfilled, (state, action) => {
      console.log("action " , action.payload);
      state.loading = false;
      state.coachMapping = action.payload;
    });
    builder.addCase(showCAMapping.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });
  },

  
});


export const {
    openCreateCoach,
    closeCreateCoach,
    openEditCoach,
    closeEditCoach,
    setSelectedCoach,
    openSuccessPopup,
    accessCoachName,
    closeSuccessPopup,
    openAssignStudents,
    closeAssignStudents,
    openAssignBatches,
    closeAssignBatches,
  } = coachSlice.actions;
  
  export default coachSlice.reducer;
